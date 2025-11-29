import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {
  CurrencyType,
  LanguageType,
  ThemeType,
  AppSettings,
  AppContextType,
} from '../types';
import { translations } from '../translations';

const STORAGE_KEYS = {
  CURRENCY: '@evro_resto_currency',
  LANGUAGE: '@evro_resto_language',
  THEME: '@evro_resto_theme',
};

const defaultSettings: AppSettings = {
  currency: 'BGN',
  language: 'bg',
  theme: 'light',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const [currency, language, theme] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.CURRENCY),
        AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE),
        AsyncStorage.getItem(STORAGE_KEYS.THEME),
      ]);

      setSettings({
        currency: (currency as CurrencyType) || defaultSettings.currency,
        language: (language as LanguageType) || defaultSettings.language,
        theme: (theme as ThemeType) || defaultSettings.theme,
      });
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setCurrency = async (currency: CurrencyType) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.CURRENCY, currency);
      setSettings((prev) => ({ ...prev, currency }));
    } catch (error) {
      console.error('Error saving currency:', error);
    }
  };

  const setLanguage = async (language: LanguageType) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
      setSettings((prev) => ({ ...prev, language }));
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  const setTheme = async (theme: ThemeType) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.THEME, theme);
      setSettings((prev) => ({ ...prev, theme }));
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const t = (key: string): string => {
    return translations[settings.language][key] || key;
  };

  return (
    <AppContext.Provider
      value={{
        settings,
        setCurrency,
        setLanguage,
        setTheme,
        t,
        isLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

// Re-export types for convenience
export type { CurrencyType, LanguageType, ThemeType } from '../types';
