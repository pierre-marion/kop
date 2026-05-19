import { ScrollView, View, Text, Pressable, StyleSheet, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { colors, radius } from '../theme/tokens';
import { useAuthStore } from '../stores/auth';
import { useSettingsStore, type ThemeMode, type Language } from '../stores/settings';
import { useFavoritesStore } from '../stores/favorites';
import i18n from '../lib/i18n';

export default function ProfileScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  const user = useAuthStore((s) => s.user);
  const profile = useAuthStore((s) => s.profile);
  const signOut = useAuthStore((s) => s.signOut);

  const theme = useSettingsStore((s) => s.theme);
  const setTheme = useSettingsStore((s) => s.setTheme);
  const language = useSettingsStore((s) => s.language);
  const setLanguage = useSettingsStore((s) => s.setLanguage);
  const notifLive = useSettingsStore((s) => s.notifLiveMatches);
  const notifGoals = useSettingsStore((s) => s.notifGoals);
  const notifNews = useSettingsStore((s) => s.notifNews);
  const notifMatchReminders = useSettingsStore((s) => s.notifMatchReminders);
  const setNotif = useSettingsStore((s) => s.setNotif);

  const favorites = useFavoritesStore((s) => s.items);

  // Garde i18n synchro avec le store
  useEffect(() => {
    if (i18n.language !== language) i18n.changeLanguage(language);
  }, [language]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={10}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </Pressable>
          <Text style={styles.headerTitle}>{t('settings.title')}</Text>
          <View style={{ width: 22 }} />
        </View>

        {/* Profil */}
        <View style={styles.profileSection}>
          <LinearGradient
            colors={[colors.accent, '#88dd00']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.avatar}
          >
            <Ionicons name="person" size={36} color={colors.accentText} />
          </LinearGradient>

          {user ? (
            <>
              <Text style={styles.username}>{profile?.username || user.email?.split('@')[0]}</Text>
              <Text style={styles.email}>{user.email}</Text>
            </>
          ) : (
            <>
              <Text style={styles.username}>Invité</Text>
              <Text style={styles.email}>Connecte-toi pour synchroniser tes favoris</Text>
              <View style={{ flexDirection: 'row', gap: 8, marginTop: 14 }}>
                <Pressable
                  style={styles.loginBtn}
                  onPress={() => router.push('/auth/login')}
                >
                  <Text style={styles.loginBtnText}>{t('auth.login')}</Text>
                </Pressable>
                <Pressable
                  style={styles.registerBtn}
                  onPress={() => router.push('/auth/register')}
                >
                  <Text style={styles.registerBtnText}>{t('auth.register')}</Text>
                </Pressable>
              </View>
            </>
          )}
        </View>

        {/* Favoris */}
        {favorites.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('settings.favorites').toUpperCase()}</Text>
            <View style={styles.card}>
              <View style={styles.row}>
                <Ionicons name="star" size={18} color={colors.accent} />
                <Text style={styles.rowLabel}>{favorites.length} suivi{favorites.length > 1 ? 's' : ''}</Text>
                <Text style={styles.rowMeta}>
                  {favorites.filter((f) => f.kind === 'team').length} équipes ·{' '}
                  {favorites.filter((f) => f.kind === 'competition').length} compétitions
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Apparence */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.appearance').toUpperCase()}</Text>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>{t('settings.theme')}</Text>
            <View style={styles.choiceRow}>
              <ChoiceButton
                label={t('settings.themeAuto')}
                icon="phone-portrait-outline"
                active={theme === 'auto'}
                onPress={() => setTheme('auto')}
              />
              <ChoiceButton
                label={t('settings.themeDark')}
                icon="moon-outline"
                active={theme === 'dark'}
                onPress={() => setTheme('dark')}
              />
              <ChoiceButton
                label={t('settings.themeLight')}
                icon="sunny-outline"
                active={theme === 'light'}
                onPress={() => setTheme('light')}
              />
            </View>
            <Text style={styles.cardHint}>
              Le thème clair sera appliqué progressivement à toutes les pages.
            </Text>
          </View>

          <View style={[styles.card, { marginTop: 10 }]}>
            <Text style={styles.cardLabel}>{t('settings.language')}</Text>
            <View style={styles.choiceRow}>
              <ChoiceButton
                label="Français"
                active={language === 'fr'}
                onPress={() => setLanguage('fr')}
              />
              <ChoiceButton
                label="English"
                active={language === 'en'}
                onPress={() => setLanguage('en')}
              />
            </View>
          </View>
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.notifications').toUpperCase()}</Text>
          <View style={styles.card}>
            <NotifRow
              label={t('settings.notifLive')}
              icon="radio-outline"
              value={notifLive}
              onChange={(v) => setNotif('notifLiveMatches', v)}
            />
            <NotifRow
              label={t('settings.notifGoals')}
              icon="football-outline"
              value={notifGoals}
              onChange={(v) => setNotif('notifGoals', v)}
            />
            <NotifRow
              label={t('settings.notifNews')}
              icon="newspaper-outline"
              value={notifNews}
              onChange={(v) => setNotif('notifNews', v)}
            />
            <NotifRow
              label="Rappel matchs favoris"
              icon="alarm-outline"
              value={notifMatchReminders}
              onChange={(v) => setNotif('notifMatchReminders', v)}
              isLast
            />
          </View>
        </View>

        {/* Compte */}
        {user && (
          <View style={styles.section}>
            <Pressable
              style={styles.logoutBtn}
              onPress={async () => {
                await signOut();
                router.replace('/');
              }}
            >
              <Ionicons name="log-out-outline" size={18} color={colors.live} />
              <Text style={styles.logoutText}>{t('auth.logout')}</Text>
            </Pressable>
          </View>
        )}

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function ChoiceButton({ label, icon, active, onPress }: {
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.choiceBtn, active && styles.choiceBtnActive]}
    >
      {icon && (
        <Ionicons
          name={icon}
          size={14}
          color={active ? colors.accent : colors.textMuted}
        />
      )}
      <Text style={[styles.choiceText, active && styles.choiceTextActive]}>{label}</Text>
    </Pressable>
  );
}

function NotifRow({ label, icon, value, onChange, isLast }: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  value: boolean;
  onChange: (v: boolean) => void;
  isLast?: boolean;
}) {
  return (
    <View style={[styles.notifRow, !isLast && { borderBottomWidth: 0.5, borderBottomColor: colors.border }]}>
      <Ionicons name={icon} size={16} color={colors.textMuted} />
      <Text style={styles.notifLabel}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: colors.surfaceAlt, true: 'rgba(204,255,0,0.4)' }}
        thumbColor={value ? colors.accent : colors.textDim}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
  },
  headerTitle: { fontSize: 14, color: colors.text, fontWeight: '600' },
  // Profil
  profileSection: { alignItems: 'center', paddingVertical: 22 },
  avatar: { width: 84, height: 84, borderRadius: 42, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  username: { fontSize: 22, color: colors.text, fontWeight: '600', letterSpacing: -0.5 },
  email: { fontSize: 11, color: colors.textMuted, marginTop: 4 },
  loginBtn: { backgroundColor: colors.accent, paddingVertical: 10, paddingHorizontal: 20, borderRadius: radius.pill },
  loginBtnText: { color: colors.accentText, fontWeight: '700', fontSize: 12, letterSpacing: 0.3 },
  registerBtn: { borderWidth: 1, borderColor: colors.border, paddingVertical: 10, paddingHorizontal: 20, borderRadius: radius.pill },
  registerBtnText: { color: colors.text, fontWeight: '600', fontSize: 12, letterSpacing: 0.3 },
  // Section
  section: { paddingHorizontal: 16, paddingTop: 14 },
  sectionTitle: { fontSize: 9, color: colors.textDim, letterSpacing: 1, fontWeight: '600', marginBottom: 8, marginLeft: 4 },
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 0.5, borderColor: colors.border, padding: 14 },
  cardLabel: { fontSize: 12, color: colors.text, fontWeight: '500', marginBottom: 10 },
  cardHint: { fontSize: 10, color: colors.textDim, marginTop: 8, fontStyle: 'italic' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  rowLabel: { fontSize: 13, color: colors.text, fontWeight: '500', flex: 1 },
  rowMeta: { fontSize: 10, color: colors.textMuted },
  // Choices
  choiceRow: { flexDirection: 'row', gap: 6 },
  choiceBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 10,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.sm,
    borderWidth: 0.5,
    borderColor: colors.border,
  },
  choiceBtnActive: { backgroundColor: 'rgba(204,255,0,0.12)', borderColor: colors.accent },
  choiceText: { fontSize: 11, color: colors.textMuted, fontWeight: '500' },
  choiceTextActive: { color: colors.accent, fontWeight: '600' },
  // Notif
  notifRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
  notifLabel: { fontSize: 12, color: colors.text, fontWeight: '500', flex: 1 },
  // Logout
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 0.5,
    borderColor: colors.border,
  },
  logoutText: { fontSize: 13, color: colors.live, fontWeight: '600' },
});
