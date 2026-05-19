import { ScrollView, View, Text, Pressable, StyleSheet, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { colors, radius } from '../../theme/tokens';
import InnerTabs from '../../components/InnerTabs';
import FormDots from '../../components/FormDots';
import { matchDetail } from '../../data/mockData';

const matchTabs = [
  { id: 'summary', label: 'Résumé' },
  { id: 'lineups', label: 'Compos' },
  { id: 'stats', label: 'Stats' },
  { id: 'h2h', label: 'H2H' },
];

// Convertit hex en rgba
const hexToRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export default function MatchDetailScreen() {
  const router = useRouter();
  const match = matchDetail;

  const getEventIcon = (type: string) => {
    if (type === 'goal') return { icon: 'football' as const, color: colors.accent, bg: 'rgba(204,255,0,0.15)' };
    if (type === 'yellow-card') return { icon: 'square' as const, color: '#EF4444', bg: 'rgba(239,68,68,0.15)' };
    return { icon: 'football' as const, color: colors.textMuted, bg: 'rgba(204,255,0,0.1)' };
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={10}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </Pressable>
          <View style={styles.headerActions}>
            <Pressable
              hitSlop={10}
              onPress={() =>
                Share.share({
                  message: `${match.homeTeam.name} ${match.homeTeam.score} - ${match.awayTeam.score} ${match.awayTeam.name} · ${match.competition} sur Kop ⚽`,
                }).catch(() => {})
              }
            >
              <Ionicons name="share-outline" size={20} color={colors.text} />
            </Pressable>
            <Pressable hitSlop={10}>
              <Ionicons name="notifications-outline" size={20} color={colors.text} />
            </Pressable>
          </View>
        </View>

        {/* Bloc score héros */}
        <LinearGradient
          colors={[hexToRgba(match.competitionColor, 0.15), colors.bg]}
          style={styles.heroSection}
        >
          <View style={styles.heroHalo} />

          <View style={styles.competitionRow}>
            <View style={[styles.competitionBadge, { backgroundColor: match.competitionColor }]}>
              <Text style={styles.competitionBadgeText}>{match.competitionCode}</Text>
            </View>
            <Text style={styles.competitionLabel}>{match.competition}</Text>
          </View>

          <View style={styles.teamsRow}>
            {/* Home team */}
            <View style={styles.teamColumn}>
              <LinearGradient
                colors={match.homeTeam.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.teamLogo}
              >
                <Text style={styles.teamLogoText}>{match.homeTeam.code}</Text>
              </LinearGradient>
              <Text style={styles.teamName}>{match.homeTeam.name}</Text>
              <FormDots form={match.homeTeam.form} />
            </View>

            {/* Score */}
            <View style={styles.scoreBlock}>
              <View style={styles.liveBadge}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>LIVE · {match.minute}</Text>
              </View>
              <View style={styles.scoreRow}>
                <Text style={[styles.score, { color: colors.accent }]}>{match.homeTeam.score}</Text>
                <Text style={styles.scoreDash}>—</Text>
                <Text style={styles.score}>{match.awayTeam.score}</Text>
              </View>
            </View>

            {/* Away team */}
            <View style={styles.teamColumn}>
              <LinearGradient
                colors={match.awayTeam.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.teamLogo}
              >
                <Text style={[styles.teamLogoText, { color: match.awayTeam.logoTextColor || 'white' }]}>
                  {match.awayTeam.code}
                </Text>
              </LinearGradient>
              <Text style={styles.teamName}>{match.awayTeam.name}</Text>
              <FormDots form={match.awayTeam.form} />
            </View>
          </View>
        </LinearGradient>

        {/* Inner Tabs */}
        <InnerTabs tabs={matchTabs} />

        {/* Section Événements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Événements clés</Text>

          <View style={styles.timeline}>
            <View style={styles.timelineLine} />
            {match.events.map((event, index) => {
              const config = getEventIcon(event.type);
              const isHome = event.team === 'home';
              const minuteColor = event.type === 'goal'
                ? (isHome ? colors.accent : colors.accent)
                : colors.textMuted;

              return (
                <View key={index} style={styles.eventRow}>
                  <View
                    style={[
                      styles.timelineDot,
                      {
                        backgroundColor:
                          event.type === 'goal'
                            ? colors.accent
                            : event.type === 'yellow-card'
                            ? '#EF4444'
                            : '#009DDC',
                      },
                    ]}
                  />
                  <Text style={[styles.eventMinute, { color: minuteColor }]}>{event.minute}</Text>
                  <View style={[styles.eventIcon, { backgroundColor: config.bg }]}>
                    <Ionicons name={config.icon} size={12} color={config.color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.eventPlayer}>
                      {event.player} ·{' '}
                      {event.type === 'goal' ? 'BUT' : event.type === 'yellow-card' ? 'Carton jaune' : ''}
                    </Text>
                    {event.assist && (
                      <Text style={styles.eventDetail}>Pass. décisive : {event.assist}</Text>
                    )}
                    {event.detail && <Text style={styles.eventDetail}>{event.detail}</Text>}
                  </View>
                  {event.score && (
                    <Text style={[styles.eventScore, isHome && { color: colors.accent }]}>
                      {event.score}
                    </Text>
                  )}
                </View>
              );
            })}
          </View>
        </View>

        {/* Section Stats */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Statistiques</Text>
            <Text style={styles.sectionAction}>Voir tout</Text>
          </View>

          <View style={styles.statsCard}>
            {match.stats.map((stat, index) => {
              const homeTotal = stat.home + stat.away;
              const homeFlex = homeTotal > 0 ? (stat.home / homeTotal) * 100 : 50;
              const awayFlex = 100 - homeFlex;
              const homeWins = stat.home >= stat.away;

              return (
                <View key={stat.label} style={[styles.statRow, index < match.stats.length - 1 && { marginBottom: 14 }]}>
                  <View style={styles.statHeader}>
                    <Text style={[styles.statValue, homeWins && { color: colors.accent }]}>
                      {stat.home}{stat.suffix || ''}
                    </Text>
                    <Text style={styles.statLabel}>{stat.label}</Text>
                    <Text style={[styles.statValue, !homeWins && { color: colors.accent }]}>
                      {stat.away}{stat.suffix || ''}
                    </Text>
                  </View>
                  <View style={styles.statBar}>
                    <View style={[styles.statBarHome, { flex: homeFlex, backgroundColor: homeWins ? colors.accent : colors.border }]} />
                    <View style={[styles.statBarAway, { flex: awayFlex, backgroundColor: !homeWins ? '#009DDC' : colors.border }]} />
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Section H2H */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Confrontations directes</Text>
            <Text style={styles.sectionAction}>5 derniers</Text>
          </View>

          <View style={styles.h2hCard}>
            <View style={styles.h2hColumn}>
              <Text style={[styles.h2hValue, { color: colors.accent }]}>{match.h2h.homeWins}</Text>
              <Text style={styles.h2hLabel}>{match.homeTeam.code}</Text>
            </View>
            <View style={styles.h2hColumn}>
              <Text style={styles.h2hValue}>{match.h2h.draws}</Text>
              <Text style={styles.h2hLabel}>NULS</Text>
            </View>
            <View style={styles.h2hColumn}>
              <Text style={styles.h2hValue}>{match.h2h.awayWins}</Text>
              <Text style={styles.h2hLabel}>{match.awayTeam.code}</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
  },
  headerActions: { flexDirection: 'row', gap: 14 },
  heroSection: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 18, position: 'relative', overflow: 'hidden' },
  heroHalo: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(204,255,0,0.06)',
  },
  competitionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 12,
  },
  competitionBadge: { width: 18, height: 18, borderRadius: 4, alignItems: 'center', justifyContent: 'center' },
  competitionBadgeText: { fontSize: 9, color: 'white', fontWeight: '600' },
  competitionLabel: { fontSize: 10, color: colors.textMuted, letterSpacing: 0.5 },
  teamsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  teamColumn: { flex: 1, alignItems: 'center', gap: 8 },
  teamLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  teamLogoText: { fontSize: 16, color: 'white', fontWeight: '600' },
  teamName: { fontSize: 13, color: colors.text, fontWeight: '600' },
  scoreBlock: { alignItems: 'center', gap: 6 },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(204,255,0,0.12)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  liveDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: colors.accent },
  liveText: { fontSize: 10, color: colors.accent, letterSpacing: 0.5, fontWeight: '600' },
  scoreRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  score: { fontSize: 56, color: colors.text, fontWeight: '600', letterSpacing: -3, lineHeight: 56 },
  scoreDash: { fontSize: 22, color: colors.textDim, fontWeight: '300' },
  // Sections
  section: { paddingHorizontal: 16, paddingTop: 16 },
  sectionTitle: { fontSize: 11, color: colors.text, fontWeight: '600' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionAction: { fontSize: 10, color: colors.textDim },
  // Timeline
  timeline: { marginTop: 12, paddingLeft: 16, position: 'relative' },
  timelineLine: { position: 'absolute', left: 4, top: 12, bottom: 12, width: 1, backgroundColor: colors.border },
  eventRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8, position: 'relative' },
  timelineDot: { position: 'absolute', left: -16, width: 7, height: 7, borderRadius: 3.5, borderWidth: 2, borderColor: colors.bg },
  eventMinute: { fontSize: 11, fontWeight: '600', width: 28 },
  eventIcon: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  eventPlayer: { fontSize: 12, color: colors.text, fontWeight: '500' },
  eventDetail: { fontSize: 9, color: colors.textMuted, marginTop: 1 },
  eventScore: { fontSize: 10, color: colors.textMuted, fontWeight: '600' },
  // Stats
  statsCard: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: 14, borderWidth: 0.5, borderColor: colors.border },
  statRow: {},
  statHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  statValue: { fontSize: 12, color: colors.text, fontWeight: '600' },
  statLabel: { fontSize: 9, color: colors.textMuted, letterSpacing: 0.5 },
  statBar: { flexDirection: 'row', gap: 2, height: 4 },
  statBarHome: { borderRadius: 2 },
  statBarAway: { borderRadius: 2 },
  // H2H
  h2hCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 14,
    borderWidth: 0.5,
    borderColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  h2hColumn: { flex: 1, alignItems: 'center' },
  h2hValue: { fontSize: 20, color: colors.text, fontWeight: '600' },
  h2hLabel: { fontSize: 9, color: colors.textMuted, letterSpacing: 0.5, marginTop: 2 },
});