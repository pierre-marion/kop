import { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors } from '../theme/tokens';

type Tab = {
  id: string;
  label: string;
};

type Props = {
  tabs: Tab[];
  initialActiveId?: string;
  onChange?: (id: string) => void;
};

export default function InnerTabs({ tabs, initialActiveId, onChange }: Props) {
  const [activeId, setActiveId] = useState(initialActiveId || tabs[0]?.id);

  const handlePress = (id: string) => {
    setActiveId(id);
    onChange?.(id);
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeId;
          return (
            <Pressable
              key={tab.id}
              onPress={() => handlePress(tab.id)}
              style={[styles.tab, isActive && styles.tabActive]}
            >
              <Text style={[styles.label, isActive ? styles.labelActive : styles.labelInactive]}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 0.5,
    borderBottomColor: colors.borderSoft,
    paddingVertical: 10,
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
    alignItems: 'center',
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: colors.accent,
  },
  label: {
    fontSize: 11,
  },
  labelActive: {
    color: colors.accent,
    fontWeight: '600',
  },
  labelInactive: {
    color: colors.textMuted,
  },
});