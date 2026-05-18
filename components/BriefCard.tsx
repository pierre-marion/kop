import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radius } from '../theme/tokens';

type Props = {
  category: string;
  categoryColor: string;
  categoryTextColor: string;
  title: string;
  excerpt: string;
  time: string;
  source: string;
};

export default function BriefCard({
  category,
  categoryColor,
  categoryTextColor,
  title,
  excerpt,
  time,
  source,
}: Props) {
  return (
    <Pressable style={styles.wrapper}>
      <LinearGradient
        colors={[colors.surface, '#1a1421']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        {/* Header : badge catégorie + heure/source */}
        <View style={styles.header}>
          <View style={[styles.categoryBadge, { backgroundColor: categoryColor }]}>
            <Text style={[styles.categoryText, { color: categoryTextColor }]}>{category}</Text>
          </View>
          <Text style={styles.timeSource}>{time} · {source}</Text>
        </View>

        {/* Titre */}
        <Text style={styles.title}>{title}</Text>

        {/* Extrait */}
        <Text style={styles.excerpt} numberOfLines={2}>
          {excerpt}
        </Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 18,
    marginBottom: 10,
  },
  card: {
    borderRadius: radius.lg,
    padding: 14,
    borderWidth: 0.5,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  categoryBadge: {
    paddingVertical: 2,
    paddingHorizontal: 7,
    borderRadius: 4,
  },
  categoryText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  timeSource: {
    fontSize: 9,
    color: colors.textDim,
    marginLeft: 'auto',
  },
  title: {
    fontSize: 13,
    color: colors.text,
    lineHeight: 17,
    fontWeight: '500',
    marginBottom: 6,
  },
  excerpt: {
    fontSize: 11,
    color: colors.textMuted,
    lineHeight: 15,
  },
});