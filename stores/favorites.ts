import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuthStore } from './auth';

export type FavoriteKind = 'team' | 'competition' | 'player';

export type FavoriteItem = {
  kind: FavoriteKind;
  entityId: string;
  displayName: string;
  meta?: Record<string, unknown>;
};

type FavoritesState = {
  items: FavoriteItem[];

  isFavorited: (kind: FavoriteKind, entityId: string) => boolean;
  toggle: (item: FavoriteItem) => Promise<void>;
  hydrateFromCloud: () => Promise<void>;
};

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      items: [],

      isFavorited: (kind, entityId) =>
        get().items.some((i) => i.kind === kind && i.entityId === entityId),

      toggle: async (item) => {
        const exists = get().isFavorited(item.kind, item.entityId);
        const next = exists
          ? get().items.filter((i) => !(i.kind === item.kind && i.entityId === item.entityId))
          : [...get().items, item];
        set({ items: next });

        // Sync cloud si connecté
        if (isSupabaseConfigured) {
          const user = useAuthStore.getState().user;
          if (user) {
            if (exists) {
              await supabase
                .from('favorites')
                .delete()
                .eq('user_id', user.id)
                .eq('kind', item.kind)
                .eq('entity_id', item.entityId);
            } else {
              await supabase.from('favorites').upsert({
                user_id: user.id,
                kind: item.kind,
                entity_id: item.entityId,
                display_name: item.displayName,
                meta: item.meta || {},
              });
            }
          }
        }
      },

      hydrateFromCloud: async () => {
        if (!isSupabaseConfigured) return;
        const user = useAuthStore.getState().user;
        if (!user) return;

        const { data, error } = await supabase
          .from('favorites')
          .select('*')
          .eq('user_id', user.id);

        if (error || !data) return;

        const cloudItems: FavoriteItem[] = data.map((d) => ({
          kind: d.kind as FavoriteKind,
          entityId: d.entity_id,
          displayName: d.display_name || '',
          meta: d.meta || {},
        }));

        // Merge cloud avec local (cloud prioritaire)
        const localItems = get().items;
        const merged: FavoriteItem[] = [...cloudItems];
        for (const local of localItems) {
          const inCloud = cloudItems.some(
            (c) => c.kind === local.kind && c.entityId === local.entityId
          );
          if (!inCloud) {
            merged.push(local);
            // Pousser dans le cloud
            await supabase.from('favorites').upsert({
              user_id: user.id,
              kind: local.kind,
              entity_id: local.entityId,
              display_name: local.displayName,
              meta: local.meta || {},
            });
          }
        }
        set({ items: merged });
      },
    }),
    {
      name: 'kop-favorites',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
