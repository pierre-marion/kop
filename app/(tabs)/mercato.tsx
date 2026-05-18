import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/tokens';
import PageHeader from '../../components/PageHeader';
import MercatoOverview from '../../components/MercatoOverview';
import OfficialDealCard from '../../components/OfficialDealCard';
import RumorCard from '../../components/RumorCard';
import FaisTonMercatoTeaser from '../../components/FaisTonMercatoTeaser';
import { mercatoOverview, officialDeals, transferRumors } from '../../data/mockData';

export default function MercatoScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <PageHeader
          title="Mercato"
          subtitle={`FENÊTRE D'ÉTÉ · J-${mercatoOverview.daysLeft} JOURS`}
        />

        <MercatoOverview />

        {/* Section Deals officiels */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.dot} />
            <Text style={styles.sectionTitle}>Deals officiels</Text>
          </View>
          <Text style={styles.sectionAction}>23 cette semaine →</Text>
        </View>

        {officialDeals.map((deal) => (
          <OfficialDealCard
            key={deal.id}
            playerName={deal.playerName}
            date={deal.date}
            type={deal.type}
            clubFrom={deal.clubFrom}
            clubTo={deal.clubTo}
            amount={deal.amount}
            salary={deal.salary}
            duration={deal.duration}
            accentColor={deal.accentColor}
          />
        ))}

        {/* Section Radar des rumeurs */}
        <View style={[styles.sectionHeader, { marginTop: 12 }]}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="radio-outline" size={13} color="#FF7A00" />
            <Text style={styles.sectionTitle}>Radar des rumeurs</Text>
          </View>
          <Text style={styles.sortLabel}>
            Trier par <Text style={styles.sortValue}>FIABILITÉ ↓</Text>
          </Text>
        </View>

        {transferRumors.map((rumor) => (
          <RumorCard
            key={rumor.id}
            playerName={rumor.playerName}
            amount={rumor.amount}
            clubFrom={rumor.clubFrom}
            clubTo={rumor.clubTo}
            reliability={rumor.reliability}
            sources={rumor.sources}
            trackedDays={rumor.trackedDays}
          />
        ))}

        <FaisTonMercatoTeaser />

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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 8,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent,
  },
  sectionTitle: {
    fontSize: 11,
    color: colors.text,
    fontWeight: '600',
  },
  sectionAction: {
    fontSize: 10,
    color: colors.textDim,
  },
  sortLabel: {
    fontSize: 10,
    color: colors.textDim,
  },
  sortValue: {
    color: colors.accent,
    fontWeight: '600',
  },
});