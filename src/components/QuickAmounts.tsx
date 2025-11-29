import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import type { LanguageType } from '../context/AppContext';

const triggerHapticFeedback = () => {
  try {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } catch (e) {
    // Haptics not available
  }
};

// Преводи
const translations = {
  bg: {
    title: 'Чести суми',
    lv: 'лв',
    euro: '€',
  },
  en: {
    title: 'Quick amounts',
    lv: 'lv',
    euro: '€',
  },
};

interface QuickAmountsProps {
  amounts: number[];
  onSelect: (amount: number) => void;
  currency: 'BGN' | 'EUR';
  isDark?: boolean;
  language?: LanguageType;
}

export function QuickAmounts({
  amounts,
  onSelect,
  currency,
  isDark = false,
  language = 'bg',
}: QuickAmountsProps) {
  const [pressedIndex, setPressedIndex] = useState<number | null>(null);
  const t = translations[language];

  const handlePress = (amount: number, index: number) => {
    setPressedIndex(index);
    triggerHapticFeedback();

    setTimeout(() => {
      setPressedIndex(null);
    }, 150);

    onSelect(amount);
  };

  const dynamicStyles = {
    title: {
      color: isDark ? '#9CA3AF' : '#9CA3AF',
    },
    buttonNormal: {
      backgroundColor: isDark ? '#374151' : '#F9FAFB',
      borderColor: isDark ? '#4B5563' : '#E5E7EB',
    },
    textNormal: {
      color: isDark ? '#F9FAFB' : '#374151',
    },
    currencyNormal: {
      color: isDark ? '#9CA3AF' : '#9CA3AF',
    },
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

const styles = StyleSheet.create({
  container: {
    marginTop: 14,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  amountButton: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  amountButtonPressed: {
    backgroundColor: '#7C3AED',
    borderColor: '#7C3AED',
    transform: [{ scale: 0.95 }],
  },
  amountText: {
    fontSize: 18,
    fontWeight: '700',
  },
  amountTextPressed: {
    color: '#FFFFFF',
  },
  currencyText: {
    fontSize: 12,
    marginTop: 2,
  },
  currencyTextPressed: {
    color: '#FFFFFF',
  },
});
