import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../theme/tokens';
import { liveMatch } from '../data/mockData';

export default function LiveMatchCard() {
  return (
    <View style={styles.container}>
      {/* Header de la card */}
      <View style={styles.header}>
        <View style={styles.compRow}>
          <View style={[styles.compBadge, { backgroundColor: liveMatch.competitionColor }]}>
            <Text style={styles.compBadgeText}>{liveMatch.competitionCode}</Text>
          </View>
          <Text style={styles.compName}>{liveMatch.competition}</Text>
        </View>
        <View style={styles.liveBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE {liveMatch.minute}</Text>
        </View>
      </View>

      {/* Score */}
      <View style={styles.scoreRow}>
        {/* Équipe domicile */}
        <View style={styles.teamBlock}>
          <LinearGradient
            colors={[liveMatch.homeTeam.color1, liveMatch.homeTeam.color2]}
            style={styles.teamLogo}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.teamLogoText}>{liveMatch.homeTeam.code}</Text>
          </LinearGradient>
          <Text style={styles.teamName}>{liveMatch.homeTeam.name}</Text>
        </View>

        {/* Score */}
        <View style={styles.scoreBlock}>
          <Text style={[styles.score, { color: colors.accent }]}>{liveMatch.homeTeam.score}</Text>
          <Text style={styles.scoreDash}>—</Text>
          <Text style={styles.score}>{liveMatch.awayTeam.score}</Text>
        </View>

        {/* Équipe extérieur */}
        <View style={styles.teamBlock}>
          <LinearGradient
            colors={[liveMatch.awayTeam.color1, liveMatch.awayTeam.color2]}
            style={styles.teamLogo}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={[styles.teamLogoText, { color: liveMatch.awayTeam.color1 }]}>
              {liveMatch.awayTeam.code}
            </Text>
          </LinearGradient>
          <Text style={styles.teamName}>{liveMatch.awayTeam.name}</Text>
        </View>
      </View>

      {/* Dernier événement */}
      <View style={styles.eventRow}>
        <Ionicons name="football" size={13} color={colors.accent} />
        <Text style={styles.eventText}>
          <Text style={{ color: colors.accent, fontWeight: '500' }}>{liveMatch.lastEvent.minute} </Text>
          {liveMatch.lastEvent.text}
        </Text>
        <Ionicons name="chevron-forward" size={14} color={colors.textDim} />
      </View>
    </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  compRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  compBadge: {
    width: 18,
    height: 18,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compBadgeText: {
    fontSize: 9,
    color: 'white',
    fontWeight: '500',
  },
  compName: {
    fontSize: 10,
    color: colors.textMuted,
    letterSpacing: 0.5,
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
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  teamBlock: {
    alignItems: 'center',
    gap: 8,
    width: 65,   //80
  },
  teamLogo: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  teamLogoText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
    letterSpacing: -0.5,
  },
  teamName: {
    fontSize: 11,
    color: colors.text,
    fontWeight: '500',
  },
  scoreBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  score: {
    fontSize: 44,
    fontWeight: '500',
    color: colors.text,
    letterSpacing: -2,
    lineHeight: 44,
  },
  scoreDash: {
    fontSize: 16,
    color: colors.textDim,
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
    marginTop: 14,
    paddingTop: 10,
  },
  eventText: {
    fontSize: 11,
    color: colors.text,
    flex: 1,
  },
});