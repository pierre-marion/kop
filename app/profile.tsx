import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { colors, radius } from '../theme/tokens';
import {
  userProfile,
  profilePreferences,
  profileAbout,
} from '../data/mockData';

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={10}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </Pressable>
          <Pressable hitSlop={10}>
            <Ionicons name="settings-outline" size={20} color={colors.text} />
          </Pressable>
        </View>

        {/* Bloc profil avec avatar */}
        <View style={styles.profileSection}>
          <LinearGradient
            colors={[colors.accent, '#88dd00']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.avatar}
          >
            <Ionicons name="person" size={36} color={colors.accentText} />
          </LinearGradient>

          <Text style={styles.username}>{userProfile.username}</Text>
          <Text style={styles.userSubtitle}>Crée un compte pour personnaliser</Text>

          <Pressable style={styles.loginButton}>
            <Text style={styles.loginButtonText}>SE CONNECTER</Text>
          </Pressable>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: colors.accent }]}>
              {userProfile.stats.teamsFollowed}
            </Text>
            <Text style={styles.statLabel}>SUIVIES</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{userProfile.stats.articlesRead}</Text>
            <Text style={styles.statLabel}>ARTICLES LUS</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{userProfile.stats.streak}</Text>
            <Text style={styles.statLabel}>SÉRIE</Text>
          </View>
        </View>

        {/* Mes équipes */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>MES ÉQUIPES</Text>
          <View style={styles.listCard}>
            {userProfile.followedTeams.map((team, index) => (
              <Pressable
                key={team.id}
                style={[
                  styles.listRow,
                  index > 0 && { borderTopWidth: 0.5, borderTopColor: colors.border },
                ]}
              >
                <LinearGradient
                  colors={team.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.teamLogo}
                >
                  <Text
                    style={[
                      styles.teamLogoText,
                      team.logoTextColor && { color: team.logoTextColor },
                    ]}
                  >
                    {team.code}
                  </Text>
                </LinearGradient>
                <Text style={styles.teamName}>{team.name}</Text>
                <Ionicons
                  name={team.notifEnabled ? 'notifications' : 'notifications-outline'}
                  size={15}
                  color={team.notifEnabled ? colors.accent : colors.textMuted}
                />
              </Pressable>
            ))}
            {/* Bouton ajouter */}
            <Pressable
              style={[
                styles.listRow,
                { borderTopWidth: 0.5, borderTopColor: colors.border },
              ]}
            >
              <Ionicons name="add" size={18} color={colors.accent} />
              <Text style={[styles.teamName, { color: colors.accent }]}>
                Ajouter une équipe
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Préférences */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>PRÉFÉRENCES</Text>
          <View style={styles.listCard}>
            {profilePreferences.map((pref, index) => (
              <Pressable
                key={pref.id}
                style={[
                  styles.listRow,
                  index > 0 && { borderTopWidth: 0.5, borderTopColor: colors.border },
                ]}
              >
                <Ionicons
                  name={pref.icon as any}
                  size={16}
                  color={colors.accent}
                />
                <Text style={styles.prefLabel}>{pref.label}</Text>
                <Text style={styles.prefValue}>{pref.value}</Text>
                <Ionicons name="chevron-forward" size={14} color={colors.textDim} />
              </Pressable>
            ))}
          </View>
        </View>

        {/* À propos */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>À PROPOS</Text>
          <View style={styles.listCard}>
            {profileAbout.map((item, index) => (
              <Pressable
                key={item.id}
                style={[
                  styles.listRow,
                  index > 0 && { borderTopWidth: 0.5, borderTopColor: colors.border },
                ]}
              >
                <Ionicons
                  name={item.icon as any}
                  size={16}
                  color={colors.textMuted}
                />
                <Text style={[styles.prefLabel, { flex: 1 }]}>{item.label}</Text>
                <Ionicons name="chevron-forward" size={14} color={colors.textDim} />
              </Pressable>
            ))}
          </View>
          <Text style={styles.version}>kop · v1.0.0</Text>
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
  // Section profil
  profileSection: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  username: {
    fontSize: 18,
    color: colors.text,
    fontWeight: '600',
    marginBottom: 4,
  },
  userSubtitle: {
    fontSize: 11,
    color: colors.textMuted,
    marginBottom: 14,
  },
  loginButton: {
    backgroundColor: colors.accent,
    paddingVertical: 9,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  loginButtonText: {
    fontSize: 12,
    color: colors.accentText,
    fontWeight: '700',
  },
  // Stats
  statsRow: {
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: 12,
    borderWidth: 0.5,
    borderColor: colors.border,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
  },
  statLabel: {
    fontSize: 9,
    color: colors.textMuted,
    letterSpacing: 0.5,
    marginTop: 2,
  },
  // Sections
  section: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sectionLabel: {
    fontSize: 10,
    color: colors.textDim,
    letterSpacing: 1,
    fontWeight: '500',
    marginBottom: 8,
  },
  listCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 0.5,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 11,
    paddingHorizontal: 12,
  },
  // Équipe
  teamLogo: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamLogoText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '600',
  },
  teamName: {
    fontSize: 12,
    color: colors.text,
    flex: 1,
    fontWeight: '500',
  },
  // Préférences
  prefLabel: {
    fontSize: 12,
    color: colors.text,
    flex: 1,
  },
  prefValue: {
    fontSize: 10,
    color: colors.textMuted,
  },
  version: {
    fontSize: 9,
    color: colors.textDim,
    textAlign: 'center',
    marginTop: 12,
  },
});