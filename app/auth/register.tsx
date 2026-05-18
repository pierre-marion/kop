import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, Link } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { colors, radius } from '../../theme/tokens';
import { useAuthStore } from '../../stores/auth';

export default function RegisterScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const signUp = useAuthStore((s) => s.signUp);
  const loading = useAuthStore((s) => s.loading);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    if (!email.trim() || !password) {
      setError(t('auth.errorRequired'));
      return;
    }
    if (password !== confirm) {
      setError(t('auth.errorPasswordMatch'));
      return;
    }
    const { error } = await signUp(email.trim(), password);
    if (error) {
      setError(error);
    } else {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => router.replace('/auth/login')} hitSlop={12}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </Pressable>
        </View>
        <View style={styles.successBox}>
          <View style={styles.successIcon}>
            <Ionicons name="mail-outline" size={36} color={colors.accent} />
          </View>
          <Text style={styles.successTitle}>Presque fini !</Text>
          <Text style={styles.successText}>{t('auth.checkEmail')}</Text>
          <Pressable
            style={styles.submitBtn}
            onPress={() => router.replace('/auth/login')}
          >
            <Text style={styles.submitText}>{t('auth.loginAction')}</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </Pressable>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{t('auth.createAccount')}</Text>
          <Text style={styles.subtitle}>Suis tes équipes, ne rate aucun match.</Text>

          <View style={styles.field}>
            <Text style={styles.label}>{t('auth.email')}</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              placeholderTextColor={colors.textDim}
              placeholder="toi@exemple.com"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>{t('auth.password')}</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="new-password"
              placeholderTextColor={colors.textDim}
              placeholder="••••••••"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>{t('auth.passwordConfirm')}</Text>
            <TextInput
              style={styles.input}
              value={confirm}
              onChangeText={setConfirm}
              secureTextEntry
              autoComplete="new-password"
              placeholderTextColor={colors.textDim}
              placeholder="••••••••"
            />
          </View>

          {error && (
            <View style={styles.errorBox}>
              <Ionicons name="warning-outline" size={14} color={colors.live} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <Pressable
            style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color={colors.accentText} />
            ) : (
              <Text style={styles.submitText}>{t('auth.registerAction')}</Text>
            )}
          </Pressable>

          <View style={styles.footer}>
            <Text style={styles.footerText}>{t('auth.haveAccount')} </Text>
            <Link href="/auth/login" replace>
              <Text style={styles.footerLink}>{t('auth.loginAction')}</Text>
            </Link>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 8 },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 20 },
  title: { fontSize: 32, color: colors.text, fontWeight: '600', letterSpacing: -1, marginBottom: 8 },
  subtitle: { fontSize: 13, color: colors.textMuted, marginBottom: 28 },
  field: { marginBottom: 14 },
  label: { fontSize: 10, color: colors.textDim, letterSpacing: 0.8, marginBottom: 8, fontWeight: '600' },
  input: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 0.5,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 14,
    color: colors.text,
    fontSize: 14,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(239,68,68,0.1)',
    borderRadius: radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 14,
  },
  errorText: { fontSize: 11, color: colors.live, flex: 1 },
  submitBtn: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitBtnDisabled: { opacity: 0.5 },
  submitText: { color: colors.accentText, fontWeight: '700', fontSize: 14, letterSpacing: 0.3 },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  footerText: { fontSize: 12, color: colors.textMuted },
  footerLink: { fontSize: 12, color: colors.accent, fontWeight: '600' },
  successBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    gap: 14,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(204,255,0,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  successTitle: { fontSize: 22, color: colors.text, fontWeight: '600', letterSpacing: -0.5 },
  successText: { fontSize: 13, color: colors.textMuted, textAlign: 'center', marginBottom: 14 },
});
