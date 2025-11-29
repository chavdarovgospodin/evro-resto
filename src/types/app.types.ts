export type CurrencyType = 'BGN' | 'EUR';
export type LanguageType = 'bg' | 'en';
export type ThemeType = 'light' | 'dark';

export interface AppSettings {
  currency: CurrencyType;
  language: LanguageType;
  theme: ThemeType;
}

export interface AppContextType {
  settings: AppSettings;
  setCurrency: (currency: CurrencyType) => void;
  setLanguage: (language: LanguageType) => void;
  setTheme: (theme: ThemeType) => void;
  t: (key: string) => string;
  isLoading: boolean;
}

