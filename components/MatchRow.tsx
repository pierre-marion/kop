import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, radius } from '../theme/tokens';
import TeamLogo from './TeamLogo';
import { getTeamColor } from '../theme/teamColors';
import type { Match } from '../services/footballApi';

function formatTime(utcDate: string): string {
  return new Date(utcDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

function formatDayLong(utcDate: string): string {
  const d = new Date(utcDate);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  if (sameDay(d, today)) return "Aujourd'hui";
  if (sameDay(d, yesterday)) return 'Hier';
  if (sameDay(d, tomorrow)) return 'Demain';
  return d.toLocaleDateString('fr-FR', { weekday: 'short', day: '2-digit', month: 'short' });
}

type Props = {
  match: Match;
  isFirst?: boolean;
};

export default function MatchRow({ match, isFirst }: Props) {
  const router = useRouter();
  const isLive = match.status === 'IN_PLAY' || match.status === 'PAUSED';
  const isFinished = match.status === 'FINISHED';
  const homeScore = match.score.fullTime.home ?? 0;
  const awayScore = match.score.fullTime.away ?? 0;

  return (
    <Pressable
      onPress={() => router.push(`/match/${match.id}` as any)}
      style={[styles.row, !isFirst && styles.rowBorder]}
    >
      <View style={styles.left}>
        {isLive ? (
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>{match.minute ? `${match.minute}'` : 'LIVE'}</Text>
          </View>
        ) : (
          <Text style={styles.date}>{formatDayLong(match.utcDate)}</Text>
        )}
        {!isLive && <Text style={styles.time}>{formatTime(match.utcDate)}</Text>}
      </View>

      <View style={styles.teams}>
        <View style={styles.teamRow}>
          <TeamLogo
            url={match.homeTeam.crest}
            tla={match.homeTeam.tla}
            fallbackBg={getTeamColor(match.homeTeam.id)}
            fallbackText="#FFFFFF"
            size={20}
          />
          <Text style={styles.teamName} numberOfLines={1}>
            {match.homeTeam.shortName || match.homeTeam.name}
          </Text>
          {(isLive || isFinished) && (
            <Text style={[styles.score, isLive && { color: colors.accent }]}>{homeScore}</Text>
          )}
        </View>
        <View style={styles.teamRow}>
          <TeamLogo
            url={match.awayTeam.crest}
            tla={match.awayTeam.tla}
            fallbackBg={getTeamColor(match.awayTeam.id)}
            fallbackText="#FFFFFF"
            size={20}
          />
          <Text style={styles.teamName} numberOfLines={1}>
            {match.awayTeam.shortName || match.awayTeam.name}
          </Text>
          {(isLive || isFinished) && (
            <Text style={[styles.score, isLive && { color: colors.accent }]}>{awayScore}</Text>
          )}
        </View>
      </View>

      <Ionicons name="chevron-forward" size={16} color={colors.textDim} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 12,
  },
  rowBorder: {
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
  },
  left: {
    width: 76,
  },
  date: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  time: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '600',
    marginTop: 2,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(204,255,0,0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.sm,
    alignSelf: 'flex-start',
  },
  liveDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.accent,
  },
  liveText: {
    fontSize: 9,
    color: colors.accent,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  teams: {
    flex: 1,
    gap: 6,
  },
  teamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  teamName: {
    flex: 1,
    fontSize: 13,
    color: colors.text,
    fontWeight: '500',
  },
  score: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '700',
    minWidth: 16,
    textAlign: 'right',
  },
});
