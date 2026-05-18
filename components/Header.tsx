import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '../theme/tokens';

export default function Header() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Logo kop• */}
      <View style={styles.logoRow}>
        <Text style={styles.logo}>kop</Text>
        <View style={styles.dot} />
      </View>

      {/* Icônes droite */}
      <View style={styles.icons}>
        <Pressable
          style={styles.iconButton}
          onPress={() => router.push('/search')}
        >
          <Ionicons name="search" size={18} color={colors.text} />
        </Pressable>
        <Pressable
  style={styles.iconButton}
  onPress={() => router.push('/notifications')}
>
  <Ionicons name="notifications" size={18} color={colors.text} />
  <View style={styles.notifDot} />
</Pressable>
        <Pressable
          style={[styles.iconButton, { borderWidth: 0.5, borderColor: colors.border }]}
          onPress={() => router.push('/profile')}
        >
          <Ionicons name="person" size={18} color={colors.text} />
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
    gap: 4,
  },
  logo: {
    fontSize: 28,
    fontWeight: '600',
    color: colors.text,
    letterSpacing: -1,
    lineHeight: 30,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: colors.accent,
    marginBottom: 6,
  },
  icons: {
    flexDirection: 'row',
    gap: 10,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notifDot: {
    position: 'absolute',
    top: 8,
    right: 9,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: colors.accent,
  },
});