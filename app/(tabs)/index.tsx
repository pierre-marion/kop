import { ScrollView, View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/tokens';
import Header from '../../components/Header';
import DateTitle from '../../components/DateTitle';
import LiveMatchCard from '../../components/LiveMatchCard';
import UpcomingMatchCardAPI from '../../components/UpcomingMatchCardAPI';
import NewsCard from '../../components/NewsCard';
import TopScorers from '../../components/TopScorers';
import SectionHeader from '../../components/SectionHeader';
import { useUpcomingMatches } from '../../hooks/useFootballData';
import { news } from '../../data/mockData';

export default function HomeScreen() {
  const { data: upcomingMatches, isLoading: isLoadingUpcoming } = useUpcomingMatches(6);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header />
        <DateTitle />
        <LiveMatchCard />

        <SectionHeader title="À venir aujourd'hui" />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.matchesScroll}
        >
          {isLoadingUpcoming ? (
            <View style={styles.upcomingLoading}>
              <ActivityIndicator color={colors.accent} size="small" />
            </View>
          ) : upcomingMatches && upcomingMatches.length > 0 ? (
            upcomingMatches.map((match) => (
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

        <SectionHeader title="Pour toi" />
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