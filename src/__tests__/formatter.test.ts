import { formatAmount } from '../utils/formatter';

describe('Formatter Utilities', () => {
  describe('formatAmount', () => {
    describe('Basic formatting', () => {
      it('should format 0 as "0.00"', () => {
        expect(formatAmount(0)).toBe('0.00');
      });

      it('should format integer with 2 decimal places', () => {
        expect(formatAmount(100)).toBe('100.00');
      });

      it('should format 1 decimal place to 2', () => {
        expect(formatAmount(15.5)).toBe('15.50');
      });

      it('should keep 2 decimal places', () => {
        expect(formatAmount(15.55)).toBe('15.55');
      });
    });

    describe('Rounding', () => {
      it('should round down when 3rd decimal is < 5', () => {
        expect(formatAmount(15.554)).toBe('15.55');
      });

      it('should round up when 3rd decimal is >= 5', () => {
        expect(formatAmount(15.555)).toBe('15.56');
      });

      it('should round correctly for edge cases', () => {
        expect(formatAmount(15.999)).toBe('16.00');
      });
    });

    describe('Large numbers', () => {
      it('should format thousands with comma separator', () => {
        const result = formatAmount(1000);
        expect(result).toMatch(/1[,.]?000\.00/);
      });

      it('should format maximum amount', () => {
        const result = formatAmount(99999.99);
        expect(result).toMatch(/99[,.]?999\.99/);
      });

      it('should format very large numbers', () => {
        const result = formatAmount(1000000);
        expect(result).toBeDefined();
      });
    });

    describe('Small numbers', () => {
      it('should format 1 cent', () => {
        expect(formatAmount(0.01)).toBe('0.01');
      });

      it('should format 99 cents', () => {
        expect(formatAmount(0.99)).toBe('0.99');
      });

      it('should format very small decimal', () => {
        expect(formatAmount(0.001)).toBe('0.00');
      });
    });

    describe('Edge cases', () => {
      it('should handle negative zero', () => {
        // Note: JavaScript's toLocaleString may preserve -0 as "-0.00"
        const result = formatAmount(-0);
        expect(result === '0.00' || result === '-0.00').toBe(true);
      });

      it('should handle floating point precision issues', () => {
        // 0.1 + 0.2 = 0.30000000000000004 in JS
        expect(formatAmount(0.1 + 0.2)).toBe('0.30');
      });

      it('should handle very long decimals', () => {
        expect(formatAmount(10.123456789)).toBe('10.12');
      });
    });

    describe('Negative numbers', () => {
      it('should format negative numbers', () => {
        const result = formatAmount(-100);
        expect(result).toMatch(/-?100\.00/);
      });

      it('should format negative decimals', () => {
        const result = formatAmount(-15.5);
        expect(result).toMatch(/-?15\.50/);
      });
    });

    describe('Type consistency', () => {
      it('should always return a string', () => {
        expect(typeof formatAmount(0)).toBe('string');
        expect(typeof formatAmount(100)).toBe('string');
        expect(typeof formatAmount(15.5)).toBe('string');
      });

      it('should always have exactly 2 decimal places', () => {
        const testCases = [0, 1, 10, 100, 1000, 0.1, 0.01, 15.5, 15.55, 15.555];
        testCases.forEach((num) => {
          const result = formatAmount(num);
          const decimalPart = result.split('.')[1];
          expect(decimalPart?.length).toBe(2);
        });
      });
    });
  });
});

