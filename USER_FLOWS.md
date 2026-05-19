# User Flows Kop

> Documentation de la navigation entre les écrans de l'app.

---

## 🗺️ Vue d'ensemble

┌─────────────────────────────────────────────────────────┐
│                    LANCEMENT APP                        │
└──────────────────────┬──────────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────┐
│                  ONGLETS PRINCIPAUX                     │
│                                                         │
│    [🏠 Accueil]  [📰 Actu]  [🔄 Mercato]  [🏆 Compét]   │
└─────────┬──────────┬──────────┬─────────────┬───────────┘
│          │          │             │
▼          ▼          ▼             ▼
(Voir flux détaillés ci-dessous)

---

## 1. Flux Accueil

ACCUEIL
├── 🔍 Icône recherche (header)        → SEARCH (modal)
├── 🔔 Icône notifications (header)    → NOTIFICATIONS (modal)
├── 👤 Icône profil (header)           → PROFIL (modal)
│
├── Card "Match featured"              → MATCH DETAIL /match/[id]
│
├── Card "Prochain match" (carrousel)  → MATCH DETAIL /match/[id]
│
└── Section "Pour toi" (cards news)    → ARTICLE DETAIL (à venir)

---

## 2. Flux ActuACTU
├── 🔍 Recherche                       → SEARCH (modal)
├── Filtres chips (Tout / Mercato...)  → Recharge le feed avec filtre
│
├── Hero article "L'événement"         → ARTICLE DETAIL (à venir)
├── Transfer flash card                → MATCH DETAIL ou PLAYER DETAIL
├── Interview card                     → ARTICLE DETAIL (à venir)
├── Vidéo card                         → VIDEO PLAYER (à venir)
├── Brief card                         → ARTICLE DETAIL (à venir)
└── Dossier card                       → ARTICLE DETAIL (à venir)

---

## 3. Flux MercatoMERCATO
├── Bloc "Volume global"               (info statique, non cliquable)
├── Section "Deals officiels"
│   └── OfficialDealCard               → PLAYER DETAIL (à venir)
│
├── Section "Radar des rumeurs"
│   ├── RumorCard                      → PLAYER DETAIL (à venir)
│   └── Bouton "Trier par..."          → Modale tri (à venir)
│
└── CTA "Fais ton mercato"             → FANTASY MERCATO (à venir, V0.4)

---

## 4. Flux CompétitionsCOMPÉTITIONS (hub des 5 championnats)
│
├── CompetitionCard Ligue 1            → COMPETITION DETAIL /competition/FL1
├── CompetitionCard Premier League     → /competition/PL
├── CompetitionCard La Liga            → /competition/PD
├── CompetitionCard Serie A            → /competition/SA
└── CompetitionCard Bundesliga         → /competition/BL1

### Sous-flux : Page détail compétitionCOMPETITION DETAIL /competition/[id]
├── ← Retour
├── ⭐ Favoris
├── Onglet "Classement" (par défaut)
│   └── Ligne d'équipe                 → TEAM DETAIL /team/[id]
├── Onglet "Calendrier" (à venir)
├── Onglet "Buteurs"
│   └── Ligne joueur                   → PLAYER DETAIL (à venir)
└── Onglet "Équipes" (à venir)

---

## 5. Flux Match DetailMATCH DETAIL /match/[id]
├── ← Retour
├── 🔗 Share
├── 🔔 S'abonner aux notifs du match
│
├── Bloc score héros
│   ├── Click logo équipe domicile     → TEAM DETAIL /team/[id]
│   └── Click logo équipe extérieur    → TEAM DETAIL /team/[id]
│
├── Onglet "Résumé" (par défaut)
│   ├── Timeline événements            (info statique)
│   ├── Stats avec barres              (info statique)
│   └── Confrontations directes        → COMPETITION DETAIL ou archive
│
├── Onglet "Compos" (à venir, plan payant API)
├── Onglet "Stats" (à venir, plan payant API)
└── Onglet "H2H"
└── Ligne match précédent          → MATCH DETAIL /match/[oldId]

---

## 6. Flux Team DetailTEAM DETAIL /team/[id]
├── ← Retour
├── 🔗 Share
├── ➕ SUIVRE (CTA principal)
│
├── Bloc identité (logo, nom, stats)
│
├── Onglet "Aperçu" (par défaut)
│   ├── Match en cours                 → MATCH DETAIL /match/[id]
│   ├── Prochains matchs (liste)       → MATCH DETAIL /match/[id]
│   ├── Joueurs clés (carrousel)       → PLAYER DETAIL (à venir)
│   └── Dernière actu                  → ARTICLE DETAIL (à venir)
│
├── Onglet "Effectif" (à venir)
│   └── Liste tous joueurs             → PLAYER DETAIL (à venir)
│
├── Onglet "Matchs" (à venir)
│   ├── Calendrier complet             → MATCH DETAIL /match/[id]
│   └── Résultats précédents           → MATCH DETAIL /match/[id]
│
└── Onglet "Actu" (à venir)
└── Articles liés à l'équipe       → ARTICLE DETAIL (à venir)

---

## 7. Flux modaux (depuis header accueil)

### Search (modal slide-from-bottom)SEARCH
├── ← Fermer (swipe down ou bouton)
├── Barre de recherche
├── Filtres (Tout / Équipes / Joueurs / Compétitions)
├── Résultats (3 types possibles)
│   ├── Équipe                         → TEAM DETAIL /team/[id]
│   ├── Joueur                         → PLAYER DETAIL (à venir)
│   └── Compétition                    → COMPETITION DETAIL /competition/[id]
├── Recherches récentes (chips)        → Relance recherche
└── Tendances (top 5)                  → Relance recherche

### Notifications (modal slide-from-bottom)NOTIFICATIONS
├── ← Fermer
├── "Tout lire"                        → Marque tout comme lu
├── Filtres (Toutes / Matchs / Mercato / Actu)
│
├── Section "AUJOURD'HUI"
│   ├── Notif type GOAL                → MATCH DETAIL /match/[id]
│   ├── Notif type MERCATO             → ARTICLE DETAIL (à venir)
│   └── Notif type HOT                 → ARTICLE DETAIL (à venir)
│
├── Section "HIER"
│   ├── Notif type RESULT              → MATCH DETAIL /match/[id]
│   └── Notif type REMINDER            → MATCH DETAIL /match/[id]
│
└── Card "Gérer mes alertes"           → SETTINGS NOTIFICATIONS (à venir)

### Profil (modal slide-from-bottom)PROFIL
├── ← Fermer
├── ⚙️ Settings (top right)            → SETTINGS (à venir)
│
├── Avatar + nom utilisateur
├── CTA "SE CONNECTER"                 → AUTH (à venir, V1.0)
│
├── Stats (Suivies / Articles / Série) (statique)
│
├── Section "Mes équipes"
│   ├── Team item                      → TEAM DETAIL /team/[id]
│   └── ➕ Ajouter une équipe          → SEARCH avec filtre Équipes
│
├── Section "Préférences"
│   ├── Notifications                  → SETTINGS NOTIFICATIONS
│   ├── Thème                          → SETTINGS THEME (à venir)
│   └── Langue                         → SETTINGS LANGUAGE (à venir)
│
└── Section "À propos"
├── À propos de Kop                → ABOUT (à venir)
├── Confidentialité                → PRIVACY (à venir)
└── Conditions                     → TERMS (à venir)

---

## 🎯 Profondeur de navigation

**Règle de design** : on cherche **maximum 3 niveaux de profondeur** entre l'accueil et n'importe quelle info.

| Niveau | Exemple |
|---|---|
| 0 | Accueil (entrée) |
| 1 | Onglet (Mercato, Compétitions, etc.) |
| 2 | Page détail (Match, Équipe, Compétition) |
| 3 | Sous-page éventuelle (Joueur depuis équipe) |

→ Au-delà de 3, on perd l'utilisateur. À surveiller au fur et à mesure que de nouvelles pages s'ajoutent.

---

## 🔄 Pages "à venir" (versions futures)

- ARTICLE DETAIL (V0.3)
- PLAYER DETAIL (V0.4)
- FANTASY MERCATO (V0.4)
- VIDEO PLAYER (V0.4)
- AUTH (login/signup, V1.0)
- SETTINGS (notifications, thème, langue) (V1.0)
- ABOUT / PRIVACY / TERMS (V1.0)