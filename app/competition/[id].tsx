import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { colors, radius } from '../../theme/tokens';
import InnerTabs from '../../components/InnerTabs';
import FormDots from '../../components/FormDots';
import { competitionDetail } from '../../data/mockData';

const competitionTabs = [
  { id: 'standings', label: 'Classement' },
  { id: 'fixtures', label: 'Calendrier' },
  { id: 'scorers', label: 'Buteurs' },
  { id: 'teams', label: 'Équipes' },
];

const hexToRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export default function CompetitionDetailScreen() {
  const router = useRouter();
  const comp = competitionDetail;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={10}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </Pressable>
          <Pressable hitSlop={10}>
            <Ionicons name="star-outline" size={20} color={colors.text} />
          </Pressable>
        </View>

        {/* Bloc identité */}
        <LinearGradient
          colors={[hexToRgba(comp.color, 0.25), colors.bg]}
          style={styles.identitySection}
        >
          <View style={[styles.identityHalo, { backgroundColor: hexToRgba(comp.color, 0.4) }]} />
          <View style={styles.identityRow}>
            <View style={[styles.compLogo, { backgroundColor: comp.color }]}>
              <Text style={[styles.compLogoText, { color: comp.logoTextColor }]}>{comp.code}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.compName}>{comp.name}</Text>
              <Text style={styles.compSubtitle}>{comp.country} · {comp.season}</Text>
              <View style={styles.matchdayRow}>
                <View style={styles.matchdayBadge}>
                  <Text style={styles.matchdayBadgeText}>{comp.matchday}</Text>
                </View>
                <Text style={styles.matchdayInfo}>· {comp.remainingDays} journées restantes</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Inner tabs */}
        <InnerTabs tabs={competitionTabs} />

        {/* En-tête du classement */}
        <View style={styles.standingsHeader}>
          <Text style={[styles.colLabel, { width: 18 }]}>#</Text>
          <Text style={[styles.colLabel, { flex: 1 }]}>ÉQUIPE</Text>
          <Text style={[styles.colLabel, { width: 24, textAlign: 'center' }]}>J</Text>
          <Text style={[styles.colLabel, { width: 24, textAlign: 'center' }]}>D</Text>
          <Text style={[styles.colLabel, { width: 60, textAlign: 'center' }]}>FORME</Text>
          <Text style={[styles.colLabel, { width: 26, textAlign: 'right' }]}>PTS</Text>
        </View>

        {/* Tableau classement */}
        <View style={styles.standingsCard}>
          {comp.standings.map((team, index) => {
            const isLeader = team.rank === 1;
            // Ligne pointillée entre rang 3 et 4 (zone Europa)
            const showSeparator = comp.standings[index - 1]?.qualifZone === 'champions' && team.qualifZone === 'europa';

            return (
              <View key={team.rank}>
                {showSeparator && (
                  <View style={styles.qualifSeparator}>
                    <Text style={styles.qualifSeparatorText}>═══ EUROPA LEAGUE ═══</Text>
                  </View>
                )}
                <Pressable style={[styles.standingRow, index > 0 && { borderTopWidth: 0.5, borderTopColor: colors.border }, isLeader && styles.standingRowLeader]}>
                  {isLeader && <View style={styles.leaderBar} />}
                  <Text style={[styles.rank, isLeader && { color: colors.accent, fontWeight: '700' }]}>{team.rank}</Text>
                  <View style={[styles.teamCircle, { backgroundColor: team.teamColor }]}>
                    <Text style={styles.teamCircleText}>{team.teamCode}</Text>
                  </View>
                  <Text style={[styles.teamName, isLeader && { fontWeight: '600' }]}>{team.teamName}</Text>
                  <Text style={styles.cellPlayed}>{team.played}</Text>
                  <Text style={styles.cellDiff}>{team.diff}</Text>
                  <View style={{ width: 60, alignItems: 'center' }}>
                    <FormDots form={team.form} />
                  </View>
                  <Text style={[styles.cellPoints, isLeader && { color: colors.accent, fontWeight: '700' }]}>{team.points}</Text>
                </Pressable>
              </View>
            );
          })}
        </View>

        {/* Top buteurs */}
        <View style={styles.section}>
          <View style={styles.scorersCard}>
            <View style={styles.scorersHeader}>
              <Ionicons name="trophy" size={13} color={colors.accent} />
              <Text style={styles.scorersTitle}>Top buteurs · {comp.name}</Text>
              <Text style={styles.scorersAction}>Voir tout →</Text>
            </View>
            {comp.topScorersList.map((scorer, index) => (
              <View
                key={scorer.rank}
                style={[styles.scorerRow, index > 0 && { borderTopWidth: 0.5, borderTopColor: colors.border }]}
              >
                <Text style={[styles.scorerRank, scorer.rank === 1 && { color: colors.accent }]}>{scorer.rank}</Text>
                <View style={[styles.scorerTeam, { backgroundColor: scorer.teamColor }]}>
                  <Text style={styles.scorerTeamCode}>{scorer.team}</Text>
                </View>
                <Text style={styles.scorerName}>{scorer.name}</Text>
                <Text style={styles.scorerGoals}>{scorer.goals}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 14, paddingBottom: 8 },
  identitySection: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 20, position: 'relative', overflow: 'hidden' },
  identityHalo: { position: 'absolute', top: -30, right: -30, width: 140, height: 140, borderRadius: 70 },
  identityRow: { flexDirection: 'row', gap: 14, alignItems: 'center', position: 'relative', zIndex: 1 },
  compLogo: { width: 60, height: 60, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  compLogoText: { fontSize: 22, fontWeight: '700' },
  compName: { fontSize: 22, color: colors.text, fontWeight: '600', letterSpacing: -0.5 },
  compSubtitle: { fontSize: 11, color: colors.textMuted, marginTop: 3 },
  matchdayRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  matchdayBadge: { backgroundColor: 'rgba(204,255,0,0.15)', paddingVertical: 3, paddingHorizontal: 8, borderRadius: 4 },
  matchdayBadgeText: { fontSize: 9, color: colors.accent, fontWeight: '700', letterSpacing: 0.5 },
  matchdayInfo: { fontSize: 10, color: colors.textMuted },
  // Standings
  standingsHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 28, paddingTop: 12, paddingBottom: 6 },
  colLabel: { fontSize: 9, color: colors.textDim, letterSpacing: 0.5 },
  standingsCard: { marginHorizontal: 16, backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 0.5, borderColor: colors.border, overflow: 'hidden' },
  standingRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 10, paddingHorizontal: 12, position: 'relative' },
  standingRowLeader: { backgroundColor: 'rgba(204,255,0,0.04)' },
  leaderBar: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, backgroundColor: colors.accent },
  rank: { fontSize: 11, color: colors.text, fontWeight: '600', width: 18 },
  teamCircle: { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  teamCircleText: { fontSize: 8, color: 'white', fontWeight: '700' },
  teamName: { fontSize: 12, color: colors.text, flex: 1, fontWeight: '500' },
  cellPlayed: { fontSize: 11, color: colors.textMuted, width: 24, textAlign: 'center' },
  cellDiff: { fontSize: 11, color: colors.textMuted, width: 24, textAlign: 'center' },
  cellPoints: { fontSize: 12, color: colors.text, fontWeight: '600', width: 26, textAlign: 'right' },
  qualifSeparator: { backgroundColor: 'rgba(204,255,0,0.06)', paddingVertical: 4, paddingHorizontal: 12, borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.border, borderStyle: 'dashed' },
  qualifSeparatorText: { fontSize: 8, color: colors.accent, letterSpacing: 1, fontWeight: '600' },
  // Section
  section: { paddingHorizontal: 16, paddingTop: 16 },
  scorersCard: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: 14, borderWidth: 0.5, borderColor: colors.border },
  scorersHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  scorersTitle: { fontSize: 11, color: colors.text, fontWeight: '600', flex: 1 },
  scorersAction: { fontSize: 10, color: colors.textDim },
  scorerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 6 },
  scorerRank: { fontSize: 13, color: colors.textMuted, fontWeight: '600', width: 14 },
  scorerTeam: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  scorerTeamCode: { fontSize: 9, color: 'white', fontWeight: '600' },
  scorerName: { fontSize: 12, color: colors.text, flex: 1, fontWeight: '500' },
  scorerGoals: { fontSize: 13, color: colors.text, fontWeight: '600' },
});