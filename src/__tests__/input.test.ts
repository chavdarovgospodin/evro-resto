import {
  sanitizeCurrencyInput,
  isAmountValid,
  MAX_AMOUNT,
} from '../utils/input';

describe('Input Utilities', () => {
  describe('MAX_AMOUNT constant', () => {
    it('should be defined', () => {
      expect(MAX_AMOUNT).toBeDefined();
    });

    it('should be 99999.99', () => {
      expect(MAX_AMOUNT).toBe(99999.99);
    });
  });

  describe('sanitizeCurrencyInput', () => {
    describe('Basic input handling', () => {
      it('should return empty string for empty input', () => {
        expect(sanitizeCurrencyInput('')).toBe('');
      });

      it('should keep valid digits', () => {
        expect(sanitizeCurrencyInput('123')).toBe('123');
      });

      it('should keep decimal point', () => {
        expect(sanitizeCurrencyInput('12.34')).toBe('12.34');
      });

      it('should convert comma to dot', () => {
        expect(sanitizeCurrencyInput('12,34')).toBe('12.34');
      });
    });

    describe('Invalid character filtering', () => {
      it('should remove letters', () => {
        expect(sanitizeCurrencyInput('12abc34')).toBe('1234');
      });

      it('should remove currency symbols', () => {
        expect(sanitizeCurrencyInput('$100')).toBe('100');
        expect(sanitizeCurrencyInput('€50')).toBe('50');
        expect(sanitizeCurrencyInput('100лв')).toBe('100');
      });

      it('should remove special characters', () => {
        expect(sanitizeCurrencyInput('100!@#')).toBe('100');
      });

      it('should remove spaces', () => {
        expect(sanitizeCurrencyInput('100 50')).toBe('10050');
      });

      it('should remove minus sign', () => {
        expect(sanitizeCurrencyInput('-50')).toBe('50');
      });

      it('should remove plus sign', () => {
        expect(sanitizeCurrencyInput('+50')).toBe('50');
      });
    });

    describe('Decimal place limiting', () => {
      it('should limit to 2 decimal places', () => {
        expect(sanitizeCurrencyInput('12.345')).toBe('12.34');
      });

      it('should limit to 2 decimal places with many digits', () => {
        expect(sanitizeCurrencyInput('12.3456789')).toBe('12.34');
      });

      it('should keep 1 decimal place', () => {
        expect(sanitizeCurrencyInput('12.3')).toBe('12.3');
      });

      it('should keep 2 decimal places', () => {
        expect(sanitizeCurrencyInput('12.34')).toBe('12.34');
      });

      it('should handle decimal point at end', () => {
        expect(sanitizeCurrencyInput('12.')).toBe('12.');
      });

      it('should handle decimal point at start', () => {
        expect(sanitizeCurrencyInput('.5')).toBe('.5');
      });
    });

    describe('Multiple decimal points', () => {
      it('should handle multiple dots - keep first', () => {
        expect(sanitizeCurrencyInput('12.34.56')).toBe('12.34');
      });

      it('should handle multiple commas', () => {
        expect(sanitizeCurrencyInput('12,34,56')).toBe('12.34');
      });

      it('should handle mixed dots and commas', () => {
        expect(sanitizeCurrencyInput('12.34,56')).toBe('12.34');
      });
    });

    describe('Length limiting', () => {
      it('should limit total length to 9 characters', () => {
        expect(sanitizeCurrencyInput('1234567890')).toBe('123456789');
      });

      it('should keep 9 characters exactly', () => {
        expect(sanitizeCurrencyInput('123456789')).toBe('123456789');
      });

      it('should handle long input with decimals', () => {
        expect(sanitizeCurrencyInput('123456.789')).toBe('123456.78');
      });
    });

    describe('Edge cases', () => {
      it('should handle only dot', () => {
        expect(sanitizeCurrencyInput('.')).toBe('.');
      });

      it('should handle only comma', () => {
        expect(sanitizeCurrencyInput(',')).toBe('.');
      });

      it('should handle zero', () => {
        expect(sanitizeCurrencyInput('0')).toBe('0');
      });

      it('should handle leading zeros', () => {
        expect(sanitizeCurrencyInput('007')).toBe('007');
      });

      it('should handle 0.00', () => {
        expect(sanitizeCurrencyInput('0.00')).toBe('0.00');
      });

      it('should handle maximum valid input', () => {
        expect(sanitizeCurrencyInput('99999.99')).toBe('99999.99');
      });
    });

    describe('Real-world inputs', () => {
      it('should handle "50 лв"', () => {
        expect(sanitizeCurrencyInput('50 лв')).toBe('50');
      });

      it('should handle "€100.00"', () => {
        expect(sanitizeCurrencyInput('€100.00')).toBe('100.00');
      });

      it('should handle "1,234.56"', () => {
        expect(sanitizeCurrencyInput('1,234.56')).toBe('1.23');
      });

      it('should handle Bulgarian decimal format "15,50"', () => {
        expect(sanitizeCurrencyInput('15,50')).toBe('15.50');
      });

      it('should handle copy-pasted formatted number', () => {
        expect(sanitizeCurrencyInput('1 234,56')).toBe('1234.56');
      });
    });
  });

  describe('isAmountValid', () => {
    describe('Valid amounts', () => {
      it('should return true for 0', () => {
        expect(isAmountValid(0)).toBe(true);
      });

      it('should return true for positive amount', () => {
        expect(isAmountValid(100)).toBe(true);
      });

      it('should return true for decimal amount', () => {
        expect(isAmountValid(15.5)).toBe(true);
      });

      it('should return true for maximum amount', () => {
        expect(isAmountValid(MAX_AMOUNT)).toBe(true);
      });

      it('should return true for amount just below maximum', () => {
        expect(isAmountValid(99999.98)).toBe(true);
      });

      it('should return true for very small amount', () => {
        expect(isAmountValid(0.01)).toBe(true);
      });
    });

    describe('Invalid amounts', () => {
      it('should return false for amount over maximum', () => {
        expect(isAmountValid(100000)).toBe(false);
      });

      it('should return false for amount just over maximum', () => {
        expect(isAmountValid(100000.00)).toBe(false);
      });

      it('should return false for negative amount', () => {
        expect(isAmountValid(-1)).toBe(false);
      });

      it('should return false for very large amount', () => {
        expect(isAmountValid(999999999)).toBe(false);
      });
    });

    describe('Edge cases', () => {
      it('should handle floating point edge case', () => {
        // 99999.99 + 0.001 might cause floating point issues
        expect(isAmountValid(99999.99)).toBe(true);
      });

      it('should handle NaN', () => {
        expect(isAmountValid(NaN)).toBe(false);
      });

      it('should handle Infinity', () => {
        expect(isAmountValid(Infinity)).toBe(false);
      });

      it('should handle negative Infinity', () => {
        expect(isAmountValid(-Infinity)).toBe(false);
      });
    });
  });
});

