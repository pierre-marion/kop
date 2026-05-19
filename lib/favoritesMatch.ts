import type { FavoriteItem } from '../stores/favorites';

/**
 * Construit un matcher qui dit si une équipe (identifiée par TLA ou nom)
 * fait partie des favoris de l'utilisateur.
 *
 * Utilisé sur les données mockées d'Actu et Mercato, où on n'a pas
 * l'ID Football-Data mais juste un code TLA et un nom de club.
 */
export function buildFavoriteClubMatcher(favorites: FavoriteItem[]) {
  const teams = favorites.filter((f) => f.kind === 'team');
  if (teams.length === 0) return () => false;

  const tlas = new Set(
    teams
      .map((t) => (t.meta as { tla?: string } | undefined)?.tla?.toUpperCase())
      .filter((v): v is string => !!v)
  );
  const names = new Set(teams.map((t) => t.displayName.toLowerCase()));

  return (clubIdentifiers: Array<string | null | undefined>): boolean => {
    for (const id of clubIdentifiers) {
      if (!id) continue;
      const upper = id.toUpperCase();
      const lower = id.toLowerCase();
      if (tlas.has(upper)) return true;
      if (names.has(lower)) return true;
      // Match partiel sur les noms (ex: "Paris Saint-Germain" matche "PSG"? non, mais "Real Madrid" matche "Real Madrid")
      for (const favName of names) {
        if (favName.length >= 4 && (lower.includes(favName) || favName.includes(lower))) {
          return true;
        }
      }
    }
    return false;
  };
}
