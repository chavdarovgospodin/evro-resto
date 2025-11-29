/**
 * Форматиране на валути и числа
 */

/**
 * Форматира сума с 2 десетични знака
 */
export function formatAmount(amount: number): string {
  return amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}
