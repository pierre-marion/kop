# Changelog Kop

> Toutes les modifications notables du projet.

Format basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/).

---

## [Non publié]

### À venir
- Migration complète du onglet Compétitions vers API réelle
- Branchement des pages détail Match / Compétition / Équipe sur l'API
- Pull-to-refresh sur tous les écrans
- Skeleton loaders pendant les chargements

---

## [0.1.0] — Mai 2026

### ✨ Ajouté
- Setup initial Expo SDK 54 + TypeScript
- Architecture expo-router (Stack + Tabs + modales)
- Design system complet (theme/tokens.ts)
- Écran Accueil avec match featured live et prochains matchs
- Écran Actu avec 6 formats de cards (Hero, Transfer Flash, Interview, Vidéo, Brief, Dossier)
- Écran Mercato avec volume global, deals officiels, radar de rumeurs
- Écran Compétitions (5 championnats)
- Écran Search (recherche, recherches récentes, tendances)
- Écran Notifications (types visuels, sections par date)
- Écran Profil (mode invité, équipes suivies, préférences)
- Pages détail Match / Compétition / Équipe avec onglets internes
- Composant TeamLogo avec cache et fallback TLA
- Intégration Football-Data.org pour matchs de l'accueil
- Optimisation React Query (cache 60s, mutualisation des appels)
- Variables d'environnement sécurisées (.env)

### 🎨 Design
- Thème sombre profond (#0A0A0B) avec accent vert lime (#CCFF00)
- Halos radiaux et dégradés diagonaux aux couleurs des clubs
- Typographie éditoriale avec gros titres et letter-spacing négatif

### 📚 Documentation
- README.md, PITCH.md, ROADMAP.md
- DESIGN_SYSTEM.md, USER_FLOWS.md
- STACK.md, API.md, CONVENTIONS.md
- PERSONAS.md, LAUNCH_STRATEGY.md
- Structure docs/ organisée (product / design / technical)
