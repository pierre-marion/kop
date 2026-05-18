import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../theme/tokens';

export default function Header() {
  return (
    <View style={styles.container}>
      {/* Logo kop• */}
      <View style={styles.logoRow}>
        <Text style={styles.logo}>kop</Text>
        <View style={styles.dot} />
      </View>

      {/* Icônes droite */}
      <View style={styles.icons}>
        <Pressable style={styles.iconButton}>
          <Ionicons name="search" size={14} color={colors.text} />
        </Pressable>
        <Pressable style={styles.iconButton}>
          <Ionicons name="notifications" size={12} color={colors.text} />
          <View style={styles.notifDot} />
        </Pressable>
        <Pressable style={[styles.iconButton, { borderWidth: 0.5, borderColor: colors.border }]}>
          <Ionicons name="person" size={12} color={colors.text} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 14,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3,
  },
  logo: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.text,
    letterSpacing: -0.5,
    lineHeight: 18,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.accent,
    marginBottom: 4,
  },
  icons: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notifDot: {
    position: 'absolute',
    top: 6,
    right: 7,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.accent,
  },
});