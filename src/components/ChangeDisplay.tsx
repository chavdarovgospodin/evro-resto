import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { View, Animated, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatAmount } from '../utils/formatter';
import { getDenominationBreakdown } from '../utils/calculator';
import { isBanknote } from '../utils/currency';
import { triggerHapticLight } from '../utils/haptics';
import { changeDisplayStyles as styles } from '../styles/changeDisplay.styles';
import { getChangeDisplayDynamicStyles } from '../styles/theme.styles';
import { changeDisplayTranslations } from '../translations/changeDisplay.translations';
import type { ChangeDisplayProps } from '../types/changeDisplay.types';
import type { CurrencyType } from '../types';

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
  const t = changeDisplayTranslations[language];

  // Мемоизирани динамични стилове
  const dynamicStyles = useMemo(
    () => getChangeDisplayDynamicStyles(isDark),
    [isDark]
  );

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

  const toggleBreakdownCurrency = useCallback(() => {
    triggerHapticLight();
    setBreakdownCurrency((prev) => (prev === 'BGN' ? 'EUR' : 'BGN'));
  }, []);

  // Мемоизирано изчисление на разбивката по деноминации
  const currentAmount = breakdownCurrency === 'BGN' ? changeBgn : changeEur;
  const denominations = useMemo(
    () => getDenominationBreakdown(currentAmount, breakdownCurrency),
    [currentAmount, breakdownCurrency]
  );

  // Мемоизирани стрингове за валута
  const currencyInfo = useMemo(
    () => ({
      symbol: breakdownCurrency === 'BGN' ? t.lv : t.euroSymbol,
      name: breakdownCurrency === 'BGN' ? t.leva : t.euro,
      otherName: breakdownCurrency === 'BGN' ? t.euro : t.leva,
    }),
    [breakdownCurrency, t]
  );

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
            <Text style={styles.noChangeText} allowFontScaling={true}
              maxFontSizeMultiplier={1.1}>{t.noChange}</Text>
          </View>
        </View>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <View style={[styles.container, dynamicStyles.container]}>
        <Text style={[styles.headerLabel, dynamicStyles.headerLabel]} allowFontScaling={true}
              maxFontSizeMultiplier={1.1}>
          {t.headerLabel}
        </Text>

        <View style={styles.currencyRow}>
          <View style={[styles.currencyBox, dynamicStyles.currencyBox]}>
            <Text style={styles.currencyFlag} allowFontScaling={true}
              maxFontSizeMultiplier={1.1}>🇧🇬</Text>
            <Text style={[styles.currencyAmount, dynamicStyles.currencyAmount]} allowFontScaling={true}
              maxFontSizeMultiplier={1.1}>
              {formatAmount(changeBgn)}
            </Text>
            <Text style={[styles.currencyLabel, dynamicStyles.currencyLabel]} allowFontScaling={true}
              maxFontSizeMultiplier={1.1}>
              {t.leva}
            </Text>
          </View>

          <View style={styles.divider}>
            <Text style={[styles.dividerText, dynamicStyles.dividerText]} allowFontScaling={true}
              maxFontSizeMultiplier={1.1}>
              {t.or}
            </Text>
          </View>

          <View style={[styles.currencyBox, dynamicStyles.currencyBox]}>
            <Text style={styles.currencyFlag} allowFontScaling={true}
              maxFontSizeMultiplier={1.1}>🇪🇺</Text>
            <Text style={[styles.currencyAmount, dynamicStyles.currencyAmount]} allowFontScaling={true}
              maxFontSizeMultiplier={1.1}>
              {formatAmount(changeEur)}
            </Text>
            <Text style={[styles.currencyLabel, dynamicStyles.currencyLabel]} allowFontScaling={true}
              maxFontSizeMultiplier={1.1}>
              {t.euro}
            </Text>
          </View>
        </View>

        {denominations.length > 0 && (
          <View style={styles.denominationsSection}>
            <View style={styles.denominationsHeader}>
              <Text
                style={[
                  styles.denominationsTitle,
                  dynamicStyles.denominationsTitle,
                ]}
              >
                {t.breakdownIn} {currencyInfo.name}:
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
                  {t.showIn} {currencyInfo.otherName} →
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
                    <Text style={styles.denominationIcon} allowFontScaling={true}
              maxFontSizeMultiplier={1.1}>🪙</Text>
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
                      : `${formatAmount(item.denomination)} ${
                          currencyInfo.symbol
                        }`}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {changeBgn > 500 && (
          <View style={styles.warning}>
            <Ionicons
              name="alert-circle-outline"
              size={18}
              color="#EF4444"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.warningText} allowFontScaling={true}
              maxFontSizeMultiplier={1.1}>{t.warning}</Text>
          </View>
        )}
      </View>
    </Animated.View>
  );
}
