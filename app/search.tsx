import { useState, useMemo } from 'react';
import { ScrollView, View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useQueries } from '@tanstack/react-query';
import { colors, radius } from '../theme/tokens';
import FilterChips from '../components/FilterChips';
import TeamLogo from '../components/TeamLogo';
import { useMatchesAroundToday } from '../hooks/useFootballData';
import { getStandings, type Match, type StandingEntry } from '../services/footballApi';
import { COMPETITION_CONFIGS, type CompetitionConfig } from '../data/competitionConfigs';
import { getTeamColor } from '../theme/teamColors';
import { useRecentSearchesStore } from '../stores/recentSearches';

type SearchFilterId = 'all' | 'teams' | 'competitions' | 'matches';

const FILTERS = [
  { id: 'all', label: 'Tout' },
  { id: 'teams', label: 'Équipes' },
  { id: 'competitions', label: 'Compétitions' },
  { id: 'matches', label: 'Matchs' },
];

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim();
}

function formatMatchDate(utcDate: string): string {
  const d = new Date(utcDate);
  return d.toLocaleDateString('fr-FR', { weekday: 'short', day: '2-digit', month: 'short' }) +
    ' · ' + d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<SearchFilterId>('all');

  const recent = useRecentSearchesStore((s) => s.items);
  const addRecent = useRecentSearchesStore((s) => s.add);
  const removeRecent = useRecentSearchesStore((s) => s.remove);

  // Récupère les classements des 5 grands championnats (réutilise cache)
  const standingsQueries = useQueries({
    queries: COMPETITION_CONFIGS.map((c) => ({
      queryKey: ['standings', c.apiCode],
      queryFn: () => getStandings(c.apiCode),
      staleTime: 5 * 60 * 1000,
    })),
  });

  const allMatches = useMatchesAroundToday();

  const hasQuery = query.trim().length > 0;
  const nq = normalize(query);

  // Toutes les équipes des 5 grands championnats (déduplique par id)
  const allTeams = useMemo(() => {
    const seen = new Set<number>();
    const list: { entry: StandingEntry; competitionCode: string }[] = [];
    standingsQueries.forEach((q, i) => {
      const table = q.data?.standings?.find((s) => s.type === 'TOTAL')?.table;
      if (!table) return;
      const code = COMPETITION_CONFIGS[i].apiCode;
      for (const entry of table) {
        if (!seen.has(entry.team.id)) {
          seen.add(entry.team.id);
          list.push({ entry, competitionCode: code });
        }
      }
    });
    return list;
  }, [standingsQueries]);

  const filteredTeams = useMemo(() => {
    if (!hasQuery) return [];
    return allTeams
      .filter(({ entry }) => {
        const name = normalize(entry.team.name);
        const shortName = normalize(entry.team.shortName || '');
        const tla = normalize(entry.team.tla);
        return name.includes(nq) || shortName.includes(nq) || tla.includes(nq);
      })
      .slice(0, 15);
  }, [allTeams, nq, hasQuery]);

  const filteredCompetitions = useMemo<CompetitionConfig[]>(() => {
    if (!hasQuery) return [];
    return COMPETITION_CONFIGS.filter((c) => {
      return (
        normalize(c.name).includes(nq) ||
        normalize(c.country).includes(nq) ||
        normalize(c.displayCode).includes(nq) ||
        normalize(c.apiCode).includes(nq)
      );
    });
  }, [nq, hasQuery]);

  const filteredMatches = useMemo<Match[]>(() => {
    if (!hasQuery || !allMatches.data) return [];
    return allMatches.data
      .filter((m) => {
        return (
          normalize(m.homeTeam.name).includes(nq) ||
          normalize(m.awayTeam.name).includes(nq) ||
          normalize(m.homeTeam.tla).includes(nq) ||
          normalize(m.awayTeam.tla).includes(nq) ||
          normalize(m.competition.name).includes(nq)
        );
      })
      .sort((a, b) => Math.abs(new Date(a.utcDate).getTime() - Date.now()) - Math.abs(new Date(b.utcDate).getTime() - Date.now()))
      .slice(0, 10);
  }, [allMatches.data, nq, hasQuery]);

  const totalResults = filteredTeams.length + filteredCompetitions.length + filteredMatches.length;

  const showTeams = activeFilter === 'all' || activeFilter === 'teams';
  const showCompetitions = activeFilter === 'all' || activeFilter === 'competitions';
  const showMatches = activeFilter === 'all' || activeFilter === 'matches';

  const filtersWithCount = [
    { id: 'all', label: 'Tout', count: totalResults },
    { id: 'teams', label: 'Équipes', count: filteredTeams.length },
    { id: 'competitions', label: 'Compétitions', count: filteredCompetitions.length },
    { id: 'matches', label: 'Matchs', count: filteredMatches.length },
  ];

  const handleTeamPress = (teamId: number, teamName: string) => {
    addRecent(teamName);
    router.push(`/team/${teamId}`);
  };

  const handleCompetitionPress = (apiCode: string, name: string) => {
    addRecent(name);
    router.push(`/competition/${apiCode}`);
  };

  const handleMatchPress = (matchId: number, label: string) => {
    addRecent(label);
    router.push(`/match/${matchId}`);
  };

  const handleRecentPress = (q: string) => setQuery(q);

  const isLoading = hasQuery && standingsQueries.some((q) => q.isLoading) && allTeams.length === 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Recherche</Text>
      </View>

      <View style={styles.searchBarWrapper}>
        <View style={[styles.searchBar, hasQuery && styles.searchBarActive]}>
          <Ionicons name="search" size={16} color={hasQuery ? colors.accent : colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Équipes, compétitions, matchs…"
            placeholderTextColor={colors.textDim}
            value={query}
            onChangeText={setQuery}
            autoFocus
            returnKeyType="search"
          />
          {hasQuery && (
            <Pressable onPress={() => setQuery('')} hitSlop={10}>
              <Ionicons name="close-circle" size={16} color={colors.textDim} />
            </Pressable>
          )}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {/* Filtres */}
        {hasQuery && (
          <View style={styles.filtersContainer}>
            <FilterChips
              filters={filtersWithCount}
              activeId={activeFilter}
              onChange={(id) => setActiveFilter(id as SearchFilterId)}
            />
          </View>
        )}

        {/* État vide / loading */}
        {hasQuery && isLoading && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Chargement…</Text>
          </View>
        )}
        {hasQuery && !isLoading && totalResults === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={28} color={colors.textDim} />
            <Text style={styles.emptyText}>Aucun résultat pour "{query}"</Text>
            <Text style={styles.emptyHint}>
              Essaie le nom d'une équipe, d'un club ou d'un championnat des 5 grands.
            </Text>
          </View>
        )}

        {/* Résultats : Compétitions */}
        {hasQuery && showCompetitions && filteredCompetitions.length > 0 && (
          <View style={styles.section}>
            {activeFilter === 'all' && <Text style={styles.sectionLabel}>COMPÉTITIONS</Text>}
            {filteredCompetitions.map((comp) => (
              <Pressable
                key={comp.apiCode}
                style={styles.resultCard}
                onPress={() => handleCompetitionPress(comp.apiCode, comp.name)}
              >
                <View style={[styles.compBadge, { backgroundColor: comp.color }]}>
                  <Text style={[styles.compBadgeText, { color: comp.logoTextColor }]}>{comp.displayCode}</Text>
                </View>
                <View style={styles.resultContent}>
                  <Text style={styles.resultName}>{comp.name}</Text>
                  <Text style={styles.resultSubtitle}>{comp.country}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={colors.textDim} />
              </Pressable>
            ))}
          </View>
        )}

        {/* Résultats : Équipes */}
        {hasQuery && showTeams && filteredTeams.length > 0 && (
          <View style={styles.section}>
            {activeFilter === 'all' && <Text style={styles.sectionLabel}>ÉQUIPES</Text>}
            {filteredTeams.map(({ entry, competitionCode }) => {
              const compConfig = COMPETITION_CONFIGS.find((c) => c.apiCode === competitionCode);
              return (
                <Pressable
                  key={entry.team.id}
                  style={styles.resultCard}
                  onPress={() => handleTeamPress(entry.team.id, entry.team.shortName || entry.team.name)}
                >
                  <TeamLogo
                    url={entry.team.crest}
                    tla={entry.team.tla}
                    fallbackBg={getTeamColor(entry.team.id)}
                    fallbackText="#FFFFFF"
                    size={38}
                  />
                  <View style={styles.resultContent}>
                    <Text style={styles.resultName}>{entry.team.shortName || entry.team.name}</Text>
                    <Text style={styles.resultSubtitle}>
                      {compConfig?.name || competitionCode} · {entry.position}e · {entry.points} pts
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={colors.textDim} />
                </Pressable>
              );
            })}
          </View>
        )}

        {/* Résultats : Matchs */}
        {hasQuery && showMatches && filteredMatches.length > 0 && (
          <View style={styles.section}>
            {activeFilter === 'all' && <Text style={styles.sectionLabel}>MATCHS</Text>}
            {filteredMatches.map((m) => {
              const isLive = m.status === 'IN_PLAY' || m.status === 'PAUSED';
              const isFinished = m.status === 'FINISHED';
              const homeScore = m.score.fullTime.home ?? 0;
              const awayScore = m.score.fullTime.away ?? 0;
              return (
                <Pressable
                  key={m.id}
                  style={styles.matchCard}
                  onPress={() =>
                    handleMatchPress(m.id, `${m.homeTeam.tla} - ${m.awayTeam.tla}`)
                  }
                >
                  <View style={styles.matchHeader}>
                    <Text style={styles.matchComp} numberOfLines={1}>{m.competition.name}</Text>
                    {isLive ? (
                      <View style={styles.liveBadge}>
                        <View style={styles.liveDot} />
                        <Text style={styles.liveText}>{m.minute ? `${m.minute}'` : 'LIVE'}</Text>
                      </View>
                    ) : (
                      <Text style={styles.matchDate}>{formatMatchDate(m.utcDate)}</Text>
                    )}
                  </View>
                  <View style={styles.matchRow}>
                    <View style={styles.matchTeam}>
                      <TeamLogo url={m.homeTeam.crest} tla={m.homeTeam.tla} fallbackBg={getTeamColor(m.homeTeam.id)} size={22} />
                      <Text style={styles.matchTeamName} numberOfLines={1}>{m.homeTeam.shortName || m.homeTeam.tla}</Text>
                      {(isLive || isFinished) && (
                        <Text style={[styles.matchScore, isLive && { color: colors.accent }]}>{homeScore}</Text>
                      )}
                    </View>
                    <View style={styles.matchTeam}>
                      <TeamLogo url={m.awayTeam.crest} tla={m.awayTeam.tla} fallbackBg={getTeamColor(m.awayTeam.id)} size={22} />
                      <Text style={styles.matchTeamName} numberOfLines={1}>{m.awayTeam.shortName || m.awayTeam.tla}</Text>
                      {(isLive || isFinished) && (
                        <Text style={[styles.matchScore, isLive && { color: colors.accent }]}>{awayScore}</Text>
                      )}
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}

        {/* Recherches récentes (si pas de query) */}
        {!hasQuery && recent.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>RECHERCHES RÉCENTES</Text>
            <View style={styles.recentChips}>
              {recent.map((q) => (
                <Pressable key={q} style={styles.recentChip} onPress={() => handleRecentPress(q)}>
                  <Ionicons name="time-outline" size={11} color={colors.textDim} />
                  <Text style={styles.recentChipText}>{q}</Text>
                  <Pressable onPress={() => removeRecent(q)} hitSlop={6}>
                    <Ionicons name="close" size={11} color={colors.textDim} />
                  </Pressable>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* Suggestions par défaut */}
        {!hasQuery && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>CHAMPIONNATS</Text>
            {COMPETITION_CONFIGS.map((comp) => (
              <Pressable
                key={comp.apiCode}
                style={styles.resultCard}
                onPress={() => handleCompetitionPress(comp.apiCode, comp.name)}
              >
                <View style={[styles.compBadge, { backgroundColor: comp.color }]}>
                  <Text style={[styles.compBadgeText, { color: comp.logoTextColor }]}>{comp.displayCode}</Text>
                </View>
                <View style={styles.resultContent}>
                  <Text style={styles.resultName}>{comp.name}</Text>
                  <Text style={styles.resultSubtitle}>{comp.country}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={colors.textDim} />
              </Pressable>
            ))}
          </View>
        )}

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 8 },
  headerTitle: { fontSize: 16, color: colors.text, fontWeight: '600' },
  searchBarWrapper: { paddingHorizontal: 16, paddingVertical: 10 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchBarActive: { borderColor: colors.accent },
  searchInput: { flex: 1, fontSize: 13, color: colors.text, padding: 0 },
  filtersContainer: { paddingVertical: 4, paddingBottom: 12 },
  section: { paddingHorizontal: 16, paddingBottom: 12 },
  sectionLabel: { fontSize: 10, color: colors.textDim, letterSpacing: 1, fontWeight: '500', marginBottom: 8 },
  emptyState: {
    paddingHorizontal: 32,
    paddingVertical: 60,
    alignItems: 'center',
    gap: 10,
  },
  emptyText: { fontSize: 13, color: colors.textMuted, textAlign: 'center' },
  emptyHint: { fontSize: 11, color: colors.textDim, textAlign: 'center' },
  // Result card (équipe / compétition)
  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: 12,
    marginBottom: 6,
    borderWidth: 0.5,
    borderColor: colors.border,
  },
  compBadge: { width: 38, height: 38, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  compBadgeText: { fontSize: 11, fontWeight: '700' },
  resultContent: { flex: 1 },
  resultName: { fontSize: 13, color: colors.text, fontWeight: '600' },
  resultSubtitle: { fontSize: 10, color: colors.textMuted, marginTop: 2 },
  // Match card
  matchCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: 12,
    marginBottom: 6,
    borderWidth: 0.5,
    borderColor: colors.border,
  },
  matchHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  matchComp: { fontSize: 9, color: colors.textMuted, letterSpacing: 0.5, flex: 1, marginRight: 8 },
  matchDate: { fontSize: 9, color: colors.textDim, textTransform: 'capitalize' },
  liveBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(204,255,0,0.12)', paddingVertical: 2, paddingHorizontal: 6, borderRadius: 10 },
  liveDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: colors.accent },
  liveText: { fontSize: 9, color: colors.accent, fontWeight: '600' },
  matchRow: { gap: 6 },
  matchTeam: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  matchTeamName: { fontSize: 12, color: colors.text, flex: 1 },
  matchScore: { fontSize: 13, color: colors.text, fontWeight: '600', width: 20, textAlign: 'right' },
  // Recent
  recentChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  recentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.surface,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: colors.border,
  },
  recentChipText: { fontSize: 10, color: colors.text },
});
