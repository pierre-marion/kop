import { ScrollView, View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors, radius } from '../../theme/tokens';
import InnerTabs from '../../components/InnerTabs';
import FormDots from '../../components/FormDots';
import TeamLogo from '../../components/TeamLogo';
import { useStandings, useTopScorers } from '../../hooks/useFootballData';
import { getTeamColor } from '../../theme/teamColors';
import {
  getCompetitionConfig,
  getQualifZone,
  getCurrentSeasonLabel,
  type QualifZone,
} from '../../data/competitionConfigs';
import type { StandingEntry } from '../../services/footballApi';

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

function parseForm(form: string | undefined): string[] {
  if (!form) return [];
  return form.split(',').map((s) => s.trim()).filter(Boolean);
}

export default function CompetitionDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const apiCode = (id ?? '').toUpperCase();
  const config = getCompetitionConfig(apiCode);

  const {
    data: standingsData,
    isLoading: standingsLoading,
    error: standingsError,
  } = useStandings(apiCode);

  const {
    data: scorersData,
    isLoading: scorersLoading,
    error: scorersError,
  } = useTopScorers(apiCode, 5);

  // Compétition inconnue → fallback simple
  if (!config) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={10}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </Pressable>
        </View>
        <View style={styles.centerState}>
          <Ionicons name="warning-outline" size={28} color={colors.textMuted} />
          <Text style={styles.centerStateText}>Compétition inconnue</Text>
        </View>
      </SafeAreaView>
    );
  }

  const totalTable = standingsData?.standings?.find((s) => s.type === 'TOTAL')?.table ?? [];
  const totalTeams = totalTable.length;
  const currentMatchday = standingsData?.season?.currentMatchday;
  const totalMatchdays = totalTeams ? (totalTeams - 1) * 2 : 0;
  const matchdayLabel = currentMatchday
    ? totalMatchdays
      ? `J${currentMatchday}/${totalMatchdays}`
      : `J${currentMatchday}`
    : '—';
  const remainingDays = currentMatchday && totalMatchdays
    ? Math.max(0, totalMatchdays - currentMatchday)
    : null;

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
          colors={[hexToRgba(config.color, 0.25), colors.bg]}
          style={styles.identitySection}
        >
          <View style={[styles.identityHalo, { backgroundColor: hexToRgba(config.color, 0.4) }]} />
          <View style={styles.identityRow}>
            <View style={[styles.compLogo, { backgroundColor: config.color }]}>
              <Text style={[styles.compLogoText, { color: config.logoTextColor }]}>{config.displayCode}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.compName}>{config.name}</Text>
              <Text style={styles.compSubtitle}>
                {config.country} · {getCurrentSeasonLabel()}
              </Text>
              <View style={styles.matchdayRow}>
                <View style={styles.matchdayBadge}>
                  <Text style={styles.matchdayBadgeText}>{matchdayLabel}</Text>
                </View>
                {remainingDays !== null && (
                  <Text style={styles.matchdayInfo}>· {remainingDays} journées restantes</Text>
                )}
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Inner tabs */}
        <InnerTabs tabs={competitionTabs} />

        {/* CLASSEMENT */}
        {standingsLoading && totalTable.length === 0 ? (
          <View style={styles.sectionState}>
            <ActivityIndicator size="small" color={colors.accent} />
            <Text style={styles.sectionStateText}>Chargement du classement…</Text>
          </View>
        ) : standingsError ? (
          <View style={styles.sectionState}>
            <Ionicons name="warning-outline" size={20} color={colors.textMuted} />
            <Text style={styles.sectionStateText}>
              {(standingsError as Error)?.message || 'Classement indisponible'}
            </Text>
          </View>
        ) : totalTable.length === 0 ? (
          <View style={styles.sectionState}>
            <Ionicons name="file-tray-outline" size={20} color={colors.textMuted} />
            <Text style={styles.sectionStateText}>Aucune donnée de classement</Text>
          </View>
        ) : (
          <>
            <View style={styles.standingsHeader}>
              <Text style={[styles.colLabel, { width: 18 }]}>#</Text>
              <Text style={[styles.colLabel, { flex: 1 }]}>ÉQUIPE</Text>
              <Text style={[styles.colLabel, { width: 24, textAlign: 'center' }]}>J</Text>
              <Text style={[styles.colLabel, { width: 30, textAlign: 'center' }]}>D</Text>
              <Text style={[styles.colLabel, { width: 60, textAlign: 'center' }]}>FORME</Text>
              <Text style={[styles.colLabel, { width: 26, textAlign: 'right' }]}>PTS</Text>
            </View>

            <View style={styles.standingsCard}>
              {totalTable.map((entry, index) => {
                const isLeader = entry.position === 1;
                const zone: QualifZone = getQualifZone(apiCode, entry.position, totalTeams);
                const prevZone: QualifZone | null =
                  index > 0
                    ? getQualifZone(apiCode, totalTable[index - 1].position, totalTeams)
                    : null;

                const separator =
                  prevZone === 'champions' && zone === 'europa'
                    ? 'EUROPA LEAGUE'
                    : prevZone !== 'relegation' && zone === 'relegation'
                    ? 'ZONE DE RELÉGATION'
                    : null;

                const teamColor = getTeamColor(entry.team.id);
                const form = parseForm(entry.form);
                const diffLabel =
                  entry.goalDifference > 0 ? `+${entry.goalDifference}` : `${entry.goalDifference}`;

                return (
                  <View key={entry.team.id}>
                    {separator && (
                      <View
                        style={[
                          styles.qualifSeparator,
                          separator === 'ZONE DE RELÉGATION' && styles.qualifSeparatorDanger,
                        ]}
                      >
                        <Text
                          style={[
                            styles.qualifSeparatorText,
                            separator === 'ZONE DE RELÉGATION' && styles.qualifSeparatorTextDanger,
                          ]}
                        >
                          ═══ {separator} ═══
                        </Text>
                      </View>
                    )}
                    <Pressable
                      onPress={() => router.push(`/team/${entry.team.id}`)}
                      style={[
                        styles.standingRow,
                        index > 0 && { borderTopWidth: 0.5, borderTopColor: colors.border },
                        isLeader && styles.standingRowLeader,
                      ]}
                    >
                      {isLeader && <View style={styles.leaderBar} />}
                      <Text
                        style={[styles.rank, isLeader && { color: colors.accent, fontWeight: '700' }]}
                      >
                        {entry.position}
                      </Text>
                      <TeamLogo
                        url={entry.team.crest}
                        tla={entry.team.tla}
                        fallbackBg={teamColor}
                        fallbackText="#FFFFFF"
                        size={22}
                      />
                      <Text style={[styles.teamName, isLeader && { fontWeight: '600' }]} numberOfLines={1}>
                        {entry.team.shortName || entry.team.name}
                      </Text>
                      <Text style={styles.cellPlayed}>{entry.playedGames}</Text>
                      <Text style={styles.cellDiff}>{diffLabel}</Text>
                      <View style={{ width: 60, alignItems: 'center' }}>
                        <FormDots form={form} />
                      </View>
                      <Text
                        style={[
                          styles.cellPoints,
                          isLeader && { color: colors.accent, fontWeight: '700' },
                        ]}
                      >
                        {entry.points}
                      </Text>
                    </Pressable>
                  </View>
                );
              })}
            </View>
          </>
        )}

        {/* TOP BUTEURS */}
        <View style={styles.section}>
          <View style={styles.scorersCard}>
            <View style={styles.scorersHeader}>
              <Ionicons name="trophy" size={13} color={colors.accent} />
              <Text style={styles.scorersTitle}>Top buteurs · {config.name}</Text>
            </View>

            {scorersLoading ? (
              <View style={styles.inlineState}>
                <ActivityIndicator size="small" color={colors.accent} />
                <Text style={styles.inlineStateText}>Chargement…</Text>
              </View>
            ) : scorersError ? (
              <View style={styles.inlineState}>
                <Ionicons name="warning-outline" size={14} color={colors.textMuted} />
                <Text style={styles.inlineStateText}>Buteurs indisponibles</Text>
              </View>
            ) : !scorersData?.scorers?.length ? (
              <View style={styles.inlineState}>
                <Ionicons name="file-tray-outline" size={14} color={colors.textMuted} />
                <Text style={styles.inlineStateText}>Aucun buteur</Text>
              </View>
            ) : (
              scorersData.scorers.map((scorer, index) => (
                <Pressable
                  key={scorer.player.id}
                  onPress={() => router.push(`/team/${scorer.team.id}`)}
                  style={[
                    styles.scorerRow,
                    index > 0 && { borderTopWidth: 0.5, borderTopColor: colors.border },
                  ]}
                >
                  <Text style={[styles.scorerRank, index === 0 && { color: colors.accent }]}>
                    {index + 1}
                  </Text>
                  <TeamLogo
                    url={scorer.team.crest}
                    tla={scorer.team.tla}
                    fallbackBg={getTeamColor(scorer.team.id)}
                    fallbackText="#FFFFFF"
                    size={28}
                  />
                  <Text style={styles.scorerName} numberOfLines={1}>
                    {scorer.player.name}
                  </Text>
                  <Text style={styles.scorerGoals}>{scorer.goals}</Text>
                </Pressable>
              ))
            )}
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
  centerState: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10 },
  centerStateText: { fontSize: 13, color: colors.textMuted },
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
  // States
  sectionState: { alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 40 },
  sectionStateText: { fontSize: 12, color: colors.textMuted },
  inlineState: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14 },
  inlineStateText: { fontSize: 11, color: colors.textMuted },
  // Standings
  standingsHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 28, paddingTop: 12, paddingBottom: 6 },
  colLabel: { fontSize: 9, color: colors.textDim, letterSpacing: 0.5 },
  standingsCard: { marginHorizontal: 16, backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 0.5, borderColor: colors.border, overflow: 'hidden' },
  standingRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 10, paddingHorizontal: 12, position: 'relative' },
  standingRowLeader: { backgroundColor: 'rgba(204,255,0,0.04)' },
  leaderBar: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, backgroundColor: colors.accent },
  rank: { fontSize: 11, color: colors.text, fontWeight: '600', width: 18 },
  teamName: { fontSize: 12, color: colors.text, flex: 1, fontWeight: '500' },
  cellPlayed: { fontSize: 11, color: colors.textMuted, width: 24, textAlign: 'center' },
  cellDiff: { fontSize: 11, color: colors.textMuted, width: 30, textAlign: 'center' },
  cellPoints: { fontSize: 12, color: colors.text, fontWeight: '600', width: 26, textAlign: 'right' },
  qualifSeparator: { backgroundColor: 'rgba(204,255,0,0.06)', paddingVertical: 4, paddingHorizontal: 12, borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.border, borderStyle: 'dashed' },
  qualifSeparatorDanger: { backgroundColor: 'rgba(239,68,68,0.08)' },
  qualifSeparatorText: { fontSize: 8, color: colors.accent, letterSpacing: 1, fontWeight: '600', textAlign: 'center' },
  qualifSeparatorTextDanger: { color: '#EF4444' },
  // Section
  section: { paddingHorizontal: 16, paddingTop: 16 },
  scorersCard: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: 14, borderWidth: 0.5, borderColor: colors.border },
  scorersHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  scorersTitle: { fontSize: 11, color: colors.text, fontWeight: '600', flex: 1 },
  scorerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 6 },
  scorerRank: { fontSize: 13, color: colors.textMuted, fontWeight: '600', width: 14 },
  scorerName: { fontSize: 12, color: colors.text, flex: 1, fontWeight: '500' },
  scorerGoals: { fontSize: 13, color: colors.text, fontWeight: '600' },
});
