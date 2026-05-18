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

// ============================================
// PAGE ACTU
// ============================================

export const actuStats = {
  total: 23,
  lastUpdate: 'il y a 4min',
};

export const actuFilters = [
  { id: 'all', label: 'TOUT', count: 23 },
  { id: 'mercato', label: 'MERCATO', count: 8 },
  { id: 'l1', label: 'LIGUE 1', count: 5 },
  { id: 'pl', label: 'PL', count: 4 },
  { id: 'liga', label: 'LIGA', count: 3 },
  { id: 'sa', label: 'SERIE A', count: 2 },
  { id: 'bl', label: 'BUNDESLIGA', count: 1 },
];

export const actuFeed = [
  {
    id: 'a1',
    isHot: true,
    category: 'CHAUD',
    title: 'Mbappé prolonge au Real Madrid jusqu\'en 2030',
    excerpt: "Selon les informations du quotidien sportif, l'attaquant français aurait paraphé son contrat ce matin pour 4 saisons supplémentaires...",
    time: '12:23',
    source: 'L\'ÉQUIPE',
    views: '24k',
    comments: 312,
  },
  {
    id: 'a2',
    category: 'LIGUE 1',
    categoryColor: '#003DA5',
    categoryTextColor: '#FFFFFF',
    title: 'PSG : Luis Enrique fait tourner avant la finale de C1',
    excerpt: 'Le coach espagnol pourrait laisser Dembélé, Vitinha et Hakimi au repos ce soir face à l\'OM...',
    time: '11:48',
    source: 'RMC',
  },
  {
    id: 'a3',
    category: 'LIGA',
    categoryColor: '#FEBE10',
    categoryTextColor: '#00529F',
    title: 'Vinicius vers la Premier League ? Le Real fixe son prix à 200M€',
    excerpt: 'Manchester City prêt à passer à l\'offensive pour le Brésilien selon les médias espagnols...',
    time: '11:30',
    source: 'MARCA',
  },
  {
    id: 'a4',
    category: 'PREMIER L.',
    categoryColor: '#3D195B',
    categoryTextColor: '#FFFFFF',
    title: 'Liverpool — Arsenal : les compos probables du choc',
    excerpt: 'Salah de retour dans le onze, Arteta préserve Saliba blessé au mollet...',
    time: '10:55',
    source: 'BBC',
  },
  {
    id: 'a5',
    isMercato: true,
    category: 'MERCATO',
    title: 'Le PSG cible un milieu de la Bundesliga, contacts avancés',
    excerpt: 'Le club parisien aurait coché le nom d\'un international allemand pour renforcer son entrejeu...',
    time: '10:12',
    source: 'SKY',
  },
  {
    id: 'a6',
    category: 'SERIE A',
    categoryColor: '#008FD7',
    categoryTextColor: '#FFFFFF',
    title: 'Derby de Milan : l\'Inter à la chasse du titre',
    excerpt: 'Les Nerazzurri peuvent prendre une option décisive ce soir face au rival rossonero...',
    time: '09:48',
    source: 'GAZZETTA',
  },
  {
    id: 'a7',
    category: 'BUNDESLIGA',
    categoryColor: '#D20515',
    categoryTextColor: '#FFFFFF',
    title: 'Klassiker : Bayern et Dortmund pour finir en beauté',
    excerpt: 'Dernière journée explosive avec le titre encore en jeu pour les Bavarois...',
    time: '09:22',
    source: 'KICKER',
  },
];

// ============================================
// PAGE MERCATO
// ============================================

export const mercatoOverview = {
  daysLeft: 12,
  volumeTotal: '2.1',
  volumeUnit: 'Mds€',
  variation: '+18%',
  distribution: [
    { league: 'PL', percent: 35, color: '#3D195B' },
    { league: 'LIGA', percent: 25, color: '#FEBE10' },
    { league: 'SA', percent: 20, color: '#008FD7' },
    { league: 'L1', percent: 12, color: '#003DA5' },
    { league: 'BL', percent: 8, color: '#D20515' },
  ],
};

export const officialDeals = [
  {
    id: 'd1',
    playerName: 'Kylian Mbappé',
    date: 'Aujourd\'hui · 10:34',
    type: 'Prolongation 2030',
    clubFrom: { code: 'RM', name: 'Real Madrid', color: '#FEBE10', textColor: '#00529F' },
    clubTo: null,
    amount: '180M€',
    salary: '50M€',
    duration: '4 ans',
    accentColor: '#FEBE10',
  },
];

export const transferRumors = [
  {
    id: 'r1',
    playerName: 'Vinicius Jr',
    amount: '~200M€',
    clubFrom: { code: 'RM', name: 'Real Madrid', color: '#FEBE10', textColor: '#00529F' },
    clubTo: { code: 'MC', name: 'Man City', color: '#6CABDD', textColor: '#FFFFFF' },
    reliability: 95,
    sources: 12,
    trackedDays: 5,
  },
  {
    id: 'r2',
    playerName: 'Florian Wirtz',
    amount: '~130M€',
    clubFrom: { code: 'B04', name: 'Leverkusen', color: '#E32219', textColor: '#FFFFFF' },
    clubTo: { code: 'BAY', name: 'Bayern', color: '#DC052D', textColor: '#FFFFFF' },
    reliability: 78,
    sources: 8,
    trackedDays: 12,
  },
  {
    id: 'r3',
    playerName: 'Bruno Fernandes',
    amount: '~80M€',
    clubFrom: { code: 'MU', name: 'Man United', color: '#DA291C', textColor: '#FBE122' },
    clubTo: { flag: '🇸🇦', name: 'Arabie Saoudite' },
    reliability: 45,
    sources: 3,
    trackedDays: 2,
  },
];