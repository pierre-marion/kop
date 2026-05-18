import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../theme/tokens';

type Club = {
  code: string;
  name: string;
  color: string;
  textColor: string;
};

type Props = {
  time: string;
  playerName: string;
  amount: string;
  clubFrom: Club;
  clubTo: Club;
  description: string;
  accentColor: string;
};

const hexToRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export default function TransferFlashCard({
  time,
  playerName,
  amount,
  clubFrom,
  clubTo,
  description,
  accentColor,
}: Props) {
  return (
    <Pressable style={styles.wrapper}>
      <LinearGradient
        colors={[hexToRgba(accentColor, 0.18), colors.surface, hexToRgba(accentColor, 0.05)]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        {/* Halo radial */}
        <View style={[styles.halo, { backgroundColor: hexToRgba(accentColor, 0.25) }]} />

        <View style={styles.content}>
          {/* Header : badge + heure */}
          <View style={styles.header}>
            <View style={styles.badge}>
              <Ionicons name="swap-horizontal" size={10} color={colors.accent} />
              <Text style={styles.badgeText}>TRANSFERT FLASH</Text>
            </View>
            <Text style={styles.time}>{time}</Text>
          </View>

          {/* Nom du joueur */}
          <Text style={styles.playerName}>{playerName}</Text>

          {/* Bloc transfert avec 2 clubs et flèche */}
          <View style={styles.transferBlock}>
            <View style={styles.clubColumn}>
              <View style={[styles.clubLogo, { backgroundColor: clubFrom.color }]}>
                <Text style={[styles.clubCode, { color: clubFrom.textColor }]}>{clubFrom.code}</Text>
              </View>
              <Text style={styles.clubName}>{clubFrom.name}</Text>
            </View>

            <View style={styles.arrowColumn}>
              <Ionicons name="arrow-forward" size={22} color={colors.accent} />
              <Text style={styles.amount}>{amount}</Text>
            </View>

            <View style={styles.clubColumn}>
              <View style={[styles.clubLogo, { backgroundColor: clubTo.color }]}>
                <Text style={[styles.clubCode, { color: clubTo.textColor }]}>{clubTo.code}</Text>
              </View>
              <Text style={[styles.clubName, { color: colors.text, fontWeight: '600' }]}>{clubTo.name}</Text>
            </View>
          </View>

          {/* Description */}
          <Text style={styles.description}>{description}</Text>
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
    borderRadius: radius.lg,
    borderWidth: 0.5,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  halo: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  content: {
    padding: 14,
    position: 'relative',
    zIndex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(204,255,0,0.15)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 9,
    color: colors.accent,
    letterSpacing: 0.8,
    fontWeight: '700',
  },
  time: {
    fontSize: 9,
    color: colors.textDim,
    marginLeft: 'auto',
  },
  playerName: {
    fontSize: 15,
    color: colors.text,
    fontWeight: '600',
    marginBottom: 12,
  },
  transferBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  clubColumn: {
    alignItems: 'center',
    gap: 5,
  },
  clubLogo: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clubCode: {
    fontSize: 11,
    fontWeight: '700',
  },
  clubName: {
    fontSize: 9,
    color: colors.textMuted,
  },
  arrowColumn: {
    flex: 1,
    alignItems: 'center',
  },
  amount: {
    fontSize: 11,
    color: colors.text,
    fontWeight: '600',
    marginTop: 4,
  },
  description: {
    fontSize: 11,
    color: colors.textMuted,
    paddingTop: 8,
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
  },
});