import { useState } from 'react';
import { ScrollView, Pressable, Text, StyleSheet } from 'react-native';
import { colors, radius } from '../theme/tokens';

type Filter = {
  id: string;
  label: string;
  count?: number;
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
    gap: 6,
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: radius.sm,
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
    letterSpacing: 0.3,
  },
  labelActive: {
    color: colors.accentText,
    fontWeight: '600',
  },
  labelInactive: {
    color: colors.text,
  },
});