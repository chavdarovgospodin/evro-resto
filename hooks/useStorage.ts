import { useState, useEffect } from 'react';
import { getStorageItem, setStorageItem } from '@/utils/storage';

/**
 * Hook за работа с AsyncStorage
 */
export function useStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => Promise<void>] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const item = await getStorageItem(key);
        if (item) {
          setStoredValue(JSON.parse(item) as T);
        }
      } catch (error) {
        console.error('Error loading from storage:', error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [key]);

  const setValue = async (value: T) => {
    try {
      setStoredValue(value);
      await setStorageItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to storage:', error);
      throw error;
    }
  };

  return [storedValue, setValue];
}

