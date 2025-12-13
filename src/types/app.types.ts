export type CurrencyType = 'BGN' | 'EUR';
export type LanguageType = 'bg' | 'en';
export type ThemeType = 'light' | 'dark' | 'system';

export interface AppSettings {
  currency: CurrencyType;
  language: LanguageType;
  theme: ThemeType;
}

export interface AppContextType {
  settings: AppSettings;
  isDark: boolean;
  setCurrency: (currency: CurrencyType) => void;
  setLanguage: (language: LanguageType) => void;
  setTheme: (theme: ThemeType) => void;
  t: (key: string) => string;
  isLoading: boolean;
  showOnboarding: boolean;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}

