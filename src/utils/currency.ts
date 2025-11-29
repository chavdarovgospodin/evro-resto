import type { CurrencyType } from '../types';

/**
 * Determines if a denomination value is a banknote (>= 5) or a coin
 */
export const isBanknote = (value: number, _currency: CurrencyType): boolean => {
  return value >= 5;
};

