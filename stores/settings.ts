import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuthStore } from './auth';

export type ThemeMode = 'dark' | 'light' | 'auto';
export type Language = 'fr' | 'en';

type SettingsState = {
  theme: ThemeMode;
  language: Language;
  notifLiveMatches: boolean;
  notifGoals: boolean;
  notifNews: boolean;
  notifMatchReminders: boolean;

  setTheme: (mode: ThemeMode) => Promise<void>;
  setLanguage: (lang: Language) => Promise<void>;
  setNotif: (key: 'notifLiveMatches' | 'notifGoals' | 'notifNews' | 'notifMatchReminders', value: boolean) => Promise<void>;
  hydrateFromProfile: () => Promise<void>;
};

async function syncToProfile(patch: Record<string, unknown>) {
  if (!isSupabaseConfigured) return;
  const user = useAuthStore.getState().user;
  if (!user) return;
  await supabase.from('profiles').update(patch).eq('id', user.id);
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'auto',
      language: 'fr',
      notifLiveMatches: true,
      notifGoals: true,
      notifNews: false,
      notifMatchReminders: false,

      setTheme: async (mode) => {
        set({ theme: mode });
        await syncToProfile({ theme: mode });
      },

      setLanguage: async (lang) => {
        set({ language: lang });
        await syncToProfile({ language: lang });
      },

      setNotif: async (key, value) => {
        set({ [key]: value } as Partial<SettingsState>);
        const map = {
          notifLiveMatches: 'notif_live_matches',
          notifGoals: 'notif_goals',
          notifNews: 'notif_news',
          notifMatchReminders: 'notif_match_reminders',
        } as const;
        await syncToProfile({ [map[key]]: value });
      },

      hydrateFromProfile: async () => {
        const profile = useAuthStore.getState().profile;
        if (!profile) return;
        set({
          theme: profile.theme,
          language: profile.language,
          notifLiveMatches: profile.notif_live_matches,
          notifGoals: profile.notif_goals,
          notifNews: profile.notif_news,
        });
      },
    }),
    {
      name: 'kop-settings',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
