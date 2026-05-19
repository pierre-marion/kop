import { useMemo } from 'react';
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
import { useFavoritesStore } from '../../stores/favorites';
import { buildFavoriteClubMatcher } from '../../lib/favoritesMatch';

function clubIds(item: any): Array<string | null | undefined> {
  return [
    item.clubFrom?.code,
    item.clubFrom?.name,
    item.clubTo?.code,
    item.clubTo?.name,
  ];
}

export default function MercatoScreen() {
  const favorites = useFavoritesStore((s) => s.items);

  const { favDeals, otherDeals, favRumors, otherRumors } = useMemo(() => {
    const matches = buildFavoriteClubMatcher(favorites);
    return {
      favDeals: officialDeals.filter((d) => matches(clubIds(d))),
      otherDeals: officialDeals.filter((d) => !matches(clubIds(d))),
      favRumors: transferRumors.filter((r) => matches(clubIds(r))),
      otherRumors: transferRumors.filter((r) => !matches(clubIds(r))),
    };
  }, [favorites]);

  const hasFavorites = favDeals.length + favRumors.length > 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <PageHeader
          title="Mercato"
          subtitle={`FENÊTRE D'ÉTÉ · J-${mercatoOverview.daysLeft} JOURS`}
        />

        <MercatoOverview />

        {/* Section "Tes clubs" — affichée seulement si des favoris matchent */}
        {hasFavorites && (
          <>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <Ionicons name="star" size={13} color={colors.accent} />
                <Text style={styles.sectionTitle}>Tes clubs</Text>
              </View>
              <Text style={styles.sectionAction}>
                {favDeals.length + favRumors.length} actu{favDeals.length + favRumors.length > 1 ? 's' : ''}
              </Text>
            </View>

            {favDeals.map((deal) => (
              <OfficialDealCard
                key={`favd-${deal.id}`}
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
            {favRumors.map((rumor) => (
              <RumorCard
                key={`favr-${rumor.id}`}
                playerName={rumor.playerName}
                amount={rumor.amount}
                clubFrom={rumor.clubFrom}
                clubTo={rumor.clubTo}
                reliability={rumor.reliability}
                sources={rumor.sources}
                trackedDays={rumor.trackedDays}
              />
            ))}
          </>
        )}

        {/* Section Deals officiels */}
        <View style={[styles.sectionHeader, hasFavorites && { marginTop: 12 }]}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.dot} />
            <Text style={styles.sectionTitle}>Deals officiels</Text>
          </View>
          <Text style={styles.sectionAction}>23 cette semaine</Text>
        </View>

        {otherDeals.map((deal) => (
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

        {otherRumors.map((rumor) => (
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