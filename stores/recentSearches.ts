import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MAX_RECENT = 8;

type RecentSearchesState = {
  items: string[];
  add: (query: string) => void;
  remove: (query: string) => void;
  clear: () => void;
};

export const useRecentSearchesStore = create<RecentSearchesState>()(
  persist(
    (set, get) => ({
      items: [],

      add: (query) => {
        const trimmed = query.trim();
        if (!trimmed) return;
        const filtered = get().items.filter((q) => q.toLowerCase() !== trimmed.toLowerCase());
        set({ items: [trimmed, ...filtered].slice(0, MAX_RECENT) });
      },

      remove: (query) => {
        set({ items: get().items.filter((q) => q !== query) });
      },

      clear: () => set({ items: [] }),
    }),
    {
      name: 'kop-recent-searches',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
