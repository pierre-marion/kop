import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../theme/tokens';

type Highlight = {
  type: 'live' | 'next' | 'derby';
  label: string;
};

type Props = {
  code: string;
  name: string;
  country: string;
  matchday: string;
  color: string;
  logoTextColor: string;
  leader: { code: string; name: string; color: string; points: number };
  highlight: Highlight;
};

export default function CompetitionCard({
  code,
  name,
  country,
  matchday,
  color,
  logoTextColor,
  leader,
  highlight,
}: Props) {
  // Icône et couleur du highlight selon le type
  const getHighlightStyle = () => {
    switch (highlight.type) {
      case 'live':
        return { icon: 'radio-button-on' as const, iconColor: colors.accent, isLive: true };
      case 'derby':
        return { icon: 'flame' as const, iconColor: '#FF7A00', isLive: false };
      case 'next':
      default:
        return { icon: 'time-outline' as const, iconColor: colors.textDim, isLive: false };
    }
  };

  const highlightStyle = getHighlightStyle();

  // Convertir hex en rgba pour le dégradé
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  return (
    <Pressable style={styles.wrapper}>
      <LinearGradient
        colors={[hexToRgba(color, 0.25), colors.surface, hexToRgba(color, 0.1)]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        {/* Halo radial en haut à droite */}
        <View style={[styles.halo, { backgroundColor: hexToRgba(color, 0.4) }]} />

        <View style={styles.content}>
          {/* En-tête : logo + nom + flèche */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={[styles.logoBox, { backgroundColor: color }]}>
                <Text style={[styles.logoText, { color: logoTextColor }]}>{code}</Text>
              </View>
              <View>
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.country}>
                  {country} · {matchday}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textDim} />
          </View>

          {/* Leader */}
          <View style={styles.leaderSection}>
            <Text style={styles.leaderLabel}>LEADER</Text>
            <View style={styles.leaderRow}>
              <View style={[styles.leaderDot, { backgroundColor: leader.color }]} />
              <Text style={styles.leaderName}>{leader.name}</Text>
              <Text style={styles.leaderPoints}>{leader.points} pts</Text>
            </View>
          </View>

          {/* Highlight (live, derby, next) */}
          <View style={styles.highlightRow}>
            {highlightStyle.isLive ? (
              <View style={styles.liveDot} />
            ) : (
              <Ionicons
                name={highlightStyle.icon}
                size={11}
                color={highlightStyle.iconColor}
              />
            )}
            <Text style={styles.highlightText}>
              {highlightStyle.isLive && (
                <Text style={{ color: colors.accent, fontWeight: '500' }}>LIVE </Text>
              )}
              {highlight.label.replace('LIVE ', '')}
            </Text>
          </View>
        </View>
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
    borderRadius: radius.xl,
    padding: 16,
    borderWidth: 0.5,
    borderColor: colors.border,
    position: 'relative',
    overflow: 'hidden',
  },
  halo: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    opacity: 0.6,
  },
  content: {
    position: 'relative',
    zIndex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 12,
    fontWeight: '600',
  },
  name: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
  },
  country: {
    fontSize: 9,
    color: colors.textMuted,
    letterSpacing: 0.5,
    marginTop: 1,
  },
  leaderSection: {
    marginBottom: 10,
  },
  leaderLabel: {
    fontSize: 9,
    color: colors.textDim,
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  leaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  leaderDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
  },
  leaderName: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '500',
    flex: 1,
  },
  leaderPoints: {
    fontSize: 11,
    color: colors.accent,
    fontWeight: '600',
  },
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 10,
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
  },
  liveDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.accent,
  },
  highlightText: {
    fontSize: 10,
    color: colors.text,
  },
});