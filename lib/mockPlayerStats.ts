/**
 * Génère des stats joueur "plausibles" et déterministes à partir du playerId.
 * Utilisé en attendant une API payante qui fournit les vraies stats de carrière.
 * À retirer/remplacer quand on passera sur API-Football Pro ou équivalent.
 */

import type { Player } from '../services/footballApi';

// LCG simple pour pseudo-aléatoire déterministe
function seededInt(seed: number, range: number): number {
  const x = Math.sin(seed) * 10000;
  return Math.floor((x - Math.floor(x)) * range);
}
function seededFloat(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

type PositionGroup = 'goalkeeper' | 'defender' | 'midfielder' | 'attacker';

function getPositionGroup(position?: string | null): PositionGroup {
  if (!position) return 'midfielder';
  const p = position.toLowerCase();
  if (p.includes('keeper') || p.includes('goal')) return 'goalkeeper';
  if (p.includes('back') || p.includes('defender') || p.includes('defence')) return 'defender';
  if (p.includes('forward') || p.includes('striker') || p.includes('winger') || p.includes('attack') || p.includes('offence')) return 'attacker';
  return 'midfielder';
}

export type MockCareer = {
  apps: number;
  goals: number;
  assists: number;
  trophies: number;
};

export type MockClubEntry = {
  name: string;
  tla: string;
  color: string;
  period: string;
  apps: number;
  goals: number;
};

export type MockPlayerStats = {
  career: MockCareer;
  clubs: MockClubEntry[];
  form: Array<'W' | 'D' | 'L' | 'N'>;
};

// Pool de clubs européens pour générer un historique crédible
const CLUB_POOL: Array<{ name: string; tla: string; color: string }> = [
  { name: 'Manchester United', tla: 'MUN', color: '#DA291C' },
  { name: 'Manchester City', tla: 'MCI', color: '#6CABDD' },
  { name: 'Arsenal', tla: 'ARS', color: '#EF0107' },
  { name: 'Liverpool', tla: 'LIV', color: '#C8102E' },
  { name: 'Chelsea', tla: 'CHE', color: '#034694' },
  { name: 'Tottenham', tla: 'TOT', color: '#132257' },
  { name: 'Real Madrid', tla: 'RMA', color: '#FEBE10' },
  { name: 'Barcelona', tla: 'FCB', color: '#A50044' },
  { name: 'Atlético Madrid', tla: 'ATM', color: '#CB3524' },
  { name: 'Sevilla', tla: 'SEV', color: '#F43333' },
  { name: 'Bayern Munich', tla: 'BAY', color: '#DC052D' },
  { name: 'Borussia Dortmund', tla: 'BVB', color: '#FDE100' },
  { name: 'RB Leipzig', tla: 'RBL', color: '#DD0741' },
  { name: 'Juventus', tla: 'JUV', color: '#000000' },
  { name: 'AC Milan', tla: 'MIL', color: '#FB090B' },
  { name: 'Inter Milan', tla: 'INT', color: '#0066B3' },
  { name: 'Napoli', tla: 'NAP', color: '#12A0D7' },
  { name: 'PSG', tla: 'PSG', color: '#004170' },
  { name: 'Olympique de Marseille', tla: 'OM', color: '#009DDC' },
  { name: 'Olympique Lyonnais', tla: 'OL', color: '#2E5C9A' },
  { name: 'Monaco', tla: 'ASM', color: '#DA001A' },
  { name: 'Ajax', tla: 'AJA', color: '#D2122E' },
  { name: 'PSV', tla: 'PSV', color: '#ED1C24' },
  { name: 'Porto', tla: 'POR', color: '#003F87' },
  { name: 'Benfica', tla: 'SLB', color: '#E60022' },
];

export function generateMockStats(player: Player, age: number | null): MockPlayerStats {
  const seed = player.id;
  const group = getPositionGroup(player.position);
  const yearsPro = Math.max(2, (age ?? 24) - 18);

  // Apparitions totales : ~30 par an de carrière
  const apps = 60 + yearsPro * 18 + seededInt(seed, 120);

  // Buts selon position
  const goalsBase = {
    goalkeeper: seededInt(seed + 1, 4),
    defender: 6 + seededInt(seed + 1, 22),
    midfielder: 18 + seededInt(seed + 1, 55),
    attacker: 45 + seededInt(seed + 1, 130),
  }[group];
  const goals = Math.round(goalsBase * (yearsPro / 6));

  // Passes décisives
  const assistsBase = {
    goalkeeper: seededInt(seed + 2, 2),
    defender: 5 + seededInt(seed + 2, 18),
    midfielder: 25 + seededInt(seed + 2, 60),
    attacker: 20 + seededInt(seed + 2, 50),
  }[group];
  const assists = Math.round(assistsBase * (yearsPro / 6));

  // Trophées : 0 à 8 selon carrière
  const trophies = seededInt(seed + 3, Math.min(9, Math.floor(yearsPro / 1.5) + 1));

  // Historique : 1 à 3 clubs précédents (donc 2 à 4 entrées avec le club actuel)
  const numPrevious = 1 + seededInt(seed + 4, 3);
  const clubs: MockClubEntry[] = [];
  const usedIndices = new Set<number>();
  const currentYear = new Date().getFullYear();
  let endYear = currentYear - yearsPro;
  for (let i = 0; i < numPrevious; i++) {
    let idx = seededInt(seed + 10 + i * 7, CLUB_POOL.length);
    let tries = 0;
    while (usedIndices.has(idx) && tries < 10) {
      idx = (idx + 1) % CLUB_POOL.length;
      tries++;
    }
    usedIndices.add(idx);
    const club = CLUB_POOL[idx];
    const duration = 1 + seededInt(seed + 20 + i, Math.min(yearsPro, 5));
    const startYear = endYear;
    endYear = startYear + duration;
    const clubApps = 15 + seededInt(seed + 30 + i, 90);
    const clubGoals = Math.round((goals / yearsPro) * duration * (0.7 + seededFloat(seed + 40 + i) * 0.6));
    clubs.push({
      ...club,
      period: `${startYear}–${endYear}`,
      apps: clubApps,
      goals: clubGoals,
    });
  }

  // Club actuel à la fin
  if (player.currentTeam) {
    const currentDuration = Math.max(1, currentYear - endYear);
    const currentApps = 12 + seededInt(seed + 50, 65);
    const currentGoals = Math.round((goals / yearsPro) * currentDuration * (0.8 + seededFloat(seed + 60) * 0.4));
    clubs.push({
      name: player.currentTeam.shortName || player.currentTeam.name,
      tla: player.currentTeam.tla || '',
      color: '#666666',
      period: `${endYear}–Auj.`,
      apps: currentApps,
      goals: Math.max(currentGoals, 0),
    });
  }

  // Forme : 5 derniers (W, D, L, N=non jouée)
  const formOptions: Array<'W' | 'D' | 'L' | 'N'> = ['W', 'W', 'D', 'L', 'W'];
  const form: Array<'W' | 'D' | 'L' | 'N'> = [];
  for (let i = 0; i < 5; i++) {
    const pick = seededInt(seed + 70 + i, 10);
    if (pick < 6) form.push('W');
    else if (pick < 8) form.push('D');
    else if (pick < 9) form.push('L');
    else form.push('N');
  }

  return {
    career: { apps, goals, assists, trophies },
    clubs,
    form,
  };
}
