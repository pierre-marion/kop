import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { colors, radius } from '../../theme/tokens';
import InnerTabs from '../../components/InnerTabs';
import { teamDetail } from '../../data/mockData';

const teamTabs = [
  { id: 'overview', label: 'Aperçu' },
  { id: 'squad', label: 'Effectif' },
  { id: 'matches', label: 'Matchs' },
  { id: 'news', label: 'Actu' },
];

export default function TeamDetailScreen() {
  const router = useRouter();
  const team = teamDetail;

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
            <Pressable style={styles.followButton}>
              <Ionicons name="add" size={12} color={colors.accentText} />
              <Text style={styles.followText}>SUIVRE</Text>
            </Pressable>
          </View>
        </View>

        {/* Bloc identité avec dégradé club */}
        <LinearGradient
          colors={[`${team.gradient[0]}66`, `${team.gradient[1]}33`, colors.bg]}
          style={styles.identitySection}
        >
          <View style={styles.identityHalo} />
          <View style={styles.identityRow}>
            <LinearGradient
              colors={team.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.teamMainLogo}
            >
              <Text style={styles.teamMainLogoText}>{team.code}</Text>
            </LinearGradient>
            <View style={{ flex: 1 }}>
              <Text style={styles.teamShortName}>{team.shortName}</Text>
              <Text style={styles.teamSubtitle}>
                {team.fullName} · Fondé {team.founded}
              </Text>
              <View style={styles.competitionInfo}>
                <View style={[styles.compBadge, { backgroundColor: team.competition.color }]}>
                  <Text style={styles.compBadgeText}>{team.competition.code}</Text>
                </View>
                <Text style={styles.compName}>{team.competition.name}</Text>
                <Text style={styles.dot}>·</Text>
                <Text style={styles.compRank}>
                  {team.competition.rank}er · {team.competition.points} pts
                </Text>
              </View>
            </View>
          </View>

          {/* Stats glass cards */}
          <View style={styles.statsRow}>
            <View style={styles.glassCard}>
              <Text style={[styles.glassValue, { color: colors.accent }]}>{team.stats.wins}</Text>
              <Text style={styles.glassLabel}>VICTOIRES</Text>
            </View>
            <View style={styles.glassCard}>
              <Text style={styles.glassValue}>{team.stats.draws}</Text>
              <Text style={styles.glassLabel}>NULS</Text>
            </View>
            <View style={styles.glassCard}>
              <Text style={[styles.glassValue, { color: '#EF4444' }]}>{team.stats.losses}</Text>
              <Text style={styles.glassLabel}>DÉFAITES</Text>
            </View>
            <View style={styles.glassCard}>
              <Text style={styles.glassValue}>{team.stats.goalDiff}</Text>
              <Text style={styles.glassLabel}>DIFF. BUTS</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Inner tabs */}
        <InnerTabs tabs={teamTabs} />

        {/* Match en cours */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.liveLabelDot} />
            <Text style={styles.sectionTitle}>Match en cours</Text>
          </View>
          <Pressable
            style={styles.matchCard}
            onPress={() => router.push('/match/m1')}
          >
            <View style={styles.matchCardHeader}>
              <Text style={styles.matchComp}>{team.currentMatch.competition}</Text>
              <View style={styles.matchLiveBadge}>
                <View style={styles.liveLabelDot} />
                <Text style={styles.matchLiveText}>LIVE {team.currentMatch.minute}</Text>
              </View>
            </View>
            <View style={styles.matchScoreRow}>
              <View style={styles.matchTeam}>
                <View style={[styles.matchTeamLogo, { backgroundColor: team.currentMatch.homeColor }]}>
                  <Text style={styles.matchTeamCode}>{team.currentMatch.homeCode}</Text>
                </View>
                <Text style={styles.matchTeamName}>Paris</Text>
              </View>
              <View style={styles.matchScoreCenter}>
                <Text style={[styles.matchScore, { color: colors.accent }]}>{team.currentMatch.homeScore}</Text>
                <Text style={styles.matchScoreDash}>—</Text>
                <Text style={styles.matchScore}>{team.currentMatch.awayScore}</Text>
              </View>
              <View style={styles.matchTeam}>
                <Text style={styles.matchTeamName}>{team.currentMatch.awayCode}</Text>
                <LinearGradient
                  colors={team.currentMatch.awayGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.matchTeamLogo}
                >
                  <Text style={[styles.matchTeamCode, { color: team.currentMatch.awayLogoTextColor }]}>
                    {team.currentMatch.awayCode}
                  </Text>
                </LinearGradient>
              </View>
            </View>
          </Pressable>
        </View>

        {/* Prochains matchs */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Prochains matchs</Text>
            <Text style={styles.sectionAction}>Voir tout</Text>
          </View>
          <View style={styles.upcomingCard}>
            {team.upcomingMatches.map((match, index) => (
              <View
                key={index}
                style={[styles.upcomingRow, index > 0 && { borderTopWidth: 0.5, borderTopColor: colors.border }]}
              >
                <Text style={styles.upcomingDate}>{match.date}</Text>
                <Text style={styles.upcomingOpponent}>{match.opponent}</Text>
                <Text style={styles.upcomingMeta}>{match.time} · {match.competition}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Joueurs clés */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { marginBottom: 10 }]}>Joueurs clés</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {team.keyPlayers.map((player, index) => (
              <LinearGradient
                key={index}
                colors={[`${team.gradient[0]}66`, colors.surface]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.playerCard}
              >
                <View style={[styles.playerAvatar, player.isStar && { borderWidth: 2, borderColor: colors.accent }]}>
                  <Ionicons name="person" size={22} color="rgba(255,255,255,0.6)" />
                </View>
                <Text style={styles.playerName}>{player.name}</Text>
                <Text style={styles.playerPosition}>{player.position}</Text>
                <View style={styles.playerStats}>
                  {player.stats.map((stat, i) => (
                    <View key={i} style={styles.playerStat}>
                      <Text style={[styles.playerStatValue, stat.highlight && { color: colors.accent }]}>
                        {stat.value}
                      </Text>
                      <Text style={styles.playerStatLabel}>{stat.label}</Text>
                    </View>
                  ))}
                </View>
              </LinearGradient>
            ))}
          </ScrollView>
        </View>

        {/* Dernière actu */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { marginBottom: 10 }]}>Dernière actu</Text>
          <View style={styles.newsCard}>
            <View style={styles.newsHeader}>
              <Ionicons name="swap-horizontal" size={10} color={colors.accent} />
              <Text style={styles.newsCategory}>{team.latestNews.category}</Text>
              <Text style={styles.newsMeta}>{team.latestNews.time} · {team.latestNews.source}</Text>
            </View>
            <Text style={styles.newsTitle}>{team.latestNews.title}</Text>
          </View>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 14, paddingBottom: 8 },
  headerActions: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  followButton: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: colors.accent, paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20 },
  followText: { fontSize: 10, color: colors.accentText, fontWeight: '700' },
  // Identity
  identitySection: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 20, position: 'relative', overflow: 'hidden' },
  identityHalo: { position: 'absolute', top: -20, right: -20, width: 180, height: 180, borderRadius: 90, backgroundColor: 'rgba(204,255,0,0.08)' },
  identityRow: { flexDirection: 'row', gap: 14, alignItems: 'center', marginBottom: 18, position: 'relative', zIndex: 1 },
  teamMainLogo: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: colors.border },
  teamMainLogoText: { fontSize: 22, color: 'white', fontWeight: '700' },
  teamShortName: { fontSize: 22, color: colors.text, fontWeight: '600', letterSpacing: -0.5 },
  teamSubtitle: { fontSize: 11, color: colors.textMuted, marginTop: 4 },
  competitionInfo: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  compBadge: { width: 14, height: 14, borderRadius: 3, alignItems: 'center', justifyContent: 'center' },
  compBadgeText: { fontSize: 7, color: 'white', fontWeight: '700' },
  compName: { fontSize: 10, color: colors.text, fontWeight: '500' },
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
  sectionAction: { fontSize: 10, color: colors.textDim },
  liveLabelDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: colors.accent },
  // Match card
  matchCard: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: 14, borderWidth: 0.5, borderColor: colors.border },
  matchCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  matchComp: { fontSize: 9, color: colors.textMuted, letterSpacing: 0.5 },
  matchLiveBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(204,255,0,0.12)', paddingVertical: 3, paddingHorizontal: 8, borderRadius: 20 },
  matchLiveText: { fontSize: 9, color: colors.accent, fontWeight: '600' },
  matchScoreRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  matchTeam: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  matchTeamLogo: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  matchTeamCode: { fontSize: 10, color: 'white', fontWeight: '700' },
  matchTeamName: { fontSize: 13, color: colors.text, fontWeight: '500' },
  matchScoreCenter: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  matchScore: { fontSize: 22, color: colors.text, fontWeight: '600', lineHeight: 22 },
  matchScoreDash: { fontSize: 13, color: colors.textDim },
  // Upcoming
  upcomingCard: { backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 0.5, borderColor: colors.border, overflow: 'hidden' },
  upcomingRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, paddingHorizontal: 12 },
  upcomingDate: { fontSize: 10, color: colors.textMuted, width: 70 },
  upcomingOpponent: { fontSize: 11, color: colors.text, flex: 1, fontWeight: '500' },
  upcomingMeta: { fontSize: 9, color: colors.textDim },
  // Player cards
  playerCard: { width: 120, padding: 12, borderRadius: radius.lg, borderWidth: 0.5, borderColor: colors.border, alignItems: 'center' },
  playerAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#333', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  playerName: { fontSize: 11, color: colors.text, fontWeight: '600' },
  playerPosition: { fontSize: 9, color: colors.textMuted, marginTop: 1, marginBottom: 6 },
  playerStats: { flexDirection: 'row', gap: 12, paddingTop: 6, borderTopWidth: 0.5, borderTopColor: colors.border, width: '100%', justifyContent: 'space-around' },
  playerStat: { alignItems: 'center' },
  playerStatValue: { fontSize: 13, color: colors.text, fontWeight: '600' },
  playerStatLabel: { fontSize: 8, color: colors.textDim },
  // News card
  newsCard: { backgroundColor: colors.surface, borderRadius: radius.md, padding: 12, borderWidth: 0.5, borderColor: colors.border },
  newsHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 5 },
  newsCategory: { fontSize: 9, color: colors.accent, letterSpacing: 0.8, fontWeight: '700' },
  newsMeta: { fontSize: 9, color: colors.textDim, marginLeft: 'auto' },
  newsTitle: { fontSize: 12, color: colors.text, lineHeight: 16, fontWeight: '500' },
});