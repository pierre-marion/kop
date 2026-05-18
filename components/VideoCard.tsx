import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../theme/tokens';

type Props = {
  title: string;
  duration: string;
  time: string;
  source: string;
  views: string;
  thumbnailColors: [string, string, string];
};

export default function VideoCard({
  title,
  duration,
  time,
  source,
  views,
  thumbnailColors,
}: Props) {
  return (
    <Pressable style={styles.wrapper}>
      <View style={styles.card}>
        {/* Thumbnail avec play button */}
        <LinearGradient
          colors={thumbnailColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.thumbnail}
        >
          <View style={styles.overlay} />
          
          <View style={styles.playButton}>
            <Ionicons name="play" size={22} color={colors.accentText} style={{ marginLeft: 3 }} />
          </View>

          {/* Badge VIDÉO top left */}
          <View style={styles.videoBadge}>
            <Ionicons name="play" size={10} color={colors.accent} />
            <Text style={styles.videoBadgeText}>VIDÉO</Text>
          </View>

          {/* Durée bottom right */}
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>{duration}</Text>
          </View>
        </LinearGradient>

        {/* Texte sous la thumbnail */}
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaText}>{time} · {source}</Text>
            <View style={styles.viewsRow}>
              <Ionicons name="eye-outline" size={10} color={colors.textDim} />
              <Text style={styles.viewsText}>{views}</Text>
            </View>
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
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 0.5,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  thumbnail: {
    aspectRatio: 16 / 9,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  playButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(204,255,0,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  videoBadgeText: {
    fontSize: 9,
    color: colors.accent,
    letterSpacing: 0.5,
    fontWeight: '700',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  durationText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '600',
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 13,
    color: colors.text,
    lineHeight: 17,
    fontWeight: '500',
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  metaText: {
    fontSize: 9,
    color: colors.textDim,
  },
  viewsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  viewsText: {
    fontSize: 9,
    color: colors.textMuted,
  },
});