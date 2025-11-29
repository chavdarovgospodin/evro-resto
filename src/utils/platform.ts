import { Platform, StatusBar } from 'react-native';
import type { EdgeInsets } from 'react-native-safe-area-context';

/**
 * Calculates top padding based on platform and safe area insets
 */
export const getTopPadding = (insets: EdgeInsets): number => {
  if (Platform.OS === 'ios') {
    return Math.max(insets.top, 20) + 10;
  }
  return (StatusBar.currentHeight || 24) + 10;
};

