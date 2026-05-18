import { ScrollView, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/tokens';
import PageHeader from '../../components/PageHeader';
import CompetitionCard from '../../components/CompetitionCard';
import { competitions } from '../../data/mockData';

export default function CompetitionsScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <PageHeader
          title="Compétitions"
          subtitle="LES 5 GRANDS CHAMPIONNATS"
        />

        <View style={styles.list}>
          {competitions.map((comp) => (
            <CompetitionCard
              key={comp.id}
              code={comp.code}
              name={comp.name}
              country={comp.country}
              matchday={comp.matchday}
              color={comp.color}
              logoTextColor={comp.logoTextColor}
              leader={comp.leader}
              highlight={comp.highlight}
            />
          ))}
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  list: {
    paddingTop: 12,
  },
}); 