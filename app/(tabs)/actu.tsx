import { View, Text } from 'react-native';
import { colors } from '../../theme/tokens';

export default function ActuScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: colors.text, fontSize: 20 }}>Actu</Text>
    </View>
  );
}