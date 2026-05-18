import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { colors, radius } from '../theme/tokens';
import type { Match } from '../services/footballApi';
import TeamLogo from './TeamLogo';
type Props = {
  match: Match;
};

// Couleurs officielles par TLA (les vrais clubs qu'on a)
// Pour les autres on génère une couleur stable à partir du TLA
const TEAM_COLORS: Record<string, { bg: string; text: string }> = {
  // Ligue 1
  PSG: { bg: '#004170', text: '#FFFFFF' },
  OM: { bg: '#009DDC', text: '#FFFFFF' },
  OL: { bg: '#2E5C9A', text: '#FFFFFF' },
  ASM: { bg: '#DA001A', text: '#FFFFFF' },
  LOSC: { bg: '#C8102E', text: '#FFFFFF' },
  // Premier League
  LIV: { bg: '#C8102E', text: '#FFFFFF' },
  ARS: { bg: '#EF0107', text: '#FFFFFF' },
  MCI: { bg: '#6CABDD', text: '#FFFFFF' },
  MUN: { bg: '#DA291C', text: '#FBE122' },
  CHE: { bg: '#034694', text: '#FFFFFF' },
  TOT: { bg: '#132257', text: '#FFFFFF' },
  // La Liga
  RMA: { bg: '#FEBE10', text: '#00529F' },
  FCB: { bg: '#A50044', text: '#FFED02' },
  ATM: { bg: '#CB3524', text: '#FFFFFF' },
  // Serie A
  JUV: { bg: '#000000', text: '#FFFFFF' },
  INT: { bg: '#010E80', text: '#FFFFFF' },
  ACM: { bg: '#FB090B', text: '#FFFFFF' },
  // Bundesliga
  FCB_DE: { bg: '#DC052D', text: '#FFFFFF' },
  BVB: { bg: '#FDE100', text: '#000000' },
  RBL: { bg: '#DD0741', text: '#FFFFFF' },
};

// Fallback : génère une couleur stable basée sur le TLA
function getTeamColor(tla: string): { bg: string; text: string } {
  if (TEAM_COLORS[tla]) return TEAM_COLORS[tla];
  
  // Hash → hue stable par équipe
  let hash = 0;
  for (let i = 0; i < tla.length; i++) {
    hash = tla.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return { bg: `hsl(${hue}, 55%, 35%)`, text: '#FFFFFF' };
}

// Convertit couleur (hex ou hsl) en rgba avec alpha
function colorToRgba(color: string, alpha: number): string {
  if (color.startsWith('#')) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  if (color.startsWith('hsl')) {
    // hsl(120, 55%, 35%) → hsla(120, 55%, 35%, alpha)
    return color.replace('hsl(', 'hsla(').replace(')', `, ${alpha})`);
  }
  return color;
}

// Nom court de la compétition affichable
function getCompetitionShortName(code: string, name: string): string {
  const map: Record<string, string> = {
    FL1: 'LIGUE 1',
    PL: 'PREMIER L.',
    PD: 'LA LIGA',
    SA: 'SERIE A',
    BL1: 'BUNDESLIGA',
  };
  return map[code] || name.toUpperCase();
}

export default function UpcomingMatchCardAPI({ match }: Props) {
  const router = useRouter();
  const homeColor = getTeamColor(match.homeTeam.tla);
  const awayColor = getTeamColor(match.awayTeam.tla);
  const competitionName = getCompetitionShortName(
    match.competition.code,
    match.competition.name
  );

  const matchDate = new Date(match.utcDate);
  const time = matchDate.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Pressable onPress={() => router.push(`/match/${match.id}`)}>
      <LinearGradient
        colors={[
          colorToRgba(homeColor.bg, 0.18),
          colors.surface,
          colorToRgba(awayColor.bg, 0.18),
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        {/* Halos : haut-gauche (home) et bas-droite (away) */}
        <View
          style={[
            styles.haloHome,
            { backgroundColor: colorToRgba(homeColor.bg, 0.3) },
          ]}
        />
        <View
          style={[
            styles.haloAway,
            { backgroundColor: colorToRgba(awayColor.bg, 0.3) },
          ]}
        />

        <View style={styles.content}>
          {/* Header : compétition + heure */}
          <View style={styles.header}>
            <Text style={styles.competition} numberOfLines={1}>
              {competitionName}
            </Text>
            <Text style={styles.time}>{time}</Text>
          </View>

          {/* Logos clubs */}
        {/* Logos clubs */}
          <View style={styles.teamsRow}>
            <TeamLogo
              url={match.homeTeam.crest}
              tla={match.homeTeam.tla}
              fallbackBg={homeColor.bg}
              fallbackText={homeColor.text}
              size={44}
            />
            <Text style={styles.dash}>—</Text>
            <TeamLogo
              url={match.awayTeam.crest}
              tla={match.awayTeam.tla}
              fallbackBg={awayColor.bg}
              fallbackText={awayColor.text}
              size={44}
            />
          </View>

          {/* Noms des équipes en bas */}
          <View style={styles.namesRow}>
            <Text style={styles.name} numberOfLines={1}>
              {match.homeTeam.shortName}
            </Text>
            <Text style={styles.name} numberOfLines={1}>
              {match.awayTeam.shortName}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 170,
    padding: 14,
    borderRadius: radius.xl,
    borderWidth: 0.5,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  haloHome: {
    position: 'absolute',
    top: -20,
    left: -20,
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  haloAway: {
    position: 'absolute',
    bottom: -20,
    right: -20,
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  content: {
    position: 'relative',
    zIndex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    gap: 6,
  },
  competition: {
    fontSize: 9,
    color: colors.text,
    letterSpacing: 1,
    fontWeight: '500',
    flex: 1,
  },
  time: {
    fontSize: 11,
    color: colors.text,
    fontWeight: '500',
    fontVariant: ['tabular-nums'],
  },
  teamsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 11,
    fontWeight: '700',
  },
  dash: {
    fontSize: 13,
    color: colors.textDim,
    fontWeight: '400',
  },
  namesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    gap: 8,
  },
  name: {
    fontSize: 10,
    color: colors.textMuted,
    maxWidth: 65,
  },
});