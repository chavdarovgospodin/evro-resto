import { isBanknote } from '../utils/currency';
import {
  BGN_TO_EUR_RATE,
  EUR_TO_BGN_RATE,
  BGN_DENOMINATIONS,
  EUR_DENOMINATIONS,
  getAllDenominations,
  isDenominationBanknote,
} from '../constants/currency';

describe('Currency Constants', () => {
  describe('Exchange rates', () => {
    it('should have correct BGN to EUR rate', () => {
      expect(BGN_TO_EUR_RATE).toBe(1.95583);
    });

    it('should have EUR to BGN rate as inverse', () => {
      expect(EUR_TO_BGN_RATE).toBeCloseTo(1 / 1.95583, 10);
    });

    it('should satisfy BGN * EUR_TO_BGN = 1', () => {
      expect(BGN_TO_EUR_RATE * EUR_TO_BGN_RATE).toBeCloseTo(1, 10);
    });
  });

  describe('BGN_DENOMINATIONS', () => {
    it('should have banknotes array', () => {
      expect(BGN_DENOMINATIONS.banknotes).toBeDefined();
      expect(Array.isArray(BGN_DENOMINATIONS.banknotes)).toBe(true);
    });

    it('should have coins array', () => {
      expect(BGN_DENOMINATIONS.coins).toBeDefined();
      expect(Array.isArray(BGN_DENOMINATIONS.coins)).toBe(true);
    });

    it('should have correct BGN banknotes', () => {
      expect(BGN_DENOMINATIONS.banknotes).toContain(100);
      expect(BGN_DENOMINATIONS.banknotes).toContain(50);
      expect(BGN_DENOMINATIONS.banknotes).toContain(20);
      expect(BGN_DENOMINATIONS.banknotes).toContain(10);
      expect(BGN_DENOMINATIONS.banknotes).toContain(5);
      expect(BGN_DENOMINATIONS.banknotes).toContain(2);
    });

    it('should have correct BGN coins', () => {
      expect(BGN_DENOMINATIONS.coins).toContain(2);
      expect(BGN_DENOMINATIONS.coins).toContain(1);
      expect(BGN_DENOMINATIONS.coins).toContain(0.5);
      expect(BGN_DENOMINATIONS.coins).toContain(0.2);
      expect(BGN_DENOMINATIONS.coins).toContain(0.1);
      expect(BGN_DENOMINATIONS.coins).toContain(0.05);
      expect(BGN_DENOMINATIONS.coins).toContain(0.02);
      expect(BGN_DENOMINATIONS.coins).toContain(0.01);
    });

    it('should have banknotes in descending order', () => {
      const banknotes = [...BGN_DENOMINATIONS.banknotes];
      const sorted = [...banknotes].sort((a, b) => b - a);
      expect(banknotes).toEqual(sorted);
    });

    it('should have coins in descending order', () => {
      const coins = [...BGN_DENOMINATIONS.coins];
      const sorted = [...coins].sort((a, b) => b - a);
      expect(coins).toEqual(sorted);
    });
  });

  describe('EUR_DENOMINATIONS', () => {
    it('should have banknotes array', () => {
      expect(EUR_DENOMINATIONS.banknotes).toBeDefined();
      expect(Array.isArray(EUR_DENOMINATIONS.banknotes)).toBe(true);
    });

    it('should have coins array', () => {
      expect(EUR_DENOMINATIONS.coins).toBeDefined();
      expect(Array.isArray(EUR_DENOMINATIONS.coins)).toBe(true);
    });

    it('should have correct EUR banknotes', () => {
      expect(EUR_DENOMINATIONS.banknotes).toContain(200);
      expect(EUR_DENOMINATIONS.banknotes).toContain(100);
      expect(EUR_DENOMINATIONS.banknotes).toContain(50);
      expect(EUR_DENOMINATIONS.banknotes).toContain(20);
      expect(EUR_DENOMINATIONS.banknotes).toContain(10);
      expect(EUR_DENOMINATIONS.banknotes).toContain(5);
    });

    it('should have correct EUR coins', () => {
      expect(EUR_DENOMINATIONS.coins).toContain(2);
      expect(EUR_DENOMINATIONS.coins).toContain(1);
      expect(EUR_DENOMINATIONS.coins).toContain(0.5);
      expect(EUR_DENOMINATIONS.coins).toContain(0.2);
      expect(EUR_DENOMINATIONS.coins).toContain(0.1);
      expect(EUR_DENOMINATIONS.coins).toContain(0.05);
      expect(EUR_DENOMINATIONS.coins).toContain(0.02);
      expect(EUR_DENOMINATIONS.coins).toContain(0.01);
    });

    it('should have 200 EUR banknote (not in BGN)', () => {
      expect(EUR_DENOMINATIONS.banknotes).toContain(200);
      expect(BGN_DENOMINATIONS.banknotes).not.toContain(200);
    });
  });

  describe('getAllDenominations', () => {
    it('should return all BGN denominations', () => {
      const all = getAllDenominations('BGN');
      expect(all).toContain(100);
      expect(all).toContain(50);
      expect(all).toContain(0.01);
    });

    it('should return all EUR denominations', () => {
      const all = getAllDenominations('EUR');
      expect(all).toContain(200);
      expect(all).toContain(100);
      expect(all).toContain(0.01);
    });

    it('should return denominations in descending order', () => {
      const bgnAll = getAllDenominations('BGN');
      const eurAll = getAllDenominations('EUR');

      for (let i = 0; i < bgnAll.length - 1; i++) {
        expect(bgnAll[i]).toBeGreaterThanOrEqual(bgnAll[i + 1]);
      }

      for (let i = 0; i < eurAll.length - 1; i++) {
        expect(eurAll[i]).toBeGreaterThanOrEqual(eurAll[i + 1]);
      }
    });

    it('should include both banknotes and coins', () => {
      const all = getAllDenominations('BGN');
      // Banknotes
      expect(all).toContain(100);
      expect(all).toContain(50);
      // Coins
      expect(all).toContain(1);
      expect(all).toContain(0.5);
    });

    it('should have expected number of unique denominations', () => {
      const bgnAll = getAllDenominations('BGN');
      const eurAll = getAllDenominations('EUR');

      const bgnSet = new Set(bgnAll);
      const eurSet = new Set(eurAll);

      // BGN has 2 in both banknotes and coins, so there's 1 duplicate
      // banknotes: [100, 50, 20, 10, 5, 2] + coins: [2, 1, 0.50, 0.20, 0.10, 0.05, 0.02, 0.01]
      // Total: 14 items, 13 unique (2 appears twice)
      expect(bgnSet.size).toBe(13);
      expect(bgnAll.length).toBe(14);

      // EUR has 2 in coins only, so no duplicates
      // banknotes: [200, 100, 50, 20, 10, 5] + coins: [2, 1, 0.50, 0.20, 0.10, 0.05, 0.02, 0.01]
      expect(eurSet.size).toBe(eurAll.length);
    });
  });

  describe('isDenominationBanknote', () => {
    describe('BGN', () => {
      it('should return true for 100 BGN', () => {
        expect(isDenominationBanknote(100, 'BGN')).toBe(true);
      });

      it('should return true for 50 BGN', () => {
        expect(isDenominationBanknote(50, 'BGN')).toBe(true);
      });

      it('should return true for 20 BGN', () => {
        expect(isDenominationBanknote(20, 'BGN')).toBe(true);
      });

      it('should return true for 10 BGN', () => {
        expect(isDenominationBanknote(10, 'BGN')).toBe(true);
      });

      it('should return true for 5 BGN', () => {
        expect(isDenominationBanknote(5, 'BGN')).toBe(true);
      });

      it('should return true for 2 BGN (banknote)', () => {
        expect(isDenominationBanknote(2, 'BGN')).toBe(true);
      });

      it('should return false for 1 BGN coin', () => {
        expect(isDenominationBanknote(1, 'BGN')).toBe(false);
      });

      it('should return false for 0.50 BGN coin', () => {
        expect(isDenominationBanknote(0.5, 'BGN')).toBe(false);
      });

      it('should return false for 0.01 BGN coin', () => {
        expect(isDenominationBanknote(0.01, 'BGN')).toBe(false);
      });
    });

    describe('EUR', () => {
      it('should return true for 200 EUR', () => {
        expect(isDenominationBanknote(200, 'EUR')).toBe(true);
      });

      it('should return true for 100 EUR', () => {
        expect(isDenominationBanknote(100, 'EUR')).toBe(true);
      });

      it('should return true for 5 EUR', () => {
        expect(isDenominationBanknote(5, 'EUR')).toBe(true);
      });

      it('should return false for 2 EUR coin', () => {
        expect(isDenominationBanknote(2, 'EUR')).toBe(false);
      });

      it('should return false for 1 EUR coin', () => {
        expect(isDenominationBanknote(1, 'EUR')).toBe(false);
      });

      it('should return false for 0.01 EUR coin', () => {
        expect(isDenominationBanknote(0.01, 'EUR')).toBe(false);
      });
    });

    describe('Edge cases', () => {
      it('should return false for non-existent denomination', () => {
        expect(isDenominationBanknote(3, 'BGN')).toBe(false);
        expect(isDenominationBanknote(15, 'EUR')).toBe(false);
      });

      it('should return false for 0', () => {
        expect(isDenominationBanknote(0, 'BGN')).toBe(false);
        expect(isDenominationBanknote(0, 'EUR')).toBe(false);
      });
    });
  });
});

describe('Currency Utility Functions', () => {
  describe('isBanknote', () => {
    describe('BGN', () => {
      it('should return true for values >= 5', () => {
        expect(isBanknote(5, 'BGN')).toBe(true);
        expect(isBanknote(10, 'BGN')).toBe(true);
        expect(isBanknote(20, 'BGN')).toBe(true);
        expect(isBanknote(50, 'BGN')).toBe(true);
        expect(isBanknote(100, 'BGN')).toBe(true);
      });

      it('should return false for values < 5', () => {
        expect(isBanknote(2, 'BGN')).toBe(false);
        expect(isBanknote(1, 'BGN')).toBe(false);
        expect(isBanknote(0.5, 'BGN')).toBe(false);
        expect(isBanknote(0.01, 'BGN')).toBe(false);
      });
    });

    describe('EUR', () => {
      it('should return true for values >= 5', () => {
        expect(isBanknote(5, 'EUR')).toBe(true);
        expect(isBanknote(10, 'EUR')).toBe(true);
        expect(isBanknote(200, 'EUR')).toBe(true);
      });

      it('should return false for values < 5', () => {
        expect(isBanknote(2, 'EUR')).toBe(false);
        expect(isBanknote(1, 'EUR')).toBe(false);
        expect(isBanknote(0.5, 'EUR')).toBe(false);
      });
    });

    describe('Edge cases', () => {
      it('should return true for exactly 5', () => {
        expect(isBanknote(5, 'BGN')).toBe(true);
        expect(isBanknote(5, 'EUR')).toBe(true);
      });

      it('should return false for 4.99', () => {
        expect(isBanknote(4.99, 'BGN')).toBe(false);
        expect(isBanknote(4.99, 'EUR')).toBe(false);
      });

      it('should return false for 0', () => {
        expect(isBanknote(0, 'BGN')).toBe(false);
        expect(isBanknote(0, 'EUR')).toBe(false);
      });

      it('should return false for negative values', () => {
        expect(isBanknote(-5, 'BGN')).toBe(false);
        expect(isBanknote(-10, 'EUR')).toBe(false);
      });
    });
  });
});

