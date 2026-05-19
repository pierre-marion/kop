# Stack technique Kop

> Documentation des choix techniques, libs utilisées, et raisons derrière chaque choix.

---

## 🎯 Philosophie technique

3 principes guident les choix :

1. **Simplicité** — préférer ce qui est standard, bien documenté, maintenu
2. **Performance** — chaque lib doit être justifiée (poids, impact runtime)
3. **Productivité** — éviter les outils qui rallongent inutilement le développement

---

## 📱 Framework principal

### React Native + Expo SDK 54

**Pourquoi React Native ?**
- Une seule base de code pour iOS et Android
- Communauté massive, écosystème mature
- Composants natifs (pas du WebView lourd)

**Pourquoi Expo plutôt que React Native CLI ?**
- Setup en 30 secondes (vs 1h+ avec React Native pur)
- Outils intégrés (build cloud via EAS, OTA updates)
- Plus accessible quand on débute en mobile
- Possibilité d'éjecter plus tard si besoin de modules natifs custom

**Pourquoi SDK 54 et pas 55+ ?**
- Stabilité : SDK 54 est ultra mature en mai 2026
- Compatibilité Expo Go (le SDK 55 nécessite un dev build, plus relou pour itérer)
- Suffisant pour toutes les features V1

---

## 📦 Dépendances principales

### Routing

**expo-router** (v6)
- File-based routing comme Next.js
- Permet les routes dynamiques (`[id].tsx`)
- Modal natif (slide-from-bottom) inclus
- Alternative écartée : React Navigation pur (plus verbeux)

### Gestion d'état

**@tanstack/react-query** (v5)
- Gère tout ce qui vient de l'API (cache, refetch, retry)
- **Crucial pour notre limite de 10 req/min** : cache 60 sec par défaut
- Refetch automatique si data devient "stale"
- Gestion fine du loading/error/empty

**Zustand**
- State global léger (vs Redux qui est overkill)
- Utilisé pour : préférences utilisateur, équipes favorites
- ~1 KB, syntaxe minimale, performant

### UI

**expo-linear-gradient**
- Pour tous les dégradés (cards de matchs, hero sections)
- Performant car natif

**@expo/vector-icons** (Ionicons)
- Bibliothèque d'icônes intégrée à Expo
- Couvre 99% des besoins, économise un asset bundle

**expo-image**
- Composant Image moderne (remplace `Image` de React Native)
- Cache mémoire + disque automatique → crucial pour les logos d'équipes
- Transitions fluides (fade in)
- Support des formats raster (PNG, JPG, WebP)

---

## 🌐 API et données

### Football-Data.org (plan gratuit)

**Pourquoi ce choix ?**
- Gratuit et illimité dans le temps (10 req/min)
- Couvre les 5 grands championnats européens (parfait pour notre scope)
- API REST classique, docs claires
- Données fiables et à jour

**Limites assumées V1** :
- ❌ Pas de news / articles éditoriaux
- ❌ Pas d'événements détaillés des matchs (buts/cartons minute par minute) en plan gratuit
- ❌ Pas de compositions / statistiques avancées en plan gratuit
- ❌ Pas de stats par joueur

**Plan B identifiés** :
- Pour les news : NewsAPI, RSS feeds, ou scraping
- Pour les events détaillés : passer plan payant (15 €/mois) ou changer pour SportMonks / API-Football
- Pour les stats avancées : idem

### Stratégie de cache (config React Query)

```ts
{
  staleTime: 60 * 1000,           // Data fraîche 60 sec
  gcTime: 5 * 60 * 1000,          // Garde en cache 5 min après inactivité
  refetchOnWindowFocus: false,    // Pas de refetch au focus de l'app
  retry: 2,                       // 2 retries en cas d'erreur réseau
  retryDelay: backoff exponentiel,
}
```

**Refetch automatique** uniquement si match LIVE détecté (toutes les 60 sec).

**Mutualisation des appels** : un seul fetch `/matches?dateFrom=...&dateTo=...` alimente à la fois le match featured et les cards "À venir". Économie x2.

---

## 🛠️ Outils de développement

| Outil | Usage |
|---|---|
| **VS Code** | Éditeur principal |
| **Expo Go** | Test en live sur tel personnel |
| **TypeScript** | Typage strict, IntelliSense, autocomplete |
| **ESLint** (config Expo par défaut) | Linting |
| **Git + GitHub** (privé) | Versioning |

---

## 📂 Architecture du code

app/                # Écrans (file-based routing)
├── _layout.tsx     # Layout racine + QueryClient + Stack
├── (tabs)/         # Groupe d'onglets bottom tab
└── [écrans secondaires en routes plates]
components/         # Composants UI réutilisables
# 1 composant = 1 fichier
# Pas de sous-dossiers (pour l'instant)
services/           # Couche d'accès API
# Pas de logique métier ici, juste fetch + types
hooks/              # Hooks personnalisés
# Surtout les wrappers React Query
theme/              # Design tokens
# Une source de vérité pour couleurs/espacements
data/               # Données mockées
# En cours de remplacement par l'API

**Règle** : aucun composant ne doit fetcher de la data lui-même. Toujours passer par un hook (`useFootballData.ts`).

---

## 🔐 Variables d'environnement

Le token Football-Data est stocké dans `.env` (ignoré par git) :
EXPO_PUBLIC_FOOTBALL_DATA_TOKEN=xxx

Le préfixe `EXPO_PUBLIC_` est obligatoire pour qu'Expo l'expose au runtime.

⚠️ **Important** : tout ce qui est `EXPO_PUBLIC_` est visible dans le bundle JS de l'app. Pour du secret réellement secret (clé API d'un service payant, etc.), passer par un backend proxy en V2.

---

## ⚖️ Choix écartés et pourquoi

| Outil | Raison de l'écarter |
|---|---|
| **Redux** | Overkill pour notre cas, Zustand suffit |
| **NativeBase / React Native Paper** | Composants UI tout faits, mais imposent leur style → contraire à notre identité visuelle |
| **Tailwind / NativeWind** | Possible mais ajoute une dépendance ; on garde StyleSheet natif pour la perf et la simplicité |
| **API-Football** | Plus complet mais payant à partir de 19 €/mois, à reconsidérer plus tard |
| **Firebase pour auth** | Pas besoin en V1 (pas de compte utilisateur) — sera ajouté en V1.0 si lancement public |

---

## 🚀 Pour la suite

Outils à intégrer dans les prochaines versions :

- **AsyncStorage** (V0.2) — persister les préférences utilisateur localement
- **Expo Notifications** (V0.4) — vraies push notifications
- **Supabase** ou **Firebase** (V1.0) — backend + auth
- **EAS Build** (V1.0) — builds .apk / .ipa pour les stores
- **Sentry** (V1.0) — monitoring des erreurs en prod