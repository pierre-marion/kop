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
// PAGE ACTU (V3 - formats variés)
// ============================================

export const actuStats = {
  total: 23,
  lastUpdate: 'il y a 4min',
};

export const actuFilters = [
  { id: 'all', label: 'Tout', icon: 'sparkles' },
  { id: 'transferts', label: 'Transferts', icon: 'swap-horizontal' },
  { id: 'entretiens', label: 'Entretiens', icon: 'mic' },
  { id: 'videos', label: 'Vidéos', icon: 'play' },
  { id: 'dossiers', label: 'Dossiers', icon: null },
  { id: 'l1', label: 'Ligue 1', icon: null },
  { id: 'pl', label: 'Premier L.', icon: null },
  { id: 'liga', label: 'Liga', icon: null },
];

// Le hero du jour
export const heroArticle = {
  category: 'MERCATO · OFFICIEL',
  label: "L'ÉVÉNEMENT",
  title: 'Mbappé prolonge au Real Madrid jusqu\'en 2030',
  source: "L'Équipe · Fabrice Hawkins",
  time: 'il y a 2h',
  gradientColors: ['rgba(0,65,112,0.6)', 'rgba(237,28,36,0.4)'] as [string, string],
};

// Feed mélangé de différents formats
export const actuFeed = [
  {
    id: 'f1',
    type: 'transfer-flash',
    time: '11:48',
    playerName: 'Manuel Ugarte',
    amount: '45M€',
    clubFrom: { code: 'MU', name: 'Man United', color: '#DA291C', textColor: '#FBE122' },
    clubTo: { code: 'PSG', name: 'PSG', color: '#004170', textColor: '#FFFFFF' },
    description: 'Le milieu uruguayen rejoint Paris pour 5 saisons',
    accentColor: '#004170',
  },
  {
    id: 'f2',
    type: 'interview',
    playerName: 'L. Hernandez',
    club: 'PSG',
    clubGradient: ['#2a1f3a', '#1a1428'] as [string, string],
    quote: '« On peut tout gagner cette saison »',
    readTime: '8 min',
    source: "L'Équipe",
  },
  {
    id: 'f3',
    type: 'video',
    title: 'Les 3 buts qui ont transformé le match PSG — OM',
    duration: '2:34',
    time: 'il y a 1h',
    source: 'Canal+',
    views: '15k vues',
    thumbnailColors: ['#004170', '#ED1C24', '#003DA5'] as [string, string, string],
  },
  {
    id: 'f4',
    type: 'brief',
    category: 'LIGA',
    categoryColor: '#FEBE10',
    categoryTextColor: '#00529F',
    title: 'Vinicius vers la Premier League ? Le Real fixe son prix à 200M€',
    excerpt: 'Manchester City prêt à passer à l\'offensive pour le Brésilien selon les médias espagnols...',
    time: '11:30',
    source: 'Marca',
  },
  {
    id: 'f5',
    type: 'dossier',
    title: 'Comment Luis Enrique a réinventé le PSG',
    excerpt: "Tactique, leadership, gestion d'effectif : enquête sur la méthode du coach espagnol qui fait du Paris SG une machine de guerre européenne.",
    readTime: '12 min',
    author: 'Théo Martin',
    source: 'RMC Sport',
  },
  {
    id: 'f6',
    type: 'brief',
    category: 'PREMIER L.',
    categoryColor: '#3D195B',
    categoryTextColor: '#FFFFFF',
    title: 'Liverpool — Arsenal : les compos probables du choc',
    excerpt: 'Salah de retour dans le onze, Arteta préserve Saliba blessé au mollet...',
    time: '10:55',
    source: 'BBC',
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

// ============================================
// PAGE COMPÉTITIONS
// ============================================

export const competitions = [
  {
    id: 'l1',
    code: 'L1',
    name: 'Ligue 1',
    country: '🇫🇷 FRANCE',
    matchday: 'J34/38',
    color: '#003DA5',
    logoTextColor: '#FFFFFF',
    leader: { code: 'PSG', name: 'PSG', color: '#004170', points: 79 },
    highlight: { type: 'live', label: 'PSG 2 — 1 OM · 67\'' },
  },
  {
    id: 'pl',
    code: 'PL',
    name: 'Premier League',
    country: '🇬🇧 ANGLETERRE',
    matchday: 'J36/38',
    color: '#3D195B',
    logoTextColor: '#FFFFFF',
    leader: { code: 'LIV', name: 'Liverpool', color: '#C8102E', points: 82 },
    highlight: { type: 'next', label: 'Prochain · LIV — ARS · 21:00' },
  },
  {
    id: 'liga',
    code: 'LA',
    name: 'La Liga',
    country: '🇪🇸 ESPAGNE',
    matchday: 'J35/38',
    color: '#FEBE10',
    logoTextColor: '#00529F',
    leader: { code: 'RM', name: 'Real Madrid', color: '#FEBE10', points: 85 },
    highlight: { type: 'derby', label: 'Clásico ce soir · RM — FCB · 21:00' },
  },
  {
    id: 'sa',
    code: 'SA',
    name: 'Serie A',
    country: '🇮🇹 ITALIE',
    matchday: 'J36/38',
    color: '#008FD7',
    logoTextColor: '#FFFFFF',
    leader: { code: 'INT', name: 'Inter', color: '#010E80', points: 81 },
    highlight: { type: 'derby', label: 'Derby di Milano · INT — MIL · 20:45' },
  },
  {
    id: 'bl',
    code: 'BL',
    name: 'Bundesliga',
    country: '🇩🇪 ALLEMAGNE',
    matchday: 'J33/34',
    color: '#D20515',
    logoTextColor: '#FFFFFF',
    leader: { code: 'BAY', name: 'Bayern', color: '#DC052D', points: 76 },
    highlight: { type: 'derby', label: 'Klassiker · BAY — DOR · 20:30' },
  },
];

// ============================================
// PAGE SEARCH
// ============================================

export const searchFilters = [
  { id: 'all', label: 'Tout' },
  { id: 'teams', label: 'Équipes' },
  { id: 'players', label: 'Joueurs' },
  { id: 'competitions', label: 'Compétitions' },
];

export const searchResults = [
  {
    id: 's1',
    type: 'team',
    name: 'Paris Saint-Germain',
    subtitle: 'Équipe · Ligue 1',
    gradient: ['#004170', '#ED1C24'] as [string, string],
    code: 'PSG',
  },
  {
    id: 's2',
    type: 'player',
    name: 'Ousmane Dembélé',
    subtitle: 'Joueur · PSG · Attaquant',
  },
  {
    id: 's3',
    type: 'player',
    name: 'Luis Enrique',
    subtitle: 'Entraîneur · PSG',
  },
];

export const recentSearches = ['Mbappé', 'Real Madrid', 'Ligue 1'];

export const trendingSearches = [
  { rank: 1, query: 'Mbappé', volume: '24k' },
  { rank: 2, query: 'Clásico', volume: '18k' },
  { rank: 3, query: 'Vinicius', volume: '12k' },
  { rank: 4, query: 'Real Madrid', volume: '9k' },
  { rank: 5, query: 'Liverpool', volume: '7k' },
];

// ============================================
// PAGE PROFIL
// ============================================

export const userProfile = {
  isGuest: true,
  username: 'Invité',
  stats: {
    teamsFollowed: 3,
    articlesRead: 12,
    streak: '7j',
  },
  followedTeams: [
    {
      id: 't1',
      code: 'PSG',
      name: 'Paris SG',
      gradient: ['#004170', '#ED1C24'] as [string, string],
      notifEnabled: true,
    },
    {
      id: 't2',
      code: 'RM',
      name: 'Real Madrid',
      gradient: ['#FEBE10', '#FEBE10'] as [string, string],
      logoTextColor: '#00529F',
      notifEnabled: false,
    },
  ],
};

export const profilePreferences = [
  { id: 'notif', icon: 'notifications-outline', label: 'Notifications', value: 'Activées' },
  { id: 'theme', icon: 'color-palette-outline', label: 'Thème', value: 'Sombre' },
  { id: 'language', icon: 'language-outline', label: 'Langue', value: 'Français' },
];

export const profileAbout = [
  { id: 'about', icon: 'information-circle-outline', label: 'À propos de Kop' },
  { id: 'privacy', icon: 'shield-checkmark-outline', label: 'Confidentialité' },
  { id: 'terms', icon: 'document-text-outline', label: 'Conditions d\'utilisation' },
];


// ============================================
// PAGE NOTIFICATIONS
// ============================================

export const notifFilters = [
  { id: 'all', label: 'Toutes', count: 7 },
  { id: 'matches', label: 'Matchs', count: 3 },
  { id: 'mercato', label: 'Mercato', count: 2 },
  { id: 'actu', label: 'Actu', count: 2 },
];

export const notifications = [
  // AUJOURD'HUI
  {
    id: 'n1',
    section: 'today',
    type: 'goal',
    label: 'BUT — PSG 2-1 OM · 63\'',
    title: 'Dembélé donne l\'avantage au PSG !',
    time: 'il y a 4min',
    isUnread: true,
  },
  {
    id: 'n2',
    section: 'today',
    type: 'mercato',
    label: 'MERCATO · OFFICIEL',
    title: 'Mbappé prolonge au Real Madrid jusqu\'en 2030',
    time: 'il y a 2h',
    isUnread: true,
  },
  {
    id: 'n3',
    section: 'today',
    type: 'hot',
    label: 'ARTICLE CHAUD',
    title: 'Le PSG cible un milieu de la Bundesliga',
    time: 'il y a 4h',
    isUnread: true,
  },
  // HIER
  {
    id: 'n4',
    section: 'yesterday',
    type: 'result',
    label: 'RÉSULTAT',
    title: 'Real Madrid 3 — 1 Atletico (FT)',
    time: 'Hier · 22:48',
    isUnread: false,
  },
  {
    id: 'n5',
    section: 'yesterday',
    type: 'reminder',
    label: 'RAPPEL',
    title: 'PSG — OM commence dans 1h',
    time: 'Hier · 20:00',
    isUnread: false,
  },
];

export const notifStats = {
  newCount: 3,
  totalUnread: 7,
};

// ============================================
// PAGE MATCH DETAIL
// ============================================

export const matchDetail = {
  id: 'm1',
  competition: 'LIGUE 1 · J34 · PARC DES PRINCES',
  competitionCode: 'L1',
  competitionColor: '#003DA5',
  status: 'live',
  minute: "67'",
  homeTeam: {
    code: 'PSG',
    name: 'Paris',
    fullName: 'Paris Saint-Germain',
    score: 2,
    gradient: ['#004170', '#ED1C24'] as [string, string],
    form: ['W', 'W', 'W', 'D', 'W'], // W=win, D=draw, L=loss
  },
  awayTeam: {
    code: 'OM',
    name: 'Marseille',
    fullName: 'Olympique de Marseille',
    score: 1,
    gradient: ['#009DDC', '#FFFFFF'] as [string, string],
    logoTextColor: '#009DDC',
    form: ['W', 'L', 'D', 'W', 'L'],
  },
  events: [
    {
      minute: "63'",
      type: 'goal',
      team: 'home',
      player: 'Dembélé',
      assist: 'Vitinha',
      score: '2-1',
    },
    {
      minute: "52'",
      type: 'yellow-card',
      team: 'away',
      player: 'Aubameyang',
      detail: 'Faute sur Hakimi',
    },
    {
      minute: "38'",
      type: 'goal',
      team: 'away',
      player: 'Aubameyang',
      assist: 'Greenwood',
      score: '1-1',
    },
    {
      minute: "12'",
      type: 'goal',
      team: 'home',
      player: 'Barcola',
      assist: 'Dembélé',
      score: '1-0',
    },
  ],
  stats: [
    { label: 'POSSESSION', home: 62, away: 38, suffix: '%' },
    { label: 'TIRS', home: 14, away: 7 },
    { label: 'TIRS CADRÉS', home: 6, away: 3 },
    { label: 'CORNERS', home: 4, away: 5 },
  ],
  h2h: { homeWins: 3, draws: 1, awayWins: 1 },
};

// ============================================
// PAGE COMPETITION DETAIL
// ============================================

export const competitionDetail = {
  id: 'l1',
  code: 'L1',
  name: 'Ligue 1',
  fullName: 'Ligue 1 Uber Eats',
  country: '🇫🇷 FRANCE',
  season: 'SAISON 2025-26',
  matchday: 'J34/38',
  remainingDays: 4,
  color: '#003DA5',
  logoTextColor: '#FFFFFF',
  standings: [
    {
      rank: 1,
      teamCode: 'PSG',
      teamName: 'Paris SG',
      teamColor: '#004170',
      played: 33,
      diff: '+47',
      form: ['W', 'W', 'W', 'D', 'W'],
      points: 79,
      qualifZone: 'champions',
    },
    {
      rank: 2,
      teamCode: 'MON',
      teamName: 'Monaco',
      teamColor: '#DA001A',
      played: 33,
      diff: '+18',
      form: ['W', 'D', 'W', 'W', 'L'],
      points: 62,
      qualifZone: 'champions',
    },
    {
      rank: 3,
      teamCode: 'OM',
      teamName: 'Marseille',
      teamColor: '#009DDC',
      played: 33,
      diff: '+15',
      form: ['W', 'L', 'D', 'W', 'L'],
      points: 58,
      qualifZone: 'champions',
    },
    {
      rank: 4,
      teamCode: 'LIL',
      teamName: 'Lille',
      teamColor: '#C8102E',
      played: 33,
      diff: '+12',
      form: ['D', 'W', 'W', 'D', 'W'],
      points: 54,
      qualifZone: 'europa',
    },
    {
      rank: 5,
      teamCode: 'LYO',
      teamName: 'Lyon',
      teamColor: '#2E5C9A',
      played: 33,
      diff: '+8',
      form: ['W', 'L', 'W', 'D', 'W'],
      points: 52,
      qualifZone: 'europa',
    },
  ],
  topScorersList: [
    { rank: 1, name: 'Dembélé', team: 'PSG', teamColor: '#004170', goals: 24 },
    { rank: 2, name: 'Aubameyang', team: 'OM', teamColor: '#009DDC', goals: 19 },
    { rank: 3, name: 'Ben Yedder', team: 'MON', teamColor: '#DA001A', goals: 16 },
  ],
};

// ============================================
// PAGE TEAM DETAIL
// ============================================

export const teamDetail = {
  id: 'psg',
  code: 'PSG',
  shortName: 'Paris SG',
  fullName: 'Paris Saint-Germain',
  founded: 1970,
  gradient: ['#004170', '#ED1C24'] as [string, string],
  competition: {
    code: 'L1',
    name: 'Ligue 1',
    color: '#003DA5',
    rank: 1,
    points: 79,
  },
  stats: {
    wins: 25,
    draws: 4,
    losses: 4,
    goalDiff: '+47',
  },
  currentMatch: {
    competition: 'LIGUE 1 · J34',
    minute: "67'",
    homeCode: 'PSG',
    homeColor: '#004170',
    homeScore: 2,
    awayCode: 'OM',
    awayGradient: ['#009DDC', '#FFFFFF'] as [string, string],
    awayLogoTextColor: '#009DDC',
    awayScore: 1,
  },
  upcomingMatches: [
    { date: 'SAM 24/05', opponent: 'Monaco', time: '21:00', competition: 'L1' },
    { date: 'MER 28/05', opponent: 'Real Madrid', time: '21:00', competition: 'UCL' },
    { date: 'SAM 31/05', opponent: 'Lyon', time: '21:00', competition: 'L1' },
  ],
  keyPlayers: [
    { name: 'Dembélé', position: 'Attaquant', isStar: true, stats: [{ label: 'BUTS', value: 24, highlight: true }, { label: 'PASS.', value: 12 }] },
    { name: 'Vitinha', position: 'Milieu', isStar: false, stats: [{ label: 'BUTS', value: 7 }, { label: 'PASS.', value: 14, highlight: true }] },
    { name: 'Donnarumma', position: 'Gardien', isStar: false, stats: [{ label: 'CLEAN S.', value: 14, highlight: true }] },
  ],
  latestNews: {
    category: 'MERCATO',
    title: 'Le PSG cible un milieu de la Bundesliga',
    time: 'il y a 4h',
    source: 'RMC',
  },
};