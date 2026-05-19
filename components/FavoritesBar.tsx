import { ScrollView, View, Pressable, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useFavoritesStore, type FavoriteItem } from '../stores/favorites';
import TeamLogo from './TeamLogo';
import { colors } from '../theme/tokens';

const BUBBLE_SIZE = 52;
const LOGO_SIZE = 36;

export default function FavoritesBar() {
  const router = useRouter();
  const items = useFavoritesStore((s) => s.items);

  const teams = items.filter((i) => i.kind === 'team');
  if (teams.length === 0) return null;

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>FAVORIS</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {teams.map((fav) => (
          <FavoriteBubble
            key={fav.entityId}
            item={fav}
            onPress={() => router.push(`/team/${fav.entityId}` as any)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

function FavoriteBubble({ item, onPress }: { item: FavoriteItem; onPress: () => void }) {
  const meta = item.meta as { crest?: string; tla?: string } | undefined;
  const tla = meta?.tla || item.displayName.slice(0, 3).toUpperCase();

  return (
    <Pressable onPress={onPress} hitSlop={6} style={styles.bubbleWrap}>
      <View style={styles.bubble}>
        <TeamLogo url={meta?.crest} tla={tla} size={LOGO_SIZE} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingTop: 14,
  },
  label: {
    fontSize: 10,
    color: colors.textDim,
    fontWeight: '500',
    letterSpacing: 1.5,
    paddingHorizontal: 18,
    paddingBottom: 8,
  },
  container: {
    paddingHorizontal: 18,
    paddingBottom: 12,
    gap: 12,
  },
  bubbleWrap: {
    alignItems: 'center',
  },
  bubble: {
    width: BUBBLE_SIZE,
    height: BUBBLE_SIZE,
    borderRadius: BUBBLE_SIZE / 2,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
