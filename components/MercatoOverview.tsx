import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../theme/tokens';
import { mercatoOverview } from '../data/mockData';

export default function MercatoOverview() {
  return (
    <View style={styles.card}>
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
    </View>
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
});