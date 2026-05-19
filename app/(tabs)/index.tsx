import { useMemo } from 'react';
import { ScrollView, View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors } from '../../theme/tokens';
import Header from '../../components/Header';
import DateTitle from '../../components/DateTitle';
import LiveMatchCard from '../../components/LiveMatchCard';
import UpcomingMatchCardAPI from '../../components/UpcomingMatchCardAPI';
import NewsCard from '../../components/NewsCard';
import TopScorers from '../../components/TopScorers';
import SectionHeader from '../../components/SectionHeader';
import FavoritesBar from '../../components/FavoritesBar';
import { useUpcomingMatches } from '../../hooks/useFootballData';
import { useFavoritesStore } from '../../stores/favorites';
import { news } from '../../data/mockData';

export default function HomeScreen() {
  const router = useRouter();
  const { data: upcomingMatches, isLoading: isLoadingUpcoming } = useUpcomingMatches(6);
  const favorites = useFavoritesStore((s) => s.items);

  // Tri "favoris d'abord" : les matchs avec au moins une équipe favorite remontent
  const sortedUpcoming = useMemo(() => {
    if (!upcomingMatches) return upcomingMatches;
    const favTeamIds = new Set(
      favorites.filter((f) => f.kind === 'team').map((f) => f.entityId)
    );
    if (favTeamIds.size === 0) return upcomingMatches;

    const involvesFavorite = (m: typeof upcomingMatches[number]) =>
      favTeamIds.has(String(m.homeTeam.id)) || favTeamIds.has(String(m.awayTeam.id));

    return [...upcomingMatches].sort((a, b) => {
      const aFav = involvesFavorite(a) ? 1 : 0;
      const bFav = involvesFavorite(b) ? 1 : 0;
      return bFav - aFav;
    });
  }, [upcomingMatches, favorites]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header />
        <FavoritesBar />
        <DateTitle />
        <LiveMatchCard />

        <SectionHeader
          title="À venir aujourd'hui"
          onPress={() => router.push('/matches')}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.matchesScroll}
        >
          {isLoadingUpcoming ? (
            <View style={styles.upcomingLoading}>
              <ActivityIndicator color={colors.accent} size="small" />
            </View>
          ) : sortedUpcoming && sortedUpcoming.length > 0 ? (
            sortedUpcoming.map((match) => (
              <UpcomingMatchCardAPI key={match.id} match={match} />
            ))
          ) : (
            <View style={styles.upcomingEmpty}>
              <Text style={styles.upcomingEmptyText}>
                Aucun match à venir cette semaine
              </Text>
            </View>
          )}
        </ScrollView>

        <SectionHeader
          title="Pour toi"
          onPress={() => router.push('/(tabs)/actu')}
        />
        <View style={styles.newsContainer}>
          {news.map((item) => (
            <NewsCard
              key={item.id}
              isBreaking={item.isBreaking}
              category={item.category}
              title={item.title}
              time={item.time}
              source={item.source}
              imageColors={item.imageColors}
            />
          ))}
        </View>

        <TopScorers />

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  matchesScroll: {
    paddingHorizontal: 18,
    gap: 12,
    paddingBottom: 16,
    paddingTop: 4,
  },
  newsContainer: {
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 8,
  },
  upcomingLoading: {
    width: 170,
    height: 130,
    alignItems: 'center',
    justifyContent: 'center',
  },
  upcomingEmpty: {
    width: 280,
    height: 130,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  upcomingEmptyText: {
    fontSize: 11,
    color: colors.textMuted,
    textAlign: 'center',
  },
});