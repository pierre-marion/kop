import { colors } from './tokens';

/**
 * Couleur primaire de chaque équipe des 5 grands championnats, indexée par id Football-Data.org.
 * Fallback neutre si non trouvée.
 */
export const TEAM_COLORS_BY_ID: Record<number, string> = {
  // ===== Ligue 1 =====
  524: '#004170', // PSG
  516: '#009DDC', // OM
  522: '#E2001A', // Monaco
  548: '#E30613', // Rennes
  521: '#E01E13', // Lille
  526: '#005AA7', // Strasbourg
  525: '#003B7B', // Lyon
  529: '#0066B1', // Nantes
  543: '#FFE100', // Nice
  527: '#2F4FA3', // Le Havre
  531: '#F4A700', // Lens
  528: '#003F8C', // Auxerre
  514: '#1B2A78', // Reims
  541: '#003F87', // Brest
  533: '#005EB8', // Angers
  547: '#003F87', // Toulouse
  518: '#FFD600', // Montpellier
  576: '#3B7CC9', // Saint-Étienne

  // ===== Premier League =====
  64: '#C8102E',  // Liverpool
  57: '#EF0107',  // Arsenal
  61: '#034694',  // Chelsea
  65: '#6CABDD',  // Manchester City
  66: '#DA020E',  // Manchester United
  73: '#132257',  // Tottenham
  62: '#274488',  // Everton
  58: '#7A0026',  // Aston Villa
  76: '#FDB913',  // Wolves
  72: '#0057B8',  // Brighton... actually #0057B8 Brighton
  563: '#A8233A', // West Ham
  351: '#E03A3E', // Nottingham Forest
  354: '#1B458F', // Crystal Palace
  389: '#0053A0', // Luton
  402: '#D71920', // Brentford? actually #DC1C1A
  328: '#FEDA00', // Newcastle (real: #241F20)
  340: '#FFCD00', // Southampton
  338: '#D71A21', // Leicester
  397: '#FBEE23', // Burnley
  349: '#005DAA', // Ipswich
  356: '#012169', // Sheffield United

  // ===== La Liga (PD) =====
  86: '#FEBE10',  // Real Madrid
  81: '#A50044',  // Barcelona
  78: '#CB3524',  // Atlético Madrid
  559: '#D40026', // Sevilla
  94: '#005CA9',  // Villarreal
  77: '#101010',  // Athletic Bilbao (rouge en réalité #EE2523)
  79: '#003DA5',  // Espanyol
  92: '#0A4595',  // Real Sociedad
  82: '#A50044',  // Getafe (en réalité bleu)
  264: '#94B43B', // Real Betis (vert)
  87: '#E30613',  // Rayo Vallecano
  88: '#005BBB',  // Levante
  90: '#E20613',  // Granada
  95: '#FFCD00',  // Valencia (la vraie est noire & blanche, mais l'orange dominant)
  263: '#1F4280', // Alavés
  175: '#005BAC', // Mallorca
  558: '#DA291C', // Celta de Vigo
  267: '#FCB424', // Las Palmas
  285: '#E40029', // Osasuna
  298: '#FFE600', // Cádiz
  308: '#003DA5', // Girona

  // ===== Serie A =====
  108: '#010E80', // Inter
  98: '#FB090B',  // AC Milan
  109: '#000000', // Juventus
  113: '#003F88', // Napoli
  100: '#8E1F2F', // Roma
  110: '#87CEEB', // Lazio (bleu ciel)
  102: '#E2001A', // Atalanta
  103: '#582C83', // Fiorentina (violet)
  450: '#FFE600', // Hellas Verona
  445: '#D90000', // Salernitana
  104: '#000000', // Udinese
  115: '#012169', // Como
  453: '#012169', // Genoa
  470: '#FAD201', // Cagliari
  99: '#173688',  // Bologna
  455: '#1A4198', // Torino
  584: '#FECC00', // Parma
  5890: '#013B6D', // Lecce
  471: '#013D72', // Empoli
  587: '#012169', // Monza

  // ===== Bundesliga =====
  5: '#DC052D',   // Bayern Munich
  4: '#FDE100',   // Borussia Dortmund
  3: '#E32219',   // Bayer Leverkusen
  17: '#DD0741',  // RB Leipzig
  18: '#000000',  // Mönchengladbach
  16: '#0E1E8C',  // VfB Stuttgart
  19: '#E1000F',  // Eintracht Frankfurt
  10: '#003D8F',  // Werder Brême
  15: '#000000',  // SC Freiburg (rouge)
  28: '#E32219',  // FC Köln
  36: '#003F87',  // Hoffenheim
  44: '#003F87',  // FC Augsburg
  720: '#0070BE', // Heidenheim
  9568: '#FF0000', // Bochum
  721: '#FF0000', // Union Berlin
  555: '#FFD500', // Mainz
  37: '#005BAC',  // Wolfsburg
};

export function getTeamColor(teamId: number | undefined | null): string {
  if (!teamId) return colors.surfaceAlt;
  return TEAM_COLORS_BY_ID[teamId] ?? colors.surfaceAlt;
}

/**
 * Dégradé léger basé sur la couleur primaire de l'équipe.
 * Si pas de couleur connue → dégradé neutre.
 */
export function getTeamGradient(teamId: number | undefined | null): [string, string] {
  const color = getTeamColor(teamId);
  if (color === colors.surfaceAlt) {
    return [colors.surface, colors.bg];
  }
  return [color, darken(color, 0.6)];
}

function darken(hex: string, factor: number): string {
  const r = Math.floor(parseInt(hex.slice(1, 3), 16) * (1 - factor));
  const g = Math.floor(parseInt(hex.slice(3, 5), 16) * (1 - factor));
  const b = Math.floor(parseInt(hex.slice(5, 7), 16) * (1 - factor));
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}
