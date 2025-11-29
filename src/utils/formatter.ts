/**
 * Форматиране на валути и числа
 */

/**
 * Форматира число с разделители за хиляди
 */
export function formatNumberWithSeparators(num: number, decimals: number = 2): string {
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

/**
 * Форматира сума като валута без символ
 */
export function formatAmount(amount: number): string {
  return formatNumberWithSeparators(amount, 2);
}

/**
 * Форматира сума с валутен символ
 */
export function formatAmountWithCurrency(amount: number, currency: 'BGN' | 'EUR'): string {
  const symbol = currency === 'BGN' ? 'лв' : '€';
  return `${formatAmount(amount)} ${symbol}`;
}

/**
 * Форматира процент
 */
export function formatPercentage(value: number): string {
  return `${value.toFixed(2)}%`;
}

/**
 * Скъсява големи числа (1000 -> 1K, 1000000 -> 1M)
 */
export function formatCompactNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return formatAmount(num);
}

/**
 * Форматира време
 */
export function formatTime(date: Date): string {
  return date.toLocaleTimeString('bg-BG', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

/**
 * Форматира дата
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('bg-BG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Форматира дата и час
 */
export function formatDateTime(date: Date): string {
  return `${formatDate(date)} ${formatTime(date)}`;
}
