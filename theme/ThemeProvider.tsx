import { createContext, useContext, useMemo, useEffect, useState } from 'react';
import { Appearance } from 'react-native';
import { useSettingsStore } from '../stores/settings';
import { darkPalette, lightPalette, type Palette } from './palettes';

type ThemeContextValue = {
  colors: Palette;
  isDark: boolean;
};

const ThemeContext = createContext<ThemeContextValue>({
  colors: darkPalette,
  isDark: true,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const themeMode = useSettingsStore((s) => s.theme);
  const [systemScheme, setSystemScheme] = useState<'light' | 'dark'>(
    Appearance.getColorScheme() === 'light' ? 'light' : 'dark'
  );

  useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemScheme(colorScheme === 'light' ? 'light' : 'dark');
    });
    return () => sub.remove();
  }, []);

  const value = useMemo<ThemeContextValue>(() => {
    const resolved =
      themeMode === 'auto' ? systemScheme : themeMode === 'light' ? 'light' : 'dark';
    return {
      colors: resolved === 'light' ? lightPalette : darkPalette,
      isDark: resolved === 'dark',
    };
  }, [themeMode, systemScheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeColors(): Palette {
  return useContext(ThemeContext).colors;
}

export function useIsDark(): boolean {
  return useContext(ThemeContext).isDark;
}
