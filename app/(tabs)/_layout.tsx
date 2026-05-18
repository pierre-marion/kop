import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/tokens';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.bg,
          borderTopColor: colors.border,
          borderTopWidth: 0.5,
          height: 70,
          paddingTop: 8,
          paddingBottom: 12,
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Accueil',
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="actu"
        options={{
          title: 'Actu',
          tabBarIcon: ({ color, size }) => <Ionicons name="newspaper" size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="mercato"
        options={{
          title: 'Mercato',
          tabBarIcon: ({ color, size }) => <Ionicons name="swap-horizontal" size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="competitions"
        options={{
          title: 'Compétitions',
          tabBarIcon: ({ color, size }) => <Ionicons name="trophy" size={20} color={color} />,
        }}
      />
    </Tabs>
  );
}