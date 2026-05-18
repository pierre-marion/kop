import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/tokens';

type Props = {
  title: string;
  subtitle?: string;
  liveBadge?: string; // ex: "23 brèves aujourd'hui · MAJ il y a 4min"
};

export default function PageHeader({ title, subtitle, liveBadge }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {liveBadge && (
        <View style={styles.liveRow}>
          <View style={styles.dot} />
          <Text style={styles.liveText}>{liveBadge}</Text>
        </View>
      )}
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 4,
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
  liveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent,
  },
  liveText: {
    fontSize: 10,
    color: colors.textMuted,
    letterSpacing: 0.3,
  },
});