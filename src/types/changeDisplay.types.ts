import type { CurrencyType, LanguageType } from './app.types';

export interface ChangeDisplayProps {
  changeBgn: number;
  changeEur: number;
  primaryCurrency: CurrencyType;
  isDark?: boolean;
  language?: LanguageType;
}

