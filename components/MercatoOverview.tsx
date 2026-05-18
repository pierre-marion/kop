import { useState } from 'react';
import { View, Text, Pressable, StyleSheet, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../theme/tokens';
import { mercatoOverview } from '../data/mockData';

// Active LayoutAnimation sur Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function MercatoOverview() {
  const [expanded, setExpanded] = useState(false);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((v) => !v);
  };

  return (
    <Pressable onPress={toggle} style={styles.card}>
      <View style={styles.liveBadge}>
        <Text style={styles.liveBadgeText}>EN TEMPS RÉEL</Text>
      </View>

      <Text style={styles.label}>VOLUME TOTAL · ÉTÉ 2026</Text>

      <View style={styles.amountRow}>
        <Text style={styles.amount}>{mercatoOverview.volumeTotal}</Text>
        <Text style={styles.unit}>{mercatoOverview.volumeUnit}</Text>
        <View style={styles.variation}>
          <Ionicons name="trending-up" size={10} color={colors.accent} />
          <Text style={styles.variationText}>{mercatoOverview.variation}</Text>
        </View>
      </View>

      {/* Barre stacked */}
      <View style={styles.barRow}>
        {mercatoOverview.distribution.map((item, index) => (
          <View
            key={item.league}
            style={{
              flex: item.percent,
              height: 4,
              backgroundColor: item.color,
              borderRadius: 2,
              marginRight: index < mercatoOverview.distribution.length - 1 ? 4 : 0,
            }}
          />
        ))}
      </View>

      {/* Légende */}
      <View style={styles.legend}>
        {mercatoOverview.distribution.map((item) => (
          <Text key={item.league} style={styles.legendText}>
            {item.league} {item.percent}%
          </Text>
        ))}
      </View>

      {/* Toggle hint */}
      <View style={styles.toggleHint}>
        <Text style={styles.toggleHintText}>
          {expanded ? 'Masquer le détail' : 'Voir le détail'}
        </Text>
        <Ionicons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={11}
          color={colors.textDim}
        />
      </View>

      {/* DÉTAIL */}
      {expanded && (
        <View style={styles.detailWrapper}>
          {/* Détail par championnat */}
          <Text style={styles.detailTitle}>DÉTAIL PAR CHAMPIONNAT</Text>
          <View style={styles.leaguesList}>
            {mercatoOverview.distribution.map((item) => (
              <View key={item.league} style={styles.leagueRow}>
                <View style={[styles.leagueDot, { backgroundColor: item.color }]} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.leagueName}>{item.leagueName}</Text>
                  <Text style={styles.leagueMeta}>
                    {item.deals} deals · plus gros : {item.biggest}
                  </Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.leagueAmount}>{item.amount}</Text>
                  <Text style={styles.leaguePercent}>{item.percent}%</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Top transferts */}
          <Text style={[styles.detailTitle, { marginTop: 16 }]}>TOP 5 TRANSFERTS</Text>
          <View style={styles.topTransfersList}>
            {mercatoOverview.topTransfers.map((t, i) => (
              <View
                key={i}
                style={[
                  styles.transferRow,
                  i > 0 && { borderTopWidth: 0.5, borderTopColor: colors.border },
                ]}
              >
                <Text style={[styles.transferRank, i === 0 && { color: colors.accent }]}>
                  {i + 1}
                </Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.transferPlayer}>{t.player}</Text>
                  <Text style={styles.transferRoute}>
                    {t.from} → {t.to}
                  </Text>
                </View>
                <Text style={styles.transferAmount}>{t.amount}</Text>
              </View>
            ))}
          </View>

          {/* Top clubs acheteurs */}
          <Text style={[styles.detailTitle, { marginTop: 16 }]}>CLUBS LES PLUS DÉPENSIERS</Text>
          <View style={styles.buyersList}>
            {mercatoOverview.topBuyers.map((b, i) => (
              <View key={i} style={styles.buyerCard}>
                <View style={[styles.buyerDot, { backgroundColor: b.color }]} />
                <Text style={styles.buyerClub} numberOfLines={1}>{b.club}</Text>
                <Text style={styles.buyerAmount}>{b.amount}</Text>
                <Text style={styles.buyerLeague}>{b.league}</Text>
              </View>
            ))}
          </View>

          {/* Disclaimer mock */}
          <Text style={styles.mockNotice}>
            Données indicatives · Source officielle bientôt disponible
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 18,
    marginTop: 12,
    marginBottom: 4,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 14,
    borderWidth: 0.5,
    borderColor: colors.border,
    position: 'relative',
    overflow: 'hidden',
  },
  liveBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(204,255,0,0.12)',
    borderBottomLeftRadius: 12,
  },
  liveBadgeText: {
    fontSize: 9,
    color: colors.accent,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  label: {
    fontSize: 9,
    color: colors.textDim,
    letterSpacing: 1,
    fontWeight: '500',
    marginBottom: 12,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginBottom: 12,
  },
  amount: {
    fontSize: 36,
    color: colors.text,
    fontWeight: '600',
    letterSpacing: -2,
    lineHeight: 36,
  },
  unit: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  variation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginLeft: 8,
    backgroundColor: 'rgba(204,255,0,0.12)',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  variationText: {
    fontSize: 10,
    color: colors.accent,
    fontWeight: '600',
  },
  barRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  legendText: {
    fontSize: 9,
    color: colors.textMuted,
  },
  // Toggle
  toggleHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingTop: 12,
    marginTop: 8,
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
  },
  toggleHintText: {
    fontSize: 10,
    color: colors.textDim,
    letterSpacing: 0.3,
  },
  // Détail
  detailWrapper: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
  },
  detailTitle: {
    fontSize: 9,
    color: colors.textDim,
    letterSpacing: 1,
    fontWeight: '600',
    marginBottom: 10,
  },
  // Leagues
  leaguesList: {
    gap: 10,
  },
  leagueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  leagueDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  leagueName: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '500',
  },
  leagueMeta: {
    fontSize: 9,
    color: colors.textMuted,
    marginTop: 1,
  },
  leagueAmount: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '600',
  },
  leaguePercent: {
    fontSize: 9,
    color: colors.accent,
    fontWeight: '600',
    marginTop: 1,
  },
  // Top transfers
  topTransfersList: {
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: radius.md,
    borderWidth: 0.5,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  transferRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  transferRank: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '600',
    width: 14,
  },
  transferPlayer: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '500',
  },
  transferRoute: {
    fontSize: 9,
    color: colors.textMuted,
    marginTop: 1,
  },
  transferAmount: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '600',
  },
  // Buyers
  buyersList: {
    flexDirection: 'row',
    gap: 8,
  },
  buyerCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: radius.md,
    borderWidth: 0.5,
    borderColor: colors.border,
    padding: 10,
    alignItems: 'center',
  },
  buyerDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    marginBottom: 6,
  },
  buyerClub: {
    fontSize: 10,
    color: colors.text,
    fontWeight: '500',
    textAlign: 'center',
  },
  buyerAmount: {
    fontSize: 13,
    color: colors.accent,
    fontWeight: '700',
    marginTop: 4,
  },
  buyerLeague: {
    fontSize: 8,
    color: colors.textDim,
    letterSpacing: 0.5,
    marginTop: 2,
  },
  // Notice
  mockNotice: {
    fontSize: 9,
    color: colors.textDim,
    textAlign: 'center',
    marginTop: 14,
    fontStyle: 'italic',
  },
});
