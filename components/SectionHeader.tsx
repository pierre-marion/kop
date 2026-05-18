import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/tokens';

type Props = {
  title: string;
  action?: string;
};

export default function SectionHeader({ title, action = 'Voir tout' }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.action}>{action}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 6,
  },
  title: {
    fontSize: 11,
    color: colors.text,
    fontWeight: '500',
  },
  action: {
    fontSize: 10,
    color: colors.textDim,
  },
});