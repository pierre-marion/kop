import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../theme/tokens';

type Props = {
  playerName: string;
  date: string;
  type: string;
  clubFrom: { code: string; name: string; color: string; textColor: string };
  clubTo: { code: string; name: string; color: string; textColor: string } | null;
  amount: string;
  salary: string;
  duration: string;
  accentColor: string;
};

export default function OfficialDealCard({
  playerName,
  date,
  type,
  clubFrom,
  clubTo,
  amount,
  salary,
  duration,
  accentColor,
}: Props) {
  return (
    <LinearGradient
      colors={[`${accentColor}1F`, colors.surface]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      <View style={styles.header}>
        <View style={styles.officialBadge}>
          <Text style={styles.officialText}>OFFICIEL</Text>
        </View>
        <Text style={styles.date}>{date}</Text>
      </View>

      <Text style={styles.playerName}>{playerName}</Text>

      <View style={styles.clubsRow}>
        <View style={[styles.clubCircle, { backgroundColor: clubFrom.color }]}>
          <Text style={[styles.clubCode, { color: clubFrom.textColor }]}>{clubFrom.code}</Text>
        </View>
        <Text style={styles.clubName}>{clubFrom.name}</Text>
        <Ionicons name="arrow-forward" size={14} color={colors.accent} style={{ marginHorizontal: 6 }} />
        {clubTo ? (
          <>
            <View style={[styles.clubCircle, { backgroundColor: clubTo.color }]}>
              <Text style={[styles.clubCode, { color: clubTo.textColor }]}>{clubTo.code}</Text>
            </View>
            <Text style={styles.clubName}>{clubTo.name}</Text>
          </>
        ) : (
          <Text style={styles.clubName}>{type}</Text>
        )}
      </View>

      <View style={styles.stats}>
        <View style={styles.statBlock}>
          <Text style={styles.statLabel}>MONTANT</Text>
          <Text style={styles.statValue}>{amount}</Text>
        </View>
        <View style={styles.statBlock}>
          <Text style={styles.statLabel}>SALAIRE/AN</Text>
          <Text style={styles.statValue}>{salary}</Text>
        </View>
        <View style={styles.statBlock}>
          <Text style={styles.statLabel}>DURÉE</Text>
          <Text style={styles.statValue}>{duration}</Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 18,
    marginBottom: 8,
    borderRadius: radius.xl,
    padding: 14,
    borderWidth: 0.5,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  officialBadge: {
    backgroundColor: colors.accent,
    paddingVertical: 2,
    paddingHorizontal: 7,
    borderRadius: 3,
  },
  officialText: {
    fontSize: 9,
    color: colors.accentText,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  date: {
    fontSize: 9,
    color: colors.textDim,
  },
  playerName: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
    marginBottom: 12,
  },
  clubsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  clubCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clubCode: {
    fontSize: 9,
    fontWeight: '700',
  },
  clubName: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '500',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
  },
  statBlock: {
    flex: 1,
  },
  statLabel: {
    fontSize: 9,
    color: colors.textDim,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '600',
  },
});