# Kop

> L'app foot moderne. Pensée pour l'utilisateur, pas pour les annonceurs.

Une application mobile d'actualités foot focalisée sur l'**expérience utilisateur** : design épuré, navigation fluide, hiérarchie claire de l'information. Suivi des 5 grands championnats européens (Ligue 1, Premier League, La Liga, Serie A, Bundesliga).

---

## 🎯 Le projet

Kop part d'un constat simple : les apps foot actuelles (FootMercato, Onefootball, L'Équipe) ont un excellent contenu mais une **interface vieillissante**, surchargée et peu pensée pour l'usage mobile moderne.

L'objectif n'est pas de remplacer leur travail éditorial — c'est de proposer une **alternative orientée design et UX**, taillée pour les fans de foot qui veulent une expérience plus premium au quotidien.

**Cible** : fans de foot de tous âges, des supporters quotidiens aux amateurs occasionnels.

**Différenciation** : UI/UX moderne, gestion claire des données (matchs, équipes, joueurs, classements), features uniques (radar de fiabilité des rumeurs mercato, mode "Fais ton mercato" gamifié, etc.).

---

## ✨ Fonctionnalités

### V1 (en cours)
- 🏠 **Accueil** : match du jour en avant, prochains matchs, top buteurs
- 📰 **Actu** : fil d'articles avec formats variés (brèves, entretiens, vidéos, dossiers, transferts flash)
- 🔄 **Mercato** : volume global, deals officiels avec stats détaillées, radar des rumeurs avec score de fiabilité
- 🏆 **Compétitions** : 5 grands championnats, classements complets, top buteurs
- 🔍 **Recherche** : équipes, joueurs, compétitions
- 🔔 **Notifications** : organisées par section (aujourd'hui, hier), types visuels (buts, mercato, articles)
- 👤 **Profil** : équipes favorites, préférences, stats personnelles

### Pages détail
- ⚽ Détail d'un match (score, événements, stats, confrontations directes)
- 🏆 Détail d'une compétition (classement complet, calendrier, buteurs)
- 🛡️ Détail d'une équipe (effectif, calendrier, joueurs clés)

---

## 🎨 Identité visuelle

- **Thème sombre profond** par défaut (`#0A0A0B`)
- **Accent vert lime** (`#CCFF00`) utilisé avec parcimonie
- **Halos radiaux et dégradés diagonaux** aux couleurs des clubs
- **Typographie éditoriale** avec gros titres et letter-spacing négatif
- **Minimalisme assumé** : pas de bordures épaisses, espacements généreux

---

## 🛠️ Stack technique

- **Framework** : React Native avec [Expo SDK 54](https://expo.dev/)
- **Langage** : TypeScript
- **Routing** : [expo-router](https://docs.expo.dev/router/introduction/) (file-based)
- **State / Cache** : [@tanstack/react-query](https://tanstack.com/query/latest) (gestion API + cache)
- **State global** : [Zustand](https://zustand.docs.pmnd.rs/) (préférences utilisateur)
- **Images** : [expo-image](https://docs.expo.dev/versions/latest/sdk/image/) (avec cache mémoire + disque)
- **Gradients** : expo-linear-gradient
- **Icônes** : @expo/vector-icons (Ionicons)

### API de données

- **[Football-Data.org](https://www.football-data.org/)** (plan gratuit, 10 req/min) — données matchs, classements, équipes, top buteurs

### Limites connues

- L'API gratuite ne fournit **pas** :
  - Les compositions détaillées des matchs
  - Les événements minute par minute (buts, cartons)
  - Les news / articles (nécessite une autre source)
- Solutions envisagées : RSS feeds (L'Équipe, RMC), NewsAPI, ou migration vers plan payant Football-Data

---

## 🚀 Lancement du projet

### Prérequis

- Node.js 20+ ou 22+
- npm
- Expo Go installé sur ton téléphone ([iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))

### Installation

```bash
# Cloner le repo
git clone <url-du-repo>
cd kop

# Installer les dépendances
npm install --legacy-peer-deps

# Créer le fichier .env (à la racine)
echo "EXPO_PUBLIC_FOOTBALL_DATA_TOKEN=ton_token_ici" > .env
```

Récupère un token gratuit sur [football-data.org/client/register](https://www.football-data.org/client/register).

### Démarrer le projet

```bash
npx expo start --tunnel
```

Scanne le QR code avec Expo Go sur ton téléphone.

---

## 📁 Structure du projet

kop/
├── app/                      # Écrans (expo-router)
│   ├── _layout.tsx           # Layout racine + routes
│   ├── (tabs)/               # Onglets principaux
│   │   ├── index.tsx         # Accueil
│   │   ├── actu.tsx
│   │   ├── mercato.tsx
│   │   └── competitions.tsx
│   ├── match/[id].tsx        # Page détail match (dynamic route)
│   ├── competition/[id].tsx
│   ├── team/[id].tsx
│   ├── search.tsx            # Pages modales
│   ├── profile.tsx
│   └── notifications.tsx
├── components/               # Composants réutilisables
│   ├── TeamLogo.tsx          # Logo équipe avec fallback
│   ├── LiveMatchCard.tsx     # Carte du match featured
│   ├── UpcomingMatchCardAPI.tsx
│   └── ...
├── services/                 # Couche API
│   └── footballApi.ts
├── hooks/                    # Hooks React Query
│   └── useFootballData.ts
├── theme/                    # Design tokens
│   └── tokens.ts
├── data/                     # Données mockées (en cours de remplacement)
│   └── mockData.ts
└── assets/                   # Icônes, splash, images

---

## 🗺️ Roadmap

Voir [docs/product/ROADMAP.md](./docs/product/ROADMAP.md) pour le détail des versions et fonctionnalités prévues.

---

## 📝 Conventions

Voir [docs/technical/CONVENTIONS.md](./docs/technical/CONVENTIONS.md) pour les règles de nommage, de commit et de structure.

Documentation complète : [docs/](./docs/)
- **Produit** : [PITCH](./docs/product/PITCH.md) · [ROADMAP](./docs/product/ROADMAP.md) · [PERSONAS](./docs/product/PERSONAS.md) · [USER_FLOWS](./docs/product/USER_FLOWS.md) · [LAUNCH_STRATEGY](./docs/product/LAUNCH_STRATEGY.md)
- **Design** : [DESIGN_SYSTEM](./docs/design/DESIGN_SYSTEM.md)
- **Technique** : [STACK](./docs/technical/STACK.md) · [API](./docs/technical/API.md) · [CONVENTIONS](./docs/technical/CONVENTIONS.md) · [CHANGELOG](./docs/technical/CHANGELOG.md) · [SUPABASE_SETUP](./docs/technical/SUPABASE_SETUP.md)

---

## 📄 Licence

Projet personnel, non-open source pour l'instant. Tous droits réservés.

---

## 👤 Auteur

Pierre Marion — 2026