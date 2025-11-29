import React, { useEffect, useState } from 'react';
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
  const dynamicStyles = getChangeDisplayDynamicStyles(isDark);

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
    triggerHapticLight();
    setBreakdownCurrency((prev) => (prev === 'BGN' ? 'EUR' : 'BGN'));
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
        <Text style={[styles.headerLabel, dynamicStyles.headerLabel]}>
          {t.headerLabel}
        </Text>

        <View style={styles.currencyRow}>
          <View style={[styles.currencyBox, dynamicStyles.currencyBox]}>
            <Text style={styles.currencyFlag}>🇧🇬</Text>
            <Text style={[styles.currencyAmount, dynamicStyles.currencyAmount]}>
              {formatAmount(changeBgn)}
            </Text>
            <Text style={[styles.currencyLabel, dynamicStyles.currencyLabel]}>
              {t.leva}
            </Text>
          </View>

          <View style={styles.divider}>
            <Text style={[styles.dividerText, dynamicStyles.dividerText]}>
              {t.or}
            </Text>
          </View>

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
