import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Config React Query optimisée pour API limitée (10 req/min)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data considérée fraîche pendant 60 sec → pas de refetch inutile
      staleTime: 60 * 1000,
      // Garde en cache 5 min → si on revient sur l'écran, pas de nouveau call
      gcTime: 5 * 60 * 1000,
      // Pas de refetch automatique au focus (sinon ça consomme nos 10/min)
      refetchOnWindowFocus: false,
      // 2 retries en cas d'erreur réseau (avec backoff exponentiel)
      retry: 2,
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
    },
  },
});

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="search" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
          <Stack.Screen name="profile" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
          <Stack.Screen name="notifications" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
          <Stack.Screen name="match/[id]" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="competition/[id]" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="team/[id]" options={{ animation: 'slide_from_right' }} />
        </Stack>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}