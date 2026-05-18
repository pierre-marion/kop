import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/tokens';

export default function DateTitle() {
  // Plus tard on calculera dynamiquement
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
    paddingTop: 14,
    paddingBottom: 4,
  },
  date: {
    fontSize: 9,
    color: colors.textDim,
    letterSpacing: 1.5,
    fontWeight: '500',
    marginBottom: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: '500',
    color: colors.text,
    letterSpacing: -1,
  },
});