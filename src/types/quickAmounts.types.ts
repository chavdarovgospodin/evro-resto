import type { LanguageType } from './app.types';

export interface QuickAmountsProps {
  amounts: number[];
  onSelect: (amount: number) => void;
  currency: 'BGN' | 'EUR';
  isDark?: boolean;
  language?: LanguageType;
}

