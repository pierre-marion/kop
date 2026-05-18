import { ScrollView, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/tokens';
import PageHeader from '../../components/PageHeader';
import CompetitionCard from '../../components/CompetitionCard';
import { useStandings, useMatchesAroundToday } from '../../hooks/useFootballData';
import { getTeamColor } from '../../theme/teamColors';
import { COMPETITION_CONFIGS, type CompetitionConfig } from '../../data/competitionConfigs';
import type { Match, StandingEntry, CompetitionStandings } from '../../services/footballApi';

function formatMatchday(standings?: CompetitionStandings): string {
  if (!standings) return '';
  const current = standings.season?.currentMatchday;
  const teamCount = standings.standings?.find((s) => s.type === 'TOTAL')?.table.length ?? 0;
  if (!current) return '';
  if (!teamCount) return `J${current}`;
  const total = (teamCount - 1) * 2;
  return `J${current}/${total}`;
}

function pickLeader(standings?: CompetitionStandings): StandingEntry | undefined {
  if (!standings) return undefined;
  const total = standings.standings?.find((s) => s.type === 'TOTAL');
  return total?.table?.[0];
}

function formatTime(utcDate: string): string {
  const d = new Date(utcDate);
  return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

function formatDayShort(utcDate: string): string {
  const d = new Date(utcDate);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
  if (sameDay(d, today)) return "Aujourd'hui";
  if (sameDay(d, tomorrow)) return 'Demain';
  return d.toLocaleDateString('fr-FR', { weekday: 'short', day: '2-digit' });
}

function pickCompetitionHighlight(matches: Match[] | undefined, apiCode: string) {
  if (!matches) return undefined;
  const filtered = matches.filter((m) => m.competition.code === apiCode);

  const live = filtered.find((m) => m.status === 'IN_PLAY' || m.status === 'PAUSED');
  if (live) {
    const home = live.homeTeam.tla;
    const away = live.awayTeam.tla;
    const hs = live.score.fullTime.home ?? 0;
    const as = live.score.fullTime.away ?? 0;
    const minute = live.minute ? `${live.minute}'` : 'LIVE';
    return {
      type: 'live' as const,
      label: `${home} ${hs} — ${as} ${away} · ${minute}`,
    };
  }

  const now = new Date();
  const upcoming = filtered
    .filter((m) => {
      const d = new Date(m.utcDate);
      return d >= now && (m.status === 'SCHEDULED' || (m.status as string) === 'TIMED');
    })
    .sort((a, b) => new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime())[0];

  if (upcoming) {
    return {
      type: 'next' as const,
      label: `${formatDayShort(upcoming.utcDate)} · ${upcoming.homeTeam.tla} — ${upcoming.awayTeam.tla} · ${formatTime(upcoming.utcDate)}`,
    };
  }

  return undefined;
}

function CompetitionCardWithData({ config, matches }: { config: CompetitionConfig; matches?: Match[] }) {
  const { data, isLoading, error } = useStandings(config.apiCode);

  const leaderEntry = pickLeader(data);
  const leader = leaderEntry
    ? {
        code: leaderEntry.team.tla,
        name: leaderEntry.team.shortName || leaderEntry.team.name,
        color: getTeamColor(leaderEntry.team.id),
        points: leaderEntry.points,
      }
    : undefined;

  const matchday = formatMatchday(data);
  const highlight = pickCompetitionHighlight(matches, config.apiCode);

  return (
    <CompetitionCard
      code={config.displayCode}
      apiCode={config.apiCode}
      name={config.name}
      country={config.country}
      countryFlag={config.countryFlag}
      matchday={matchday}
      color={config.color}
      logoTextColor={config.logoTextColor}
      leader={leader}
      highlight={highlight}
      loading={isLoading}
      errorMessage={error ? 'Classement indisponible' : undefined}
    />
  );
}

export default function CompetitionsScreen() {
  // 1 seul appel partagé pour les highlights de toutes les cards
  const { data: matches } = useMatchesAroundToday();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <PageHeader
          title="Compétitions"
          subtitle="LES 5 GRANDS CHAMPIONNATS"
        />

        <View style={styles.list}>
          {COMPETITION_CONFIGS.map((config) => (
            <CompetitionCardWithData
              key={config.apiCode}
              config={config}
              matches={matches}
            />
          ))}
        </View>

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
  list: {
    paddingTop: 12,
  },
});
