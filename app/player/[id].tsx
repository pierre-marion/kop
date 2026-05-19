import { useMemo } from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useQueries } from '@tanstack/react-query';
import { colors, radius } from '../../theme/tokens';
import TeamLogo from '../../components/TeamLogo';
import Flag from '../../components/Flag';
import FormDots from '../../components/FormDots';
import { usePlayer } from '../../hooks/useFootballData';
import { getTopScorers } from '../../services/footballApi';
import { COMPETITION_CONFIGS } from '../../data/competitionConfigs';
import { getTeamColor } from '../../theme/teamColors';
import { translatePosition, translateCountry } from '../../lib/playerLabels';
import { generateMockStats } from '../../lib/mockPlayerStats';

const hexToRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

function getAge(dateOfBirth?: string): number | null {
  if (!dateOfBirth) return null;
  const dob = new Date(dateOfBirth);
  if (Number.isNaN(dob.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age--;
  return age;
}

function formatDate(d?: string): string | null {
  if (!d) return null;
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
}

function getYear(d?: string): string | null {
  if (!d) return null;
  const year = new Date(d).getFullYear();
  return Number.isNaN(year) ? null : String(year);
}

export default function PlayerDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const playerId = id ? parseInt(id, 10) : undefined;

  const { data: player, isLoading, error } = usePlayer(playerId);

  // Cherche le joueur dans le top buteurs des 5 grands championnats (cache)
  const scorersQueries = useQueries({
    queries: COMPETITION_CONFIGS.map((c) => ({
      queryKey: ['scorers', c.apiCode, 30],
      queryFn: () => getTopScorers(c.apiCode, 30),
      staleTime: 10 * 60 * 1000,
      enabled: !!playerId,
    })),
  });

  const seasonStats = useMemo(() => {
    if (!playerId) return null;
    for (let i = 0; i < scorersQueries.length; i++) {
      const list = scorersQueries[i].data?.scorers;
      if (!list) continue;
      const found = list.find((s) => s.player.id === playerId);
      if (found) {
        return {
          goals: found.goals,
          assists: found.assists,
          competition: COMPETITION_CONFIGS[i],
        };
      }
    }
    return null;
  }, [scorersQueries, playerId]);

  // ⚠️ Hooks doivent être appelés avant tout return conditionnel.
  // Génération des stats mockées — calculée même quand player est undefined.
  const age = player ? getAge(player.dateOfBirth) : null;
  const mock = useMemo(
    () => (player ? generateMockStats(player, age) : null),
    [player, age]
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={10}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </Pressable>
        </View>
        <View style={styles.center}>
          <ActivityIndicator color={colors.accent} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !player) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={10}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </Pressable>
        </View>
        <View style={styles.center}>
          <Ionicons name="warning-outline" size={28} color={colors.textMuted} />
          <Text style={styles.errorText}>
            {(error as Error)?.message || 'Joueur indisponible'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // À ce stade player et mock sont garantis définis (early returns au-dessus)
  if (!mock) return null;
  const teamColor = player.currentTeam?.id ? getTeamColor(player.currentTeam.id) : colors.accent;
  const positionLabel = translatePosition(player.position);
  const countryLabel = translateCountry(player.nationality);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={10}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </Pressable>
          <Pressable hitSlop={10}>
            <Ionicons name="share-outline" size={20} color={colors.text} />
          </Pressable>
        </View>

        {/* HERO */}
        <LinearGradient
          colors={[hexToRgba(teamColor, 0.55), hexToRgba(teamColor, 0.18), colors.bg]}
          style={styles.hero}
        >
          <View style={[styles.heroHalo, { backgroundColor: hexToRgba(teamColor, 0.45) }]} />

          {/* Bandeau club au-dessus du nom */}
          {player.currentTeam && (
            <View style={styles.clubChip}>
              <TeamLogo
                url={player.currentTeam.crest}
                tla={player.currentTeam.tla || ''}
                fallbackBg={teamColor}
                fallbackText="#FFFFFF"
                size={18}
              />
              <Text style={styles.clubChipText} numberOfLines={1}>
                {player.currentTeam.shortName || player.currentTeam.name}
              </Text>
              {player.shirtNumber != null && (
                <View style={styles.shirtPill}>
                  <Text style={styles.shirtPillText}>#{player.shirtNumber}</Text>
                </View>
              )}
            </View>
          )}

          <Text style={styles.firstName}>{player.firstName ?? ''}</Text>
          <Text style={styles.lastName}>{player.lastName ?? player.name}</Text>

          <View style={styles.positionRow}>
            <Text style={styles.positionLabel}>{positionLabel.toUpperCase()}</Text>
            {age != null && (
              <>
                <View style={styles.positionDot} />
                <Text style={styles.positionLabel}>{age} ANS</Text>
              </>
            )}
            {countryLabel !== '—' && (
              <>
                <View style={styles.positionDot} />
                <Flag country={player.nationality} size={14} showFallbackText={false} />
                <Text style={styles.positionLabel}>{countryLabel.toUpperCase()}</Text>
              </>
            )}
          </View>
        </LinearGradient>

        {/* STATS SAISON */}
        {seasonStats && (
          <View style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <Text style={styles.sectionLabel}>SAISON EN COURS</Text>
              <Pressable
                onPress={() => router.push(`/competition/${seasonStats.competition.apiCode}?tab=scorers` as any)}
              >
                <Text style={styles.sectionAction}>
                  {seasonStats.competition.name} →
                </Text>
              </Pressable>
            </View>
            <View style={styles.statsRow}>
              <View style={[styles.statBox, styles.statBoxAccent]}>
                <Text style={styles.statValueBig}>{seasonStats.goals}</Text>
                <Text style={styles.statLabel}>BUTS</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statValueBig}>{seasonStats.assists}</Text>
                <Text style={styles.statLabel}>PASSES DÉC.</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statValueBig}>
                  {(seasonStats.goals + seasonStats.assists)}
                </Text>
                <Text style={styles.statLabel}>IMPLICATIONS</Text>
              </View>
            </View>
          </View>
        )}

        {/* CLUB ACTUEL */}
        {player.currentTeam && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>CLUB ACTUEL</Text>
            <Pressable
              onPress={() => router.push(`/team/${player.currentTeam!.id}` as any)}
            >
              <LinearGradient
                colors={[hexToRgba(teamColor, 0.25), colors.surface]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.clubCard}
              >
                <TeamLogo
                  url={player.currentTeam.crest}
                  tla={player.currentTeam.tla || ''}
                  fallbackBg={teamColor}
                  fallbackText="#FFFFFF"
                  size={48}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.clubName}>
                    {player.currentTeam.shortName || player.currentTeam.name}
                  </Text>
                  <View style={styles.clubMetaRow}>
                    {player.currentTeam.contract?.start && (
                      <Text style={styles.clubMeta}>
                        Depuis {getYear(player.currentTeam.contract.start)}
                      </Text>
                    )}
                    {player.currentTeam.contract?.until && (
                      <>
                        {player.currentTeam.contract.start && <View style={styles.metaDot} />}
                        <Text style={styles.clubMeta}>
                          Jusqu'en {getYear(player.currentTeam.contract.until)}
                        </Text>
                      </>
                    )}
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={16} color={colors.textDim} />
              </LinearGradient>
            </Pressable>
          </View>
        )}

        {/* CARRIÈRE */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionLabel}>CARRIÈRE</Text>
            <View style={styles.demoBadge}>
              <Text style={styles.demoBadgeText}>DÉMO</Text>
            </View>
          </View>
          <View style={styles.careerGrid}>
            <View style={styles.careerBox}>
              <Text style={styles.statValueBig}>{mock.career.apps}</Text>
              <Text style={styles.statLabel}>MATCHS</Text>
            </View>
            <View style={[styles.careerBox, styles.statBoxAccent]}>
              <Text style={styles.statValueBig}>{mock.career.goals}</Text>
              <Text style={styles.statLabel}>BUTS</Text>
            </View>
            <View style={styles.careerBox}>
              <Text style={styles.statValueBig}>{mock.career.assists}</Text>
              <Text style={styles.statLabel}>PASSES DÉC.</Text>
            </View>
            <View style={styles.careerBox}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Ionicons name="trophy" size={16} color={colors.accent} />
                <Text style={styles.statValueBig}>{mock.career.trophies}</Text>
              </View>
              <Text style={styles.statLabel}>TROPHÉES</Text>
            </View>
          </View>
        </View>

        {/* FORME RÉCENTE */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionLabel}>FORME · 5 DERNIERS</Text>
            <View style={styles.demoBadge}>
              <Text style={styles.demoBadgeText}>DÉMO</Text>
            </View>
          </View>
          <View style={styles.formCard}>
            <FormDots form={mock.form} size={11} />
            <Text style={styles.formText}>
              {mock.form.filter((r) => r === 'W').length}V · {mock.form.filter((r) => r === 'D').length}N · {mock.form.filter((r) => r === 'L').length}D
            </Text>
          </View>
        </View>

        {/* HISTORIQUE DES CLUBS */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionLabel}>HISTORIQUE DES CLUBS</Text>
            <View style={styles.demoBadge}>
              <Text style={styles.demoBadgeText}>DÉMO</Text>
            </View>
          </View>
          <View style={styles.historyCard}>
            {mock.clubs.map((club, idx) => (
              <View
                key={`${club.name}-${idx}`}
                style={[
                  styles.historyRow,
                  idx > 0 && styles.historyRowBorder,
                ]}
              >
                <View style={[styles.historyBadge, { backgroundColor: club.color }]}>
                  <Text style={styles.historyBadgeText}>{club.tla || '—'}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.historyClubName}>{club.name}</Text>
                  <Text style={styles.historyPeriod}>{club.period}</Text>
                </View>
                <View style={styles.historyStats}>
                  <Text style={styles.historyStatValue}>{club.apps}</Text>
                  <Text style={styles.historyStatLabel}>m</Text>
                  <Text style={[styles.historyStatValue, { marginLeft: 8 }]}>{club.goals}</Text>
                  <Text style={styles.historyStatLabel}>b</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* INFOS */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>INFOS</Text>
          <View style={styles.detailsCard}>
            {player.dateOfBirth && (
              <DetailRow label="Date de naissance" value={formatDate(player.dateOfBirth) ?? '—'} />
            )}
            {player.nationality && (
              <DetailRow label="Nationalité" value={countryLabel} />
            )}
            {player.position && (
              <DetailRow label="Poste" value={positionLabel} />
            )}
            {player.shirtNumber != null && (
              <DetailRow label="Numéro" value={`#${player.shirtNumber}`} />
            )}
            {player.currentTeam?.contract?.start && (
              <DetailRow
                label="Arrivée au club"
                value={formatDate(player.currentTeam.contract.start) ?? '—'}
                isLast={!player.currentTeam?.contract?.until}
              />
            )}
            {player.currentTeam?.contract?.until && (
              <DetailRow
                label="Fin de contrat"
                value={formatDate(player.currentTeam.contract.until) ?? '—'}
                isLast
              />
            )}
          </View>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function DetailRow({ label, value, isLast }: { label: string; value: string; isLast?: boolean }) {
  return (
    <View style={[styles.detailRow, !isLast && styles.detailRowBorder]}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 8,
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, paddingHorizontal: 32 },
  errorText: { fontSize: 12, color: colors.textMuted, textAlign: 'center' },

  // HERO
  hero: {
    paddingHorizontal: 24,
    paddingTop: 14,
    paddingBottom: 26,
    overflow: 'hidden',
  },
  heroHalo: {
    position: 'absolute',
    top: -120,
    right: -80,
    width: 320,
    height: 320,
    borderRadius: 160,
    opacity: 0.55,
  },
  clubChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.1)',
    alignSelf: 'flex-start',
    marginBottom: 18,
  },
  clubChipText: { fontSize: 11, color: colors.text, fontWeight: '600', maxWidth: 160 },
  shirtPill: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
  },
  shirtPillText: { fontSize: 10, color: colors.text, fontWeight: '700' },
  firstName: {
    fontSize: 28,
    color: colors.text,
    fontWeight: '400',
    letterSpacing: -0.8,
    opacity: 0.85,
    lineHeight: 32,
  },
  lastName: {
    fontSize: 40,
    color: colors.text,
    fontWeight: '800',
    letterSpacing: -1.4,
    lineHeight: 42,
    marginTop: -2,
  },
  positionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 14,
    flexWrap: 'wrap',
  },
  positionLabel: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: '600',
    letterSpacing: 1.2,
  },
  positionDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.textDim,
  },

  // SECTIONS
  section: { paddingHorizontal: 18, paddingTop: 20 },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionLabel: {
    fontSize: 10,
    color: colors.textDim,
    letterSpacing: 1.5,
    fontWeight: '500',
    marginBottom: 10,
  },
  sectionAction: { fontSize: 10, color: colors.accent, fontWeight: '500' },

  demoBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: 'rgba(204,255,0,0.10)',
    borderWidth: 0.5,
    borderColor: hexToRgba('#CCFF00', 0.4),
    marginBottom: 10,
  },
  demoBadgeText: {
    fontSize: 8,
    color: colors.accent,
    fontWeight: '700',
    letterSpacing: 0.8,
  },

  // STATS
  statsRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  statBox: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    paddingVertical: 18,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 0.5,
    borderColor: colors.border,
  },
  statBoxAccent: {
    borderColor: colors.accent,
    backgroundColor: hexToRgba('#CCFF00', 0.06),
  },
  statValueBig: { fontSize: 26, color: colors.text, fontWeight: '800', letterSpacing: -0.5 },
  statLabel: { fontSize: 9, color: colors.textDim, letterSpacing: 0.8, fontWeight: '500' },

  // CLUB
  clubCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: radius.lg,
    padding: 14,
    borderWidth: 0.5,
    borderColor: colors.border,
  },
  clubName: { fontSize: 16, color: colors.text, fontWeight: '700', letterSpacing: -0.3 },
  clubMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4, flexWrap: 'wrap' },
  clubMeta: { fontSize: 11, color: colors.textMuted },
  metaDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: colors.textDim },

  // CARRIÈRE (2x2)
  careerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  careerBox: {
    width: '48%',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 18,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 0.5,
    borderColor: colors.border,
  },

  // FORME
  formCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderWidth: 0.5,
    borderColor: colors.border,
  },
  formText: { fontSize: 11, color: colors.textMuted, fontWeight: '600', letterSpacing: 0.5 },

  // HISTORIQUE CLUBS
  historyCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 0.5,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  historyRowBorder: { borderTopWidth: 0.5, borderTopColor: colors.border },
  historyBadge: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyBadgeText: { fontSize: 10, color: '#FFFFFF', fontWeight: '800', letterSpacing: 0.3 },
  historyClubName: { fontSize: 13, color: colors.text, fontWeight: '600' },
  historyPeriod: { fontSize: 11, color: colors.textMuted, marginTop: 1 },
  historyStats: { flexDirection: 'row', alignItems: 'baseline' },
  historyStatValue: { fontSize: 13, color: colors.text, fontWeight: '700' },
  historyStatLabel: { fontSize: 9, color: colors.textDim, marginLeft: 2, letterSpacing: 0.5 },

  // DETAILS
  detailsCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 0.5,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  detailRowBorder: { borderBottomWidth: 0.5, borderBottomColor: colors.border },
  detailLabel: { fontSize: 12, color: colors.textMuted },
  detailValue: { fontSize: 13, color: colors.text, fontWeight: '500' },
});
