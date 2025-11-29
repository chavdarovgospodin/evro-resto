import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';

const triggerHapticFeedback = () => {
  try {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } catch (e) {
    // Haptics not available
  }
};

interface QuickAmountsProps {
  amounts: number[];
  onSelect: (amount: number) => void;
  currency: 'BGN' | 'EUR';
}

export function QuickAmounts({
  amounts,
  onSelect,
  currency,
}: QuickAmountsProps) {
  const [pressedIndex, setPressedIndex] = useState<number | null>(null);

  const handlePress = (amount: number, index: number) => {
    setPressedIndex(index);
    triggerHapticFeedback();

    setTimeout(() => {
      setPressedIndex(null);
    }, 150);

    onSelect(amount);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Чести суми</Text>
      <View style={styles.buttonContainer}>
        {amounts.map((amount, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.amountButton,
              pressedIndex === index
                ? styles.amountButtonPressed
                : styles.amountButtonNormal,
            ]}
            onPress={() => handlePress(amount, index)}
          >
            <Text
              style={[
                styles.amountText,
                pressedIndex === index
                  ? styles.amountTextPressed
                  : styles.amountTextNormal,
              ]}
            >
              {amount}
            </Text>
            <Text
              style={[
                styles.currencyText,
                pressedIndex === index
                  ? styles.currencyTextPressed
                  : styles.currencyTextNormal,
              ]}
            >
              {currency === 'BGN' ? 'лв' : '€'}
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
    color: '#9CA3AF',
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
  amountButtonNormal: {
    backgroundColor: '#F9FAFB',
    borderColor: '#E5E7EB',
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
  amountTextNormal: {
    color: '#374151',
  },
  amountTextPressed: {
    color: '#FFFFFF',
  },
  currencyText: {
    fontSize: 12,
    marginTop: 2,
  },
  currencyTextNormal: {
    color: '#9CA3AF',
  },
  currencyTextPressed: {
    color: '#FFFFFF',
  },
});
