import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { colors, radius } from '../theme/tokens';
import FilterChips from '../components/FilterChips';
import NotificationItem from '../components/NotificationItem';
import { notifFilters, notifications, notifStats } from '../data/mockData';

export default function NotificationsScreen() {
  const router = useRouter();

  // Séparer les notifs par section
  const todayNotifs = notifications.filter((n) => n.section === 'today');
  const yesterdayNotifs = notifications.filter((n) => n.section === 'yesterday');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Pressable onPress={() => router.back()} hitSlop={10}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </Pressable>
          <Text style={styles.headerTitle}>Notifications</Text>
        </View>
        <Pressable hitSlop={10}>
          <Text style={styles.headerAction}>Tout lire</Text>
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Titre éditorial */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>{notifStats.newCount} nouvelles</Text>
          <Text style={styles.subtitle}>
            {notifStats.totalUnread} NON LUES AU TOTAL
          </Text>
        </View>

        {/* Filtres */}
        <View style={styles.filtersContainer}>
          <FilterChips filters={notifFilters} />
        </View>

        {/* AUJOURD'HUI */}
        {todayNotifs.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <View style={styles.activeDot} />
              <Text style={styles.sectionTitle}>AUJOURD'HUI</Text>
            </View>
            <View style={styles.list}>
              {todayNotifs.map((notif) => (
                <NotificationItem
                  key={notif.id}
                  type={notif.type as any}
                  label={notif.label}
                  title={notif.title}
                  time={notif.time}
                  isUnread={notif.isUnread}
                />
              ))}
            </View>
          </>
        )}

        {/* HIER */}
        {yesterdayNotifs.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitleMuted}>HIER</Text>
            </View>
            <View style={styles.list}>
              {yesterdayNotifs.map((notif) => (
                <NotificationItem
                  key={notif.id}
                  type={notif.type as any}
                  label={notif.label}
                  title={notif.title}
                  time={notif.time}
                  isUnread={notif.isUnread}
                />
              ))}
            </View>
          </>
        )}

        {/* Card "Gérer mes alertes" en bas */}
        <View style={styles.manageWrapper}>
          <Pressable>
            <LinearGradient
              colors={['rgba(204,255,0,0.08)', colors.surface]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.manageCard}
            >
              <Ionicons name="settings" size={22} color={colors.accent} />
              <View style={styles.manageContent}>
                <Text style={styles.manageTitle}>Gérer mes alertes</Text>
                <Text style={styles.manageSubtitle}>
                  Personnalise tes notifications par équipe
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={14} color={colors.textDim} />
            </LinearGradient>
          </Pressable>
        </View>

        <View style={{ height: 30 }} />
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  headerTitle: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
  },
  headerAction: {
    fontSize: 11,
    color: colors.accent,
    fontWeight: '600',
  },
  titleSection: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: colors.text,
    letterSpacing: -1.2,
    lineHeight: 30,
  },
  subtitle: {
    fontSize: 11,
    color: colors.textDim,
    letterSpacing: 1,
    fontWeight: '500',
    marginTop: 4,
  },
  filtersContainer: {
    paddingVertical: 4,
    paddingBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingBottom: 8,
    paddingTop: 4,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent,
  },
  sectionTitle: {
    fontSize: 10,
    color: colors.accent,
    letterSpacing: 1,
    fontWeight: '600',
  },
  sectionTitleMuted: {
    fontSize: 10,
    color: colors.textDim,
    letterSpacing: 1,
    fontWeight: '600',
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  manageWrapper: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  manageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: radius.md,
    borderWidth: 0.5,
    borderColor: colors.border,
  },
  manageContent: {
    flex: 1,
  },
  manageTitle: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '600',
    marginBottom: 2,
  },
  manageSubtitle: {
    fontSize: 10,
    color: colors.textMuted,
  },
});