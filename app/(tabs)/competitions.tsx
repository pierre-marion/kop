import { View, Text } from 'react-native';
import { colors } from '../../theme/tokens';

export default function CompetitionsScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: colors.text, fontSize: 20 }}>Compétitions</Text>
    </View>
  );
}