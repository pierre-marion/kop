# Conventions de code Kop

> Règles à respecter pour un code cohérent et maintenable.

---

## 📁 Nommage de fichiers

| Type | Convention | Exemple |
|---|---|---|
| Composants React | PascalCase | `TeamLogo.tsx`, `LiveMatchCard.tsx` |
| Hooks | camelCase préfixé `use` | `useFootballData.ts`, `useMatch.ts` |
| Services / utils | camelCase | `footballApi.ts`, `formatDate.ts` |
| Constantes | UPPER_SNAKE | `MAX_RETRIES`, `API_BASE_URL` |
| Routes (app/) | kebab-case | `match-detail.tsx` ou via params dynamiques `[id].tsx` |

---

## 📝 Nommage de variables

| Type | Convention | Exemple |
|---|---|---|
| Variables | camelCase | `homeTeam`, `isLoading` |
| Fonctions | camelCase, verbe + nom | `getMatchById()`, `formatScore()` |
| Booleans | préfixé `is`, `has`, `should` | `isLive`, `hasError`, `shouldRefetch` |
| Types/Interfaces | PascalCase | `Match`, `TeamProps` |
| Composants | PascalCase | `function MatchCard()` |

---

## 🧩 Structure d'un composant React

Ordre des imports :

```tsx
// 1. React et hooks built-in
import { useState } from 'react';
// 2. React Native + Expo
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
// 3. Libs externes
import { Ionicons } from '@expo/vector-icons';
// 4. Routing
import { useRouter } from 'expo-router';
// 5. Imports internes (theme, hooks, components)
import { colors } from '../theme/tokens';
import { useFootballData } from '../hooks/useFootballData';
import TeamLogo from './TeamLogo';
```

Ordre d'un composant :

```tsx
// 1. Types props
type Props = { matchId: number; };

// 2. Constantes / helpers
const FALLBACK_COLOR = '#666';

// 3. Le composant
export default function MyComponent({ matchId }: Props) {
  // 3a. Hooks
  const router = useRouter();
  const { data } = useMatch(matchId);

  // 3b. State local
  const [isOpen, setIsOpen] = useState(false);

  // 3c. Calculs dérivés
  const isLive = data?.status === 'IN_PLAY';

  // 3d. Early returns (loading, error, empty)
  if (!data) return null;

  // 3e. Render principal
  return <View>...</View>;
}

// 4. Styles à la fin
const styles = StyleSheet.create({ ... });
```

---

## 🎨 Conventions de style

- Toujours `StyleSheet.create({})` (jamais d'inline styles complexes)
- Petits styles dynamiques OK en inline : `style={[styles.base, { color: colors.accent }]}`
- Une seule source de vérité pour les couleurs : `theme/tokens.ts`
- Toujours `borderWidth: 0.5` pour les bordures de cards
- Toujours utiliser les tokens (`colors.surface`, pas `#16161A` en dur)

---

## 📦 Imports

- Utiliser des chemins relatifs : `../components/...`
- Préférer les imports nommés : `import { useState } from 'react'`
- Pas d'imports `*` : éviter `import * as React from 'react'`

---

## ✍️ Convention de commits

Format : `type: description courte`

| Type | Usage |
|---|---|
| `feat` | Nouvelle fonctionnalité |
| `fix` | Correction de bug |
| `docs` | Documentation uniquement |
| `style` | Cosmétique (espaces, format, sans changement de logique) |
| `refactor` | Refactor sans changement de comportement |
| `perf` | Amélioration de perf |
| `chore` | Maintenance (deps, config, etc.) |

**Exemples**

```
feat: ajout page détail match avec timeline
fix: correction crash quand score null sur scheduled match
docs: ajout doc API Football-Data
refactor: extraction TeamLogo en composant réutilisable
chore: bump expo SDK 54.0.5
```

**Commits longs (optionnel)**

```
feat: pages détail Match + Compétition + Équipe

- Pages match/[id], competition/[id], team/[id]
- Composants InnerTabs et FormDots réutilisables
- Navigation depuis accueil, classement, etc.
- Données mockées pour l'instant
```

---

## 🧪 TypeScript

- **Pas de `any`** sauf cas extrêmes (et avec commentaire `// @ts-ignore` justifié)
- Toujours typer les props : `type Props = { ... }`
- Toujours typer les retours de fonctions API
- Utiliser `as const` pour les objets de config immutables

---

## 🌿 Stratégie de branches Git

Pour l'instant : tout sur `main` (projet solo).

Quand le projet grandira :
- `main` : prod
- `develop` : intégration
- `feature/nom-feature` : développement
- `fix/nom-bug` : correction
- `release/v0.x` : préparation release

---

## 🚫 À éviter

- Les composants > 300 lignes → splitter
- La duplication de styles → utiliser des composants réutilisables
- Les fichiers mockData.ts dans le code de prod V1.0
- Les console.log oubliés
- Les `// TODO` sans date ou ticket associé
