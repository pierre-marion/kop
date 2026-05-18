export const liveMatch = {
  competition: 'LIGUE 1 · J34',
  competitionCode: 'L1',
  competitionColor: '#003DA5',
  minute: "67'",
  homeTeam: { code: 'PSG', name: 'Paris', score: 2, color1: '#004170', color2: '#ED1C24' },
  awayTeam: { code: 'OM', name: 'Marseille', score: 1, color1: '#009DDC', color2: '#FFFFFF' },
  lastEvent: { minute: "63'", text: 'But de Dembélé' },
};

export const upcomingMatches = [
  {
    id: '1',
    competition: 'LA LIGA',
    time: '21:00',
    homeTeam: { code: 'RM', name: 'Real', color: '#FEBE10', textColor: '#00529F' },
    awayTeam: { code: 'FCB', name: 'Barça', color: '#A50044', textColor: '#FFED02' },
  },
  {
    id: '2',
    competition: 'PREMIER L.',
    time: '21:00',
    homeTeam: { code: 'LIV', name: 'Liverpool', color: '#C8102E', textColor: '#FFFFFF' },
    awayTeam: { code: 'ARS', name: 'Arsenal', color: '#EF0107', textColor: '#FFFFFF' },
  },
  {
    id: '3',
    competition: 'SERIE A',
    time: '20:45',
    homeTeam: { code: 'INT', name: 'Inter', color: '#010E80', textColor: '#FFFFFF' },
    awayTeam: { code: 'MIL', name: 'Milan', color: '#FB090B', textColor: '#FFFFFF' },
  },
  {
    id: '4',
    competition: 'BUNDESLIGA',
    time: '20:30',
    homeTeam: { code: 'BAY', name: 'Bayern', color: '#DC052D', textColor: '#FFFFFF' },
    awayTeam: { code: 'DOR', name: 'Dortmund', color: '#FDE100', textColor: '#000000' },
  },
];

export const news = [
  {
    id: '1',
    isBreaking: true,
    category: 'DERNIÈRE MINUTE',
    title: 'Mbappé prolonge au Real jusqu\'en 2030',
    time: 'il y a 2h',
    source: 'L\'Équipe',
  },
  {
    id: '2',
    category: 'MERCATO',
    title: 'Le PSG cible un milieu de la Bundesliga',
    time: 'il y a 4h',
    source: 'RMC',
    imageColors: ['#004170', '#ED1C24'] as [string, string],
  },
  {
    id: '3',
    category: 'LIGA',
    title: 'Vinicius vers la Premier League ? Le Real fixe son prix',
    time: 'il y a 6h',
    source: 'Marca',
    imageColors: ['#00529F', '#FEBE10'] as [string, string],
  },
];

export const topScorers = [
  { rank: 1, name: 'Dembélé', team: 'PSG', teamColor: '#004170', goals: 24 },
  { rank: 2, name: 'Aubameyang', team: 'OM', teamColor: '#009DDC', goals: 19 },
  { rank: 3, name: 'Ben Yedder', team: 'MON', teamColor: '#DA001A', goals: 16 },
];