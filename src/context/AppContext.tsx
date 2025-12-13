import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { Appearance } from 'react-native';
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
  HAS_SEEN_ONBOARDING: '@evro_resto_has_seen_onboarding',
};

const defaultSettings: AppSettings = {
  currency: 'EUR',
  language: 'bg',
  theme: 'system',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [systemColorScheme, setSystemColorScheme] = useState(
    Appearance.getColorScheme()
  );
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Listen for system theme changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemColorScheme(colorScheme);
    });

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    loadSettings();
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const hasSeenOnboarding = await AsyncStorage.getItem(STORAGE_KEYS.HAS_SEEN_ONBOARDING);
      if (hasSeenOnboarding === null) {
        setShowOnboarding(true);
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
    }
  };

  const loadSettings = async () => {
    try {
      const [currency, language, theme] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.CURRENCY),
        AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE),
        AsyncStorage.getItem(STORAGE_KEYS.THEME),
      ]);

      // Ако темата е 'light' или 'dark' от стари настройки, запазваме я
      // Ако е null/undefined, използваме 'system' по подразбиране
      const themeValue = theme as ThemeType;
      const validTheme =
        themeValue === 'light' ||
        themeValue === 'dark' ||
        themeValue === 'system'
          ? themeValue
          : defaultSettings.theme;

      setSettings({
        currency: (currency as CurrencyType) || defaultSettings.currency,
        language: (language as LanguageType) || defaultSettings.language,
        theme: validTheme,
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

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.HAS_SEEN_ONBOARDING, 'true');
      setShowOnboarding(false);
    } catch (error) {
      console.error('Error saving onboarding status:', error);
    }
  };

  const resetOnboarding = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.HAS_SEEN_ONBOARDING);
      setShowOnboarding(true);
    } catch (error) {
      console.error('Error resetting onboarding:', error);
    }
  };

  const t = (key: string): string => {
    return translations[settings.language][key] || key;
  };

  // Изчисляване на isDark базирано на темата
  // systemColorScheme може да е null, затова използваме 'light' като fallback
  const isDark =
    settings.theme === 'system'
      ? (systemColorScheme ?? 'light') === 'dark'
      : settings.theme === 'dark';

  return (
    <AppContext.Provider
      value={{
        settings,
        isDark,
        setCurrency,
        setLanguage,
        setTheme,
        t,
        isLoading,
        showOnboarding,
        completeOnboarding,
        resetOnboarding,
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
