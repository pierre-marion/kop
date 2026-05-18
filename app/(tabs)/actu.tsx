import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/tokens';
import PageHeader from '../../components/PageHeader';
import FilterChips from '../../components/FilterChips';
import HeroArticleCard from '../../components/HeroArticleCard';
import TransferFlashCard from '../../components/TransferFlashCard';
import InterviewCard from '../../components/InterviewCard';
import VideoCard from '../../components/VideoCard';
import BriefCard from '../../components/BriefCard';
import DossierCard from '../../components/DossierCard';
import { actuFilters, actuFeed, actuStats, heroArticle } from '../../data/mockData';

export default function ActuScreen() {
  // Fonction qui choisit le composant selon le type de la card
  const renderFeedItem = (item: any) => {
    switch (item.type) {
      case 'transfer-flash':
        return (
          <TransferFlashCard
            key={item.id}
            time={item.time}
            playerName={item.playerName}
            amount={item.amount}
            clubFrom={item.clubFrom}
            clubTo={item.clubTo}
            description={item.description}
            accentColor={item.accentColor}
          />
        );
      case 'interview':
        return (
          <InterviewCard
            key={item.id}
            playerName={item.playerName}
            club={item.club}
            clubGradient={item.clubGradient}
            quote={item.quote}
            readTime={item.readTime}
            source={item.source}
          />
        );
      case 'video':
        return (
          <VideoCard
            key={item.id}
            title={item.title}
            duration={item.duration}
            time={item.time}
            source={item.source}
            views={item.views}
            thumbnailColors={item.thumbnailColors}
          />
        );
      case 'dossier':
        return (
          <DossierCard
            key={item.id}
            title={item.title}
            excerpt={item.excerpt}
            readTime={item.readTime}
            author={item.author}
            source={item.source}
          />
        );
      case 'brief':
      default:
        return (
          <BriefCard
            key={item.id}
            category={item.category}
            categoryColor={item.categoryColor}
            categoryTextColor={item.categoryTextColor}
            title={item.title}
            excerpt={item.excerpt}
            time={item.time}
            source={item.source}
          />
        );
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <PageHeader
          title="Actu"
          liveBadge={`${actuStats.total} nouvelles · maj ${actuStats.lastUpdate}`}
        />

        <View style={styles.filterContainer}>
          <FilterChips filters={actuFilters} />
        </View>

        {/* Hero article du jour */}
        <HeroArticleCard
          label={heroArticle.label}
          category={heroArticle.category}
          title={heroArticle.title}
          source={heroArticle.source}
          time={heroArticle.time}
          gradientColors={heroArticle.gradientColors}
        />

        {/* Section title */}
        <Text style={styles.sectionLabel}>LE FIL — TEMPS RÉEL</Text>

        {/* Feed mixte */}
        {actuFeed.map((item) => renderFeedItem(item))}

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
  filterContainer: {
    paddingVertical: 14,
  },
  sectionLabel: {
    fontSize: 11,
    color: colors.textDim,
    letterSpacing: 1.5,
    fontWeight: '500',
    paddingHorizontal: 18,
    paddingBottom: 8,
  },
});