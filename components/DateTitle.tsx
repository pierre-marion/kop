import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/tokens';

export default function DateTitle() {
  return (
    <View style={styles.container}>
      <Text style={styles.date}>LUNDI 18 / 05</Text>
      <Text style={styles.title}>Ce soir.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 4,
  },
  date: {
    fontSize: 11,            // 9 → 11
    color: colors.textDim,
    letterSpacing: 1.5,
    fontWeight: '500',
    marginBottom: 4,
  },
  title: {
    fontSize: 26,            // 22 → 32 (un peu plus grand mais reste équilibré avec le nouveau header)
    fontWeight: '600',
    color: colors.text,
    letterSpacing: -1.2,
  },
});