import { useRouter } from 'expo-router';
import { Calculator } from '../../src/components/Calculator';

export default function HomeScreen() {
  const router = useRouter();

  return <Calculator onOpenSettings={() => router.push('/settings')} />;
}
