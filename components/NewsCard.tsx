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
      <View style={styles.breakingCard}>
        <View style={styles.breakingHeader}>
          <Ionicons name="flame" size={13} color={colors.accentText} />
          <Text style={styles.breakingCategory}>{category}</Text>
        </View>
        <Text style={styles.breakingTitle}>{title}</Text>
        <Text style={styles.breakingTime}>
          {time} · {source}
        </Text>
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
        <Ionicons name="image-outline" size={22} color="rgba(255,255,255,0.4)" />
      </LinearGradient>

      <View style={styles.content}>
        <View style={{ flex: 1 }}>
          <Text style={styles.category}>{category}</Text>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
        </View>
        <Text style={styles.time}>
          {time} · {source}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Card classique (avec image à gauche)
  card: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 14,
    marginBottom: 10,
    borderWidth: 0.5,
    borderColor: colors.border,
    minHeight: 92,
  },
  image: {
    width: 72,
    height: 72,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  category: {
    fontSize: 10,
    color: colors.accent,
    letterSpacing: 0.8,
    fontWeight: '600',
    marginBottom: 5,
  },
  title: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 19,
    fontWeight: '500',
  },
  time: {
    fontSize: 10,
    color: colors.textDim,
    marginTop: 6,
  },

  // ✅ Card breaking (séparée maintenant, vraie colonne)
  breakingCard: {
    flexDirection: 'column',           // ← LE FIX : colonne au lieu de hériter row
    backgroundColor: colors.accent,
    borderRadius: radius.lg,
    padding: 16,
    marginBottom: 10,
    width: '100%',                     // prend toute la largeur dispo
  },
  breakingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  breakingCategory: {
    fontSize: 10,
    color: colors.accentText,
    letterSpacing: 1,
    fontWeight: '600',
  },
  breakingTitle: {
    fontSize: 16,
    color: colors.accentText,
    lineHeight: 21,
    fontWeight: '600',
    marginBottom: 10,
  },
  breakingTime: {
    fontSize: 11,
    color: colors.accentText,
    opacity: 0.65,
  },
});