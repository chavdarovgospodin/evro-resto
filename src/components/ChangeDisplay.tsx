import React, { useEffect, useState } from 'react';
import {
  View,
  Animated,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { formatAmount } from '../utils/formatter';
import { getDenominationBreakdown } from '../utils/calculator';
import type { CurrencyType } from '../constants/currency';
import type { LanguageType } from '../context/AppContext';

// Преводи
const translations = {
  bg: {
    headerLabel: 'За връщане:',
    or: 'или',
    leva: 'лева',
    euro: 'евро',
    breakdownIn: 'Разбивка в',
    showIn: 'Покажи в',
    noChange: 'Точна сума - няма ресто',
    warning: 'Проверете сумата - голямо ресто!',
    stotinki: 'ст',
    cents: 'цент',
    lv: 'лв',
    euroSymbol: '€',
  },
  en: {
    headerLabel: 'Change:',
    or: 'or',
    leva: 'leva',
    euro: 'euro',
    breakdownIn: 'Breakdown in',
    showIn: 'Show in',
    noChange: 'Exact amount - no change',
    warning: 'Check the amount - large change!',
    stotinki: 'st',
    cents: 'cent',
    lv: 'lv',
    euroSymbol: '€',
  },
};

interface ChangeDisplayProps {
  changeBgn: number;
  changeEur: number;
  primaryCurrency: CurrencyType;
  isDark?: boolean;
  language?: LanguageType;
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
  isDark = false,
  language = 'bg',
}: ChangeDisplayProps) {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const [breakdownCurrency, setBreakdownCurrency] =
    useState<CurrencyType>('BGN');
  const t = translations[language];

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

  // Динамични стилове за тъмна тема
  const dynamicStyles = {
    container: {
      backgroundColor: isDark ? '#065F46' : '#F0FDF4',
    },
    headerLabel: {
      color: isDark ? '#A7F3D0' : '#065F46',
    },
    currencyBox: {
      backgroundColor: isDark ? '#064E3B' : '#FFFFFF',
      borderColor: isDark ? '#10B981' : '#D1FAE5',
    },
    currencyAmount: {
      color: isDark ? '#A7F3D0' : '#065F46',
    },
    currencyLabel: {
      color: isDark ? '#6EE7B7' : '#059669',
    },
    dividerText: {
      color: isDark ? '#9CA3AF' : '#6B7280',
    },
    denominationsTitle: {
      color: isDark ? '#A7F3D0' : '#065F46',
    },
    switchButton: {
      backgroundColor: isDark ? '#10B981' : '#D1FAE5',
    },
    switchButtonText: {
      color: isDark ? '#FFFFFF' : '#059669',
    },
    denominationItem: {
      backgroundColor: isDark ? '#064E3B' : '#FFFFFF',
      borderColor: isDark ? '#10B981' : '#D1FAE5',
    },
    denominationCount: {
      color: isDark ? '#A7F3D0' : '#065F46',
    },
    denominationValue: {
      color: isDark ? '#6EE7B7' : '#059669',
    },
  };

  if (changeBgn === 0 && changeEur === 0) {
    return (
      <Animated.View style={{ opacity: fadeAnim }}>
        <View style={[styles.container, dynamicStyles.container]}>
          <View style={styles.noChangeRow}>
            <Ionicons
              name="checkmark-circle"
              size={20}
              color="#10B981"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.noChangeText}>{t.noChange}</Text>
          </View>
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
  const currencySymbol = breakdownCurrency === 'BGN' ? t.lv : t.euroSymbol;
  const currencyName = breakdownCurrency === 'BGN' ? t.leva : t.euro;
  const otherCurrencyName = breakdownCurrency === 'BGN' ? t.euro : t.leva;

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <View style={[styles.container, dynamicStyles.container]}>
        {/* Заглавие */}
        <Text style={[styles.headerLabel, dynamicStyles.headerLabel]}>
          {t.headerLabel}
        </Text>

        {/* Двете валути една до друга */}
        <View style={styles.currencyRow}>
          {/* Лева */}
          <View style={[styles.currencyBox, dynamicStyles.currencyBox]}>
            <Text style={styles.currencyFlag}>🇧🇬</Text>
            <Text style={[styles.currencyAmount, dynamicStyles.currencyAmount]}>
              {formatAmount(changeBgn)}
            </Text>
            <Text style={[styles.currencyLabel, dynamicStyles.currencyLabel]}>
              {t.leva}
            </Text>
          </View>

          {/* Разделител */}
          <View style={styles.divider}>
            <Text style={[styles.dividerText, dynamicStyles.dividerText]}>
              {t.or}
            </Text>
          </View>

          {/* Евро */}
          <View style={[styles.currencyBox, dynamicStyles.currencyBox]}>
            <Text style={styles.currencyFlag}>🇪🇺</Text>
            <Text style={[styles.currencyAmount, dynamicStyles.currencyAmount]}>
              {formatAmount(changeEur)}
            </Text>
            <Text style={[styles.currencyLabel, dynamicStyles.currencyLabel]}>
              {t.euro}
            </Text>
          </View>
        </View>

        {/* Разбивка по деноминации с превключвател */}
        {denominations.length > 0 && (
          <View style={styles.denominationsSection}>
            <View style={styles.denominationsHeader}>
              <Text
                style={[
                  styles.denominationsTitle,
                  dynamicStyles.denominationsTitle,
                ]}
              >
                {t.breakdownIn} {currencyName}:
              </Text>
              <TouchableOpacity
                style={[styles.switchButton, dynamicStyles.switchButton]}
                onPress={toggleBreakdownCurrency}
              >
                <Text
                  style={[
                    styles.switchButtonText,
                    dynamicStyles.switchButtonText,
                  ]}
                >
                  {t.showIn} {otherCurrencyName} →
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.denominationsList}>
              {denominations.map((item, index) => (
                <View
                  key={index}
                  style={[
                    styles.denominationItem,
                    dynamicStyles.denominationItem,
                  ]}
                >
                  {isBanknote(item.denomination, breakdownCurrency) ? (
                    <Ionicons
                      name="cash-outline"
                      size={16}
                      color={isDark ? '#6EE7B7' : '#059669'}
                      style={styles.denominationIcon}
                    />
                  ) : (
                    <Text style={styles.denominationIcon}>🪙</Text>
                  )}
                  <Text
                    style={[
                      styles.denominationCount,
                      dynamicStyles.denominationCount,
                    ]}
                  >
                    {item.count}x
                  </Text>
                  <Text
                    style={[
                      styles.denominationValue,
                      dynamicStyles.denominationValue,
                    ]}
                  >
                    {item.denomination < 1
                      ? `${Math.round(item.denomination * 100)} ${
                          breakdownCurrency === 'BGN' ? t.stotinki : t.cents
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
            <Ionicons
              name="alert-circle-outline"
              size={18}
              color="#EF4444"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.warningText}>{t.warning}</Text>
          </View>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  headerLabel: {
    fontSize: 16,
    fontWeight: '600',
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
    borderRadius: 12,
    borderWidth: 2,
  },
  currencyFlag: {
    fontSize: 24,
    marginBottom: 4,
  },
  currencyAmount: {
    fontSize: 32,
    fontWeight: '700',
  },
  currencyLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 2,
  },
  divider: {
    paddingHorizontal: 12,
  },
  dividerText: {
    fontSize: 14,
    fontWeight: '500',
  },
  noChangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
    textAlign: 'center',
    marginBottom: 8,
  },
  switchButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  switchButtonText: {
    fontSize: 13,
    fontWeight: '600',
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
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
  },
  denominationIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  denominationCount: {
    fontSize: 14,
    fontWeight: '700',
    marginRight: 4,
  },
  denominationValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  warning: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
