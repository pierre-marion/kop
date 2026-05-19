# Roadmap Kop

## ✅ Version 0.1 — MVP (en cours, mai 2026)

**Objectif** : Prouver le concept design + données réelles fonctionnelles.

### Pages
- [x] Onglet Accueil (match featured live + prochains matchs + top buteurs)
- [x] Onglet Actu (formats variés mockés)
- [x] Onglet Mercato (deals officiels + radar de rumeurs mockés)
- [x] Onglet Compétitions (5 championnats)
- [x] Page Search (recherche + tendances)
- [x] Page Notifications (types visuels)
- [x] Page Profil (compte invité)
- [x] Pages détail Match / Compétition / Équipe

### Technique
- [x] Setup Expo SDK 54 + TypeScript
- [x] Architecture expo-router + Stack/Tabs
- [x] Design system (theme/tokens.ts)
- [x] Intégration Football-Data.org pour matchs accueil
- [x] Système TeamLogo avec cache + fallback
- [x] React Query optimisé (cache 60s, retry, refetchInterval pour live)
- [ ] Brancher API pour : onglet Compétitions, page détail Match, page détail Compétition, page détail Équipe (en cours)

---

## 🎯 Version 0.2 — App vivante (juin 2026)

**Objectif** : 100 % des écrans alimentés en data réelle.

- [ ] **Pull-to-refresh** sur tous les écrans
- [ ] **Skeleton loaders** (placeholders pendant le chargement)
- [ ] **Persistance locale** des préférences utilisateur (équipes favorites, thème) via AsyncStorage
- [ ] **Vraies équipes suivies** : possibilité de suivre n'importe quelle équipe et l'avoir dans son profil
- [ ] **Filtres fonctionnels** sur l'onglet Actu (par championnat, par type)

---

## 🚀 Version 0.3 — Contenu enrichi (juillet 2026)

**Objectif** : Combler le manque de news (Football-Data ne fournit pas d'articles).

- [ ] **Intégration NewsAPI** ou **RSS feeds** (L'Équipe, RMC) pour le fil Actu réel
- [ ] **Page détail article** avec rendu propre du contenu
- [ ] **Section "Pour toi"** sur l'accueil personnalisée selon les équipes suivies
- [ ] **Tendances** alimentées dynamiquement

---

## 🔥 Version 0.4 — Engagement (août 2026)

**Objectif** : Donner envie aux users de revenir tous les jours.

- [ ] **Vraies notifications push** (Expo Notifications)
  - Match qui commence
  - But marqué pour ton équipe
  - Transfert officiel d'un joueur que tu suis
- [ ] **Système de favoris joueurs/équipes/compétitions**
- [ ] **Mode "Fais ton mercato"** (mini-jeu, V1)
- [ ] **Statistiques personnelles** dans le profil (streak de jours consécutifs, articles lus, etc.)

---

## 💼 Version 1.0 — Lancement public (septembre-octobre 2026)

**Objectif** : Publier sur les stores.

- [ ] **Onboarding** propre (choix des équipes favorites, championnats suivis)
- [ ] **Système de compte** (login email ou Apple/Google) via Supabase ou Firebase
- [ ] **Synchronisation des préférences** entre appareils
- [ ] **Optimisations performance** (lazy loading des images, code splitting)
- [ ] **Accessibilité** (labels, contrastes, dynamic type)
- [ ] **Tests sur plusieurs appareils** (iPhone SE, iPhone Pro Max, Android budget, Android premium)
- [ ] **Préparation stores** :
  - Icône d'app
  - Splash screen
  - Screenshots store (5-8 par store)
  - Description longue / courte
  - Mots-clés ASO
- [ ] **EAS Build** pour générer .apk et .ipa
- [ ] **Soumission App Store** (compte développeur Apple)
- [ ] **Soumission Google Play** (compte développeur Google)

---

## 🌟 Vision V2 et au-delà (2027)

À explorer en fonction de l'accueil de la V1 :

- [ ] **Communauté** : commentaires sous les articles, profils publics
- [ ] **Prédictions entre amis** (qui gagnera le match ? compose ton onze type)
- [ ] **Synthèses vidéo de matchs** via IA
- [ ] **Extension à d'autres sports** (NBA, F1, tennis)
- [ ] **Version web** complémentaire
- [ ] **Mode "Pro"** payant (stats avancées, notifications custom, sans limite)
- [ ] **Internationalisation** : EN, ES, IT, DE en plus du FR