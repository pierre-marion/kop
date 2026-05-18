import { useState } from 'react';
import { ScrollView, View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { colors, radius } from '../theme/tokens';
import FilterChips from '../components/FilterChips';
import {
  searchFilters,
  searchResults,
  recentSearches,
  trendingSearches,
} from '../data/mockData';

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('PSG');

  const hasQuery = query.length > 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header avec flèche retour */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Recherche</Text>
      </View>

      {/* Barre de recherche */}
      <View style={styles.searchBarWrapper}>
        <View style={[styles.searchBar, hasQuery && styles.searchBarActive]}>
          <Ionicons
            name="search"
            size={16}
            color={hasQuery ? colors.accent : colors.textMuted}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Équipes, joueurs, compétitions..."
            placeholderTextColor={colors.textDim}
            value={query}
            onChangeText={setQuery}
            autoFocus
          />
          {hasQuery && (
            <Pressable onPress={() => setQuery('')} hitSlop={10}>
              <Ionicons name="close-circle" size={16} color={colors.textDim} />
            </Pressable>
          )}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Filtres */}
        <View style={styles.filtersContainer}>
          <FilterChips filters={searchFilters} />
        </View>

        {/* Résultats si query */}
        {hasQuery && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>{searchResults.length} RÉSULTATS</Text>
            {searchResults.map((result) => (
              <Pressable key={result.id} style={styles.resultCard}>
                {result.type === 'team' && result.gradient ? (
                  <LinearGradient
                    colors={result.gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.resultAvatar}
                  >
                    <Text style={styles.resultTeamCode}>{result.code}</Text>
                  </LinearGradient>
                ) : (
                  <View style={[styles.resultAvatar, styles.resultAvatarPerson]}>
                    <Ionicons name="person" size={18} color="rgba(255,255,255,0.6)" />
                  </View>
                )}
                <View style={styles.resultContent}>
                  <Text style={styles.resultName}>{result.name}</Text>
                  <Text style={styles.resultSubtitle}>{result.subtitle}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={colors.textDim} />
              </Pressable>
            ))}
          </View>
        )}

        {/* Recherches récentes */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>RECHERCHES RÉCENTES</Text>
          <View style={styles.recentChips}>
            {recentSearches.map((search) => (
              <Pressable key={search} style={styles.recentChip}>
                <Ionicons name="time-outline" size={11} color={colors.textDim} />
                <Text style={styles.recentChipText}>{search}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Tendances */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>TENDANCES</Text>
          <View style={styles.trendingCard}>
            {trendingSearches.map((item, index) => (
              <Pressable
                key={item.rank}
                style={[
                  styles.trendingRow,
                  index > 0 && { borderTopWidth: 0.5, borderTopColor: colors.border },
                ]}
              >
                <Text
                  style={[
                    styles.trendingRank,
                    item.rank === 1 && { color: colors.accent },
                  ]}
                >
                  {item.rank}
                </Text>
                <Ionicons name="trending-up" size={13} color={colors.accent} />
                <Text style={styles.trendingQuery}>{item.query}</Text>
                <Text style={styles.trendingVolume}>{item.volume}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
  },
  searchBarWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchBarActive: {
    borderColor: colors.accent,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: colors.text,
    padding: 0,
  },
  filtersContainer: {
    paddingVertical: 4,
    paddingBottom: 12,
  },
  section: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  sectionLabel: {
    fontSize: 10,
    color: colors.textDim,
    letterSpacing: 1,
    fontWeight: '500',
    marginBottom: 8,
  },
  // Résultats
  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: 12,
    marginBottom: 6,
    borderWidth: 0.5,
    borderColor: colors.border,
  },
  resultAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultAvatarPerson: {
    backgroundColor: '#333',
  },
  resultTeamCode: {
    fontSize: 11,
    color: 'white',
    fontWeight: '600',
  },
  resultContent: {
    flex: 1,
  },
  resultName: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '600',
  },
  resultSubtitle: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 1,
  },
  // Recherches récentes
  recentChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  recentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.surface,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: colors.border,
  },
  recentChipText: {
    fontSize: 10,
    color: colors.text,
  },
  // Tendances
  trendingCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 0.5,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  trendingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  trendingRank: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600',
    width: 14,
  },
  trendingQuery: {
    fontSize: 12,
    color: colors.text,
    flex: 1,
  },
  trendingVolume: {
    fontSize: 9,
    color: colors.textDim,
  },
});