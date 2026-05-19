# Design System Kop

> La référence visuelle de l'app. Tout est construit autour de ces tokens.

---

## 🎨 Philosophie

Kop suit 4 principes de design stricts :

1. **Sombre par défaut** — fond profond pour réduire la fatigue oculaire et mettre en valeur les couleurs des clubs
2. **Accent unique** — un seul vert lime (#CCFF00) utilisé avec parcimonie pour les highlights critiques (scores gagnants, CTA, états actifs)
3. **Hiérarchie par la taille** — pas de bordures épaisses, pas de couleurs partout, juste des contrastes de taille typographique
4. **Halos et dégradés subtils** — pour donner de la profondeur sans charger visuellement

---

## 🎨 Palette de couleurs

### Fonds

| Token | Hex | Usage |
|---|---|---|
| `colors.bg` | `#0A0A0B` | Fond principal de toutes les pages |
| `colors.surface` | `#16161A` | Cards, surfaces élevées |
| `colors.surfaceAlt` | `#1a1a1f` | Variation pour différencier deux surfaces côte à côte |

### Bordures

| Token | Hex | Usage |
|---|---|---|
| `colors.border` | `#26262C` | Bordures de cards (toujours en 0.5px) |
| `colors.borderSoft` | `#16161A` | Bordures très subtiles (séparateurs onglets) |

### Textes

| Token | Hex | Usage |
|---|---|---|
| `colors.text` | `#FAFAFA` | Texte principal |
| `colors.textMuted` | `#8A8A95` | Texte secondaire (métadonnées) |
| `colors.textDim` | `#5A5A65` | Texte très discret (labels, hints) |

### Accent

| Token | Hex | Usage |
|---|---|---|
| `colors.accent` | `#CCFF00` | Vert lime : score gagnant, CTA, état actif, badge LIVE |
| `colors.accentText` | `#0A0A0B` | Texte sur fond lime (toujours noir profond pour la lisibilité) |

### États sémantiques

| Token | Hex | Usage |
|---|---|---|
| `colors.live` | `#EF4444` | Indicateur "live" rouge (utilisé rarement, lime préféré) |
| Orange chaud | `#FF7A00` | Articles "chauds", flamme de tendance |

### Couleurs de compétitions

| Compétition | Couleur | Code Football-Data |
|---|---|---|
| Ligue 1 | `#003DA5` | FL1 |
| Premier League | `#3D195B` | PL |
| La Liga | `#FEBE10` | PD |
| Serie A | `#008FD7` | SA |
| Bundesliga | `#D20515` | BL1 |

### Couleurs de clubs (principales)

Stockées dans `components/UpcomingMatchCardAPI.tsx` (map `TEAM_COLORS`). Une fonction de hash sur le TLA génère une couleur stable pour les clubs non mappés.

---

## ✍️ Typographie

**Police par défaut** : système (`-apple-system, BlinkMacSystemFont, Inter`)

### Tailles

| Token | Px | Usage |
|---|---|---|
| `typography.size.xs` | 9 | Labels en majuscules, métadonnées discrètes |
| `typography.size.sm` | 10 | Petits textes, légendes |
| `typography.size.base` | 11 | Texte courant secondaire |
| `typography.size.md` | 12 | Texte courant standard |
| `typography.size.lg` | 14 | Titres de cards |
| `typography.size.xl` | 18 | Sous-titres |
| `typography.size.xxl` | 22 | Titres principaux des pages détail |
| Titre éditorial | 28 | Titres "héros" (Actu, Mercato, Compétitions) |
| Score | 44–56 | Score d'un match (44 sur card, 56 sur page détail) |

### Letter-spacing

| Contexte | Valeur |
|---|---|
| Labels en majuscules | `+0.5` à `+1.5` (lisibilité) |
| Titres standards | `-0.5` |
| Titres éditoriaux | `-1.2` |
| Scores | `-2` à `-3` (impact visuel) |

### Poids

- **400** (regular) — texte courant
- **500** (medium) — titres, valeurs importantes
- **600** (semibold) — titres principaux, scores
- **700** (bold) — badges, labels en majuscules

### Règle d'or

> Si tu hésites sur le poids, prends **500**. C'est le poids "moyen-marqué" qui marche dans 80% des cas sur fond sombre.

---

## 📏 Espacements

| Token | Px | Usage |
|---|---|---|
| `spacing.xs` | 4 | Gap minimal entre éléments très liés |
| `spacing.sm` | 8 | Gap standard interne aux composants |
| `spacing.md` | 12 | Gap entre éléments liés |
| `spacing.lg` | 16 | Padding standard des cards |
| `spacing.xl` | 20 | Padding "généreux" |
| `spacing.xxl` | 24 | Marges entre sections |

**Padding standard horizontal des pages** : 16-18px (cohérent partout).

---

## 🔘 Border-radius

| Token | Px | Usage |
|---|---|---|
| `radius.sm` | 8 | Petits éléments (badges, chips actifs) |
| `radius.md` | 12 | Cards de liste, boutons |
| `radius.lg` | 14 | Cards standards |
| `radius.xl` | 16 | Cards mises en avant |
| `radius.pill` | 999 | Boutons pill, badges arrondis |

---

## 🧩 Composants principaux

### Cards

**Style standard** :
- Background : `colors.surface`
- Border : `0.5px solid colors.border`
- Border-radius : `radius.lg` (14)
- Padding : 14-16px

**Variation hero** :
- Avec dégradé linéaire diagonal aux couleurs du contexte (club, compétition)
- Halo radial subtil dans un coin (10-15 % d'opacité)
- Border-radius : `radius.xl` (16-18)

### Badges

**Badge "LIVE"** :
- Background : `rgba(204, 255, 0, 0.12)`
- Texte : `colors.accent`, font-size 10, letter-spacing 0.5
- Point lime 5px à gauche

**Badge catégorie** :
- Background : couleur du championnat (FL1 bleu, PL violet, etc.)
- Texte : blanc 9px, font-weight 700, letter-spacing 0.5

### Logos d'équipes

Toujours via le composant `TeamLogo` :
- Tailles courantes : 22 (classement), 30 (matchs liste), 44 (cards), 52 (live match), 60 (page détail), 72 (page équipe)
- Fallback : cercle de couleur + TLA en gras
- Cache : mémoire + disque

### Onglets internes

- 4 onglets max (au-delà → ScrollView horizontal)
- Indicateur actif : bordure inférieure de 2px en `colors.accent`
- Texte actif : `colors.accent` font-weight 600
- Texte inactif : `colors.textMuted`

### Filtres chips (FilterChips)

- Pill arrondi (radius 20)
- Actif : fond `colors.accent`, texte `colors.accentText`
- Inactif : fond `colors.surface`, bordure 0.5px, texte `colors.text`

---

## 🌫️ Effets visuels signature

### Halos radiaux

Cercles flous en arrière-plan des cards hero pour donner de la profondeur :

position: absolute;
top: -30px (ou bottom selon le côté);
right: -30px (ou left);
width: 100-180px;
height: 100-180px;
border-radius: 50%;
background: radial-gradient(circle, [couleur club] 0%, transparent 70%);
opacity: 0.3 à 0.4;

### Dégradés diagonaux

Pour les cards de matchs à venir et hero :

LinearGradient
colors: [couleurEquipe1 + alpha 0.18, surface, couleurEquipe2 + alpha 0.18]
start: { x: 0, y: 0 }
end: { x: 1, y: 1 }

### Bordure accent gauche

Pour les éléments en avant (article CHAUD, leader du classement, dossier) :border-left: 3px solid colors.accent;
background: linear-gradient(90deg, rgba(204,255,0,0.06), surface);

---

## 🚫 Anti-patterns à éviter

❌ Bordures épaisses (>1px) — toujours 0.5px
❌ Plus de 2 couleurs d'accent — uniquement lime, jamais bleu + rouge + jaune ensemble
❌ Texte blanc pur (`#FFFFFF`) — utiliser `#FAFAFA` qui fatigue moins l'œil
❌ Ombres portées (`shadowColor`, etc.) — préférer les halos
❌ Coins carrés — toujours un border-radius minimum de 8
❌ Pas assez d'air autour du texte — padding minimum 12 dans les cards
❌ Couleurs aléatoires pour les clubs — toujours via `TEAM_COLORS` ou fonction de hash