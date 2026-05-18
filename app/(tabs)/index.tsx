import { ScrollView, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/tokens';
import Header from '../../components/Header';
import DateTitle from '../../components/DateTitle';
import LiveMatchCard from '../../components/LiveMatchCard';
import UpcomingMatchCard from '../../components/UpcomingMatchCard';
import NewsCard from '../../components/NewsCard';
import TopScorers from '../../components/TopScorers';
import SectionHeader from '../../components/SectionHeader';
import { upcomingMatches, news } from '../../data/mockData';

export default function HomeScreen() {
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
          {upcomingMatches.map((match) => (
            <UpcomingMatchCard
              key={match.id}
              competition={match.competition}
              time={match.time}
              homeTeam={match.homeTeam}
              awayTeam={match.awayTeam}
            />
          ))}
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
    gap: 10,
    paddingBottom: 12,
  },
  newsContainer: {
    paddingHorizontal: 18,
    paddingTop: 6,
    paddingBottom: 4,
  },
});