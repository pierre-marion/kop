/**
 * Palettes Dark / Light pour le thème dynamique.
 * Le shape est identique à `colors` dans tokens.ts.
 * Composants existants : `import { colors } from '../theme/tokens'` → reste valide (dark statique).
 * Composants à venir : `const colors = useThemeColors()` → réactif au thème.
 */
export type Palette = {
  bg: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  borderSoft: string;
  text: string;
  textMuted: string;
  textDim: string;
  accent: string;
  accentText: string;
  live: string;
};

export const darkPalette: Palette = {
  bg: '#0A0A0B',
  surface: '#16161A',
  surfaceAlt: '#1a1a1f',
  border: '#26262C',
  borderSoft: '#16161A',
  text: '#FAFAFA',
  textMuted: '#8A8A95',
  textDim: '#5A5A65',
  accent: '#CCFF00',
  accentText: '#0A0A0B',
  live: '#EF4444',
};

export const lightPalette: Palette = {
  bg: '#FAFAFA',
  surface: '#FFFFFF',
  surfaceAlt: '#F2F2F5',
  border: '#E5E5EA',
  borderSoft: '#F2F2F5',
  text: '#0A0A0B',
  textMuted: '#6B6B73',
  textDim: '#A0A0A8',
  accent: '#7AAA00',         // Vert plus foncé pour contraste sur fond clair
  accentText: '#FFFFFF',
  live: '#DC2626',
};
