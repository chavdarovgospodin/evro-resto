/**
 * Помощни функции за работа с деноминации
 */
import { BGN_DENOMINATIONS, EUR_DENOMINATIONS, type CurrencyType } from '../constants/currency';

/**
 * Връща всички налични банкноти за дадена валута
 */
export function getBanknotes(currency: CurrencyType): number[] {
  return currency === 'BGN' ? BGN_DENOMINATIONS.banknotes : EUR_DENOMINATIONS.banknotes;
}

/**
 * Връща всички налични монети за дадена валута
 */
export function getCoins(currency: CurrencyType): number[] {
  return currency === 'BGN' ? BGN_DENOMINATIONS.coins : EUR_DENOMINATIONS.coins;
}

/**
 * Проверява дали дадена стойност е валидна деноминация
 */
export function isValidDenomination(value: number, currency: CurrencyType): boolean {
  const banknotes = getBanknotes(currency);
  const coins = getCoins(currency);
  return [...banknotes, ...coins].includes(value);
}

/**
 * Намира най-близката по-голяма деноминация
 */
export function findNextHigherDenomination(value: number, currency: CurrencyType): number | null {
  const allDenominations = [...getBanknotes(currency), ...getCoins(currency)].sort((a, b) => a - b);

  for (const denomination of allDenominations) {
    if (denomination > value) {
      return denomination;
    }
  }

  return null;
}

/**
 * Намира най-близката по-малка деноминация
 */
export function findNextLowerDenomination(value: number, currency: CurrencyType): number | null {
  const allDenominations = [...getBanknotes(currency), ...getCoins(currency)].sort((a, b) => b - a);

  for (const denomination of allDenominations) {
    if (denomination < value) {
      return denomination;
    }
  }

  return null;
}

/**
 * Групира еднакви деноминации в разбивката
 */
export function groupDenominations(denominations: number[]): Array<{value: number, count: number}> {
  const grouped = denominations.reduce((acc, value) => {
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  return Object.entries(grouped)
    .map(([value, count]) => ({ value: parseFloat(value), count }))
    .sort((a, b) => b.value - a.value);
}

/**
 * Изчислява обща сума от разбивка
 */
export function calculateTotalFromBreakdown(breakdown: Array<{value: number, count: number}>): number {
  return breakdown.reduce((total, item) => total + (item.value * item.count), 0);
}

/**
 * Проверява дали сумата може да се разбие точно
 */
export function canBreakdownExactly(amount: number, currency: CurrencyType): boolean {
  const allDenominations = [...getBanknotes(currency), ...getCoins(currency)].sort((a, b) => b - a);
  let remaining = Math.round(amount * 100) / 100;

  for (const denomination of allDenominations) {
    const count = Math.floor(remaining / denomination);
    remaining = Math.round((remaining - (count * denomination)) * 100) / 100;
  }

  return remaining < 0.001; // Толеранс за floating point грешки
}
