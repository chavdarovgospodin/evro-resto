/**
 * Sanitizes currency input text
 * - Allows only digits, dots and commas
 * - Converts commas to dots
 * - Limits to 2 decimal places
 * - Limits total length to 9 characters
 */
export const sanitizeCurrencyInput = (text: string): string => {
  let filteredText = text.replace(/[^\d.,]/g, '');
  filteredText = filteredText.replace(',', '.');

  const parts = filteredText.split('.');
  if (parts.length > 2) {
    filteredText = parts[0] + '.' + parts.slice(1).join('');
  }
  if (parts.length > 1) {
    parts[1] = parts[1].substring(0, 2);
    filteredText = parts[0] + '.' + parts[1];
  }
  if (filteredText.length > 9) {
    filteredText = filteredText.substring(0, 9);
  }

  return filteredText;
};

