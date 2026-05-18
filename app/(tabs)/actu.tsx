import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/tokens';
import PageHeader from '../../components/PageHeader';
import FilterChips from '../../components/FilterChips';
import ActuFeedItem from '../../components/ActuFeedItem';
import { actuFilters, actuFeed, actuStats } from '../../data/mockData';

export default function ActuScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <PageHeader
          title="Actu"
          liveBadge={`${actuStats.total} brèves aujourd'hui · MAJ ${actuStats.lastUpdate}`}
        />

        <View style={styles.filterContainer}>
          <FilterChips filters={actuFilters} />
        </View>

        <View style={styles.feed}>
          {actuFeed.map((item) => (
            <ActuFeedItem
              key={item.id}
              isHot={item.isHot}
              isMercato={item.isMercato}
              category={item.category}
              categoryColor={item.categoryColor}
              categoryTextColor={item.categoryTextColor}
              title={item.title}
              excerpt={item.excerpt}
              time={item.time}
              source={item.source}
              views={item.views}
              comments={item.comments}
            />
          ))}
        </View>

        <Text style={styles.pullToRefresh}>— TIRER POUR CHARGER PLUS —</Text>
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
  feed: {
    paddingHorizontal: 18,
  },
  pullToRefresh: {
    fontSize: 10,
    color: colors.textDim,
    letterSpacing: 1,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
});