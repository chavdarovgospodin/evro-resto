/**
 * ChangeDisplay Вариант 3: Вертикален stack с accent линия
 * - Двете суми една под друга
 * - Accent линия отляво
 * - Компактен и елегантен
 */
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  View,
  Animated,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatAmount } from '../utils/formatter';
import { getDenominationBreakdown } from '../utils/calculator';
import { isBanknote } from '../utils/currency';
import { triggerHapticLight } from '../utils/haptics';
import { changeDisplayTranslations } from '../translations/changeDisplay.translations';
import type { ChangeDisplayProps } from '../types/changeDisplay.types';
import type { CurrencyType } from '../types';

export function ChangeDisplayV3({
  changeBgn,
  changeEur,
  isDark = false,
  language = 'bg',
}: ChangeDisplayProps) {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const [breakdownCurrency, setBreakdownCurrency] =
    useState<CurrencyType>('BGN');
  const t = changeDisplayTranslations[language];

  const colors = {
    bg: isDark ? '#1F2937' : '#FFFFFF',
    accent: '#10B981',
    accentLight: isDark ? '#064E3B' : '#D1FAE5',
    text: isDark ? '#F9FAFB' : '#1F2937',
    secondaryText: isDark ? '#9CA3AF' : '#6B7280',
    border: isDark ? '#374151' : '#E5E7EB',
  };

  useEffect(() => {
    if (changeBgn > 0 || changeEur > 0) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [changeBgn, changeEur, fadeAnim]);

  const toggleBreakdownCurrency = useCallback(() => {
    triggerHapticLight();
    setBreakdownCurrency((prev) => (prev === 'BGN' ? 'EUR' : 'BGN'));
  }, []);

  const currentAmount = breakdownCurrency === 'BGN' ? changeBgn : changeEur;
  const denominations = useMemo(
    () => getDenominationBreakdown(currentAmount, breakdownCurrency),
    [currentAmount, breakdownCurrency]
  );

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: colors.bg,
          borderColor: colors.border,
          opacity: fadeAnim,
        },
      ]}
    >
      {/* Accent линия отляво */}
      <View style={[styles.accentLine, { backgroundColor: colors.accent }]} />

      <View style={styles.content}>
        <Text style={[styles.header, { color: colors.secondaryText }]}>
          Ресто:
        </Text>

        {/* BGN ред */}
        <View style={styles.amountRow}>
          <View style={styles.flagContainer}>
            <Text style={styles.flag}>🇧🇬</Text>
          </View>
          <View style={styles.amountContent}>
            <Text style={[styles.amount, { color: colors.text }]}>
              {formatAmount(changeBgn)}
            </Text>
            <Text style={[styles.currencyLabel, { color: colors.secondaryText }]}>
              {t.leva}
            </Text>
          </View>
        </View>

        {/* Разделител */}
        <View style={styles.separator}>
          <View style={[styles.separatorLine, { backgroundColor: colors.border }]} />
          <Text style={[styles.separatorText, { color: colors.secondaryText }]}>
            {t.or}
          </Text>
          <View style={[styles.separatorLine, { backgroundColor: colors.border }]} />
        </View>

        {/* EUR ред */}
        <View style={styles.amountRow}>
          <View style={styles.flagContainer}>
            <Text style={styles.flag}>🇪🇺</Text>
          </View>
          <View style={styles.amountContent}>
            <Text style={[styles.amount, { color: colors.text }]}>
              {formatAmount(changeEur)}
            </Text>
            <Text style={[styles.currencyLabel, { color: colors.secondaryText }]}>
              {t.euro}
            </Text>
          </View>
        </View>

        {/* Разбивка */}
        {denominations.length > 0 && (
          <View style={[styles.breakdown, { borderTopColor: colors.border }]}>
            <TouchableOpacity
              style={[styles.breakdownToggle, { backgroundColor: colors.accentLight }]}
              onPress={toggleBreakdownCurrency}
            >
              <Text style={styles.breakdownFlag}>
                {breakdownCurrency === 'BGN' ? '🇧🇬' : '🇪🇺'}
              </Text>
              <Text style={[styles.breakdownTitle, { color: colors.text }]}>
                {t.breakdownIn} {breakdownCurrency === 'BGN' ? t.leva : t.euro}
              </Text>
              <View style={[styles.switchIcon, { backgroundColor: colors.accent }]}>
                <Ionicons name="repeat" size={14} color="#FFFFFF" />
              </View>
            </TouchableOpacity>

            <View style={styles.denominationsGrid}>
              {denominations.map((item, index) => (
                <View
                  key={index}
                  style={[
                    styles.denomItem,
                    { backgroundColor: colors.accentLight },
                  ]}
                >
                  {isBanknote(item.denomination, breakdownCurrency) ? (
                    <Text style={styles.denomIcon}>💶</Text>
                  ) : (
                    <Text style={styles.denomIcon}>🪙</Text>
                  )}
                  <Text style={[styles.denomCount, { color: colors.accent }]}>
                    {item.count}×
                  </Text>
                  <Text style={[styles.denomValue, { color: colors.text }]}>
                    {item.denomination < 1
                      ? `${Math.round(item.denomination * 100)} ${
                          breakdownCurrency === 'BGN' ? t.stotinki : t.cents
                        }`
                      : `${item.denomination} ${
                          breakdownCurrency === 'BGN' ? t.lv : t.euroSymbol
                        }`}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  accentLine: {
    width: 5,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flagContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  flag: {
    fontSize: 24,
  },
  amountContent: {
    flex: 1,
  },
  amount: {
    fontSize: 32,
    fontWeight: '700',
  },
  currencyLabel: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
    paddingLeft: 58,
  },
  separatorLine: {
    flex: 1,
    height: 1,
  },
  separatorText: {
    fontSize: 12,
    fontWeight: '500',
    marginHorizontal: 12,
  },
  breakdown: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  breakdownToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    gap: 8,
  },
  breakdownFlag: {
    fontSize: 18,
  },
  breakdownTitle: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  switchIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  denominationsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  denomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  denomIcon: {
    fontSize: 14,
    marginRight: 2,
  },
  denomCount: {
    fontSize: 14,
    fontWeight: '800',
  },
  denomValue: {
    fontSize: 14,
    fontWeight: '500',
  },
});
