import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors } from '../theme/tokens';

type Props = {
  title: string;
  action?: string;
  onPress?: () => void;
};

export default function SectionHeader({ title, action = 'Voir tout', onPress }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {onPress ? (
        <Pressable onPress={onPress} hitSlop={8}>
          <Text style={[styles.action, styles.actionPressable]}>{action}</Text>
        </Pressable>
      ) : null}
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
  actionPressable: {
    color: colors.accent,
  },
});
