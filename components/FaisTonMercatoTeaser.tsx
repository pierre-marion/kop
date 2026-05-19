import { View, Text, Pressable, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../theme/tokens';

export default function FaisTonMercatoTeaser() {
  return (
    <LinearGradient
      colors={['rgba(204,255,0,0.08)', colors.surface]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <Ionicons name="game-controller" size={28} color={colors.accent} />
      <View style={styles.content}>
        <Text style={styles.title}>Fais ton mercato</Text>
        <Text style={styles.subtitle}>Compose l'effectif idéal avec ton budget</Text>
      </View>
      <Pressable
        style={styles.button}
        onPress={() =>
          Alert.alert(
            'Bientôt disponible',
            'Le mode "Fais ton mercato" arrive dans une prochaine version. Reste connecté !'
          )
        }
      >
        <Text style={styles.buttonText}>JOUER</Text>
      </Pressable>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: 18,
    marginVertical: 12,
    padding: 14,
    borderRadius: radius.lg,
    borderWidth: 0.5,
    borderColor: colors.border,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '600',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 10,
    color: colors.textMuted,
  },
  button: {
    backgroundColor: colors.accent,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  buttonText: {
    fontSize: 10,
    color: colors.accentText,
    fontWeight: '700',
  },
});