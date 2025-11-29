import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Button } from '@/components/ui/Button';
import { useStorage } from '@/hooks/useStorage';

export default function HomeScreen() {
  const [count, setCount] = useStorage<number>('counter', 0);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>EvroResto</Text>
      <Text style={styles.subtitle}>ЕвроРесто - Твоето приложение за ресторанти! 🍽️</Text>

      <View style={styles.example}>
        <Text style={styles.exampleTitle}>Пример с AsyncStorage:</Text>
        <Text style={styles.counter}>Брояч: {count}</Text>
        <View style={styles.buttonRow}>
          <Button
            title="+1"
            onPress={() => setCount(count + 1)}
            variant="primary"
          />
          <Button
            title="Reset"
            onPress={() => setCount(0)}
            variant="outline"
          />
        </View>
      </View>

      <View style={styles.info}>
        <Text style={styles.infoText}>
          🍽️ EvroResto е готов за развитие на ресторант приложението!
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  example: {
    width: '100%',
    maxWidth: 400,
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    marginBottom: 20,
  },
  exampleTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  counter: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#007AFF',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  info: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    maxWidth: 400,
  },
  infoText: {
    fontSize: 14,
    color: '#1976D2',
    textAlign: 'center',
  },
});

