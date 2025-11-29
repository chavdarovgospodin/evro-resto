/**
 * Валутни константи и деноминации
 */

// Курс на обмяна: 1.95583 лв = 1 €
export const BGN_TO_EUR_RATE = 1.95583;
export const EUR_TO_BGN_RATE = 1 / BGN_TO_EUR_RATE;

// Български деноминации
export const BGN_DENOMINATIONS = {
  banknotes: [100, 50, 20, 10, 5, 2],
  coins: [2, 1, 0.50, 0.20, 0.10, 0.05, 0.02, 0.01]
} as const;

// Евро деноминации
export const EUR_DENOMINATIONS = {
  banknotes: [200, 100, 50, 20, 10, 5],
  coins: [2, 1, 0.50, 0.20, 0.10, 0.05, 0.02, 0.01]
} as const;

/**
 * Всички налични деноминации за дадена валута
 */
export const getAllDenominations = (currency: 'BGN' | 'EUR') => {
  const denominations = currency === 'BGN' ? BGN_DENOMINATIONS : EUR_DENOMINATIONS;
  return [...denominations.banknotes, ...denominations.coins].sort((a, b) => b - a);
};

/**
 * Проверява дали дадена стойност е банкнота
 */
export const isDenominationBanknote = (value: number, currency: 'BGN' | 'EUR'): boolean => {
  const denominations = currency === 'BGN' ? BGN_DENOMINATIONS : EUR_DENOMINATIONS;
  return denominations.banknotes.includes(value);
};

/**
 * Типове за деноминации
 */
export type DenominationType = 'banknote' | 'coin';
export type CurrencyType = 'BGN' | 'EUR';

/**
 * Интерфейс за разбивка на сума по деноминации
 */
export interface DenominationBreakdown {
  denomination: number;
  count: number;
  type: DenominationType;
}
