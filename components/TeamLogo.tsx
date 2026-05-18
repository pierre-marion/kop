import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { colors } from '../theme/tokens';

type Props = {
  /** URL du logo (depuis l'API, ex: match.homeTeam.crest) */
  url?: string | null;
  /** Code 3 lettres affiché en fallback (ex: "PSG") */
  tla: string;
  /** Couleur de fond du cercle fallback */
  fallbackBg?: string;
  /** Couleur du texte fallback */
  fallbackText?: string;
  /** Taille en px */
  size?: number;
};
export default function TeamLogo({
  url,
  tla,
  fallbackBg = colors.surfaceAlt,
  fallbackText = colors.text,
  size = 44,
}: Props) {
  const [hasError, setHasError] = useState(false);

  // Détecte si c'est un SVG (qu'on ne peut pas afficher avec expo-image directement)
  const isSvg = url?.toLowerCase().endsWith('.svg');

  // Pas d'URL, erreur, ou SVG → fallback
  if (!url || hasError || isSvg) {
    return (
      <View
        style={[
          styles.fallback,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: fallbackBg,
          },
        ]}
      >
        <Text
          style={[
            styles.fallbackText,
            { color: fallbackText, fontSize: size * 0.28 },
          ]}
        >
          {tla}
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}
    >
      <Image
        source={{ uri: url }}
        style={styles.image}
        contentFit="contain"
        transition={200}
        cachePolicy="memory-disk"
        onError={() => setHasError(true)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  image: {
    width: '85%',
    height: '85%',
  },
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackText: {
    fontWeight: '700',
  },
});