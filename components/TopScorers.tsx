import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../theme/tokens';
import { topScorers } from '../data/mockData';

export default function TopScorers() {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="trophy" size={13} color={colors.accent} />
          <Text style={styles.headerTitle}>Top buteurs · Ligue 1</Text>
        </View>
        <Text style={styles.arrow}>→</Text>
      </View>

      {topScorers.map((scorer, index) => (
        <View
          key={scorer.rank}
          style={[styles.row, index > 0 && { borderTopWidth: 0.5, borderTopColor: colors.border }]}
        >
          <Text style={[styles.rank, scorer.rank === 1 && { color: colors.accent }]}>
            {scorer.rank}
          </Text>
          <View style={[styles.teamCircle, { backgroundColor: scorer.teamColor }]}>
            <Text style={styles.teamCode}>{scorer.team}</Text>
          </View>
          <Text style={styles.name}>{scorer.name}</Text>
          <Text style={styles.goals}>{scorer.goals}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 18,
    marginBottom: 12,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 14,
    borderWidth: 0.5,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerTitle: {
    fontSize: 11,
    color: colors.text,
    fontWeight: '500',
  },
  arrow: {
    fontSize: 10,
    color: colors.textDim,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 6,
  },
  rank: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: '500',
    width: 14,
  },
  teamCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamCode: {
    fontSize: 9,
    color: 'white',
    fontWeight: '500',
  },
  name: {
    fontSize: 12,
    color: colors.text,
    flex: 1,
    fontWeight: '500',
  },
  goals: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '500',
  },
});