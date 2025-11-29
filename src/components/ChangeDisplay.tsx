import React, { useEffect } from 'react';
import { View, Animated, Text, StyleSheet } from 'react-native';
import { formatAmountWithCurrency, formatAmount } from '../utils/formatter';
import type {
  DenominationBreakdown,
  CurrencyType,
} from '../constants/currency';

interface ChangeDisplayProps {
  changeBgn: number;
  changeEur: number;
  denominations: DenominationBreakdown[];
  primaryCurrency: CurrencyType;
}

// Функция за определяне дали е банкнота или монета
const isBanknote = (value: number): boolean => {
  return value >= 5;
};

export function ChangeDisplay({
  changeBgn,
  changeEur,
  denominations,
  primaryCurrency,
}: ChangeDisplayProps) {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (changeBgn > 0 || changeEur > 0) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [changeBgn, changeEur, fadeAnim]);

  if (changeBgn === 0 && changeEur === 0) {
    return (
      <Animated.View style={{ opacity: fadeAnim }}>
        <View style={styles.container}>
          <Text style={styles.noChangeText}>✅ Точна сума - няма ресто</Text>
        </View>
      </Animated.View>
    );
  }

  const primaryAmount = primaryCurrency === 'BGN' ? changeBgn : changeEur;
  const secondaryAmount = primaryCurrency === 'BGN' ? changeEur : changeBgn;
  const secondaryCurrency = primaryCurrency === 'BGN' ? 'EUR' : 'BGN';

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <View style={styles.container}>
        {/* Заглавие */}
        <Text style={styles.headerLabel}>Ресто:</Text>

        {/* Основна сума */}
        <View style={styles.mainAmount}>
          <Text style={styles.amount}>{formatAmount(primaryAmount)}</Text>
          <Text style={styles.currency}>
            {primaryCurrency === 'BGN' ? 'лв' : '€'}
          </Text>
        </View>

        {/* Еквивалент в другата валута */}
        {secondaryAmount > 0 && (
          <Text style={styles.secondaryAmount}>
            ≈ {formatAmountWithCurrency(secondaryAmount, secondaryCurrency)}
          </Text>
        )}

        {/* Разбивка по деноминации */}
        {denominations.length > 0 && (
          <View style={styles.denominationsSection}>
            <Text style={styles.denominationsTitle}>За връщане:</Text>
            <View style={styles.denominationsList}>
              {denominations.map((item, index) => (
                <View key={index} style={styles.denominationItem}>
                  <Text style={styles.denominationIcon}>
                    {isBanknote(item.denomination) ? '💵' : '🪙'}
                  </Text>
                  <Text style={styles.denominationCount}>{item.count}x</Text>
                  <Text style={styles.denominationValue}>
                    {item.denomination < 1
                      ? `${Math.round(item.denomination * 100)} ст`
                      : `${formatAmount(item.denomination)} лв`}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Предупреждение за голямо ресто */}
        {primaryAmount > 500 && (
          <View style={styles.warning}>
            <Text style={styles.warningText}>
              ⚠️ Проверете сумата - голямо ресто!
            </Text>
          </View>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  headerLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#059669',
    textAlign: 'center',
    marginBottom: 4,
  },
  mainAmount: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginBottom: 4,
  },
  amount: {
    fontSize: 40,
    fontWeight: '700',
    color: '#065F46',
  },
  currency: {
    fontSize: 20,
    color: '#059669',
    marginLeft: 6,
    fontWeight: '600',
  },
  secondaryAmount: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 12,
  },
  noChangeText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#10B981',
    textAlign: 'center',
  },
  denominationsSection: {
    borderTopWidth: 1,
    borderTopColor: '#D1FAE5',
    paddingTop: 12,
    marginTop: 8,
  },
  denominationsTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#065F46',
    textAlign: 'center',
    marginBottom: 10,
  },
  denominationsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  denominationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  denominationIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  denominationCount: {
    fontSize: 13,
    fontWeight: '700',
    color: '#065F46',
    marginRight: 4,
  },
  denominationValue: {
    fontSize: 13,
    color: '#059669',
    fontWeight: '500',
  },
  warning: {
    backgroundColor: '#FEF2F2',
    borderColor: '#EF4444',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginTop: 12,
  },
  warningText: {
    fontSize: 13,
    color: '#EF4444',
    textAlign: 'center',
  },
});
