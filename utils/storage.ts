/**
 * Утилити за работа с AsyncStorage
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Запазва стойност в AsyncStorage
 */
export async function setStorageItem(key: string, value: string): Promise<void> {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.error('Error saving to storage:', error);
    throw error;
  }
}

/**
 * Чете стойност от AsyncStorage
 */
export async function getStorageItem(key: string): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(key);
  } catch (error) {
    console.error('Error reading from storage:', error);
    return null;
  }
}

/**
 * Изтрива стойност от AsyncStorage
 */
export async function removeStorageItem(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from storage:', error);
    throw error;
  }
}

/**
 * Изчиства целия AsyncStorage
 */
export async function clearStorage(): Promise<void> {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Error clearing storage:', error);
    throw error;
  }
}

