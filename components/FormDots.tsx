import { View, StyleSheet } from 'react-native';
import { colors } from '../theme/tokens';

type Props = {
  form: string[]; // ['W', 'D', 'L', 'W', 'W']
  size?: number;
};

export default function FormDots({ form, size = 5 }: Props) {
  const getColor = (result: string) => {
    if (result === 'W') return colors.accent;
    if (result === 'L') return '#EF4444';
    return colors.textMuted; // D = draw
  };

  return (
    <View style={styles.row}>
      {form.map((result, index) => (
        <View
          key={index}
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: getColor(result),
            marginHorizontal: 1.5,
          }}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});