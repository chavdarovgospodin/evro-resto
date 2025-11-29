import React, { useState } from 'react';
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
}: QuickAmountsProps) {
  const [pressedIndex, setPressedIndex] = useState<number | null>(null);
  const t = quickAmountsTranslations[language];
  const dynamicStyles = getQuickAmountsDynamicStyles(isDark);

  const handlePress = (amount: number, index: number) => {
    setPressedIndex(index);
    triggerHapticLight();

    setTimeout(() => {
      setPressedIndex(null);
    }, 150);

    onSelect(amount);
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, dynamicStyles.title]}>{t.title}</Text>
      <View style={styles.buttonContainer}>
        {amounts.map((amount, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.amountButton,
              pressedIndex === index
                ? styles.amountButtonPressed
                : dynamicStyles.buttonNormal,
            ]}
            onPress={() => handlePress(amount, index)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.amountText,
                pressedIndex === index
                  ? styles.amountTextPressed
                  : dynamicStyles.textNormal,
              ]}
            >
              {amount}
            </Text>
            <Text
              style={[
                styles.currencyText,
                pressedIndex === index
                  ? styles.currencyTextPressed
                  : dynamicStyles.currencyNormal,
              ]}
            >
              {currency === 'BGN' ? t.lv : t.euro}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
