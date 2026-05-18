import { colors } from './tokens';

/**
 * Couleurs primaires des principales équipes des 5 grands championnats.
 * Clé = id Football-Data.org de l'équipe.
 * Si non trouvée → couleur par défaut neutre.
 */
export const TEAM_COLORS_BY_ID: Record<number, string> = {
  // Ligue 1
  524: '#004170', // PSG
  516: '#009DDC', // OM
  522: '#003B5C', // Monaco
  548: '#FFD700', // Rennes
  521: '#0066B3', // Lille
  526: '#003366', // Strasbourg

  // Premier League
  64: '#C8102E',  // Liverpool
  57: '#EF0107',  // Arsenal
  61: '#034694',  // Chelsea
  65: '#6CABDD', // Manchester City
  66: '#DA020E',  // Manchester United
  73: '#132257',  // Tottenham

  // La Liga
  86: '#FEBE10',  // Real Madrid
  81: '#A50044',  // Barcelona
  78: '#CB3524',  // Atlético Madrid
  559: '#E50914', // Sevilla

  // Serie A
  108: '#010E80', // Inter
  98: '#FB090B',  // Milan
  109: '#000000', // Juventus
  113: '#003F88', // Napoli
  100: '#8E1F2F', // Roma

  // Bundesliga
  5: '#DC052D',   // Bayern Munich
  4: '#FDE100',   // Borussia Dortmund
  3: '#E32219',   // Bayer Leverkusen
  17: '#D3010C',  // RB Leipzig
};

export function getTeamColor(teamId: number | undefined | null): string {
  if (!teamId) return colors.surfaceAlt;
  return TEAM_COLORS_BY_ID[teamId] ?? colors.surfaceAlt;
}
