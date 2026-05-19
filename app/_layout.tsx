import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { I18nextProvider } from 'react-i18next';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import i18n from '../lib/i18n';
import { ThemeProvider, useIsDark } from '../theme/ThemeProvider';
import { useAuthStore } from '../stores/auth';
import { useSettingsStore } from '../stores/settings';
import { useFavoritesStore } from '../stores/favorites';
import { useFavoriteMatchAlerts } from '../hooks/useFavoriteMatchAlerts';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      retry: 2,
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
    },
  },
});

function AppContent() {
  const isDark = useIsDark();
  const initializeAuth = useAuthStore((s) => s.initialize);
  const session = useAuthStore((s) => s.session);
  const hydrateSettings = useSettingsStore((s) => s.hydrateFromProfile);
  const hydrateFavorites = useFavoritesStore((s) => s.hydrateFromCloud);
  const language = useSettingsStore((s) => s.language);

  // Init auth au démarrage
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Synchro lorsque la session change (login/logout)
  useEffect(() => {
    if (session) {
      hydrateSettings();
      hydrateFavorites();
    }
  }, [session, hydrateSettings, hydrateFavorites]);

  // Langue i18n synchro avec le store
  useEffect(() => {
    if (i18n.language !== language) i18n.changeLanguage(language);
  }, [language]);

  // Planifie les notifications locales des matchs favoris
  useFavoriteMatchAlerts();

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="search" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
        <Stack.Screen name="profile" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
        <Stack.Screen name="notifications" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
        <Stack.Screen name="match/[id]" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="competition/[id]" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="team/[id]" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="player/[id]" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="auth" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  // Chargement de la police Inter
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  // Écran de chargement pendant que la police se charge
  if (!fontsLoaded) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#0A0A0B',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator color="#CCFF00" />
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider>
          <SafeAreaProvider>
            <AppContent />
          </SafeAreaProvider>
        </ThemeProvider>
      </I18nextProvider>
    </QueryClientProvider>
  );
}