export const colors = {
  // Fonds
  bg: '#0A0A0B',           // Fond principal
  surface: '#16161A',      // Cards et surfaces
  surfaceAlt: '#1a1a1f',   // Variation

  // Bordures
  border: '#26262C',
  borderSoft: '#16161A',

  // Textes
  text: '#FAFAFA',
  textMuted: '#8A8A95',
  textDim: '#5A5A65',

  // Accent
  accent: '#CCFF00',       // Lime, la couleur signature
  accentText: '#0A0A0B',   // Texte sur fond lime

  // États
  live: '#EF4444',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 14,
  xl: 16,
  pill: 999,
} as const;

export const typography = {
  // Tailles
  size: {
    xs: 9,
    sm: 10,
    base: 11,
    md: 12,
    lg: 14,
    xl: 18,
    xxl: 22,
    score: 44,
  },
  // Letter spacings
  letterSpacing: {
    label: 1.5,
    title: -0.5,
    score: -2,
  },
  weight: {
    regular: '400' as const,
    medium: '500' as const,
  },
};

// Couleurs des clubs (utiles pour les gradients de cards)
export const clubColors = {
  PSG: { primary: '#004170', secondary: '#ED1C24' },
  OM: { primary: '#009DDC', secondary: '#ffffff' },
  RM: { primary: '#FEBE10', secondary: '#00529F' },
  FCB: { primary: '#A50044', secondary: '#FFED02' },
  LIV: { primary: '#C8102E', secondary: '#ffffff' },
  ARS: { primary: '#EF0107', secondary: '#ffffff' },
  INT: { primary: '#010E80', secondary: '#000000' },
  MIL: { primary: '#FB090B', secondary: '#000000' },
  BAY: { primary: '#DC052D', secondary: '#ffffff' },
  DOR: { primary: '#FDE100', secondary: '#000000' },
} as const;
export const fonts = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
} as const;
// Couleurs des compétitions
export const competitionColors = {
  L1: '#003DA5',
  PL: '#3D195B',
  LIGA: '#FEBE10',
  SERIE_A: '#008FD7',
  BUNDESLIGA: '#D20515',
} as const;