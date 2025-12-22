import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { triggerHapticLight } from '../utils/haptics';
import { quickAmountsStyles as styles } from '../styles/quickAmounts.styles';
import { getQuickAmountsDynamicStyles } from '../styles/theme.styles';
import { quickAmountsTranslations } from '../translations/quickAmounts.translations';
import type { QuickAmountsProps } from '../types/quickAmounts.types';

export function QuickAmounts({
  amounts,
  onSelect,
  currency,
  isDark = false,
  language = 'bg',
  size = 'normal',
}: QuickAmountsProps) {
  const [pressedIndex, setPressedIndex] = useState<number | null>(null);
  const t = quickAmountsTranslations[language];

  // Мемоизирани динамични стилове
  const dynamicStyles = useMemo(
    () => getQuickAmountsDynamicStyles(isDark),
    [isDark]
  );

  const handlePress = useCallback(
    (amount: number, index: number) => {
      setPressedIndex(index);
      triggerHapticLight();

      setTimeout(() => {
        setPressedIndex(null);
      }, 150);

      onSelect(amount);
    },
    [onSelect]
  );

  // Мемоизиран символ на валутата
  const currencySymbol = useMemo(
    () => (currency === 'BGN' ? t.lv : t.euro),
    [currency, t]
  );

  const buttonStyle =
    size === 'small' ? styles.amountButtonSmall : styles.amountButton;
  const textStyle =
    size === 'small' ? styles.amountTextSmall : styles.amountText;
  const currencyTextStyle =
    size === 'small' ? styles.currencyTextSmall : styles.currencyText;

  return (
    <View style={styles.container}>
      {size === 'normal' && (
        <Text
          style={[styles.title, dynamicStyles.title]}
          allowFontScaling={true}
          maxFontSizeMultiplier={1.1}
        >
          {t.title}
        </Text>
      )}
      <View style={styles.buttonContainer}>
        {amounts.map((amount, index) => (
          <TouchableOpacity
            key={index}
            style={[
              buttonStyle,
              pressedIndex === index
                ? styles.amountButtonPressed
                : dynamicStyles.buttonNormal,
            ]}
            onPress={() => handlePress(amount, index)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                textStyle,
                pressedIndex === index
                  ? styles.amountTextPressed
                  : dynamicStyles.textNormal,
              ]}
              allowFontScaling={true}
              maxFontSizeMultiplier={1.1}
            >
              {amount}
            </Text>
            <Text
              style={[
                currencyTextStyle,
                pressedIndex === index
                  ? styles.currencyTextPressed
                  : dynamicStyles.currencyNormal,
              ]}
              allowFontScaling={true}
              maxFontSizeMultiplier={1.1}
            >
              {currencySymbol}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
