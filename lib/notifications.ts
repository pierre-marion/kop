import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import type { Match } from '../services/footballApi';

const MATCH_NOTIF_PREFIX = 'kop-match-';

/** Configuration globale : afficher les notifs même quand l'app est au 1er plan */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/** Demande la permission iOS/Android. Retourne true si accordée. */
export async function requestNotificationPermission(): Promise<boolean> {
  // Android : créer un canal par défaut
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('match-reminders', {
      name: 'Rappels matchs',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
    });
  }

  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

/** Annule toutes les notifs planifiées par Kop (matchs). */
export async function cancelAllMatchReminders(): Promise<void> {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  await Promise.all(
    scheduled
      .filter((n) => n.identifier.startsWith(MATCH_NOTIF_PREFIX))
      .map((n) => Notifications.cancelScheduledNotificationAsync(n.identifier))
  );
}

type ReminderConfig = {
  /** Minutes avant le coup d'envoi. 0 = pile à l'heure du match. */
  minutesBefore: number;
  /** Suffixe d'identifiant pour pouvoir dédupliquer. */
  tag: string;
  /** Construit titre + body. */
  build: (match: Match) => { title: string; body: string };
};

const REMINDERS: ReminderConfig[] = [
  {
    minutesBefore: 120,
    tag: '2h',
    build: (m) => ({
      title: `${m.homeTeam.shortName} · ${m.awayTeam.shortName} dans 2h`,
      body: `${m.competition.name} — coup d'envoi à ${formatTime(m.utcDate)}`,
    }),
  },
  {
    minutesBefore: 30,
    tag: '30m',
    build: (m) => ({
      title: `${m.homeTeam.shortName} · ${m.awayTeam.shortName} dans 30 min`,
      body: `${m.competition.name} — ça commence à ${formatTime(m.utcDate)}`,
    }),
  },
  {
    minutesBefore: 0,
    tag: 'kickoff',
    build: (m) => ({
      title: `⚽ ${m.homeTeam.shortName} · ${m.awayTeam.shortName} commence !`,
      body: m.competition.name,
    }),
  },
];

/** Planifie les 3 rappels pour 1 match (2h, 30min, kickoff). Skippe ceux dans le passé. */
export async function scheduleMatchReminders(match: Match): Promise<void> {
  const kickoff = new Date(match.utcDate).getTime();
  const now = Date.now();

  for (const cfg of REMINDERS) {
    const triggerAt = kickoff - cfg.minutesBefore * 60_000;
    if (triggerAt <= now + 5_000) continue; // skip si déjà passé / trop proche

    const { title, body } = cfg.build(match);
    await Notifications.scheduleNotificationAsync({
      identifier: `${MATCH_NOTIF_PREFIX}${match.id}-${cfg.tag}`,
      content: {
        title,
        body,
        data: { matchId: match.id, kind: 'match-reminder' },
      },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: new Date(triggerAt) } as any,
    });
  }
}

function formatTime(utcDate: string): string {
  return new Date(utcDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}
