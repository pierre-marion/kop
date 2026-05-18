import { View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { colors, radius } from '../theme/tokens';
import { useRouter } from 'expo-router';
import Flag from './Flag';
import TeamLogo from './TeamLogo';

type HighlightTeam = {
  id?: number;
  tla: string;
  crest?: string;
  fallbackColor?: string;
};

type Highlight = {
  type: 'live' | 'next' | 'derby';
  label: string;
  homeTeam?: HighlightTeam;
  awayTeam?: HighlightTeam;
};

type Props = {
  /** Code court affiché dans la pastille fallback (ex: "L1", "PL") */
  code: string;
  /** Code Football-Data utilisé pour la navigation */
  apiCode: string;
  /** URL de l'emblème de la compétition (depuis l'API) */
  emblem?: string;
  name: string;
  country: string;
  countryFlag?: string;
  matchday: string;
  color: string;
  logoTextColor: string;
  leader?: {
    id?: number;
    tla: string;
    crest?: string;
    name: string;
    color: string;
    points: number;
  };
  highlight?: Highlight;
  loading?: boolean;
  errorMessage?: string;
};

export default function CompetitionCard({
  code,
  apiCode,
  emblem,
  name,
  country,
  countryFlag,
  matchday,
  color,
  logoTextColor,
  leader,
  highlight,
  loading,
  errorMessage,
}: Props) {
  const router = useRouter();

  const getHighlightStyle = (type: Highlight['type']) => {
    switch (type) {
      case 'live':
        return { icon: 'radio-button-on' as const, iconColor: colors.accent, isLive: true };
      case 'derby':
        return { icon: 'flame' as const, iconColor: '#FF7A00', isLive: false };
      case 'next':
      default:
        return { icon: 'time-outline' as const, iconColor: colors.textDim, isLive: false };
    }
  };

  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const highlightStyle = highlight ? getHighlightStyle(highlight.type) : null;
  const isSvgEmblem = emblem?.toLowerCase().endsWith('.svg');

  return (
    <Pressable
      style={styles.wrapper}
      onPress={() => router.push(`/competition/${apiCode}`)}
    >
      <LinearGradient
        colors={[hexToRgba(color, 0.25), colors.surface, hexToRgba(color, 0.1)]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={[styles.halo, { backgroundColor: hexToRgba(color, 0.4) }]} />

        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              {emblem && !isSvgEmblem ? (
                <View style={styles.emblemBox}>
                  <Image
                    source={{ uri: emblem }}
                    style={styles.emblemImage}
                    contentFit="contain"
                    cachePolicy="memory-disk"
                    transition={150}
                  />
                </View>
              ) : (
                <View style={[styles.logoBox, { backgroundColor: color }]}>
                  <Text style={[styles.logoText, { color: logoTextColor }]}>{code}</Text>
                </View>
              )}
              <View>
                <Text style={styles.name}>{name}</Text>
                <View style={styles.countryRow}>
                  {countryFlag && <Flag country={countryFlag} size={11} showFallbackText={false} />}
                  <Text style={styles.country}>
                    {country}
                    {matchday ? ` · ${matchday}` : ''}
                  </Text>
                </View>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textDim} />
          </View>

          {/* Leader */}
          <View style={styles.leaderSection}>
            <Text style={styles.leaderLabel}>LEADER</Text>
            {loading ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator size="small" color={colors.accent} />
                <Text style={styles.loadingText}>Chargement…</Text>
              </View>
            ) : errorMessage ? (
              <View style={styles.errorRow}>
                <Ionicons name="warning-outline" size={12} color={colors.textMuted} />
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            ) : leader ? (
              <View style={styles.leaderRow}>
                <TeamLogo
                  url={leader.crest}
                  tla={leader.tla}
                  size={20}
                  fallbackBg={leader.color}
                  fallbackText="#FFFFFF"
                />
                <Text style={styles.leaderName}>{leader.name}</Text>
                <Text style={styles.leaderPoints}>{leader.points} pts</Text>
              </View>
            ) : (
              <Text style={styles.errorText}>—</Text>
            )}
          </View>

          {/* Highlight (live, derby, next) */}
          {highlight && highlightStyle ? (
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
              {/* Mini logos home/away si dispo */}
              {highlight.homeTeam && highlight.awayTeam ? (
                <View style={styles.highlightMiniLogos}>
                  <TeamLogo
                    url={highlight.homeTeam.crest}
                    tla={highlight.homeTeam.tla}
                    size={14}
                    fallbackBg={highlight.homeTeam.fallbackColor || colors.surfaceAlt}
                    fallbackText="#FFFFFF"
                  />
                  <TeamLogo
                    url={highlight.awayTeam.crest}
                    tla={highlight.awayTeam.tla}
                    size={14}
                    fallbackBg={highlight.awayTeam.fallbackColor || colors.surfaceAlt}
                    fallbackText="#FFFFFF"
                  />
                </View>
              ) : null}
              <Text style={styles.highlightText} numberOfLines={1}>
                {highlightStyle.isLive && (
                  <Text style={{ color: colors.accent, fontWeight: '500' }}>LIVE </Text>
                )}
                {highlight.label.replace('LIVE ', '')}
              </Text>
            </View>
          ) : (
            <View style={styles.highlightRow}>
              <Ionicons name="time-outline" size={11} color={colors.textDim} />
              <Text style={styles.highlightTextDim}>
                {loading ? '—' : 'Pas de match imminent'}
              </Text>
            </View>
          )}
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
  emblemBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#EFE9DC',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  emblemImage: {
    width: '100%',
    height: '100%',
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
  countryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  country: {
    fontSize: 9,
    color: colors.textMuted,
    letterSpacing: 0.5,
  },
  leaderSection: {
    marginBottom: 10,
  },
  leaderLabel: {
    fontSize: 9,
    color: colors.textDim,
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  leaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 20,
  },
  loadingText: {
    fontSize: 11,
    color: colors.textMuted,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 20,
  },
  errorText: {
    fontSize: 11,
    color: colors.textMuted,
  },
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 10,
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
  },
  highlightMiniLogos: {
    flexDirection: 'row',
    gap: 3,
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
    flex: 1,
  },
  highlightTextDim: {
    fontSize: 10,
    color: colors.textDim,
    flex: 1,
  },
});
