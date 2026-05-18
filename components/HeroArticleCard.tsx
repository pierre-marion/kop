import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../theme/tokens';

type Props = {
  label: string;
  category: string;
  title: string;
  source: string;
  time: string;
  gradientColors: [string, string];
};

export default function HeroArticleCard({
  label,
  category,
  title,
  source,
  time,
  gradientColors,
}: Props) {
  return (
    <Pressable style={styles.wrapper}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        {/* Halo lime en bas à droite */}
        <View style={styles.halo} />

        {/* Badge L'événement (top left) */}
        <View style={styles.eventBadge}>
          <Ionicons name="star" size={10} color={colors.accent} />
          <Text style={styles.eventBadgeText}>{label}</Text>
        </View>

        {/* Badge temps (top right) */}
        <View style={styles.timeBadge}>
          <Text style={styles.timeBadgeText}>{time}</Text>
        </View>

        {/* Texte en bas avec dégradé sombre */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.85)']}
          style={styles.bottomGradient}
        >
          <Text style={styles.category}>{category}</Text>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.footer}>
            <Text style={styles.source}>{source}</Text>
            <Ionicons name="arrow-up" size={18} color="white" style={{ transform: [{ rotate: '45deg' }] }} />
          </View>
        </LinearGradient>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 18,
    marginBottom: 14,
  },
  card: {
    height: 230,
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
  },
  halo: {
    position: 'absolute',
    bottom: -30,
    right: -30,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(204,255,0,0.15)',
  },
  eventBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  eventBadgeText: {
    fontSize: 9,
    color: colors.text,
    letterSpacing: 1,
    fontWeight: '700',
  },
  timeBadge: {
    position: 'absolute',
    top: 14,
    right: 14,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  timeBadgeText: {
    fontSize: 9,
    color: colors.text,
    opacity: 0.8,
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  category: {
    fontSize: 9,
    color: colors.accent,
    letterSpacing: 1.5,
    fontWeight: '700',
    marginBottom: 6,
  },
  title: {
    fontSize: 22,
    color: 'white',
    fontWeight: '700',
    lineHeight: 25,
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  source: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
  },
});