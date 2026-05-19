import { useEffect } from 'react';
import { useMatchesAroundToday } from './useFootballData';
import { useFavoritesStore } from '../stores/favorites';
import { useSettingsStore } from '../stores/settings';
import {
  requestNotificationPermission,
  cancelAllMatchReminders,
  scheduleMatchReminders,
} from '../lib/notifications';

/**
 * Planifie automatiquement les rappels (2h, 30min, kickoff) pour chaque match
 * impliquant une équipe favorite.
 *
 * Se relance à chaque changement :
 * - de la liste des favoris
 * - du toggle notifMatchReminders
 * - des matchs (fenêtre ±10 jours)
 */
export function useFavoriteMatchAlerts() {
  const favorites = useFavoritesStore((s) => s.items);
  const enabled = useSettingsStore((s) => s.notifMatchReminders);
  const { data: matches } = useMatchesAroundToday();

  useEffect(() => {
    let cancelled = false;

    async function sync() {
      // Toujours nettoyer d'abord pour éviter les doublons / orphelins
      await cancelAllMatchReminders();
      if (cancelled) return;

      if (!enabled) return;

      const favTeamIds = new Set(
        favorites.filter((f) => f.kind === 'team').map((f) => f.entityId)
      );
      if (favTeamIds.size === 0 || !matches) return;

      // Permission à demander seulement quand il y a un vrai besoin
      const granted = await requestNotificationPermission();
      if (!granted || cancelled) return;

      const FINISHED_OR_LIVE = new Set(['IN_PLAY', 'PAUSED', 'FINISHED', 'POSTPONED', 'SUSPENDED', 'CANCELLED']);
      const relevant = matches.filter(
        (m) =>
          !FINISHED_OR_LIVE.has(m.status) &&
          new Date(m.utcDate).getTime() > Date.now() &&
          (favTeamIds.has(String(m.homeTeam.id)) || favTeamIds.has(String(m.awayTeam.id)))
      );

      for (const m of relevant) {
        if (cancelled) return;
        await scheduleMatchReminders(m);
      }
    }

    sync();
    return () => {
      cancelled = true;
    };
  }, [enabled, favorites, matches]);
}
