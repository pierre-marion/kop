import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { colors } from '../theme/tokens';
import { getFlagUrl, getCountryCode } from '../data/countryFlags';

type Props = {
  /** Nom du pays renvoyé par l'API (ex: "France", "Saudi Arabia") */
  country?: string | null;
  /** Diamètre en px */
  size?: number;
  /** Affiche un fallback texte avec les 3 premières lettres si pays inconnu */
  showFallbackText?: boolean;
};

export default function Flag({ country, size = 18, showFallbackText = true }: Props) {
  const [hasError, setHasError] = useState(false);
  const url = getFlagUrl(country, size <= 20 ? 40 : size <= 40 ? 80 : 160);

  // Pas de pays ou pas mappé → fallback texte ou placeholder neutre
  if (!url || hasError) {
    if (showFallbackText && country) {
      return (
        <View
          style={[
            styles.fallback,
            { width: size, height: size, borderRadius: size / 2 },
          ]}
        >
          <Text style={[styles.fallbackText, { fontSize: size * 0.32 }]}>
            {country.slice(0, 3).toUpperCase()}
          </Text>
        </View>
      );
    }
    return (
      <View
        style={[
          styles.fallback,
          { width: size, height: size, borderRadius: size / 2 },
        ]}
      />
    );
  }

  return (
    <View
      style={[
        styles.wrapper,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      <Image
        source={{ uri: url }}
        style={styles.image}
        contentFit="cover"
        transition={150}
        cachePolicy="memory-disk"
        onError={() => setHasError(true)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    overflow: 'hidden',
    backgroundColor: colors.surfaceAlt,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  fallback: {
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackText: {
    color: colors.textMuted,
    fontWeight: '700',
  },
});

export { getCountryCode };
