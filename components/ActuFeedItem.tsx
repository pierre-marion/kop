import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../theme/tokens';

type Props = {
  isHot?: boolean;
  isMercato?: boolean;
  category: string;
  categoryColor?: string;
  categoryTextColor?: string;
  title: string;
  excerpt: string;
  time: string;
  source: string;
  views?: string;
  comments?: number;
};

export default function ActuFeedItem({
  isHot,
  isMercato,
  category,
  categoryColor,
  categoryTextColor,
  title,
  excerpt,
  time,
  source,
  views,
  comments,
}: Props) {
  return (
    <View style={[styles.card, isHot && styles.cardHot]}>
      {/* En-tête : catégorie + heure/source */}
      <View style={styles.header}>
        {isHot ? (
          <>
            <Ionicons name="flame" size={11} color={colors.accent} />
            <Text style={styles.hotLabel}>{category}</Text>
          </>
        ) : isMercato ? (
          <>
            <Ionicons name="swap-horizontal" size={11} color={colors.accent} />
            <Text style={styles.hotLabel}>{category}</Text>
          </>
        ) : (
          <View style={[styles.categoryBadge, { backgroundColor: categoryColor || colors.surface }]}>
            <Text style={[styles.categoryBadgeText, { color: categoryTextColor || colors.text }]}>
              {category}
            </Text>
          </View>
        )}
        <Text style={styles.timeSource}>
          {time} · {source}
        </Text>
      </View>

      {/* Titre */}
      <Text style={[styles.title, isHot && styles.titleHot]}>{title}</Text>

      {/* Teaser */}
      <Text style={styles.excerpt} numberOfLines={2}>
        {excerpt}
      </Text>

      {/* Stats (vues/comments) — uniquement sur les articles chauds */}
      {isHot && (views || comments !== undefined) && (
        <View style={styles.stats}>
          {views && (
            <View style={styles.statItem}>
              <Ionicons name="eye-outline" size={12} color={colors.textDim} />
              <Text style={styles.statText}>{views}</Text>
            </View>
          )}
          {comments !== undefined && (
            <View style={styles.statItem}>
              <Ionicons name="chatbubble-outline" size={11} color={colors.textDim} />
              <Text style={styles.statText}>{comments}</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: 14,
    marginBottom: 6,
    borderWidth: 0.5,
    borderColor: colors.border,
  },
  cardHot: {
    borderLeftWidth: 3,
    borderLeftColor: colors.accent,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  categoryBadge: {
    paddingVertical: 2,
    paddingHorizontal: 7,
    borderRadius: 4,
  },
  categoryBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  hotLabel: {
    fontSize: 9,
    color: colors.accent,
    fontWeight: '700',
    letterSpacing: 1,
  },
  timeSource: {
    fontSize: 9,
    color: colors.textDim,
    marginLeft: 'auto',
    letterSpacing: 0.3,
  },
  title: {
    fontSize: 13,
    color: colors.text,
    lineHeight: 17,
    fontWeight: '500',
    marginBottom: 5,
  },
  titleHot: {
    fontSize: 14,
    fontWeight: '600',
  },
  excerpt: {
    fontSize: 11,
    color: colors.textMuted,
    lineHeight: 15,
  },
  stats: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 10,
    color: colors.textMuted,
  },
});