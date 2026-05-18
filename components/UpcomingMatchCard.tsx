import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radius } from '../theme/tokens';
import { router } from 'expo-router/build/exports';

type Props = {
  competition: string;
  time: string;
  homeTeam: { code: string; name: string; color: string; textColor: string };
  awayTeam: { code: string; name: string; color: string; textColor: string };
};

export default function UpcomingMatchCard({ competition, time, homeTeam, awayTeam }: Props) {
  return (

    <Pressable onPress={() => router.push('/match/m1')}>
    <LinearGradient
      colors={[
        `${homeTeam.color}2E`, // hex avec alpha ~18%
        colors.surface,
        `${awayTeam.color}2E`,
      ]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      <View style={styles.header}>
        <Text style={styles.competition}>{competition}</Text>
        <Text style={styles.time}>{time}</Text>
      </View>

      <View style={styles.teams}>
        <View style={[styles.logo, { backgroundColor: homeTeam.color }]}>
          <Text style={[styles.logoText, { color: homeTeam.textColor }]}>{homeTeam.code}</Text>
        </View>
        <Text style={styles.dash}>—</Text>
        <View style={[styles.logo, { backgroundColor: awayTeam.color }]}>
          <Text style={[styles.logoText, { color: awayTeam.textColor }]}>{awayTeam.code}</Text>
        </View>
      </View>

      <View style={styles.names}>
        <Text style={styles.name}>{homeTeam.name}</Text>
        <Text style={styles.name}>{awayTeam.name}</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  competition: {
    fontSize: 9,
    color: colors.text,
    letterSpacing: 1,
    fontWeight: '500',
  },
  time: {
    fontSize: 11,
    color: colors.text,
    fontWeight: '500',
  },
  teams: {
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
    fontSize: 12,
    fontWeight: '500',
  },
  dash: {
    fontSize: 13,
    color: colors.textDim,
  },
  names: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  name: {
    fontSize: 10,
    color: colors.textMuted,
  },
});