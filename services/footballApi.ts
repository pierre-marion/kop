/**
 * Client API pour Football-Data.org
 * Doc : https://www.football-data.org/documentation/api
 * Plan gratuit : 10 requêtes/minute, top 5 championnats européens
 */

const BASE_URL = 'https://api.football-data.org/v4';
const TOKEN = process.env.EXPO_PUBLIC_FOOTBALL_DATA_TOKEN;

// Codes des compétitions sur Football-Data
export const COMPETITIONS = {
  L1: 'FL1',   // Ligue 1
  PL: 'PL',    // Premier League
  LIGA: 'PD',  // La Liga (Primera División)
  SA: 'SA',    // Serie A
  BL: 'BL1',   // Bundesliga
} as const;

// ────────────────────────────────────────────────────────────
// Rate limiter — Football-Data plan gratuit = 10 req/min
// File d'attente avec délai minimum entre 2 requêtes.
// ────────────────────────────────────────────────────────────
const MIN_DELAY_MS = 6500; // 6.5s entre 2 req → max ~9 req/min (marge sécu)
let lastRequestAt = 0;
let queueTail: Promise<unknown> = Promise.resolve();

function throttle<T>(task: () => Promise<T>): Promise<T> {
  const run = async (): Promise<T> => {
    const wait = MIN_DELAY_MS - (Date.now() - lastRequestAt);
    if (wait > 0) await new Promise((r) => setTimeout(r, wait));
    lastRequestAt = Date.now();
    return task();
  };
  const next = queueTail.then(run, run);
  queueTail = next.catch(() => undefined);
  return next;
}

// Fetcher générique (passe systématiquement par le rate limiter)
function fetchFromAPI<T>(endpoint: string): Promise<T> {
  if (!TOKEN) {
    throw new Error('EXPO_PUBLIC_FOOTBALL_DATA_TOKEN manquant dans le .env');
  }

  return throttle(async () => {
    const url = `${BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: { 'X-Auth-Token': TOKEN },
    });

    if (!response.ok) {
      // Lit le corps de la réponse pour diagnostic (Football-Data renvoie souvent un JSON avec `message`)
      let body = '';
      try { body = await response.text(); } catch {}
      // eslint-disable-next-line no-console
      console.warn(`[Football-Data] ${response.status} on ${endpoint} →`, body);

      if (response.status === 429) {
        throw new Error('Limite de 10 requêtes/min atteinte, réessaye dans 1 minute');
      }
      if (response.status === 403) {
        throw new Error('Accès refusé : cette compétition est peut-être en plan payant');
      }
      if (response.status === 400) {
        throw new Error(`Requête invalide : ${body.slice(0, 200)}`);
      }
      throw new Error(`Erreur API (${response.status}) : ${body.slice(0, 200)}`);
    }

    return response.json() as Promise<T>;
  });
}

// ============================================
// MATCHS
// ============================================

export type Match = {
  id: number;
  utcDate: string;
  status: 'SCHEDULED' | 'LIVE' | 'IN_PLAY' | 'PAUSED' | 'FINISHED' | 'POSTPONED';
  minute?: number;
  matchday: number;
  competition: {
    id: number;
    name: string;
    code: string;
    emblem: string;
  };
  homeTeam: {
    id: number;
    name: string;
    shortName: string;
    tla: string; // 3-letter abbreviation
    crest: string; // URL du logo
  };
  awayTeam: {
    id: number;
    name: string;
    shortName: string;
    tla: string;
    crest: string;
  };
  score: {
    fullTime: { home: number | null; away: number | null };
    halfTime: { home: number | null; away: number | null };
  };
};

/**
 * Récupère tous les matchs du jour pour les 5 grands championnats
 * 1 seule requête (au lieu de 5)
 */
export async function getTodayMatches(): Promise<Match[]> {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const codes = Object.values(COMPETITIONS).join(',');
  
  const data = await fetchFromAPI<{ matches: Match[] }>(
    `/matches?competitions=${codes}&dateFrom=${today}&dateTo=${today}`
  );
  return data.matches;
}

/**
 * Récupère les matchs sur une période (par défaut : aujourd'hui + 7 jours)
 */
export async function getUpcomingMatches(daysAhead: number = 7): Promise<Match[]> {
  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(today.getDate() + daysAhead);
  
  const dateFrom = today.toISOString().split('T')[0];
  const dateTo = futureDate.toISOString().split('T')[0];
  const codes = Object.values(COMPETITIONS).join(',');
  
  const data = await fetchFromAPI<{ matches: Match[] }>(
    `/matches?competitions=${codes}&dateFrom=${dateFrom}&dateTo=${dateTo}`
  );
  return data.matches;
}

/**
 * Détail d'un match spécifique
 */
export async function getMatchById(matchId: number): Promise<Match> {
  const data = await fetchFromAPI<{ match: Match }>(`/matches/${matchId}`);
  return data.match;
}

// ============================================
// CLASSEMENTS
// ============================================

export type StandingEntry = {
  position: number;
  team: {
    id: number;
    name: string;
    shortName: string;
    tla: string;
    crest: string;
  };
  playedGames: number;
  won: number;
  draw: number;
  lost: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  form?: string; // "W,D,L,W,W"
};

export type CompetitionStandings = {
  competition: {
    id: number;
    name: string;
    code: string;
    emblem: string;
  };
  season: {
    currentMatchday: number;
  };
  standings: Array<{
    type: 'TOTAL' | 'HOME' | 'AWAY';
    table: StandingEntry[];
  }>;
};

/**
 * Récupère le classement complet d'une compétition
 */
export async function getStandings(competitionCode: string): Promise<CompetitionStandings> {
  return fetchFromAPI<CompetitionStandings>(
    `/competitions/${competitionCode}/standings`
  );
}

// ============================================
// TOP BUTEURS
// ============================================

export type TopScorer = {
  player: {
    id: number;
    name: string;
    position: string;
  };
  team: {
    id: number;
    name: string;
    shortName: string;
    tla: string;
    crest: string;
  };
  goals: number;
  assists: number;
};

export async function getTopScorers(competitionCode: string, limit: number = 10) {
  return fetchFromAPI<{ scorers: TopScorer[] }>(
    `/competitions/${competitionCode}/scorers?limit=${limit}`
  );
}

// ============================================
// JOUEURS
// ============================================

export type Player = {
  id: number;
  name: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  nationality?: string;
  section?: string;
  position?: string;
  shirtNumber?: number;
  currentTeam?: {
    id: number;
    name: string;
    shortName?: string;
    tla?: string;
    crest?: string;
    contract?: { start?: string; until?: string };
  };
};

export async function getPlayerById(playerId: number): Promise<Player> {
  return fetchFromAPI<Player>(`/persons/${playerId}`);
}

// ============================================
// ÉQUIPES
// ============================================

export type Team = {
  id: number;
  name: string;
  shortName: string;
  tla: string;
  crest: string;
  founded: number;
  venue: string;
  squad: Array<{
    id: number;
    name: string;
    position: string;
    dateOfBirth: string;
    nationality: string;
  }>;
};


/**
 * Récupère un match "à mettre en avant" sur l'accueil
 * Cherche dans cet ordre :
 * 1. Match LIVE en cours
 * 2. Prochain match à venir (dans les 7 jours)
 * 3. Dernier match terminé (dans les 3 derniers jours)
 * 
 * Utilise une seule requête pour minimiser les calls API
 *//**
 * Récupère TOUS les matchs des 10 jours autour d'aujourd'hui
 * pour les 5 grands championnats.
 * Sert à la fois pour :
 * - Le match featured (live / prochain / dernier)
 * - La liste "À venir" sur l'accueil
 * 
 * 1 seule requête API pour les 2 usages = optimisation +++
 */
export async function getMatchesAroundToday(): Promise<Match[]> {
  const today = new Date();
  const past = new Date();
  past.setDate(today.getDate() - 3);
  const future = new Date();
  future.setDate(today.getDate() + 7);

  const dateFrom = past.toISOString().split('T')[0];
  const dateTo = future.toISOString().split('T')[0];
  const codes = Object.values(COMPETITIONS).join(',');

  const data = await fetchFromAPI<{ matches: Match[] }>(
    `/matches?competitions=${codes}&dateFrom=${dateFrom}&dateTo=${dateTo}`
  );

  return data.matches || [];
}

/**
 * Sélectionne le match à mettre en avant à partir d'une liste de matchs.
 * Priorité : LIVE > prochain à venir > dernier terminé
 */
export function pickFeaturedMatch(matches: Match[]): Match | null {
  if (!matches || matches.length === 0) return null;

  // 1) Match LIVE
  const liveMatch = matches.find(
    (m) => m.status === 'IN_PLAY' || m.status === 'PAUSED'
  );
  if (liveMatch) return liveMatch;

  // 2) Prochain match à venir
  const now = new Date();
  const upcomingMatches = matches
    .filter((m) => {
      const matchDate = new Date(m.utcDate);
      return matchDate >= now && (m.status === 'SCHEDULED' || (m.status as any) === 'TIMED');
    })
    .sort((a, b) => new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime());

  if (upcomingMatches.length > 0) return upcomingMatches[0];

  // 3) Dernier match terminé
  const finishedMatches = matches
    .filter((m) => m.status === 'FINISHED')
    .sort((a, b) => new Date(b.utcDate).getTime() - new Date(a.utcDate).getTime());

  if (finishedMatches.length > 0) return finishedMatches[0];

  return null;
}

/**
 * Récupère les prochains matchs à venir (les 6 plus proches)
 */
export function pickUpcomingMatches(matches: Match[], limit: number = 6): Match[] {
  const now = new Date();
  return matches
    .filter((m) => {
      const matchDate = new Date(m.utcDate);
      return matchDate >= now && (m.status === 'SCHEDULED' || (m.status as any) === 'TIMED');
    })
    .sort((a, b) => new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime())
    .slice(0, limit);
}
export async function getTeamById(teamId: number): Promise<Team> {
  return fetchFromAPI<Team>(`/teams/${teamId}`);
}

/**
 * Prochains matchs d'une équipe (SCHEDULED + TIMED)
 */
export async function getTeamUpcomingMatches(teamId: number, limit: number = 5): Promise<Match[]> {
  const data = await fetchFromAPI<{ matches: Match[] }>(
    `/teams/${teamId}/matches?status=SCHEDULED,TIMED&limit=${limit}`
  );
  return data.matches || [];
}