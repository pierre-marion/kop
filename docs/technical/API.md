# API Documentation — Football-Data.org

> Documentation des endpoints utilisés par Kop.

---

## 🔑 Authentification

L'API requiert un token via header :

```
X-Auth-Token: VOTRE_TOKEN
```

Le token est stocké dans `.env` (non commité) sous la clé `EXPO_PUBLIC_FOOTBALL_DATA_TOKEN`.

Obtenir un token gratuit : https://www.football-data.org/client/register

---

## ⚠️ Limites du plan gratuit

| Limite | Valeur |
|---|---|
| Requêtes par minute | **10** |
| Compétitions accessibles | 12 (dont les 5 grands championnats EU) |
| Profondeur historique | 1 saison |
| Détails matchs | Score uniquement (pas d'events minute par minute) |
| Compositions / Stats | ❌ |

### Stratégie d'optimisation

1. **Cache React Query** : 60s staleTime par défaut, 5min de gcTime
2. **Mutualisation** : `getMatchesAroundToday()` alimente plusieurs composants
3. **Refetch ciblé** : uniquement si match LIVE détecté
4. **Retry avec backoff** : 2 retries max, délai exponentiel

---

## 🌐 Base URL

```
https://api.football-data.org/v4
```

---

## 📚 Endpoints utilisés

### `GET /matches`

Récupère les matchs sur une période donnée.

**Paramètres**
- `competitions` : codes séparés par virgule (`FL1,PL,PD,SA,BL1`)
- `dateFrom` : YYYY-MM-DD
- `dateTo` : YYYY-MM-DD

**Utilisé par**
- `getMatchesAroundToday()` → écran d'accueil (featured + upcoming)

**Exemple**
```
GET /matches?competitions=FL1,PL,PD,SA,BL1&dateFrom=2026-05-15&dateTo=2026-05-25
```

---

### `GET /matches/{id}`

Détail d'un match spécifique.

**Utilisé par**
- `getMatchById(id)` → page détail match

---

### `GET /competitions/{code}/standings`

Classement complet d'une compétition.

**Codes compétitions**
| Code | Compétition |
|---|---|
| `FL1` | Ligue 1 |
| `PL` | Premier League |
| `PD` | La Liga (Primera División) |
| `SA` | Serie A |
| `BL1` | Bundesliga |

**Retour**
- `competition`, `season`, `standings[]` (TOTAL/HOME/AWAY)
- Chaque ligne : position, team, playedGames, won, draw, lost, points, goalsFor, goalsAgainst, goalDifference, form

**Utilisé par**
- `getStandings(code)` → page détail compétition + onglet Compétitions (leader)

---

### `GET /competitions/{code}/scorers`

Top buteurs d'une compétition.

**Paramètres**
- `limit` : nombre de résultats (default 10)

**Utilisé par**
- `getTopScorers(code, limit)` → composant TopScorers + page détail compétition

---

### `GET /teams/{id}`

Détail d'une équipe avec squad.

**Utilisé par**
- `getTeamById(id)` → page détail équipe

---

## 🔄 Mapping des statuts de match

| Statut API | Affichage Kop |
|---|---|
| `SCHEDULED` / `TIMED` | "AUJOURD'HUI · 21:00" ou "DEMAIN · 21:00" |
| `IN_PLAY` / `PAUSED` | "LIVE · 67'" |
| `FINISHED` | "TERMINÉ" |
| `POSTPONED` / `SUSPENDED` / `CANCELLED` | "REPORTÉ" |

---

## 🚨 Gestion d'erreurs

| Code HTTP | Cause | Action |
|---|---|---|
| 200 | OK | — |
| 403 | Token invalide ou compétition non autorisée | Message clair user |
| 429 | Rate limit dépassé | Message "réessaye dans 1 minute", retry auto |
| 500+ | Erreur serveur | Retry 2x avec backoff |

---

## 🛠️ Alternatives évaluées

| API | Pour | Contre |
|---|---|---|
| **API-Football** | Plus complet (events, stats, lineups) | Payant 19€/mois |
| **SportMonks** | Très pro | Cher (50€+/mois) |
| **TheSportsDB** | Gratuit, bons logos | Données moins fraîches sur le live |

→ Football-Data reste le meilleur compromis pour le MVP. Migration possible vers API-Football en V0.4 si besoin d'events/lineups.
