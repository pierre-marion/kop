import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../theme/tokens';

type Props = {
  playerName: string;
  club: string;
  clubGradient: [string, string];
  quote: string;
  readTime: string;
  source: string;
};

export default function InterviewCard({
  playerName,
  club,
  clubGradient,
  quote,
  readTime,
  source,
}: Props) {
  return (
    <Pressable style={styles.wrapper}>
      <View style={styles.card}>
        {/* Colonne gauche - portrait du joueur */}
        <LinearGradient
          colors={clubGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.leftColumn}
        >
          <View style={styles.portrait}>
            <Ionicons name="person" size={24} color="rgba(255,255,255,0.6)" />
          </View>
          <Text style={styles.playerName}>{playerName}</Text>
          <Text style={styles.club}>{club}</Text>
        </LinearGradient>

        {/* Colonne droite - citation */}
        <View style={styles.rightColumn}>
          <View style={styles.badge}>
            <Ionicons name="mic" size={11} color={colors.accent} />
            <Text style={styles.badgeText}>ENTRETIEN EXCLUSIF</Text>
          </View>

          <Text style={styles.quote}>{quote}</Text>

          <View style={styles.footer}>
            <Ionicons name="time-outline" size={10} color={colors.textDim} />
            <Text style={styles.footerText}>{readTime} · {source}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 18,
    marginBottom: 10,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 0.5,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  leftColumn: {
    width: 90,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  portrait: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.accent,
  },
  playerName: {
    fontSize: 10,
    color: colors.text,
    fontWeight: '600',
    marginTop: 6,
    textAlign: 'center',
  },
  club: {
    fontSize: 9,
    color: colors.textMuted,
    marginTop: 1,
  },
  rightColumn: {
    flex: 1,
    padding: 14,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 9,
    color: colors.accent,
    letterSpacing: 1,
    fontWeight: '700',
  },
  quote: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 18,
    fontWeight: '500',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  footerText: {
    fontSize: 9,
    color: colors.textMuted,
  },
});