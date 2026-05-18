import { View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, radius } from '../theme/tokens';
import { useFeaturedMatch } from '../hooks/useFootballData';
import TeamLogo from './TeamLogo';

export default function LiveMatchCard() {
  const router = useRouter();
  const { data: matchToShow, isLoading, error } = useFeaturedMatch();

  // État loading
  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator color={colors.accent} />
        <Text style={styles.loadingText}>Chargement du match...</Text>
      </View>
    );
  }

  // État erreur
  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Ionicons name="warning-outline" size={24} color={colors.textMuted} />
        <Text style={styles.errorText}>
          {error.message || 'Erreur de chargement'}
        </Text>
      </View>
    );
  }

  // État vide
  if (!matchToShow) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Ionicons name="football-outline" size={28} color={colors.textMuted} />
        <Text style={styles.emptyText}>Aucun match prévu cette semaine</Text>
      </View>
    );
  }

  // Vrai match à afficher
  const isLive = matchToShow.status === 'IN_PLAY' || matchToShow.status === 'PAUSED';
  const homeScore = matchToShow.score.fullTime.home ?? 0;
  const awayScore = matchToShow.score.fullTime.away ?? 0;
  const homeWinning = homeScore > awayScore;
  const awayWinning = awayScore > homeScore;
  const isScheduled = matchToShow.status === 'SCHEDULED' || (matchToShow.status as any) === 'TIMED';

  return (
    <Pressable onPress={() => router.push(`/match/${matchToShow.id}`)}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.compRow}>
            <Text style={styles.compName}>
              {matchToShow.competition.name.toUpperCase()} · J{matchToShow.matchday}
            </Text>
          </View>

          {isLive ? (
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>
                LIVE {matchToShow.minute ? `${matchToShow.minute}'` : ''}
              </Text>
            </View>
          ) : matchToShow.status === 'FINISHED' ? (
            <View style={styles.finishedBadge}>
              <Text style={styles.finishedText}>TERMINÉ</Text>
            </View>
          ) : (
            <View style={styles.upcomingBadge}>
              <Ionicons name="time-outline" size={11} color={colors.textMuted} />
              <Text style={styles.upcomingText}>
                {(() => {
                  const matchDate = new Date(matchToShow.utcDate);
                  const today = new Date();
                  const isToday = matchDate.toDateString() === today.toDateString();
                  const isTomorrow =
                    matchDate.toDateString() ===
                    new Date(today.getTime() + 86400000).toDateString();

                  const timeStr = matchDate.toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  if (isToday) return `AUJOURD'HUI · ${timeStr}`;
                  if (isTomorrow) return `DEMAIN · ${timeStr}`;

                  const dateStr = matchDate
                    .toLocaleDateString('fr-FR', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                    })
                    .toUpperCase();
                  return `${dateStr} · ${timeStr}`;
                })()}
              </Text>
            </View>
          )}
        </View>

        {/* Score */}
        <View style={styles.scoreRow}>
          {/* Équipe à domicile */}
          <View style={styles.teamBlock}>
            <TeamLogo
              url={matchToShow.homeTeam.crest}
              tla={matchToShow.homeTeam.tla}
              size={52}
            />
            <Text style={styles.teamName} numberOfLines={1}>
              {matchToShow.homeTeam.shortName}
            </Text>
          </View>

          {/* Score central */}
          <View style={styles.scoreBlock}>
            {isScheduled ? (
              <Text style={styles.vsText}>vs</Text>
            ) : (
              <>
                <Text style={[styles.score, homeWinning && { color: colors.accent }]}>
                  {homeScore}
                </Text>
                <Text style={styles.scoreDash}>—</Text>
                <Text style={[styles.score, awayWinning && { color: colors.accent }]}>
                  {awayScore}
                </Text>
              </>
            )}
          </View>

          {/* Équipe à l'extérieur */}
          <View style={styles.teamBlock}>
            <TeamLogo
              url={matchToShow.awayTeam.crest}
              tla={matchToShow.awayTeam.tla}
              size={52}
            />
            <Text style={styles.teamName} numberOfLines={1}>
              {matchToShow.awayTeam.shortName}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 18,
    marginVertical: 14,
    backgroundColor: colors.surface,
    borderRadius: radius.xl + 2,
    padding: 16,
    borderWidth: 0.5,
    borderColor: colors.border,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 130,
    gap: 8,
  },
  loadingText: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 4,
  },
  errorText: {
    fontSize: 11,
    color: colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 12,
    color: colors.textMuted,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  compRow: { flex: 1 },
  compName: {
    fontSize: 10,
    color: colors.textMuted,
    letterSpacing: 0.5,
    fontWeight: '500',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(204,255,0,0.12)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 20,
  },
  liveDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.accent,
  },
  liveText: {
    fontSize: 10,
    color: colors.accent,
    letterSpacing: 0.5,
    fontWeight: '500',
  },
  finishedBadge: {
    backgroundColor: colors.surfaceAlt,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: colors.border,
  },
  finishedText: {
    fontSize: 10,
    color: colors.textMuted,
    letterSpacing: 0.5,
    fontWeight: '600',
  },
  upcomingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surfaceAlt,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: colors.border,
  },
  upcomingText: {
    fontSize: 10,
    color: colors.textMuted,
    letterSpacing: 0.3,
    fontWeight: '600',
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  teamBlock: {
    alignItems: 'center',
    gap: 8,
    width: 90,
  },
  teamName: {
    fontSize: 11,
    color: colors.text,
    fontWeight: '500',
    textAlign: 'center',
  },
  scoreBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    justifyContent: 'center',
  },
  score: {
    fontSize: 44,
    fontWeight: '500',
    color: colors.text,
    letterSpacing: -2,
    lineHeight: 44,
  },
  scoreDash: {
    fontSize: 28,
    color: colors.textMuted,
    fontWeight: '300',
    marginTop: -4,
  },
  vsText: {
    fontSize: 18,
    color: colors.textMuted,
    fontWeight: '500',
  },
});