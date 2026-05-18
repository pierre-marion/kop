import { useState, useMemo } from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors, radius } from '../../theme/tokens';
import InnerTabs from '../../components/InnerTabs';
import TeamLogo from '../../components/TeamLogo';
import Flag from '../../components/Flag';
import {
  useTeam,
  useTeamUpcomingMatches,
  useTeamStandingEntry,
  useMatchesAroundToday,
} from '../../hooks/useFootballData';
import { getTeamColor, getTeamGradient } from '../../theme/teamColors';
import { getCompetitionConfig } from '../../data/competitionConfigs';
import { useFavoritesStore } from '../../stores/favorites';
import type { Match } from '../../services/footballApi';

const teamTabs = [
  { id: 'overview', label: 'Aperçu' },
  { id: 'squad', label: 'Effectif' },
  { id: 'matches', label: 'Matchs' },
];

const hexToRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

function formatTime(utcDate: string): string {
  return new Date(utcDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

function formatDay(utcDate: string): string {
  const d = new Date(utcDate);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  if (sameDay(d, today)) return "Auj.";
  if (sameDay(d, tomorrow)) return 'Demain';
  return d.toLocaleDateString('fr-FR', { weekday: 'short', day: '2-digit', month: 'short' });
}

function getAge(dateOfBirth: string): number | null {
  if (!dateOfBirth) return null;
  const dob = new Date(dateOfBirth);
  if (isNaN(dob.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age--;
  return age;
}

const POSITIONS_FR: Record<string, string> = {
  'Goalkeeper': 'Gardien',
  'Defence': 'Défenseur',
  'Defender': 'Défenseur',
  'Centre-Back': 'Défenseur central',
  'Left-Back': 'Latéral gauche',
  'Right-Back': 'Latéral droit',
  'Sweeper': 'Libéro',
  'Midfield': 'Milieu',
  'Midfielder': 'Milieu',
  'Defensive Midfield': 'Milieu défensif',
  'Central Midfield': 'Milieu central',
  'Attacking Midfield': 'Milieu offensif',
  'Left Midfield': 'Milieu gauche',
  'Right Midfield': 'Milieu droit',
  'Offence': 'Attaquant',
  'Attacker': 'Attaquant',
  'Forward': 'Attaquant',
  'Centre-Forward': 'Avant-centre',
  'Left Winger': 'Ailier gauche',
  'Right Winger': 'Ailier droit',
  'Second Striker': 'Second attaquant',
  'Manager': 'Entraîneur',
  'Head Coach': 'Entraîneur principal',
  'Assistant Coach': 'Entraîneur adjoint',
};

function translatePosition(p: string): string {
  if (!p) return '—';
  return POSITIONS_FR[p] || p;
}

type PositionGroup = 'goalkeeper' | 'defender' | 'midfielder' | 'attacker' | 'staff' | 'other';

const GROUP_ORDER: PositionGroup[] = ['goalkeeper', 'defender', 'midfielder', 'attacker', 'staff', 'other'];

const GROUP_LABELS: Record<PositionGroup, string> = {
  goalkeeper: 'Gardiens',
  defender: 'Défenseurs',
  midfielder: 'Milieux',
  attacker: 'Attaquants',
  staff: 'Staff',
  other: 'Autres',
};

function getPositionGroup(position: string): PositionGroup {
  if (!position) return 'other';
  const lower = position.toLowerCase();
  if (lower.includes('keeper') || lower.includes('goal')) return 'goalkeeper';
  if (
    lower.includes('back') ||
    lower.includes('defence') ||
    lower.includes('defender') ||
    lower.includes('sweeper')
  ) return 'defender';
  if (lower.includes('midfield')) return 'midfielder';
  if (
    lower.includes('forward') ||
    lower.includes('attack') ||
    lower.includes('winger') ||
    lower.includes('striker') ||
    lower.includes('offence')
  ) return 'attacker';
  if (
    lower.includes('manager') ||
    lower.includes('coach') ||
    lower.includes('staff')
  ) return 'staff';
  return 'other';
}

export default function TeamDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const teamId = id ? parseInt(id, 10) : undefined;

  const [activeTab, setActiveTab] = useState<string>('overview');

  const { data: team, isLoading: teamLoading, error: teamError } = useTeam(teamId);
  const { data: upcoming } = useTeamUpcomingMatches(teamId, 10);
  const standingInfo = useTeamStandingEntry(teamId);
  const { data: allMatches } = useMatchesAroundToday();

  const liveMatch: Match | undefined = useMemo(() => {
    if (!allMatches || !teamId) return undefined;
    return allMatches.find(
      (m) =>
        (m.status === 'IN_PLAY' || m.status === 'PAUSED') &&
        (m.homeTeam.id === teamId || m.awayTeam.id === teamId)
    );
  }, [allMatches, teamId]);

  const teamColor = getTeamColor(teamId);
  const teamGradient = getTeamGradient(teamId);

  if (!teamId || isNaN(teamId)) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={10}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </Pressable>
        </View>
        <View style={styles.centerState}>
          <Ionicons name="warning-outline" size={28} color={colors.textMuted} />
          <Text style={styles.centerStateText}>Équipe invalide</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (teamLoading && !team) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={10}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </Pressable>
        </View>
        <View style={styles.centerState}>
          <ActivityIndicator size="small" color={colors.accent} />
          <Text style={styles.centerStateText}>Chargement de l'équipe…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (teamError || !team) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={10}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </Pressable>
        </View>
        <View style={styles.centerState}>
          <Ionicons name="warning-outline" size={28} color={colors.textMuted} />
          <Text style={styles.centerStateText}>
            {(teamError as Error)?.message || 'Équipe indisponible'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Compétition affichée : celle trouvée dans les standings (sinon rien)
  const competitionConfig = standingInfo.competitionCode
    ? getCompetitionConfig(standingInfo.competitionCode)
    : undefined;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={10}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </Pressable>
          <View style={styles.headerActions}>
            <Pressable hitSlop={10}>
              <Ionicons name="share-outline" size={20} color={colors.text} />
            </Pressable>
            <FollowTeamButton teamId={teamId!} teamName={team.shortName || team.name} crest={team.crest} tla={team.tla} />
          </View>
        </View>

        {/* Bloc identité avec dégradé club */}
        <LinearGradient
          colors={[hexToRgba(teamColor, 0.5), hexToRgba(teamColor, 0.2), colors.bg]}
          style={styles.identitySection}
        >
          <View style={[styles.identityHalo, { backgroundColor: hexToRgba(teamColor, 0.35) }]} />
          <View style={styles.identityRow}>
            <LinearGradient
              colors={teamGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.teamMainLogoWrapper}
            >
              <View style={styles.teamMainLogoInner}>
                <TeamLogo
                  url={team.crest}
                  tla={team.tla}
                  size={60}
                  fallbackBg="transparent"
                  fallbackText="#FFFFFF"
                />
              </View>
            </LinearGradient>
            <View style={{ flex: 1 }}>
              <Text style={styles.teamShortName}>{team.shortName || team.name}</Text>
              <Text style={styles.teamSubtitle}>
                {team.name}
                {team.founded ? ` · Fondé ${team.founded}` : ''}
              </Text>
              {team.venue && (
                <Text style={styles.teamVenue}>
                  <Ionicons name="location-outline" size={9} color={colors.textMuted} /> {team.venue}
                </Text>
              )}
              {competitionConfig && standingInfo.entry && (
                <View style={styles.competitionInfo}>
                  <View style={[styles.compBadge, { backgroundColor: competitionConfig.color }]}>
                    <Text style={[styles.compBadgeText, { color: competitionConfig.logoTextColor }]}>
                      {competitionConfig.displayCode}
                    </Text>
                  </View>
                  <Text style={styles.compName} numberOfLines={1}>{competitionConfig.name}</Text>
                  <Text style={styles.dot}>·</Text>
                  <Text style={styles.compRank}>
                    {standingInfo.entry.position}e · {standingInfo.entry.points} pts
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Stats glass cards */}
          <View style={styles.statsRow}>
            <View style={styles.glassCard}>
              <Text style={[styles.glassValue, { color: colors.accent }]}>
                {standingInfo.entry?.won ?? '—'}
              </Text>
              <Text style={styles.glassLabel}>VICTOIRES</Text>
            </View>
            <View style={styles.glassCard}>
              <Text style={styles.glassValue}>
                {standingInfo.entry?.draw ?? '—'}
              </Text>
              <Text style={styles.glassLabel}>NULS</Text>
            </View>
            <View style={styles.glassCard}>
              <Text style={[styles.glassValue, { color: '#EF4444' }]}>
                {standingInfo.entry?.lost ?? '—'}
              </Text>
              <Text style={styles.glassLabel}>DÉFAITES</Text>
            </View>
            <View style={styles.glassCard}>
              <Text style={styles.glassValue}>
                {standingInfo.entry
                  ? standingInfo.entry.goalDifference > 0
                    ? `+${standingInfo.entry.goalDifference}`
                    : `${standingInfo.entry.goalDifference}`
                  : '—'}
              </Text>
              <Text style={styles.glassLabel}>DIFF. BUTS</Text>
            </View>
          </View>
        </LinearGradient>

        <InnerTabs tabs={teamTabs} initialActiveId={activeTab} onChange={setActiveTab} />

        {activeTab === 'overview' && (
          <OverviewTab
            liveMatch={liveMatch}
            upcoming={upcoming}
            squad={team.squad ?? []}
            teamColor={teamColor}
            onMatchPress={(mId) => router.push(`/match/${mId}`)}
          />
        )}

        {activeTab === 'squad' && (
          <SquadTab squad={team.squad ?? []} teamColor={teamColor} />
        )}

        {activeTab === 'matches' && (
          <MatchesTab
            upcoming={upcoming}
            liveMatch={liveMatch}
            onMatchPress={(mId) => router.push(`/match/${mId}`)}
          />
        )}

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ============================================
// BOUTON SUIVRE
// ============================================

function FollowTeamButton({ teamId, teamName, crest, tla }: {
  teamId: number;
  teamName: string;
  crest?: string;
  tla: string;
}) {
  const isFav = useFavoritesStore((s) => s.isFavorited('team', String(teamId)));
  const toggle = useFavoritesStore((s) => s.toggle);

  return (
    <Pressable
      style={[styles.followButton, isFav && styles.followButtonActive]}
      onPress={() =>
        toggle({
          kind: 'team',
          entityId: String(teamId),
          displayName: teamName,
          meta: { crest, tla },
        })
      }
    >
      <Ionicons
        name={isFav ? 'checkmark' : 'add'}
        size={12}
        color={isFav ? colors.accent : colors.accentText}
      />
      <Text style={[styles.followText, isFav && { color: colors.accent }]}>
        {isFav ? 'SUIVI' : 'SUIVRE'}
      </Text>
    </Pressable>
  );
}

// ============================================
// ONGLETS
// ============================================

function OverviewTab({
  liveMatch,
  upcoming,
  squad,
  teamColor,
  onMatchPress,
}: {
  liveMatch?: Match;
  upcoming?: Match[];
  squad: { id: number; name: string; position: string; dateOfBirth: string; nationality: string }[];
  teamColor: string;
  onMatchPress: (id: number) => void;
}) {
  // Joueurs clés : 6 premiers du squad qui ne sont pas Manager
  const keyPlayers = squad.filter((p) => p.position !== 'Manager').slice(0, 6);
  const next3 = upcoming?.slice(0, 3) ?? [];

  return (
    <>
      {/* Match en cours */}
      {liveMatch && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.liveLabelDot} />
            <Text style={styles.sectionTitle}>Match en cours</Text>
          </View>
          <LiveMatchPreview match={liveMatch} onPress={() => onMatchPress(liveMatch.id)} />
        </View>
      )}

      {/* Prochains matchs (3) */}
      <View style={styles.section}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Prochains matchs</Text>
        </View>
        {next3.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="calendar-outline" size={20} color={colors.textMuted} />
            <Text style={styles.emptyCardText}>Aucun match programmé</Text>
          </View>
        ) : (
          <View style={styles.upcomingCard}>
            {next3.map((m, index) => (
              <UpcomingRow
                key={m.id}
                match={m}
                isFirst={index === 0}
                onPress={() => onMatchPress(m.id)}
              />
            ))}
          </View>
        )}
      </View>

      {/* Joueurs clés */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { marginBottom: 10 }]}>Joueurs clés</Text>
        {keyPlayers.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="people-outline" size={20} color={colors.textMuted} />
            <Text style={styles.emptyCardText}>Effectif non disponible</Text>
          </View>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingRight: 16 }}>
            {keyPlayers.map((player, index) => (
              <LinearGradient
                key={player.id}
                colors={[hexToRgba(teamColor, 0.4), colors.surface]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.playerCard}
              >
                <View style={[styles.playerAvatar, index === 0 && { borderWidth: 2, borderColor: colors.accent }]}>
                  <Ionicons name="person" size={22} color="rgba(255,255,255,0.6)" />
                </View>
                <Text style={styles.playerName} numberOfLines={2}>{player.name}</Text>
                <Text style={styles.playerPosition}>{translatePosition(player.position)}</Text>
                <View style={styles.playerStats}>
                  <View style={styles.playerStat}>
                    <Text style={styles.playerStatValue}>{getAge(player.dateOfBirth) ?? '—'}</Text>
                    <Text style={styles.playerStatLabel}>ANS</Text>
                  </View>
                  <View style={styles.playerStat}>
                    <Flag country={player.nationality} size={20} showFallbackText={false} />
                    <Text style={styles.playerStatLabel}>NAT.</Text>
                  </View>
                </View>
              </LinearGradient>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Dernière actu - placeholder */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { marginBottom: 10 }]}>Actu</Text>
        <View style={styles.emptyCard}>
          <Ionicons name="newspaper-outline" size={20} color={colors.textMuted} />
          <Text style={styles.emptyCardText}>Flux d'actu bientôt disponible</Text>
        </View>
      </View>
    </>
  );
}

function SquadTab({
  squad,
  teamColor,
}: {
  squad: { id: number; name: string; position: string; dateOfBirth: string; nationality: string }[];
  teamColor: string;
}) {
  if (squad.length === 0) {
    return (
      <View style={styles.section}>
        <View style={styles.emptyCard}>
          <Ionicons name="people-outline" size={20} color={colors.textMuted} />
          <Text style={styles.emptyCardText}>Effectif non disponible sur cette équipe</Text>
        </View>
      </View>
    );
  }

  // Regroupe par poste large + trie chaque groupe par nom
  const groups = squad.reduce<Record<PositionGroup, typeof squad>>((acc, p) => {
    const group = getPositionGroup(p.position);
    (acc[group] ??= []).push(p);
    return acc;
  }, {} as Record<PositionGroup, typeof squad>);

  // Tri intra-groupe : alphabétique sur le nom
  for (const key of Object.keys(groups) as PositionGroup[]) {
    groups[key].sort((a, b) => a.name.localeCompare(b.name, 'fr'));
  }

  const visibleGroups = GROUP_ORDER.filter((g) => groups[g] && groups[g].length > 0);

  return (
    <View style={styles.section}>
      {visibleGroups.map((group) => (
        <View key={group} style={{ marginBottom: 14 }}>
          <View style={styles.squadGroupHeader}>
            <Text style={styles.squadGroupTitle}>{GROUP_LABELS[group].toUpperCase()}</Text>
            <Text style={styles.squadGroupCount}>{groups[group].length}</Text>
          </View>
          <View style={styles.squadCard}>
            {groups[group].map((player, index) => (
              <View
                key={player.id}
                style={[
                  styles.squadRow,
                  index > 0 && { borderTopWidth: 0.5, borderTopColor: colors.border },
                ]}
              >
                <View style={[styles.squadAvatar, { backgroundColor: hexToRgba(teamColor, 0.5) }]}>
                  <Ionicons name="person" size={14} color="rgba(255,255,255,0.7)" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.squadName}>{player.name}</Text>
                  <Text style={styles.squadPosition}>{translatePosition(player.position)}</Text>
                  <View style={styles.squadMetaRow}>
                    <Flag country={player.nationality} size={11} showFallbackText={false} />
                    <Text style={styles.squadMeta}>
                      {player.nationality || '—'}
                      {getAge(player.dateOfBirth) !== null ? ` · ${getAge(player.dateOfBirth)} ans` : ''}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}

function MatchesTab({
  upcoming,
  liveMatch,
  onMatchPress,
}: {
  upcoming?: Match[];
  liveMatch?: Match;
  onMatchPress: (id: number) => void;
}) {
  if (!upcoming) {
    return (
      <View style={styles.section}>
        <View style={styles.inlineState}>
          <ActivityIndicator size="small" color={colors.accent} />
          <Text style={styles.inlineStateText}>Chargement des matchs…</Text>
        </View>
      </View>
    );
  }

  if (!liveMatch && upcoming.length === 0) {
    return (
      <View style={styles.section}>
        <View style={styles.emptyCard}>
          <Ionicons name="calendar-outline" size={20} color={colors.textMuted} />
          <Text style={styles.emptyCardText}>Pas de match programmé</Text>
        </View>
      </View>
    );
  }

  return (
    <>
      {liveMatch && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.liveLabelDot} />
            <Text style={styles.sectionTitle}>En direct</Text>
          </View>
          <LiveMatchPreview match={liveMatch} onPress={() => onMatchPress(liveMatch.id)} />
        </View>
      )}

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { marginBottom: 10 }]}>À venir</Text>
        <View style={styles.upcomingCard}>
          {upcoming.map((m, index) => (
            <UpcomingRow
              key={m.id}
              match={m}
              isFirst={index === 0}
              onPress={() => onMatchPress(m.id)}
            />
          ))}
        </View>
      </View>
    </>
  );
}

function LiveMatchPreview({ match, onPress }: { match: Match; onPress: () => void }) {
  const homeScore = match.score.fullTime.home ?? 0;
  const awayScore = match.score.fullTime.away ?? 0;
  return (
    <Pressable style={styles.matchCard} onPress={onPress}>
      <View style={styles.matchCardHeader}>
        <Text style={styles.matchComp} numberOfLines={1}>{match.competition.name}</Text>
        <View style={styles.matchLiveBadge}>
          <View style={styles.liveLabelDot} />
          <Text style={styles.matchLiveText}>LIVE {match.minute ? `${match.minute}'` : ''}</Text>
        </View>
      </View>
      <View style={styles.matchScoreRow}>
        <View style={styles.matchTeam}>
          <TeamLogo url={match.homeTeam.crest} tla={match.homeTeam.tla} fallbackBg={getTeamColor(match.homeTeam.id)} size={30} />
          <Text style={styles.matchTeamName} numberOfLines={1}>{match.homeTeam.shortName || match.homeTeam.tla}</Text>
        </View>
        <View style={styles.matchScoreCenter}>
          <Text style={[styles.matchScore, { color: colors.accent }]}>{homeScore}</Text>
          <Text style={styles.matchScoreDash}>—</Text>
          <Text style={[styles.matchScore, { color: colors.accent }]}>{awayScore}</Text>
        </View>
        <View style={styles.matchTeam}>
          <Text style={[styles.matchTeamName, { textAlign: 'right' }]} numberOfLines={1}>{match.awayTeam.shortName || match.awayTeam.tla}</Text>
          <TeamLogo url={match.awayTeam.crest} tla={match.awayTeam.tla} fallbackBg={getTeamColor(match.awayTeam.id)} size={30} />
        </View>
      </View>
    </Pressable>
  );
}

function UpcomingRow({ match, isFirst, onPress }: { match: Match; isFirst: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.upcomingRow,
        !isFirst && { borderTopWidth: 0.5, borderTopColor: colors.border },
      ]}
    >
      <View style={styles.upcomingDateBox}>
        <Text style={styles.upcomingDate}>{formatDay(match.utcDate)}</Text>
        <Text style={styles.upcomingTime}>{formatTime(match.utcDate)}</Text>
      </View>
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <TeamLogo url={match.homeTeam.crest} tla={match.homeTeam.tla} fallbackBg={getTeamColor(match.homeTeam.id)} size={18} />
        <Text style={styles.upcomingOpponent} numberOfLines={1}>
          {match.homeTeam.tla} — {match.awayTeam.tla}
        </Text>
        <TeamLogo url={match.awayTeam.crest} tla={match.awayTeam.tla} fallbackBg={getTeamColor(match.awayTeam.id)} size={18} />
      </View>
      <Text style={styles.upcomingMeta} numberOfLines={1}>{match.competition.code}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 14, paddingBottom: 8 },
  headerActions: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  followButton: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: colors.accent, paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20 },
  followButtonActive: { backgroundColor: 'rgba(204,255,0,0.12)', borderWidth: 1, borderColor: colors.accent },
  followText: { fontSize: 10, color: colors.accentText, fontWeight: '700' },
  centerState: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10, paddingHorizontal: 24 },
  centerStateText: { fontSize: 13, color: colors.textMuted, textAlign: 'center' },
  inlineState: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14 },
  inlineStateText: { fontSize: 11, color: colors.textMuted },
  // Identity
  identitySection: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 20, position: 'relative', overflow: 'hidden' },
  identityHalo: { position: 'absolute', top: -20, right: -20, width: 180, height: 180, borderRadius: 90 },
  identityRow: { flexDirection: 'row', gap: 14, alignItems: 'center', marginBottom: 18, position: 'relative', zIndex: 1 },
  teamMainLogoWrapper: { width: 72, height: 72, borderRadius: 36, padding: 4, alignItems: 'center', justifyContent: 'center' },
  teamMainLogoInner: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  teamShortName: { fontSize: 22, color: colors.text, fontWeight: '600', letterSpacing: -0.5 },
  teamSubtitle: { fontSize: 11, color: colors.textMuted, marginTop: 4 },
  teamVenue: { fontSize: 10, color: colors.textMuted, marginTop: 2 },
  competitionInfo: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  compBadge: { paddingHorizontal: 5, paddingVertical: 2, borderRadius: 3, alignItems: 'center', justifyContent: 'center' },
  compBadgeText: { fontSize: 8, fontWeight: '700', letterSpacing: 0.3 },
  compName: { fontSize: 10, color: colors.text, fontWeight: '500', maxWidth: 130 },
  dot: { fontSize: 10, color: colors.textDim },
  compRank: { fontSize: 10, color: colors.accent, fontWeight: '600' },
  // Stats glass
  statsRow: { flexDirection: 'row', gap: 6, position: 'relative', zIndex: 1 },
  glassCard: { flex: 1, backgroundColor: 'rgba(22,22,26,0.7)', borderRadius: 10, padding: 10, alignItems: 'center' },
  glassValue: { fontSize: 16, color: colors.text, fontWeight: '600' },
  glassLabel: { fontSize: 8, color: colors.textMuted, letterSpacing: 0.5, marginTop: 2 },
  // Sections
  section: { paddingHorizontal: 16, paddingTop: 14 },
  sectionTitle: { fontSize: 11, color: colors.text, fontWeight: '600' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  liveLabelDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: colors.accent },
  emptyCard: { backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 0.5, borderColor: colors.border, paddingVertical: 22, alignItems: 'center', gap: 6 },
  emptyCardText: { fontSize: 11, color: colors.textMuted },
  // Match card
  matchCard: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: 14, borderWidth: 0.5, borderColor: colors.border },
  matchCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  matchComp: { fontSize: 9, color: colors.textMuted, letterSpacing: 0.5, flex: 1, marginRight: 8 },
  matchLiveBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(204,255,0,0.12)', paddingVertical: 3, paddingHorizontal: 8, borderRadius: 20 },
  matchLiveText: { fontSize: 9, color: colors.accent, fontWeight: '600' },
  matchScoreRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 6 },
  matchTeam: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6 },
  matchTeamName: { fontSize: 12, color: colors.text, fontWeight: '500', flex: 1 },
  matchScoreCenter: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  matchScore: { fontSize: 22, color: colors.text, fontWeight: '600', lineHeight: 24 },
  matchScoreDash: { fontSize: 13, color: colors.textDim },
  // Upcoming
  upcomingCard: { backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 0.5, borderColor: colors.border, overflow: 'hidden' },
  upcomingRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, paddingHorizontal: 12 },
  upcomingDateBox: { width: 60 },
  upcomingDate: { fontSize: 10, color: colors.text, fontWeight: '500', textTransform: 'capitalize' },
  upcomingTime: { fontSize: 9, color: colors.textMuted, marginTop: 1 },
  upcomingOpponent: { fontSize: 11, color: colors.text, flex: 1, fontWeight: '500' },
  upcomingMeta: { fontSize: 9, color: colors.textDim, width: 40, textAlign: 'right' },
  // Player cards
  playerCard: { width: 130, padding: 12, borderRadius: radius.lg, borderWidth: 0.5, borderColor: colors.border, alignItems: 'center' },
  playerAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#333', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  playerName: { fontSize: 11, color: colors.text, fontWeight: '600', textAlign: 'center' },
  playerPosition: { fontSize: 9, color: colors.textMuted, marginTop: 1, marginBottom: 6 },
  playerStats: { flexDirection: 'row', gap: 12, paddingTop: 6, borderTopWidth: 0.5, borderTopColor: colors.border, width: '100%', justifyContent: 'space-around' },
  playerStat: { alignItems: 'center' },
  playerStatValue: { fontSize: 13, color: colors.text, fontWeight: '600' },
  playerStatLabel: { fontSize: 8, color: colors.textDim },
  // Squad
  squadGroupHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6, marginHorizontal: 4 },
  squadGroupTitle: { fontSize: 9, color: colors.textDim, letterSpacing: 1, fontWeight: '600' },
  squadGroupCount: { fontSize: 9, color: colors.textDim, fontWeight: '600' },
  squadCard: { backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 0.5, borderColor: colors.border, overflow: 'hidden' },
  squadRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 9, paddingHorizontal: 12 },
  squadAvatar: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  squadName: { fontSize: 12, color: colors.text, fontWeight: '500' },
  squadPosition: { fontSize: 10, color: colors.textMuted, marginTop: 2 },
  squadMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 3 },
  squadMeta: { fontSize: 9, color: colors.textMuted },
});
