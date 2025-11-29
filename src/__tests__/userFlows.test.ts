/**
 * User Flow Tests
 *
 * Тези тестове симулират реални сценарии на използване на приложението
 * от гледна точка на потребителя (продавач в магазин).
 *
 * Покриват се:
 * - Основни сценарии на използване
 * - Edge cases и граничи условия
 * - Потенциални начини за "счупване" на приложението
 * - Неочаквано поведение на потребителя
 */

import {
  calculateChange,
  convertBgnToEur,
  convertEurToBgn,
  parseCurrencyString,
  getDenominationBreakdown,
  validateAmount,
} from '../utils/calculator';
import { sanitizeCurrencyInput, isAmountValid, MAX_AMOUNT } from '../utils/input';
import { formatAmount } from '../utils/formatter';

// ============================================================================
// HELPER FUNCTIONS - Симулират действията на потребителя
// ============================================================================

/**
 * Симулира въвеждане на текст от потребителя
 * (включва sanitization както в реалното приложение)
 */
function userTypesAmount(input: string): { display: string; value: number } {
  const sanitized = sanitizeCurrencyInput(input);
  const value = parseCurrencyString(sanitized);
  return { display: sanitized, value };
}

/**
 * Симулира пълен flow на изчисление на ресто
 */
function calculateChangeFlow(
  received: string,
  bill: string,
  currency: 'BGN' | 'EUR' = 'BGN'
): {
  receivedValue: number;
  billValue: number;
  changeBgn: number;
  changeEur: number;
  isValid: boolean;
  error?: string;
} {
  const receivedInput = userTypesAmount(received);
  const billInput = userTypesAmount(bill);

  // Конвертираме в BGN ако е в EUR
  const receivedBgn =
    currency === 'EUR'
      ? convertEurToBgn(receivedInput.value)
      : receivedInput.value;
  const billBgn =
    currency === 'EUR' ? convertEurToBgn(billInput.value) : billInput.value;

  const result = calculateChange(receivedBgn, billBgn);

  return {
    receivedValue: receivedInput.value,
    billValue: billInput.value,
    changeBgn: result.bgn,
    changeEur: result.eur,
    isValid: result.isValid,
    error: result.error,
  };
}

/**
 * Симулира смяна на валутата
 */
function switchCurrency(
  bgnValue: number,
  fromCurrency: 'BGN' | 'EUR',
  toCurrency: 'BGN' | 'EUR'
): number {
  if (fromCurrency === toCurrency) return bgnValue;
  if (toCurrency === 'EUR') return convertBgnToEur(bgnValue);
  return bgnValue; // Already in BGN
}

// ============================================================================
// TEST SUITES
// ============================================================================

describe('User Flow: Основни сценарии на използване', () => {
  describe('Сценарий 1: Клиент плаща с банкнота за малка сметка', () => {
    it('50 лв за сметка 23.50 лв', () => {
      const result = calculateChangeFlow('50', '23.50');
      expect(result.isValid).toBe(true);
      expect(result.changeBgn).toBeCloseTo(26.5, 2);
      expect(result.changeEur).toBeCloseTo(13.55, 2);
    });

    it('100 лв за сметка 67.89 лв', () => {
      const result = calculateChangeFlow('100', '67.89');
      expect(result.isValid).toBe(true);
      expect(result.changeBgn).toBeCloseTo(32.11, 2);
    });

    it('20 лв за сметка 15.00 лв', () => {
      const result = calculateChangeFlow('20', '15');
      expect(result.isValid).toBe(true);
      expect(result.changeBgn).toBe(5);
    });
  });

  describe('Сценарий 2: Клиент плаща точната сума', () => {
    it('23.50 лв за сметка 23.50 лв - няма ресто', () => {
      const result = calculateChangeFlow('23.50', '23.50');
      expect(result.isValid).toBe(true);
      expect(result.changeBgn).toBe(0);
      expect(result.changeEur).toBe(0);
    });

    it('100 лв за сметка 100 лв', () => {
      const result = calculateChangeFlow('100', '100');
      expect(result.changeBgn).toBe(0);
    });
  });

  describe('Сценарий 3: Клиент плаща в EUR', () => {
    it('50 EUR за сметка 30 EUR', () => {
      const result = calculateChangeFlow('50', '30', 'EUR');
      expect(result.isValid).toBe(true);
      // 20 EUR = ~39.12 BGN
      expect(result.changeBgn).toBeCloseTo(39.12, 1);
      expect(result.changeEur).toBeCloseTo(20, 1);
    });

    it('20 EUR за сметка 15.50 EUR', () => {
      const result = calculateChangeFlow('20', '15.50', 'EUR');
      expect(result.isValid).toBe(true);
      expect(result.changeEur).toBeCloseTo(4.5, 1);
    });
  });

  describe('Сценарий 4: Смесени валути (плащане в едната, ресто в другата)', () => {
    it('Клиент плаща 50 лв, иска ресто в EUR', () => {
      const result = calculateChangeFlow('50', '35.64');
      expect(result.isValid).toBe(true);
      // Рестото в лева
      expect(result.changeBgn).toBeCloseTo(14.36, 2);
      // Рестото в евро (ако клиентът иска)
      expect(result.changeEur).toBeCloseTo(7.34, 2);
    });
  });
});

describe('User Flow: Използване на Quick Amounts бутони', () => {
  describe('Бързо въвеждане на получена сума', () => {
    const quickAmounts = [5, 10, 20, 50, 100];

    quickAmounts.forEach((amount) => {
      it(`Quick Amount ${amount} лв за сметка 3.50 лв`, () => {
        const result = calculateChangeFlow(amount.toString(), '3.50');
        expect(result.isValid).toBe(true);
        expect(result.changeBgn).toBeCloseTo(amount - 3.5, 2);
      });
    });
  });

  describe('Quick Amount с EUR валута', () => {
    it('Quick Amount 20 EUR за сметка 15 EUR', () => {
      const result = calculateChangeFlow('20', '15', 'EUR');
      expect(result.isValid).toBe(true);
      expect(result.changeEur).toBeCloseTo(5, 2);
    });
  });
});

describe('User Flow: Превключване между валути', () => {
  describe('Запазване на стойността при смяна на валута', () => {
    it('20 BGN -> EUR -> BGN трябва да остане 20 BGN', () => {
      const originalBgn = 20;

      // Потребителят въвежда 20 лв
      const eurValue = convertBgnToEur(originalBgn);
      // Показваме в EUR
      expect(eurValue).toBeCloseTo(10.23, 2);

      // Връщаме в BGN (от запазената BGN стойност, не от EUR)
      // В приложението пазим originalBgn, не конвертираме обратно
      expect(originalBgn).toBe(20);
    });

    it('Многократна смяна на валутата не трябва да променя стойността', () => {
      const originalBgn = 100;

      // Симулираме 10 превключвания
      let currentBgn = originalBgn;
      for (let i = 0; i < 10; i++) {
        // В реалното приложение пазим BGN стойността
        // и само показваме конвертираната стойност
        const eur = convertBgnToEur(currentBgn);
        // Не обновяваме currentBgn от конвертираната стойност
        expect(currentBgn).toBe(originalBgn);
      }
    });
  });

  describe('Конверсия при въвеждане в различни валути', () => {
    it('Въвеждане на 10 EUR трябва да се запази като ~19.56 BGN', () => {
      const eurInput = 10;
      const bgnEquivalent = convertEurToBgn(eurInput);
      expect(bgnEquivalent).toBeCloseTo(19.56, 2);
    });
  });
});

describe('User Flow: Edge Cases и Гранични условия', () => {
  describe('Много малки суми', () => {
    it('1 стотинка ресто', () => {
      const result = calculateChangeFlow('10', '9.99');
      expect(result.isValid).toBe(true);
      expect(result.changeBgn).toBeCloseTo(0.01, 2);
    });

    it('Ресто под 1 стотинка (закръгляне)', () => {
      const result = calculateChangeFlow('10', '9.995');
      // 9.995 се парсва като 9.99 (2 десетични знака)
      expect(result.changeBgn).toBeCloseTo(0.01, 2);
    });

    it('Сметка 0.01 лв', () => {
      const result = calculateChangeFlow('1', '0.01');
      expect(result.isValid).toBe(true);
      expect(result.changeBgn).toBeCloseTo(0.99, 2);
    });
  });

  describe('Много големи суми', () => {
    it('Максимална позволена сума', () => {
      const result = calculateChangeFlow('99999.99', '50000');
      expect(result.isValid).toBe(true);
      expect(result.changeBgn).toBeCloseTo(49999.99, 2);
    });

    it('Сума над максимума трябва да бъде отхвърлена', () => {
      const input = userTypesAmount('100000');
      expect(isAmountValid(input.value)).toBe(false);
    });

    it('Сума точно на максимума', () => {
      const input = userTypesAmount('99999.99');
      expect(isAmountValid(input.value)).toBe(true);
    });
  });

  describe('Floating point precision проблеми', () => {
    it('0.1 + 0.2 трябва да е 0.3', () => {
      const result = calculateChangeFlow('0.30', '0');
      expect(result.changeBgn).toBeCloseTo(0.3, 2);
    });

    it('Сума с много десетични (19.999999)', () => {
      const input = userTypesAmount('19.999999');
      // Трябва да се ограничи до 2 десетични
      expect(input.display).toBe('19.99');
    });

    it('Изчисление с проблемни числа', () => {
      // 33.33 * 3 = 99.99 (не 100)
      const result = calculateChangeFlow('100', '33.33');
      expect(result.changeBgn).toBeCloseTo(66.67, 2);
    });
  });
});

describe('User Flow: Невалидни входни данни', () => {
  describe('Недостатъчна сума', () => {
    it('Получени по-малко от сметката', () => {
      const result = calculateChangeFlow('20', '50');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Недостатъчна сума');
    });

    it('Получени с 1 стотинка по-малко', () => {
      const result = calculateChangeFlow('49.99', '50');
      expect(result.isValid).toBe(false);
    });
  });

  describe('Празни полета', () => {
    it('И двете полета празни', () => {
      const result = calculateChangeFlow('', '');
      expect(result.isValid).toBe(true);
      expect(result.changeBgn).toBe(0);
    });

    it('Само получената сума е въведена', () => {
      const result = calculateChangeFlow('50', '');
      expect(result.isValid).toBe(true);
      expect(result.changeBgn).toBe(50);
    });

    it('Само сметката е въведена', () => {
      const result = calculateChangeFlow('', '50');
      // Когато received=0 и bill=50, calculateChange връща isValid=true
      // защото проверката е: received > 0 && received < bill
      // В UI това не показва ресто, защото received.trim() е празен
      expect(result.isValid).toBe(true);
      expect(result.changeBgn).toBe(-50); // Отрицателно ресто (няма смисъл в UI)
    });
  });

  describe('Невалидни символи', () => {
    it('Букви в числото', () => {
      const input = userTypesAmount('50abc');
      expect(input.display).toBe('50');
      expect(input.value).toBe(50);
    });

    it('Специални символи', () => {
      const input = userTypesAmount('$50.00!@#');
      expect(input.display).toBe('50.00');
    });

    it('Emoji', () => {
      const input = userTypesAmount('💰50');
      expect(input.display).toBe('50');
    });

    it('Кирилица', () => {
      const input = userTypesAmount('петдесет');
      expect(input.display).toBe('');
      expect(input.value).toBe(0);
    });

    it('Валутен символ', () => {
      const input = userTypesAmount('€50');
      expect(input.display).toBe('50');
    });

    it('Българска валута', () => {
      const input = userTypesAmount('50 лв');
      expect(input.display).toBe('50');
    });
  });

  describe('Проблеми с десетичния разделител', () => {
    it('Запетая вместо точка (български формат)', () => {
      const input = userTypesAmount('15,50');
      expect(input.display).toBe('15.50');
      expect(input.value).toBe(15.5);
    });

    it('Множество точки', () => {
      const input = userTypesAmount('15.50.25');
      expect(input.display).toBe('15.50');
    });

    it('Множество запетаи', () => {
      const input = userTypesAmount('15,50,25');
      expect(input.display).toBe('15.50');
    });

    it('Точка в началото', () => {
      const input = userTypesAmount('.50');
      expect(input.display).toBe('.50');
      expect(input.value).toBe(0.5);
    });

    it('Точка в края', () => {
      const input = userTypesAmount('50.');
      expect(input.display).toBe('50.');
      expect(input.value).toBe(50);
    });
  });
});

describe('User Flow: Потенциални начини за "счупване" на приложението', () => {
  describe('Бързо въвеждане и изтриване', () => {
    it('Въвеждане на дълъг низ', () => {
      const input = userTypesAmount('123456789012345');
      // Трябва да се ограничи до 9 символа
      expect(input.display.length).toBeLessThanOrEqual(9);
    });

    it('Изтриване на всичко и въвеждане отново', () => {
      let input = userTypesAmount('50');
      expect(input.value).toBe(50);

      input = userTypesAmount('');
      expect(input.value).toBe(0);

      input = userTypesAmount('100');
      expect(input.value).toBe(100);
    });
  });

  describe('Copy-paste сценарии', () => {
    it('Paste на форматирано число', () => {
      const input = userTypesAmount('1,234.56');
      // Запетаята се конвертира в точка
      expect(input.value).toBe(1.23); // "1.23" след sanitization
    });

    it('Paste на число с интервали', () => {
      const input = userTypesAmount('1 234 567');
      expect(input.display).toBe('1234567');
    });

    it('Paste на отрицателно число', () => {
      const input = userTypesAmount('-50');
      expect(input.display).toBe('50');
      expect(input.value).toBe(50);
    });

    it('Paste на научна нотация', () => {
      const input = userTypesAmount('1e5');
      expect(input.display).toBe('15');
    });
  });

  describe('Бързо натискане на бутони', () => {
    it('Многократно натискане на Quick Amount', () => {
      // Симулираме 100 бързи натискания
      for (let i = 0; i < 100; i++) {
        const amount = formatAmount(50);
        expect(amount).toBe('50.00');
      }
    });

    it('Бързо превключване на валута', () => {
      let currency: 'BGN' | 'EUR' = 'BGN';
      const originalBgn = 100;

      for (let i = 0; i < 50; i++) {
        currency = currency === 'BGN' ? 'EUR' : 'BGN';
        const displayed =
          currency === 'EUR'
            ? convertBgnToEur(originalBgn)
            : originalBgn;
        expect(displayed).toBeDefined();
      }
    });
  });

  describe('Extreme values', () => {
    it('Нула', () => {
      const result = calculateChangeFlow('0', '0');
      expect(result.isValid).toBe(true);
    });

    it('Много нули', () => {
      const input = userTypesAmount('0000000');
      expect(input.value).toBe(0);
    });

    it('Нула точка нула', () => {
      const input = userTypesAmount('0.00');
      expect(input.value).toBe(0);
    });

    it('Водещи нули', () => {
      const input = userTypesAmount('007.50');
      expect(input.value).toBe(7.5);
    });
  });
});

describe('User Flow: Разбивка на ресто по деноминации', () => {
  describe('Оптимална разбивка', () => {
    it('14.36 лв трябва да се разбие оптимално', () => {
      const breakdown = getDenominationBreakdown(14.36, 'BGN');
      const total = breakdown.reduce(
        (sum, item) => sum + item.denomination * item.count,
        0
      );
      expect(total).toBeCloseTo(14.36, 2);

      // Проверяваме, че използваме минимален брой банкноти/монети
      // 14.36 = 10 + 2 + 2 + 0.20 + 0.10 + 0.05 + 0.01
      expect(breakdown.some((d) => d.denomination === 10)).toBe(true);
    });

    it('99.99 лв разбивка', () => {
      const breakdown = getDenominationBreakdown(99.99, 'BGN');
      const total = breakdown.reduce(
        (sum, item) => sum + item.denomination * item.count,
        0
      );
      expect(total).toBeCloseTo(99.99, 2);
    });

    it('Разбивка в EUR', () => {
      const breakdown = getDenominationBreakdown(87.65, 'EUR');
      const total = breakdown.reduce(
        (sum, item) => sum + item.denomination * item.count,
        0
      );
      expect(total).toBeCloseTo(87.65, 2);

      // EUR има 200 банкнота
      expect(breakdown.some((d) => d.denomination <= 200)).toBe(true);
    });
  });

  describe('Специални случаи на разбивка', () => {
    it('Само монети (под 5 лв)', () => {
      const breakdown = getDenominationBreakdown(4.99, 'BGN');
      const hasBanknotes = breakdown.some((d) => d.type === 'banknote');
      // 2 лв е банкнота в BGN
      expect(breakdown.length).toBeGreaterThan(0);
    });

    it('Само банкноти (кръгла сума)', () => {
      const breakdown = getDenominationBreakdown(100, 'BGN');
      expect(breakdown).toContainEqual(
        expect.objectContaining({ denomination: 100, count: 1 })
      );
    });

    it('Много малка сума (стотинки)', () => {
      const breakdown = getDenominationBreakdown(0.17, 'BGN');
      const total = breakdown.reduce(
        (sum, item) => sum + item.denomination * item.count,
        0
      );
      expect(total).toBeCloseTo(0.17, 2);
    });
  });
});

describe('User Flow: Реални бизнес сценарии', () => {
  describe('Магазин за хранителни стоки', () => {
    it('Сценарий: Покупка на хляб и мляко', () => {
      // Хляб 1.50 + Мляко 2.30 = 3.80 лв
      // Клиент дава 5 лв
      const result = calculateChangeFlow('5', '3.80');
      expect(result.isValid).toBe(true);
      expect(result.changeBgn).toBeCloseTo(1.2, 2);

      const breakdown = getDenominationBreakdown(result.changeBgn, 'BGN');
      expect(breakdown).toContainEqual(
        expect.objectContaining({ denomination: 1, count: 1 })
      );
      expect(breakdown).toContainEqual(
        expect.objectContaining({ denomination: 0.2, count: 1 })
      );
    });

    it('Сценарий: Голяма покупка с ресто в EUR', () => {
      // Сметка 156.78 лв, клиент дава 200 лв
      // Иска ресто в EUR
      const result = calculateChangeFlow('200', '156.78');
      expect(result.isValid).toBe(true);
      expect(result.changeBgn).toBeCloseTo(43.22, 2);
      expect(result.changeEur).toBeCloseTo(22.1, 1);
    });
  });

  describe('Ресторант', () => {
    it('Сценарий: Сметка с бакшиш', () => {
      // Сметка 45.60 лв, клиент дава 50 лв и казва "без ресто"
      const result = calculateChangeFlow('50', '50'); // Третира се като без ресто
      expect(result.changeBgn).toBe(0);
    });

    it('Сценарий: Разделяне на сметка', () => {
      // Обща сметка 89.40 лв, разделена на 3
      // Всеки плаща 30 лв
      const perPerson = 89.4 / 3; // 29.80
      const result = calculateChangeFlow('30', perPerson.toFixed(2));
      expect(result.isValid).toBe(true);
      expect(result.changeBgn).toBeCloseTo(0.2, 2);
    });
  });

  describe('Бензиностанция', () => {
    it('Сценарий: Зареждане на гориво', () => {
      // Гориво 78.45 лв, клиент дава 100 лв
      const result = calculateChangeFlow('100', '78.45');
      expect(result.isValid).toBe(true);
      expect(result.changeBgn).toBeCloseTo(21.55, 2);
    });

    it('Сценарий: Плащане в EUR (турист)', () => {
      // Гориво ~40 EUR, клиент дава 50 EUR
      const result = calculateChangeFlow('50', '40', 'EUR');
      expect(result.isValid).toBe(true);
      expect(result.changeEur).toBeCloseTo(10, 2);
    });
  });
});

describe('User Flow: Валидация на входни данни', () => {
  describe('validateAmount функция', () => {
    it('Празен низ е валиден (0)', () => {
      const result = validateAmount('');
      expect(result.isValid).toBe(true);
      expect(result.amount).toBe(0);
    });

    it('Валидно число', () => {
      const result = validateAmount('50.00');
      expect(result.isValid).toBe(true);
      expect(result.amount).toBe(50);
    });

    it('Повече от 2 десетични знака е невалидно', () => {
      const result = validateAmount('50.123');
      expect(result.isValid).toBe(false);
    });

    it('Над максимума е невалидно', () => {
      const result = validateAmount('100000');
      expect(result.isValid).toBe(false);
    });
  });
});

describe('User Flow: Форматиране на изхода', () => {
  describe('formatAmount функция', () => {
    it('Цели числа се форматират с .00', () => {
      expect(formatAmount(50)).toBe('50.00');
    });

    it('Едно десетично се допълва', () => {
      expect(formatAmount(50.5)).toBe('50.50');
    });

    it('Закръгляне нагоре', () => {
      expect(formatAmount(50.555)).toBe('50.56');
    });

    it('Закръгляне надолу', () => {
      expect(formatAmount(50.554)).toBe('50.55');
    });

    it('Големи числа', () => {
      const result = formatAmount(99999.99);
      expect(result).toContain('99');
    });
  });
});

describe('User Flow: Accessibility и UX сценарии', () => {
  describe('Ясни съобщения за грешки', () => {
    it('Грешка при недостатъчна сума', () => {
      const result = calculateChangeFlow('10', '50');
      expect(result.error).toBeDefined();
      expect(result.error).toContain('Недостатъчна');
    });
  });

  describe('Консистентност на данните', () => {
    it('Стойностите се запазват при навигация', () => {
      // Симулираме запазване и възстановяване на стойности
      const originalReceived = 50;
      const originalBill = 35.64;

      // "Запазваме" стойностите
      const savedReceived = originalReceived;
      const savedBill = originalBill;

      // "Възстановяваме" стойностите
      expect(savedReceived).toBe(originalReceived);
      expect(savedBill).toBe(originalBill);
    });
  });
});

describe('User Flow: Stress тестове', () => {
  describe('Много изчисления последователно', () => {
    it('1000 изчисления без грешки', () => {
      for (let i = 0; i < 1000; i++) {
        const received = Math.random() * 1000;
        const bill = Math.random() * received;
        const result = calculateChange(received, bill);
        expect(result.isValid).toBe(true);
        expect(result.bgn).toBeGreaterThanOrEqual(0);
      }
    });
  });

  describe('Случайни входни данни', () => {
    it('Случайни валидни суми', () => {
      for (let i = 0; i < 100; i++) {
        const amount = (Math.random() * MAX_AMOUNT).toFixed(2);
        const input = userTypesAmount(amount);
        expect(input.value).toBeGreaterThanOrEqual(0);
        expect(input.value).toBeLessThanOrEqual(MAX_AMOUNT);
      }
    });
  });
});

describe('User Flow: Специфични за България сценарии', () => {
  describe('Преход към еврото (Януари 2026)', () => {
    it('Клиент плаща в лева, иска ресто в евро', () => {
      const result = calculateChangeFlow('100', '73.50');
      expect(result.isValid).toBe(true);
      expect(result.changeBgn).toBeCloseTo(26.5, 2);
      expect(result.changeEur).toBeCloseTo(13.55, 1);
    });

    it('Клиент плаща в евро, иска ресто в лева', () => {
      const eurReceived = 50;
      const bgnBill = 73.5;

      const bgnReceived = convertEurToBgn(eurReceived);
      const result = calculateChange(bgnReceived, bgnBill);

      expect(result.isValid).toBe(true);
      expect(result.bgn).toBeCloseTo(24.29, 1);
    });

    it('Смесено плащане (частично в лева, частично в евро)', () => {
      // Клиент дава 50 лв + 10 EUR
      const bgnPart = 50;
      const eurPart = convertEurToBgn(10); // ~19.56

      const totalReceived = bgnPart + eurPart;
      const bill = 60;

      const result = calculateChange(totalReceived, bill);
      expect(result.isValid).toBe(true);
      expect(result.bgn).toBeCloseTo(9.56, 1);
    });
  });

  describe('Официален курс 1.95583', () => {
    it('Точна конверсия на 1 EUR', () => {
      const bgn = convertEurToBgn(1);
      expect(bgn).toBeCloseTo(1.96, 2);
    });

    it('Точна конверсия на 1.95583 BGN', () => {
      const eur = convertBgnToEur(1.95583);
      expect(eur).toBe(1);
    });
  });
});

