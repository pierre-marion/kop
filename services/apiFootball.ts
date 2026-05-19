/**
 * Client API pour API-Football (api-sports.io)
 * Doc : https://www.api-football.com/documentation-v3
 * Plan gratuit : 100 requêtes/jour
 *
 * Utilisé pour : events live (buts, cartons, subs) + compositions.
 * Football-Data reste la source principale pour matchs, classements, top buteurs.
 */

const BASE_URL = 'https://v3.football.api-sports.io';
const TOKEN = process.env.EXPO_PUBLIC_API_FOOTBALL_KEY;

// IDs des 5 grands championnats côté API-Football
// (fixes, ne changent pas d'une saison à l'autre)
export const API_FOOTBALL_LEAGUES = {
  L1: 61,    // Ligue 1
  PL: 39,    // Premier League
  LIGA: 140, // La Liga
  SA: 135,   // Serie A
  BL: 78,    // Bundesliga
} as const;

// ────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────

export type ApiFootballResponse<T> = {
  get: string;
  parameters: Record<string, string>;
  errors: unknown[] | Record<string, string>;
  results: number;
  paging: { current: number; total: number };
  response: T;
};

export type ApiFootballStatus = {
  account: { firstname: string; lastname: string; email: string };
  subscription: { plan: string; end: string; active: boolean };
  requests: { current: number; limit_day: number };
};

export type ApiFootballFixture = {
  fixture: {
    id: number;
    date: string;
    status: { short: string; elapsed: number | null };
  };
  league: { id: number; name: string; season: number; round: string };
  teams: {
    home: { id: number; name: string; logo: string };
    away: { id: number; name: string; logo: string };
  };
  goals: { home: number | null; away: number | null };
};

export type ApiFootballEvent = {
  time: { elapsed: number; extra: number | null };
  team: { id: number; name: string; logo: string };
  player: { id: number; name: string };
  assist: { id: number | null; name: string | null };
  type: 'Goal' | 'Card' | 'subst' | 'Var';
  detail: string; // ex: "Normal Goal", "Yellow Card", "Substitution 1"
  comments: string | null;
};

export type ApiFootballLineup = {
  team: { id: number; name: string; logo: string; colors: unknown };
  formation: string; // ex: "4-3-3"
  startXI: Array<{
    player: { id: number; name: string; number: number; pos: string; grid: string };
  }>;
  substitutes: Array<{
    player: { id: number; name: string; number: number; pos: string; grid: string | null };
  }>;
  coach: { id: number; name: string; photo: string };
};

// ────────────────────────────────────────────────────────────
// Fetcher générique
// ────────────────────────────────────────────────────────────

async function fetchFromAPI<T>(endpoint: string): Promise<T> {
  if (!TOKEN) {
    throw new Error('EXPO_PUBLIC_API_FOOTBALL_KEY manquant dans le .env');
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { 'x-apisports-key': TOKEN },
  });

  if (!response.ok) {
    throw new Error(`API-Football error ${response.status} on ${endpoint}`);
  }

  const json = (await response.json()) as ApiFootballResponse<T>;

  // L'API renvoie 200 même en cas d'erreur métier — il faut lire `errors`
  const errs = json.errors;
  const hasErrors = Array.isArray(errs) ? errs.length > 0 : Object.keys(errs).length > 0;
  if (hasErrors) {
    throw new Error(`API-Football error: ${JSON.stringify(errs)}`);
  }

  return json.response;
}

// ────────────────────────────────────────────────────────────
// Endpoints
// ────────────────────────────────────────────────────────────

/** État du compte + quota restant. Utile pour debug. */
export function getStatus(): Promise<ApiFootballStatus> {
  return fetchFromAPI<ApiFootballStatus>('/status');
}

/**
 * Cherche un fixture par couple d'équipes + date.
 * Retourne le 1er match qui matche, ou null.
 * Utilisé pour faire le pont depuis un match Football-Data.
 */
export async function findFixtureByTeamsAndDate(
  apiFootballHomeTeamId: number,
  apiFootballAwayTeamId: number,
  date: string // YYYY-MM-DD
): Promise<ApiFootballFixture | null> {
  const fixtures = await fetchFromAPI<ApiFootballFixture[]>(
    `/fixtures?h2h=${apiFootballHomeTeamId}-${apiFootballAwayTeamId}&date=${date}`
  );
  return fixtures[0] ?? null;
}

/** Events (buts, cartons, subs) d'un fixture. */
export function getFixtureEvents(fixtureId: number): Promise<ApiFootballEvent[]> {
  return fetchFromAPI<ApiFootballEvent[]>(`/fixtures/events?fixture=${fixtureId}`);
}

/** Compositions des 2 équipes d'un fixture. */
export function getFixtureLineups(fixtureId: number): Promise<ApiFootballLineup[]> {
  return fetchFromAPI<ApiFootballLineup[]>(`/fixtures/lineups?fixture=${fixtureId}`);
}

/** Toutes les équipes d'une ligue pour une saison. Utilisé pour générer le mapping IDs. */
export function getTeamsByLeague(
  leagueId: number,
  season: number
): Promise<Array<{ team: { id: number; name: string; code: string | null }; venue: unknown }>> {
  return fetchFromAPI(`/teams?league=${leagueId}&season=${season}`);
}

/**
 * Dump des équipes des 5 grands championnats pour une saison.
 * À appeler UNE FOIS pour générer le mapping IDs.
 * Coût : 5 requêtes.
 */
export async function dumpAllTeams(season: number): Promise<
  Record<keyof typeof API_FOOTBALL_LEAGUES, Array<{ id: number; name: string; code: string | null }>>
> {
  const entries = await Promise.all(
    (Object.entries(API_FOOTBALL_LEAGUES) as Array<[keyof typeof API_FOOTBALL_LEAGUES, number]>).map(
      async ([key, leagueId]) => {
        const teams = await getTeamsByLeague(leagueId, season);
        return [key, teams.map((t) => ({ id: t.team.id, name: t.team.name, code: t.team.code }))] as const;
      }
    )
  );
  return Object.fromEntries(entries) as any;
}
