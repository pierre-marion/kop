import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../theme/tokens';

type Props = {
  isBreaking?: boolean;
  category: string;
  title: string;
  time: string;
  source: string;
  imageColors?: [string, string];
};

export default function NewsCard({ isBreaking, category, title, time, source, imageColors }: Props) {
  // Variante "breaking news" en fond lime
  if (isBreaking) {
    return (
      <View style={[styles.card, { backgroundColor: colors.accent }]}>
        <View style={styles.breakingHeader}>
          <Ionicons name="flame" size={12} color={colors.accentText} />
          <Text style={[styles.breakingCategory]}>{category}</Text>
        </View>
        <Text style={styles.breakingTitle}>{title}</Text>
        <Text style={styles.breakingTime}>{time} · {source}</Text>
      </View>
    );
  }

  // Variante classique avec image
  return (
    <View style={styles.card}>
      <LinearGradient
        colors={imageColors || [colors.surface, colors.surface]}
        style={styles.image}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Ionicons name="image-outline" size={20} color="rgba(255,255,255,0.4)" />
      </LinearGradient>

      <View style={styles.content}>
        <View>
          <Text style={styles.category}>{category}</Text>
          <Text style={styles.title}>{title}</Text>
        </View>
        <Text style={styles.time}>{time} · {source}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 12,
    marginBottom: 8,
    borderWidth: 0.5,
    borderColor: colors.border,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  category: {
    fontSize: 9,
    color: colors.accent,
    letterSpacing: 0.5,
    fontWeight: '500',
    marginBottom: 3,
  },
  title: {
    fontSize: 12,
    color: colors.text,
    lineHeight: 16,
    fontWeight: '500',
  },
  time: {
    fontSize: 9,
    color: colors.textDim,
  },
  breakingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  breakingCategory: {
    fontSize: 9,
    color: colors.accentText,
    letterSpacing: 1,
    fontWeight: '500',
  },
  breakingTitle: {
    fontSize: 14,
    color: colors.accentText,
    lineHeight: 18,
    fontWeight: '500',
    marginBottom: 6,
  },
  breakingTime: {
    fontSize: 10,
    color: colors.accentText,
    opacity: 0.6,
  },
});