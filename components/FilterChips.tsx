import { useState } from 'react';
import { ScrollView, Pressable, Text, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../theme/tokens';

type Filter = {
  id: string;
  label: string;
  count?: number;
  icon?: string | null;
};

type Props = {
  filters: Filter[];
  initialActiveId?: string;
};

export default function FilterChips({ filters, initialActiveId }: Props) {
  const [activeId, setActiveId] = useState(initialActiveId || filters[0]?.id);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scroll}
    >
      {filters.map((filter) => {
        const isActive = filter.id === activeId;
        return (
          <Pressable
            key={filter.id}
            onPress={() => setActiveId(filter.id)}
            style={[styles.chip, isActive ? styles.chipActive : styles.chipInactive]}
          >
            {filter.icon && (
              <Ionicons
                name={filter.icon as any}
                size={12}
                color={isActive ? colors.accentText : colors.accent}
              />
            )}
            <Text style={[styles.label, isActive ? styles.labelActive : styles.labelInactive]}>
              {filter.label}
              {filter.count !== undefined && ` · ${filter.count}`}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: 18,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 7,
    paddingHorizontal: 13,
    borderRadius: 20,
  },
  chipActive: {
    backgroundColor: colors.accent,
  },
  chipInactive: {
    backgroundColor: colors.surface,
    borderWidth: 0.5,
    borderColor: colors.border,
  },
  label: {
    fontSize: 11,
  },
  labelActive: {
    color: colors.accentText,
    fontWeight: '600',
  },
  labelInactive: {
    color: colors.text,
  },
});