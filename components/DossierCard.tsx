import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../theme/tokens';

type Props = {
  title: string;
  excerpt: string;
  readTime: string;
  author: string;
  source: string;
};

export default function DossierCard({ title, excerpt, readTime, author, source }: Props) {
  return (
    <Pressable style={styles.wrapper}>
      <View style={styles.card}>
        {/* Barre lime dégradée à gauche */}
        <LinearGradient
          colors={[colors.accent, 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.accentBar}
        />

        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Ionicons name="document-text" size={12} color={colors.accent} />
            <Text style={styles.dossierLabel}>DOSSIER</Text>
            <Text style={styles.readTime}>Lecture · {readTime}</Text>
          </View>

          {/* Titre */}
          <Text style={styles.title}>{title}</Text>

          {/* Extrait */}
          <Text style={styles.excerpt}>{excerpt}</Text>

          {/* Auteur */}
          <View style={styles.authorRow}>
            <View style={styles.authorAvatar} />
            <Text style={styles.authorText}>Par {author} · {source}</Text>
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
    padding: 14,
    borderWidth: 0.5,
    borderColor: colors.border,
    gap: 12,
  },
  accentBar: {
    width: 5,
    borderRadius: 3,
    minHeight: 60,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  dossierLabel: {
    fontSize: 9,
    color: colors.accent,
    letterSpacing: 1,
    fontWeight: '700',
  },
  readTime: {
    fontSize: 9,
    color: colors.textDim,
    marginLeft: 'auto',
  },
  title: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 19,
    fontWeight: '600',
    marginBottom: 6,
  },
  excerpt: {
    fontSize: 11,
    color: colors.textMuted,
    lineHeight: 15,
    marginBottom: 10,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  authorAvatar: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#333',
  },
  authorText: {
    fontSize: 10,
    color: colors.text,
  },
});