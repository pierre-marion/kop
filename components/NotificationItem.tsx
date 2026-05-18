import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../theme/tokens';

type Props = {
  type: 'goal' | 'mercato' | 'hot' | 'result' | 'reminder';
  label: string;
  title: string;
  time: string;
  isUnread: boolean;
};

// Config visuelle par type de notif
const notifConfig = {
  goal: {
    icon: 'football' as const,
    iconColor: '#EF4444',
    iconBg: 'rgba(239,68,68,0.15)',
    labelColor: '#EF4444',
    hasDot: true,
  },
  mercato: {
    icon: 'swap-horizontal' as const,
    iconColor: colors.accent,
    iconBg: 'rgba(204,255,0,0.15)',
    labelColor: colors.accent,
    hasDot: false,
  },
  hot: {
    icon: 'flame' as const,
    iconColor: '#FF7A00',
    iconBg: 'rgba(255,122,0,0.15)',
    labelColor: '#FF7A00',
    hasDot: false,
  },
  result: {
    icon: 'trophy' as const,
    iconColor: colors.textMuted,
    iconBg: 'rgba(204,255,0,0.1)',
    labelColor: colors.textMuted,
    hasDot: false,
  },
  reminder: {
    icon: 'time' as const,
    iconColor: colors.textMuted,
    iconBg: 'rgba(204,255,0,0.1)',
    labelColor: colors.textMuted,
    hasDot: false,
  },
};

export default function NotificationItem({
  type,
  label,
  title,
  time,
  isUnread,
}: Props) {
  const config = notifConfig[type];

  const cardContent = (
    <>
      {/* Petit point lime à gauche pour les non lues */}
      {isUnread && <View style={styles.unreadDot} />}

      {/* Icône colorée */}
      <View
        style={[
          styles.iconCircle,
          { backgroundColor: config.iconBg, marginLeft: isUnread ? 8 : 0 },
        ]}
      >
        <Ionicons name={config.icon} size={16} color={config.iconColor} />
      </View>

      {/* Contenu */}
      <View style={styles.content}>
        <View style={styles.labelRow}>
          {config.hasDot && <View style={styles.smallDot} />}
          <Text style={[styles.label, { color: config.labelColor }]}>{label}</Text>
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.time}>{time}</Text>
      </View>
    </>
  );

  // Si non lue, on ajoute un dégradé subtil lime
  if (isUnread) {
    return (
      <Pressable>
        <LinearGradient
          colors={['rgba(204,255,0,0.06)', colors.surface]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.card, styles.cardUnread]}
        >
          {cardContent}
        </LinearGradient>
      </Pressable>
    );
  }

  // Notif déjà lue : juste le fond surface, opacité légèrement réduite
  return (
    <Pressable>
      <View style={[styles.card, styles.cardRead]}>{cardContent}</View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: 10,
    borderRadius: radius.md,
    padding: 12,
    marginBottom: 6,
    borderWidth: 0.5,
    borderColor: colors.border,
    position: 'relative',
    alignItems: 'flex-start',
  },
  cardUnread: {
    // Le dégradé fait le boulot
  },
  cardRead: {
    backgroundColor: colors.surface,
    opacity: 0.7,
  },
  unreadDot: {
    position: 'absolute',
    left: 4,
    top: '50%',
    marginTop: -2.5,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.accent,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 3,
  },
  smallDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#EF4444',
  },
  label: {
    fontSize: 9,
    letterSpacing: 0.5,
    fontWeight: '700',
  },
  title: {
    fontSize: 13,
    color: colors.text,
    lineHeight: 17,
    fontWeight: '500',
  },
  time: {
    fontSize: 10,
    color: colors.textDim,
    marginTop: 4,
  },
});