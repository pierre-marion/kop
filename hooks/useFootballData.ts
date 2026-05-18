import { useQuery } from '@tanstack/react-query';
import {
  getMatchById,
  getStandings,
  getTopScorers,
  getTeamById,
  getMatchesAroundToday,
  pickFeaturedMatch,
  pickUpcomingMatches,
  COMPETITIONS,
  type Match,
} from '../services/footballApi';

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

export { COMPETITIONS };