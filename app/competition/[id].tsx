import { useState, useMemo } from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors, radius } from '../../theme/tokens';
import InnerTabs from '../../components/InnerTabs';
import FormDots from '../../components/FormDots';
import TeamLogo from '../../components/TeamLogo';
import Flag from '../../components/Flag';
import { useStandings, useTopScorers, useMatchesAroundToday } from '../../hooks/useFootballData';
import { getTeamColor } from '../../theme/teamColors';
import {
  getCompetitionConfig,
  getQualifZone,
  getCurrentSeasonLabel,
  type QualifZone,
} from '../../data/competitionConfigs';
import type { Match, StandingEntry } from '../../services/footballApi';

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

function formatTime(utcDate: string): string {
  return new Date(utcDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

function formatDayLong(utcDate: string): string {
  const d = new Date(utcDate);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  if (sameDay(d, today)) return "Aujourd'hui";
  if (sameDay(d, yesterday)) return 'Hier';
  if (sameDay(d, tomorrow)) return 'Demain';
  return d.toLocaleDateString('fr-FR', { weekday: 'long', day: '2-digit', month: 'short' });
}

// ============================================
// SOUS-COMPOSANTS PAR ONGLET
// ============================================

function StandingsTab({ apiCode, totalTable, totalTeams, isLoading, error }: {
  apiCode: string;
  totalTable: StandingEntry[];
  totalTeams: number;
  isLoading: boolean;
  error: unknown;
}) {
  const router = useRouter();

  if (isLoading && totalTable.length === 0) {
    return (
      <View style={styles.sectionState}>
        <ActivityIndicator size="small" color={colors.accent} />
        <Text style={styles.sectionStateText}>Chargement du classement…</Text>
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.sectionState}>
        <Ionicons name="warning-outline" size={20} color={colors.textMuted} />
        <Text style={styles.sectionStateText}>
          {(error as Error)?.message || 'Classement indisponible'}
        </Text>
      </View>
    );
  }
  if (totalTable.length === 0) {
    return (
      <View style={styles.sectionState}>
        <Ionicons name="file-tray-outline" size={20} color={colors.textMuted} />
        <Text style={styles.sectionStateText}>Aucune donnée de classement</Text>
      </View>
    );
  }

  return (
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
            index > 0 ? getQualifZone(apiCode, totalTable[index - 1].position, totalTeams) : null;

          let separator: { label: string; variant: 'champions' | 'europa' | 'danger' } | null = null;
          if (index === 0 && zone === 'champions') {
            separator = { label: 'CHAMPIONS LEAGUE', variant: 'champions' };
          } else if (prevZone === 'champions' && zone === 'europa') {
            separator = { label: 'EUROPA LEAGUE', variant: 'europa' };
          } else if (prevZone !== 'relegation' && zone === 'relegation') {
            separator = { label: 'ZONE DE RELÉGATION', variant: 'danger' };
          }

          const teamColor = getTeamColor(entry.team.id);
          const form = parseForm(entry.form);
          const diffLabel = entry.goalDifference > 0 ? `+${entry.goalDifference}` : `${entry.goalDifference}`;

          return (
            <View key={entry.team.id}>
              {separator && (
                <View
                  style={[
                    styles.qualifSeparator,
                    separator.variant === 'danger' && styles.qualifSeparatorDanger,
                    separator.variant === 'champions' && styles.qualifSeparatorUcl,
                  ]}
                >
                  <Text
                    style={[
                      styles.qualifSeparatorText,
                      separator.variant === 'danger' && styles.qualifSeparatorTextDanger,
                    ]}
                  >
                    ═══ {separator.label} ═══
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
                <Text style={[styles.rank, isLeader && { color: colors.accent, fontWeight: '700' }]}>
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
                <Text style={[styles.cellPoints, isLeader && { color: colors.accent, fontWeight: '700' }]}>
                  {entry.points}
                </Text>
              </Pressable>
            </View>
          );
        })}
      </View>
    </>
  );
}

function ScorersTab({ apiCode, competitionName }: { apiCode: string; competitionName: string }) {
  const router = useRouter();
  const { data, isLoading, error } = useTopScorers(apiCode, 10);

  return (
    <View style={styles.section}>
      <View style={styles.scorersCard}>
        <View style={styles.scorersHeader}>
          <Ionicons name="trophy" size={13} color={colors.accent} />
          <Text style={styles.scorersTitle}>Top buteurs · {competitionName}</Text>
        </View>

        {isLoading ? (
          <View style={styles.inlineState}>
            <ActivityIndicator size="small" color={colors.accent} />
            <Text style={styles.inlineStateText}>Chargement…</Text>
          </View>
        ) : error ? (
          <View style={styles.inlineState}>
            <Ionicons name="warning-outline" size={14} color={colors.textMuted} />
            <Text style={styles.inlineStateText}>
              {(error as Error)?.message || 'Buteurs indisponibles'}
            </Text>
          </View>
        ) : !data?.scorers?.length ? (
          <View style={styles.inlineState}>
            <Ionicons name="file-tray-outline" size={14} color={colors.textMuted} />
            <Text style={styles.inlineStateText}>Aucun buteur</Text>
          </View>
        ) : (
          data.scorers.map((scorer, index) => (
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
              <View style={{ flex: 1 }}>
                <Text style={styles.scorerName} numberOfLines={1}>{scorer.player.name}</Text>
                <Text style={styles.scorerTeamLabel} numberOfLines={1}>
                  {scorer.team.shortName || scorer.team.name}
                </Text>
              </View>
              <Text style={styles.scorerGoals}>{scorer.goals}</Text>
            </Pressable>
          ))
        )}
      </View>
    </View>
  );
}

function FixturesTab({ apiCode }: { apiCode: string }) {
  const router = useRouter();
  const { data: matches, isLoading, error } = useMatchesAroundToday();

  const grouped = useMemo(() => {
    if (!matches) return null;
    const filtered = matches.filter((m) => m.competition.code === apiCode);
    const now = new Date();
    const live: Match[] = [];
    const upcoming: Match[] = [];
    const finished: Match[] = [];

    for (const m of filtered) {
      if (m.status === 'IN_PLAY' || m.status === 'PAUSED') {
        live.push(m);
      } else if (m.status === 'FINISHED') {
        finished.push(m);
      } else if (new Date(m.utcDate) >= now) {
        upcoming.push(m);
      } else {
        // SCHEDULED/TIMED dans le passé = anomalie API, on les met dans finished
        finished.push(m);
      }
    }
    upcoming.sort((a, b) => new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime());
    finished.sort((a, b) => new Date(b.utcDate).getTime() - new Date(a.utcDate).getTime());
    return { live, upcoming, finished };
  }, [matches, apiCode]);

  if (isLoading && !matches) {
    return (
      <View style={styles.sectionState}>
        <ActivityIndicator size="small" color={colors.accent} />
        <Text style={styles.sectionStateText}>Chargement du calendrier…</Text>
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.sectionState}>
        <Ionicons name="warning-outline" size={20} color={colors.textMuted} />
        <Text style={styles.sectionStateText}>
          {(error as Error)?.message || 'Calendrier indisponible'}
        </Text>
      </View>
    );
  }
  if (!grouped || (grouped.live.length === 0 && grouped.upcoming.length === 0 && grouped.finished.length === 0)) {
    return (
      <View style={styles.sectionState}>
        <Ionicons name="calendar-outline" size={20} color={colors.textMuted} />
        <Text style={styles.sectionStateText}>Pas de match dans la fenêtre (±10 jours)</Text>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      {grouped.live.length > 0 && (
        <FixturesSection title="EN DIRECT" matches={grouped.live} onPress={(id) => router.push(`/match/${id}`)} />
      )}
      {grouped.upcoming.length > 0 && (
        <FixturesSection title="À VENIR" matches={grouped.upcoming} onPress={(id) => router.push(`/match/${id}`)} />
      )}
      {grouped.finished.length > 0 && (
        <FixturesSection title="RÉCENTS" matches={grouped.finished} onPress={(id) => router.push(`/match/${id}`)} />
      )}
    </View>
  );
}

function FixturesSection({ title, matches, onPress }: { title: string; matches: Match[]; onPress: (id: number) => void }) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={styles.fixturesSectionTitle}>{title}</Text>
      <View style={styles.fixturesCard}>
        {matches.map((m, index) => {
          const isLive = m.status === 'IN_PLAY' || m.status === 'PAUSED';
          const isFinished = m.status === 'FINISHED';
          const homeScore = m.score.fullTime.home ?? 0;
          const awayScore = m.score.fullTime.away ?? 0;
          return (
            <Pressable
              key={m.id}
              onPress={() => onPress(m.id)}
              style={[
                styles.fixtureRow,
                index > 0 && { borderTopWidth: 0.5, borderTopColor: colors.border },
              ]}
            >
              <View style={styles.fixtureLeft}>
                {isLive ? (
                  <View style={styles.liveBadge}>
                    <View style={styles.liveDot} />
                    <Text style={styles.liveText}>{m.minute ? `${m.minute}'` : 'LIVE'}</Text>
                  </View>
                ) : (
                  <Text style={styles.fixtureDate}>{formatDayLong(m.utcDate)}</Text>
                )}
                {!isLive && <Text style={styles.fixtureTime}>{formatTime(m.utcDate)}</Text>}
              </View>
              <View style={styles.fixtureTeams}>
                <View style={styles.fixtureTeamRow}>
                  <TeamLogo url={m.homeTeam.crest} tla={m.homeTeam.tla} fallbackBg={getTeamColor(m.homeTeam.id)} fallbackText="#FFFFFF" size={20} />
                  <Text style={styles.fixtureTeamName} numberOfLines={1}>{m.homeTeam.shortName || m.homeTeam.name}</Text>
                  {(isLive || isFinished) && (
                    <Text style={[styles.fixtureScore, isLive && { color: colors.accent }]}>{homeScore}</Text>
                  )}
                </View>
                <View style={styles.fixtureTeamRow}>
                  <TeamLogo url={m.awayTeam.crest} tla={m.awayTeam.tla} fallbackBg={getTeamColor(m.awayTeam.id)} fallbackText="#FFFFFF" size={20} />
                  <Text style={styles.fixtureTeamName} numberOfLines={1}>{m.awayTeam.shortName || m.awayTeam.name}</Text>
                  {(isLive || isFinished) && (
                    <Text style={[styles.fixtureScore, isLive && { color: colors.accent }]}>{awayScore}</Text>
                  )}
                </View>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.textDim} />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function TeamsTab({ totalTable, isLoading, error }: { totalTable: StandingEntry[]; isLoading: boolean; error: unknown }) {
  const router = useRouter();

  if (isLoading && totalTable.length === 0) {
    return (
      <View style={styles.sectionState}>
        <ActivityIndicator size="small" color={colors.accent} />
        <Text style={styles.sectionStateText}>Chargement des équipes…</Text>
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.sectionState}>
        <Ionicons name="warning-outline" size={20} color={colors.textMuted} />
        <Text style={styles.sectionStateText}>
          {(error as Error)?.message || 'Équipes indisponibles'}
        </Text>
      </View>
    );
  }
  if (totalTable.length === 0) {
    return (
      <View style={styles.sectionState}>
        <Ionicons name="file-tray-outline" size={20} color={colors.textMuted} />
        <Text style={styles.sectionStateText}>Aucune équipe</Text>
      </View>
    );
  }

  const sorted = [...totalTable].sort((a, b) =>
    (a.team.shortName || a.team.name).localeCompare(b.team.shortName || b.team.name, 'fr')
  );

  return (
    <View style={styles.section}>
      <View style={styles.teamsCard}>
        {sorted.map((entry, index) => (
          <Pressable
            key={entry.team.id}
            onPress={() => router.push(`/team/${entry.team.id}`)}
            style={[
              styles.teamRow,
              index > 0 && { borderTopWidth: 0.5, borderTopColor: colors.border },
            ]}
          >
            <TeamLogo
              url={entry.team.crest}
              tla={entry.team.tla}
              fallbackBg={getTeamColor(entry.team.id)}
              fallbackText="#FFFFFF"
              size={32}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.teamRowName}>{entry.team.shortName || entry.team.name}</Text>
              <Text style={styles.teamRowMeta}>{entry.team.tla} · {entry.position}e · {entry.points} pts</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.textDim} />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

// ============================================
// ÉCRAN PRINCIPAL
// ============================================

export default function CompetitionDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const apiCode = (id ?? '').toUpperCase();
  const config = getCompetitionConfig(apiCode);

  const [activeTab, setActiveTab] = useState<string>('standings');

  const {
    data: standingsData,
    isLoading: standingsLoading,
    error: standingsError,
  } = useStandings(apiCode);

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
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={10}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </Pressable>
          <Pressable hitSlop={10}>
            <Ionicons name="star-outline" size={20} color={colors.text} />
          </Pressable>
        </View>

        <LinearGradient
          colors={[hexToRgba(config.color, 0.25), colors.bg]}
          style={styles.identitySection}
        >
          <View style={[styles.identityHalo, { backgroundColor: hexToRgba(config.color, 0.4) }]} />
          <View style={styles.identityRow}>
            {standingsData?.competition?.emblem && !standingsData.competition.emblem.toLowerCase().endsWith('.svg') ? (
              <View style={styles.compLogoEmblem}>
                <Image
                  source={{ uri: standingsData.competition.emblem }}
                  style={{ width: '100%', height: '100%' }}
                  contentFit="contain"
                  cachePolicy="memory-disk"
                  transition={150}
                />
              </View>
            ) : (
              <View style={[styles.compLogo, { backgroundColor: config.color }]}>
                <Text style={[styles.compLogoText, { color: config.logoTextColor }]}>{config.displayCode}</Text>
              </View>
            )}
            <View style={{ flex: 1 }}>
              <Text style={styles.compName}>{config.name}</Text>
              <View style={styles.compSubtitleRow}>
                <Flag country={config.countryFlag} size={12} showFallbackText={false} />
                <Text style={styles.compSubtitle}>
                  {config.country} · {getCurrentSeasonLabel()}
                </Text>
              </View>
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

        <InnerTabs tabs={competitionTabs} initialActiveId={activeTab} onChange={setActiveTab} />

        {activeTab === 'standings' && (
          <StandingsTab
            apiCode={apiCode}
            totalTable={totalTable}
            totalTeams={totalTeams}
            isLoading={standingsLoading}
            error={standingsError}
          />
        )}
        {activeTab === 'fixtures' && <FixturesTab apiCode={apiCode} />}
        {activeTab === 'scorers' && <ScorersTab apiCode={apiCode} competitionName={config.name} />}
        {activeTab === 'teams' && (
          <TeamsTab totalTable={totalTable} isLoading={standingsLoading} error={standingsError} />
        )}

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
  compLogoEmblem: { width: 60, height: 60, borderRadius: 14, backgroundColor: '#EFE9DC', padding: 8, alignItems: 'center', justifyContent: 'center' },
  compLogoText: { fontSize: 22, fontWeight: '700' },
  compName: { fontSize: 22, color: colors.text, fontWeight: '600', letterSpacing: -0.5 },
  compSubtitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  compSubtitle: { fontSize: 11, color: colors.textMuted },
  matchdayRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  matchdayBadge: { backgroundColor: 'rgba(204,255,0,0.15)', paddingVertical: 3, paddingHorizontal: 8, borderRadius: 4 },
  matchdayBadgeText: { fontSize: 9, color: colors.accent, fontWeight: '700', letterSpacing: 0.5 },
  matchdayInfo: { fontSize: 10, color: colors.textMuted },
  // States
  sectionState: { alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 40, paddingHorizontal: 24 },
  sectionStateText: { fontSize: 12, color: colors.textMuted, textAlign: 'center' },
  inlineState: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14 },
  inlineStateText: { fontSize: 11, color: colors.textMuted, textAlign: 'center' },
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
  qualifSeparatorUcl: { backgroundColor: 'rgba(204,255,0,0.12)' },
  qualifSeparatorDanger: { backgroundColor: 'rgba(239,68,68,0.08)' },
  qualifSeparatorText: { fontSize: 8, color: colors.accent, letterSpacing: 1, fontWeight: '600', textAlign: 'center' },
  qualifSeparatorTextDanger: { color: '#EF4444' },
  // Section
  section: { paddingHorizontal: 16, paddingTop: 16 },
  // Scorers
  scorersCard: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: 14, borderWidth: 0.5, borderColor: colors.border },
  scorersHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  scorersTitle: { fontSize: 11, color: colors.text, fontWeight: '600', flex: 1 },
  scorerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 },
  scorerRank: { fontSize: 13, color: colors.textMuted, fontWeight: '600', width: 14 },
  scorerName: { fontSize: 12, color: colors.text, fontWeight: '500' },
  scorerTeamLabel: { fontSize: 9, color: colors.textMuted, marginTop: 1 },
  scorerGoals: { fontSize: 13, color: colors.text, fontWeight: '600' },
  // Fixtures
  fixturesSectionTitle: { fontSize: 9, color: colors.textDim, letterSpacing: 1, fontWeight: '600', marginBottom: 6, marginLeft: 4 },
  fixturesCard: { backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 0.5, borderColor: colors.border, overflow: 'hidden' },
  fixtureRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, paddingHorizontal: 12 },
  fixtureLeft: { width: 80 },
  fixtureDate: { fontSize: 10, color: colors.text, textTransform: 'capitalize' },
  fixtureTime: { fontSize: 10, color: colors.textMuted, marginTop: 1 },
  liveBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  liveDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: colors.accent },
  liveText: { fontSize: 10, color: colors.accent, fontWeight: '600' },
  fixtureTeams: { flex: 1, gap: 4 },
  fixtureTeamRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  fixtureTeamName: { fontSize: 12, color: colors.text, flex: 1 },
  fixtureScore: { fontSize: 13, color: colors.text, fontWeight: '600', width: 20, textAlign: 'right' },
  // Teams
  teamsCard: { backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 0.5, borderColor: colors.border, overflow: 'hidden' },
  teamRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, paddingHorizontal: 12 },
  teamRowName: { fontSize: 13, color: colors.text, fontWeight: '500' },
  teamRowMeta: { fontSize: 10, color: colors.textMuted, marginTop: 2 },
});
