import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Типове
export type CurrencyType = 'BGN' | 'EUR';
export type LanguageType = 'bg' | 'en';
export type ThemeType = 'light' | 'dark';

// Цветова палитра
export const colors = {
  light: {
    primary: '#7C3AED', // Лилаво
    primaryLight: '#EDE9FE', // Светло лилаво
    primaryDark: '#6D28D9', // Тъмно лилаво
    background: '#FFFFFF',
    surface: '#F9FAFB',
    surfaceAlt: '#F3F4F6',
    text: '#1F2937',
    textSecondary: '#6B7280',
    textMuted: '#9CA3AF',
    border: '#E5E7EB',
    error: '#EF4444',
    success: '#10B981',
    successBg: '#F0FDF4',
    successBorder: '#D1FAE5',
    successText: '#065F46',
  },
  dark: {
    primary: '#A78BFA', // По-мек лилав за тъмна тема
    primaryLight: '#4C1D95', // Тъмен лилав фон
    primaryDark: '#8B5CF6', // Среден лилав
    background: '#1F2937',
    surface: '#374151',
    surfaceAlt: '#4B5563',
    text: '#F9FAFB',
    textSecondary: '#D1D5DB',
    textMuted: '#9CA3AF',
    border: '#4B5563',
    error: '#F87171',
    success: '#34D399',
    successBg: '#065F46',
    successBorder: '#10B981',
    successText: '#A7F3D0',
  },
};

interface AppSettings {
  currency: CurrencyType;
  language: LanguageType;
  theme: ThemeType;
}

interface ThemeColors {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  background: string;
  surface: string;
  surfaceAlt: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  error: string;
  success: string;
  successBg: string;
  successBorder: string;
  successText: string;
}

interface AppContextType {
  settings: AppSettings;
  setCurrency: (currency: CurrencyType) => void;
  setLanguage: (language: LanguageType) => void;
  setTheme: (theme: ThemeType) => void;
  t: (key: string) => string;
  isLoading: boolean;
  themeColors: ThemeColors;
}

// Преводи
const translations: Record<LanguageType, Record<string, string>> = {
  bg: {
    // Заглавия
    'app.title': 'Евро Ресто',
    'app.subtitle': 'Калкулатор за ресто от евро към лева',
    'app.version': 'Евро Ресто v1.0.0',

    // Калкулатор
    'calc.received': 'Получих',
    'calc.bill': 'Сметка',
    'calc.clear': 'Изчисти',
    'calc.quickAmounts': 'Чести суми',
    'calc.exchangeRate': '1 € = 1.95583 лв',

    // Валути
    'currency.bgn': 'Лева',
    'currency.eur': 'Евро',
    'currency.lv': 'лв',
    'currency.euro': '€',
    'currency.stotinki': 'ст',
    'currency.cents': 'цент',

    // Ресто
    'change.title': 'За връщане:',
    'change.or': 'или',
    'change.leva': 'лева',
    'change.euro': 'евро',
    'change.breakdown': 'Разбивка в',
    'change.showIn': 'Покажи в',
    'change.noChange': '✅ Точна сума - няма ресто',
    'change.warning': '⚠️ Проверете сумата - голямо ресто!',

    // Грешки
    'error.insufficient': 'Недостатъчна сума',
    'error.invalid': 'Невалидна сметка',

    // Настройки
    'settings.title': 'Настройки',
    'settings.currency': 'Основна валута',
    'settings.language': 'Език',
    'settings.theme': 'Тема',
    'settings.back': '← Назад',
    'settings.bgn': 'Лева (BGN)',
    'settings.eur': 'Евро (EUR)',
    'settings.bulgarian': 'Български',
    'settings.english': 'English',
    'settings.light': 'Светла',
    'settings.dark': 'Тъмна',
  },
  en: {
    // Titles
    'app.title': 'Euro Change',
    'app.subtitle': 'Change calculator from Euro to Leva',
    'app.version': 'Euro Change v1.0.0',

    // Calculator
    'calc.received': 'Received',
    'calc.bill': 'Bill',
    'calc.clear': 'Clear',
    'calc.quickAmounts': 'Quick amounts',
    'calc.exchangeRate': '1 € = 1.95583 BGN',

    // Currencies
    'currency.bgn': 'Leva',
    'currency.eur': 'Euro',
    'currency.lv': 'lv',
    'currency.euro': '€',
    'currency.stotinki': 'st',
    'currency.cents': 'cent',

    // Change
    'change.title': 'Change:',
    'change.or': 'or',
    'change.leva': 'leva',
    'change.euro': 'euro',
    'change.breakdown': 'Breakdown in',
    'change.showIn': 'Show in',
    'change.noChange': '✅ Exact amount - no change',
    'change.warning': '⚠️ Check the amount - large change!',

    // Errors
    'error.insufficient': 'Insufficient amount',
    'error.invalid': 'Invalid bill',

    // Settings
    'settings.title': 'Settings',
    'settings.currency': 'Default Currency',
    'settings.language': 'Language',
    'settings.theme': 'Theme',
    'settings.back': '← Back',
    'settings.bgn': 'Leva (BGN)',
    'settings.eur': 'Euro (EUR)',
    'settings.bulgarian': 'Български',
    'settings.english': 'English',
    'settings.light': 'Light',
    'settings.dark': 'Dark',
  },
};

// Storage keys
const STORAGE_KEYS = {
  CURRENCY: '@evro_resto_currency',
  LANGUAGE: '@evro_resto_language',
  THEME: '@evro_resto_theme',
};

// Default settings
const defaultSettings: AppSettings = {
  currency: 'BGN',
  language: 'bg',
  theme: 'light',
};

// Context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider
export function AppProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  // Зареждане на настройките при стартиране
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

  // Функция за превод
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

// Hook за използване на контекста
export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
