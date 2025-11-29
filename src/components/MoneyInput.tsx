import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Platform,
  StyleSheet
} from 'react-native';
import { theme } from '../theme';
import { formatAmount } from '../utils/formatter';

interface MoneyInputProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder?: string;
  currency: 'BGN' | 'EUR';
  error?: string;
  autoFocus?: boolean;
}

/**
 * Компонент за въвеждане на парични суми
 * Изисквания:
 * - Показва numeric keyboard на мобилни устройства
 * - Автоматично форматира числото (1234.5 -> 1,234.50)
 * - Не позволява повече от 2 цифри след десетичната точка
 * - Не позволява отрицателни числа
 * - Максимална стойност: 99999.99
 * - При фокус селектира целия текст
 * - Показва валутата отдясно (лв или €)
 */
export function MoneyInput({
  value,
  onChange,
  label,
  placeholder = '0.00',
  currency,
  error,
  autoFocus = false
}: MoneyInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [displayValue, setDisplayValue] = useState(value);
  const inputRef = useRef<TextInput>(null);

  // Синхронизиране на displayValue с value
  useEffect(() => {
    if (value !== displayValue) {
      setDisplayValue(value);
    }
  }, [value]);

  const handleFocus = () => {
    setIsFocused(true);
    // Селектира целия текст при фокус
    setTimeout(() => {
      inputRef.current?.setNativeProps({ selection: { start: 0, end: displayValue.length } });
    }, 50);
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Форматира стойността при загуба на фокус
    if (displayValue.trim() === '' || displayValue === '0') {
      setDisplayValue('');
      onChange('');
      return;
    }

    const numericValue = parseFloat(displayValue.replace(/[^\d.]/g, '')) || 0;
    if (numericValue > 0) {
      const formatted = formatAmount(numericValue);
      setDisplayValue(formatted);
      onChange(formatted);
    } else {
      setDisplayValue('');
      onChange('');
    }
  };

  const handleChangeText = (text: string) => {
    // Позволяваме свободно въвеждане по време на писане
    // Позволяваме както точка, така и запетая като десетичен разделител
    let filteredText = text.replace(/[^\d.,]/g, '');

    // Конвертираме запетаи в точки за вътрешна обработка
    filteredText = filteredText.replace(',', '.');

    // Позволяваме само една десетична точка
    const parts = filteredText.split('.');
    if (parts.length > 2) {
      filteredText = parts[0] + '.' + parts.slice(1).join('');
    }

    // Ограничаваме до 2 цифри след десетичната точка
    if (parts.length > 1) {
      // Винаги ограничаваме до максимум 2 цифри след точката
      parts[1] = parts[1].substring(0, 2);
      filteredText = parts[0] + '.' + parts[1];
    }

    // Максимум 9 символа (999999.99)
    if (filteredText.length > 9) {
      filteredText = filteredText.substring(0, 9);
    }

    setDisplayValue(filteredText);
    onChange(filteredText);
  };

  const getCurrencySymbol = () => currency === 'BGN' ? 'лв' : '€';

  const getBorderColor = () => {
    if (error) return theme.colors.error;
    if (isFocused) return theme.colors.primary;
    return theme.colors.border;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
      </Text>

      <View style={styles.inputContainer}>
        <TextInput
          ref={inputRef}
          style={[
            styles.input,
            { borderColor: getBorderColor() }
          ]}
          value={displayValue}
          onChangeText={handleChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textMuted}
          keyboardType="numeric"
          autoFocus={autoFocus}
          selectTextOnFocus={Platform.OS !== 'web'}
          maxLength={10}
        />
        <Text style={styles.currencySymbol}>
          {getCurrencySymbol()}
        </Text>
      </View>

      {error && (
        <Text style={styles.errorText}>
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    borderWidth: 2,
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    paddingRight: 50,
    fontSize: theme.typography.sizes.xl,
    backgroundColor: theme.colors.background,
    color: theme.colors.textPrimary,
  },
  currencySymbol: {
    position: 'absolute',
    right: theme.spacing.lg,
    top: '50%',
    transform: [{ translateY: -10 }],
    fontSize: theme.typography.sizes.md,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.weights.medium,
  },
  errorText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
  },
});
