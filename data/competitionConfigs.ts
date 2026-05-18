/**
 * Configuration visuelle des 5 grands championnats, indexée par code Football-Data.
 */
export type CompetitionConfig = {
  apiCode: 'FL1' | 'PL' | 'PD' | 'SA' | 'BL1';
  displayCode: string;   // Pastille (L1, PL, LA, SA, BL)
  name: string;
  country: string;
  color: string;
  logoTextColor: string;
};

export const COMPETITION_CONFIGS: CompetitionConfig[] = [
  { apiCode: 'FL1', displayCode: 'L1', name: 'Ligue 1', country: '🇫🇷 FRANCE', color: '#003DA5', logoTextColor: '#FFFFFF' },
  { apiCode: 'PL',  displayCode: 'PL', name: 'Premier League', country: '🇬🇧 ANGLETERRE', color: '#3D195B', logoTextColor: '#FFFFFF' },
  { apiCode: 'PD',  displayCode: 'LA', name: 'La Liga', country: '🇪🇸 ESPAGNE', color: '#FEBE10', logoTextColor: '#00529F' },
  { apiCode: 'SA',  displayCode: 'SA', name: 'Serie A', country: '🇮🇹 ITALIE', color: '#008FD7', logoTextColor: '#FFFFFF' },
  { apiCode: 'BL1', displayCode: 'BL', name: 'Bundesliga', country: '🇩🇪 ALLEMAGNE', color: '#D20515', logoTextColor: '#FFFFFF' },
];

export function getCompetitionConfig(apiCode: string): CompetitionConfig | undefined {
  return COMPETITION_CONFIGS.find((c) => c.apiCode === apiCode);
}

/**
 * Zone de qualification d'une équipe selon sa position et la compétition.
 * Règles simplifiées :
 *  - top 4 = UCL
 *  - 5-6 = Europa
 *  - L1/SA/BL : 17+ = relégation
 *  - PL/PD    : 18+ = relégation
 */
export type QualifZone = 'champions' | 'europa' | 'relegation' | 'none';

export function getQualifZone(apiCode: string, position: number, totalTeams: number): QualifZone {
  if (position <= 4) return 'champions';
  if (position <= 6) return 'europa';

  const relegationStart =
    apiCode === 'PL' || apiCode === 'PD' ? 18 : 17;

  if (position >= relegationStart && position <= totalTeams) return 'relegation';
  return 'none';
}

export function getCurrentSeasonLabel(): string {
  const now = new Date();
  const year = now.getFullYear();
  // Saison européenne : démarre en juillet/août
  const startYear = now.getMonth() >= 6 ? year : year - 1;
  return `SAISON ${startYear}-${(startYear + 1).toString().slice(-2)}`;
}
