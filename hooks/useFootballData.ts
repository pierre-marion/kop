import { useQueries, useQuery } from '@tanstack/react-query';
import {
  getMatchById,
  getStandings,
  getTopScorers,
  getTeamById,
  getTeamUpcomingMatches,
  getMatchesAroundToday,
  pickFeaturedMatch,
  pickUpcomingMatches,
  COMPETITIONS,
  type Match,
  type StandingEntry,
} from '../services/footballApi';
import { COMPETITION_CONFIGS } from '../data/competitionConfigs';

/**
 * Hook racine : récupère TOUS les matchs autour d'aujourd'hui
 * Les hooks dérivés réutilisent ce cache → 1 seul appel API au lieu de plusieurs
 */
export function useMatchesAroundToday() {
  return useQuery({
    queryKey: ['matches', 'around-today'],
    queryFn: getMatchesAroundToday,
    // Si un match est live, refresh chaque 60 sec
    refetchInterval: (query) => {
      const matches = query.state.data;
      if (!matches) return false;
      const hasLive = matches.some(
        (m: Match) => m.status === 'IN_PLAY' || m.status === 'PAUSED'
      );
      return hasLive ? 60_000 : false;
    },
  });
}

// Match à mettre en avant sur l'accueil (réutilise le cache)
export function useFeaturedMatch() {
  const { data, isLoading, error } = useMatchesAroundToday();
  return {
    data: data ? pickFeaturedMatch(data) : undefined,
    isLoading,
    error,
  };
}

// Prochains matchs (réutilise le cache aussi)
export function useUpcomingMatches(limit: number = 6) {
  const { data, isLoading, error } = useMatchesAroundToday();
  return {
    data: data ? pickUpcomingMatches(data, limit) : undefined,
    isLoading,
    error,
  };
}

// Détail d'un match
export function useMatch(matchId: number | undefined) {
  return useQuery({
    queryKey: ['match', matchId],
    queryFn: () => getMatchById(matchId!),
    enabled: !!matchId,
  });
}

// Classement d'une compétition
export function useStandings(competitionCode: string) {
  return useQuery({
    queryKey: ['standings', competitionCode],
    queryFn: () => getStandings(competitionCode),
    staleTime: 5 * 60 * 1000,
  });
}

// Top buteurs d'une compétition
export function useTopScorers(competitionCode: string, limit: number = 10) {
  return useQuery({
    queryKey: ['scorers', competitionCode, limit],
    queryFn: () => getTopScorers(competitionCode, limit),
    staleTime: 5 * 60 * 1000,
  });
}

// Détail d'une équipe
export function useTeam(teamId: number | undefined) {
  return useQuery({
    queryKey: ['team', teamId],
    queryFn: () => getTeamById(teamId!),
    enabled: !!teamId,
    staleTime: 10 * 60 * 1000,
  });
}

// Prochains matchs d'une équipe (endpoint /teams/{id}/matches)
export function useTeamUpcomingMatches(teamId: number | undefined, limit: number = 5) {
  return useQuery({
    queryKey: ['team-upcoming', teamId, limit],
    queryFn: () => getTeamUpcomingMatches(teamId!, limit),
    enabled: !!teamId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Cherche une équipe dans les classements des 5 grands championnats.
 * Réutilise le cache des useStandings → 0 nouvelle requête si déjà en cache.
 */
export function useTeamStandingEntry(teamId: number | undefined): {
  entry: StandingEntry | undefined;
  competitionCode: string | undefined;
  competitionName: string | undefined;
  totalTeams: number;
  isLoading: boolean;
  error: unknown;
} {
  const queries = useQueries({
    queries: COMPETITION_CONFIGS.map((c) => ({
      queryKey: ['standings', c.apiCode],
      queryFn: () => getStandings(c.apiCode),
      staleTime: 5 * 60 * 1000,
      enabled: !!teamId,
    })),
  });

  const isLoading = queries.some((q) => q.isLoading);
  const error = queries.find((q) => q.error)?.error;

  for (let i = 0; i < queries.length; i++) {
    const table = queries[i].data?.standings?.find((s) => s.type === 'TOTAL')?.table;
    const found = table?.find((e) => e.team.id === teamId);
    if (found) {
      return {
        entry: found,
        competitionCode: COMPETITION_CONFIGS[i].apiCode,
        competitionName: COMPETITION_CONFIGS[i].name,
        totalTeams: table!.length,
        isLoading: false,
        error: undefined,
      };
    }
  }

  return {
    entry: undefined,
    competitionCode: undefined,
    competitionName: undefined,
    totalTeams: 0,
    isLoading,
    error,
  };
}

export { COMPETITIONS };