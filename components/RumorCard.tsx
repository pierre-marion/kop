import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../theme/tokens';
import Flag from './Flag';

type Club = {
  code?: string;
  country?: string;
  name: string;
  color?: string;
  textColor?: string;
};

type Props = {
  playerName: string;
  amount: string;
  clubFrom: Club;
  clubTo: Club;
  reliability: number;
  sources: number;
  trackedDays: number;
};

export default function RumorCard({
  playerName,
  amount,
  clubFrom,
  clubTo,
  reliability,
  sources,
  trackedDays,
}: Props) {
  // Couleur de la fiabilité selon le %
  const getReliabilityColor = () => {
    if (reliability >= 80) return colors.accent;
    if (reliability >= 50) return '#FF7A00';
    return colors.textMuted;
  };

  const reliabilityColor = getReliabilityColor();

  const renderClub = (club: Club, highlighted: boolean = false) => (
    <View style={styles.clubGroup}>
      {club.code ? (
        <View style={[styles.clubCircle, { backgroundColor: club.color }]}>
          <Text style={[styles.clubCode, { color: club.textColor }]}>{club.code}</Text>
        </View>
      ) : (
        <Flag country={club.country} size={22} showFallbackText={false} />
      )}
      <Text style={[styles.clubName, highlighted && { color: colors.text, fontWeight: '500' }]}>
        {club.name}
      </Text>
    </View>
  );

  return (
    <View style={styles.card}>
      {/* Joueur + montant */}
      <View style={styles.header}>
        <Text style={styles.playerName}>{playerName}</Text>
        <Text style={styles.amount}>{amount}</Text>
      </View>

      {/* Transfert clubs */}
      <View style={styles.transferRow}>
        {renderClub(clubFrom)}
        <Ionicons name="arrow-forward" size={12} color={colors.textDim} style={{ marginHorizontal: 4 }} />
        {renderClub(clubTo, true)}
      </View>

      {/* Fiabilité */}
      <View>
        <View style={styles.reliabilityHeader}>
          <Text style={styles.reliabilityLabel}>FIABILITÉ</Text>
          <Text style={[styles.reliabilityValue, { color: reliabilityColor }]}>{reliability}%</Text>
        </View>
        <View style={styles.barBg}>
          <View
            style={[
              styles.barFill,
              { width: `${reliability}%`, backgroundColor: reliabilityColor },
            ]}
          />
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.metaText}>📰 {sources} sources</Text>
          <Text style={styles.metaText}>⏱️ Suivie depuis {trackedDays}j</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 18,
    marginBottom: 8,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 14,
    borderWidth: 0.5,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  playerName: {
    fontSize: 15,
    color: colors.text,
    fontWeight: '600',
    flex: 1,
  },
  amount: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '600',
  },
  transferRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  clubGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  clubCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clubCode: {
    fontSize: 8,
    fontWeight: '700',
  },
  clubName: {
    fontSize: 11,
    color: colors.textMuted,
  },
  reliabilityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  reliabilityLabel: {
    fontSize: 9,
    color: colors.textDim,
    letterSpacing: 0.5,
  },
  reliabilityValue: {
    fontSize: 11,
    fontWeight: '700',
  },
  barBg: {
    height: 5,
    backgroundColor: colors.bg,
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  metaText: {
    fontSize: 9,
    color: colors.textMuted,
  },
});