import { useMemo } from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radius } from '../theme/tokens';
import MatchRow from '../components/MatchRow';
import { useUpcomingMatches } from '../hooks/useFootballData';
import { COMPETITION_CONFIGS, getCompetitionConfig } from '../data/competitionConfigs';
import type { Match } from '../services/footballApi';

// Ordre d'affichage des championnats (suivant l'ordre des configs)
const COMPETITION_ORDER = COMPETITION_CONFIGS.map((c) => c.apiCode);

export default function MatchesScreen() {
  const router = useRouter();
  const { data: upcomingMatches, isLoading } = useUpcomingMatches(50);

  // Groupement par compétition, tri chronologique pur dans chaque groupe
  const grouped = useMemo(() => {
    if (!upcomingMatches) return null;
    const map = new Map<string, Match[]>();
    for (const m of upcomingMatches) {
      const code = m.competition.code;
      if (!map.has(code)) map.set(code, []);
      map.get(code)!.push(m);
    }
    for (const list of map.values()) {
      list.sort((a, b) => new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime());
    }
    return [...map.entries()].sort(([a], [b]) => {
      const ai = COMPETITION_ORDER.indexOf(a);
      const bi = COMPETITION_ORDER.indexOf(b);
      if (ai === -1 && bi === -1) return a.localeCompare(b);
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });
  }, [upcomingMatches]);

  const totalCount = upcomingMatches?.length ?? 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </Pressable>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.headerTitle}>Matchs à venir</Text>
          {totalCount > 0 && (
            <Text style={styles.headerCount}>
              {totalCount} match{totalCount > 1 ? 's' : ''} sur 5 championnats
            </Text>
          )}
        </View>
        <View style={{ width: 22 }} />
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.accent} />
        </View>
      ) : !grouped || grouped.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="calendar-outline" size={32} color={colors.textMuted} />
          <Text style={styles.emptyText}>Aucun match à venir</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {grouped.map(([code, matches]) => (
            <CompetitionGroup
              key={code}
              apiCode={code}
              matches={matches}
              onPressHeader={() => router.push(`/competition/${code}` as any)}
            />
          ))}
          <View style={{ height: 24 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

function CompetitionGroup({
  apiCode,
  matches,
  onPressHeader,
}: {
  apiCode: string;
  matches: Match[];
  onPressHeader: () => void;
}) {
  const config = getCompetitionConfig(apiCode);
  const sample = matches[0];
  const compName = config?.name ?? sample?.competition.name ?? apiCode;
  const compCountry = config?.country;
  const compColor = config?.color ?? colors.accent;
  const compTextColor = config?.logoTextColor ?? '#FFFFFF';
  const displayCode = config?.displayCode ?? apiCode;

  return (
    <View style={styles.group}>
      <Pressable onPress={onPressHeader} style={styles.groupHeader} hitSlop={4}>
        <View style={[styles.badge, { backgroundColor: compColor }]}>
          <Text style={[styles.badgeText, { color: compTextColor }]}>{displayCode}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.groupName}>{compName}</Text>
          {compCountry && <Text style={styles.groupCountry}>{compCountry}</Text>}
        </View>
        <Text style={styles.groupCount}>{matches.length}</Text>
        <Ionicons name="chevron-forward" size={16} color={colors.textDim} />
      </Pressable>

      <LinearGradient
        colors={[`${compColor}14`, colors.surface]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.groupCard}
      >
        {matches.map((m, idx) => (
          <MatchRow key={m.id} match={m} isFirst={idx === 0} />
        ))}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 12,
  },
  headerTitle: { fontSize: 15, fontWeight: '700', color: colors.text },
  headerCount: { fontSize: 10, color: colors.textDim, marginTop: 2, letterSpacing: 0.3 },
  scroll: { paddingHorizontal: 18, paddingTop: 8 },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 10,
  },
  emptyText: { fontSize: 12, color: colors.textMuted, textAlign: 'center' },

  group: { marginBottom: 18 },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 4,
    paddingBottom: 8,
  },
  badge: {
    width: 28,
    height: 28,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.4 },
  groupName: { fontSize: 13, color: colors.text, fontWeight: '600' },
  groupCountry: {
    fontSize: 9,
    color: colors.textDim,
    letterSpacing: 0.8,
    marginTop: 1,
    textTransform: 'uppercase',
  },
  groupCount: {
    fontSize: 11,
    color: colors.textDim,
    fontWeight: '600',
  },
  groupCard: {
    borderRadius: radius.lg,
    borderWidth: 0.5,
    borderColor: colors.border,
    overflow: 'hidden',
  },
});
