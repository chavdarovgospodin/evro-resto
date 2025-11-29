/**
 * Общи помощни функции
 */

/**
 * Форматира число с разделители
 */
export function formatNumber(num: number): string {
  return num.toLocaleString();
}

/**
 * Форматира дата
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('bg-BG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Форматира време
 */
export function formatTime(date: Date): string {
  return date.toLocaleTimeString('bg-BG', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Дебаунс функция
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

