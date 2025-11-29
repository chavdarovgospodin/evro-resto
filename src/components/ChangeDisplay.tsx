import React, { useEffect, useState } from 'react';
import {
  View,
  Animated,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { formatAmount } from '../utils/formatter';
import { getDenominationBreakdown } from '../utils/calculator';
import type {
  DenominationBreakdown,
  CurrencyType,
} from '../constants/currency';

interface ChangeDisplayProps {
  changeBgn: number;
  changeEur: number;
  primaryCurrency: CurrencyType;
}

// Функция за определяне дали е банкнота или монета
const isBanknote = (value: number, currency: CurrencyType): boolean => {
  if (currency === 'BGN') {
    return value >= 5;
  } else {
    return value >= 5;
  }
};

export function ChangeDisplay({
  changeBgn,
  changeEur,
  primaryCurrency,
}: ChangeDisplayProps) {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const [breakdownCurrency, setBreakdownCurrency] =
    useState<CurrencyType>('BGN');

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

  const toggleBreakdownCurrency = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (e) {
      // Haptics not available
    }
    setBreakdownCurrency((prev) => (prev === 'BGN' ? 'EUR' : 'BGN'));
  };

  if (changeBgn === 0 && changeEur === 0) {
    return (
      <Animated.View style={{ opacity: fadeAnim }}>
        <View style={styles.container}>
          <Text style={styles.noChangeText}>✅ Точна сума - няма ресто</Text>
        </View>
      </Animated.View>
    );
  }

  // Изчисляваме разбивката според избраната валута
  const currentAmount = breakdownCurrency === 'BGN' ? changeBgn : changeEur;
  const denominations = getDenominationBreakdown(
    currentAmount,
    breakdownCurrency
  );
  const currencySymbol = breakdownCurrency === 'BGN' ? 'лв' : '€';
  const currencyName = breakdownCurrency === 'BGN' ? 'лева' : 'евро';
  const otherCurrencyName = breakdownCurrency === 'BGN' ? 'евро' : 'лева';

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <View style={styles.container}>
        {/* Заглавие */}
        <Text style={styles.headerLabel}>За връщане:</Text>

        {/* Двете валути една до друга */}
        <View style={styles.currencyRow}>
          {/* Лева */}
          <View style={styles.currencyBox}>
            <Text style={styles.currencyFlag}>🇧🇬</Text>
            <Text style={styles.currencyAmount}>{formatAmount(changeBgn)}</Text>
            <Text style={styles.currencyLabel}>лева</Text>
          </View>

          {/* Разделител */}
          <View style={styles.divider}>
            <Text style={styles.dividerText}>или</Text>
          </View>

          {/* Евро */}
          <View style={styles.currencyBox}>
            <Text style={styles.currencyFlag}>🇪🇺</Text>
            <Text style={styles.currencyAmount}>{formatAmount(changeEur)}</Text>
            <Text style={styles.currencyLabel}>евро</Text>
          </View>
        </View>

        {/* Разбивка по деноминации с превключвател */}
        {denominations.length > 0 && (
          <View style={styles.denominationsSection}>
            <View style={styles.denominationsHeader}>
              <Text style={styles.denominationsTitle}>
                Разбивка в {currencyName}:
              </Text>
              <TouchableOpacity
                style={styles.switchButton}
                onPress={toggleBreakdownCurrency}
              >
                <Text style={styles.switchButtonText}>
                  Покажи в {otherCurrencyName} →
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.denominationsList}>
              {denominations.map((item, index) => (
                <View key={index} style={styles.denominationItem}>
                  <Text style={styles.denominationIcon}>
                    {isBanknote(item.denomination, breakdownCurrency)
                      ? '💵'
                      : '🪙'}
                  </Text>
                  <Text style={styles.denominationCount}>{item.count}x</Text>
                  <Text style={styles.denominationValue}>
                    {item.denomination < 1
                      ? `${Math.round(item.denomination * 100)} ${
                          breakdownCurrency === 'BGN' ? 'ст' : 'цент'
                        }`
                      : `${formatAmount(item.denomination)} ${currencySymbol}`}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Предупреждение за голямо ресто */}
        {changeBgn > 500 && (
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
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  headerLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#065F46',
    textAlign: 'center',
    marginBottom: 16,
  },
  currencyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  currencyBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1FAE5',
  },
  currencyFlag: {
    fontSize: 24,
    marginBottom: 4,
  },
  currencyAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: '#065F46',
  },
  currencyLabel: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '500',
    marginTop: 2,
  },
  divider: {
    paddingHorizontal: 12,
  },
  dividerText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  noChangeText: {
    fontSize: 17,
    fontWeight: '500',
    color: '#10B981',
    textAlign: 'center',
  },
  denominationsSection: {
    borderTopWidth: 1,
    borderTopColor: '#D1FAE5',
    paddingTop: 14,
    marginTop: 16,
  },
  denominationsHeader: {
    alignItems: 'center',
    marginBottom: 12,
  },
  denominationsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#065F46',
    textAlign: 'center',
    marginBottom: 8,
  },
  switchButton: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  switchButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#059669',
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
    fontSize: 14,
    fontWeight: '700',
    color: '#065F46',
    marginRight: 4,
  },
  denominationValue: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '500',
  },
  warning: {
    backgroundColor: '#FEF2F2',
    borderColor: '#EF4444',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginTop: 14,
  },
  warningText: {
    fontSize: 14,
    color: '#EF4444',
    textAlign: 'center',
  },
});
