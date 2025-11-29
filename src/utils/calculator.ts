/**
 * Бизнес логика за калкулатора
 */
import {
  BGN_TO_EUR_RATE,
  EUR_TO_BGN_RATE,
  getAllDenominations,
  isDenominationBanknote,
  type DenominationBreakdown,
  type CurrencyType
} from '../constants/currency';

/**
 * Преобразува лева в евро с точност до стотинка
 * Закръгляне по банковите правила (до най-близката стотинка)
 */
export function convertBgnToEur(bgn: number): number {
  return Math.round((bgn / BGN_TO_EUR_RATE) * 100) / 100;
}

/**
 * Преобразува евро в лева
 */
export function convertEurToBgn(eur: number): number {
  return Math.round((eur * BGN_TO_EUR_RATE) * 100) / 100;
}

/**
 * Изчислява рестото в двете валути
 */
export function calculateChange(received: number, bill: number): {
  bgn: number;
  eur: number;
  isValid: boolean;
  error?: string;
} {
  // Ако няма въведени стойности, няма грешка
  if (received === 0 && bill === 0) {
    return {
      bgn: 0,
      eur: 0,
      isValid: true
    };
  }

  // Проверка за валидност само ако има въведени стойности
  if (bill > 0 && received > 0 && received < bill) {
    return {
      bgn: 0,
      eur: 0,
      isValid: false,
      error: 'Недостатъчна сума'
    };
  }

  // Грешка само ако сметката е отрицателна
  if (bill < 0) {
    return {
      bgn: 0,
      eur: 0,
      isValid: false,
      error: 'Невалидна сметка'
    };
  }

  // Изчисляване на рестото в лева
  const changeBgn = Math.round((received - bill) * 100) / 100;

  // Ако няма ресто
  if (changeBgn === 0) {
    return {
      bgn: 0,
      eur: 0,
      isValid: true
    };
  }

  // Преобразуване в евро
  const changeEur = convertBgnToEur(changeBgn);

  return {
    bgn: changeBgn,
    eur: changeEur,
    isValid: true
  };
}

/**
 * Разбива сумата на банкноти и монети
 * Използва greedy алгоритъм - най-големите номинали първо
 */
export function getDenominationBreakdown(
  amount: number,
  currency: CurrencyType
): DenominationBreakdown[] {
  const denominations = getAllDenominations(currency);
  const breakdown: DenominationBreakdown[] = [];
  let remaining = Math.round(amount * 100) / 100; // Точност до стотинка

  for (const denomination of denominations) {
    if (remaining >= denomination) {
      const count = Math.floor(remaining / denomination);
      if (count > 0) {
        breakdown.push({
          denomination,
          count,
          type: isDenominationBanknote(denomination, currency) ? 'banknote' : 'coin'
        });
        remaining = Math.round((remaining - (count * denomination)) * 100) / 100;
      }
    }
  }

  // Ако има остатък който не може да се разбие точно (много рядко)
  if (remaining > 0.001) {
    // Добавяме като стотинки
    const coinDenominations = currency === 'BGN'
      ? [0.01, 0.02, 0.05, 0.10, 0.20, 0.50, 1, 2]
      : [0.01, 0.02, 0.05, 0.10, 0.20, 0.50, 1, 2];

    // Намираме най-близката монета
    for (const coin of coinDenominations.sort((a, b) => b - a)) {
      if (remaining >= coin) {
        breakdown.push({
          denomination: coin,
          count: 1,
          type: 'coin'
        });
        break;
      }
    }
  }

  return breakdown;
}

/**
 * Форматира сума като валута
 */
export function formatCurrency(amount: number, currency: CurrencyType): string {
  const locale = currency === 'BGN' ? 'bg-BG' : 'de-DE';
  const currencyCode = currency === 'BGN' ? 'BGN' : 'EUR';

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

/**
 * Парсва стринг към число, игнорирайки невалидни символи
 */
export function parseCurrencyString(value: string): number {
  // Премахва всичко освен числа и десетична точка/запетая
  const cleaned = value.replace(/[^\d.,]/g, '').replace(',', '.');
  const parsed = parseFloat(cleaned);

  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Валидира входна стойност
 */
export function validateAmount(value: string): {
  isValid: boolean;
  amount: number;
  error?: string;
} {
  if (!value.trim()) {
    return { isValid: true, amount: 0 };
  }

  const amount = parseCurrencyString(value);

  if (amount < 0) {
    return { isValid: false, amount: 0, error: 'Отрицателни суми не са позволени' };
  }

  if (amount > 99999.99) {
    return { isValid: false, amount: 0, error: 'Максимална сума: 99,999.99' };
  }

  // Проверка за повече от 2 цифри след десетичната точка
  const decimalPart = value.split('.')[1];
  if (decimalPart && decimalPart.length > 2) {
    return { isValid: false, amount: 0, error: 'Максимум 2 цифри след десетичната точка' };
  }

  return { isValid: true, amount };
}
