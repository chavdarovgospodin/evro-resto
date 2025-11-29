import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Keyboard,
  StyleSheet,
  TextInput,
  SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { ChangeDisplay } from './ChangeDisplay';
import { QuickAmounts } from './QuickAmounts';
import {
  calculateChange,
  getDenominationBreakdown,
  parseCurrencyString,
  convertBgnToEur,
  convertEurToBgn,
} from '../utils/calculator';
import { formatAmount } from '../utils/formatter';

type CurrencyType = 'BGN' | 'EUR';

export function Calculator() {
  const [received, setReceived] = useState('');
  const [bill, setBill] = useState('');
  const [primaryCurrency, setPrimaryCurrency] = useState<CurrencyType>('BGN');
  const [error, setError] = useState<string>('');
  const [receivedFocused, setReceivedFocused] = useState(false);
  const [billFocused, setBillFocused] = useState(false);

  const billInputRef = useRef<TextInput>(null);
  const receivedInputRef = useRef<TextInput>(null);

  const changeResult = calculateChange(
    parseCurrencyString(received),
    parseCurrencyString(bill)
  );

  const denominationBreakdown =
    changeResult.isValid && changeResult.bgn > 0
      ? getDenominationBreakdown(changeResult.bgn, 'BGN')
      : [];

  useEffect(() => {
    if (!changeResult.isValid && changeResult.error) {
      setError(changeResult.error);
    } else {
      setError('');
    }
  }, [changeResult]);

  const handleReceivedChange = (text: string) => {
    let filteredText = text.replace(/[^\d.,]/g, '');
    filteredText = filteredText.replace(',', '.');

    const parts = filteredText.split('.');
    if (parts.length > 2) {
      filteredText = parts[0] + '.' + parts.slice(1).join('');
    }
    if (parts.length > 1) {
      parts[1] = parts[1].substring(0, 2);
      filteredText = parts[0] + '.' + parts[1];
    }
    if (filteredText.length > 9) {
      filteredText = filteredText.substring(0, 9);
    }

    setReceived(filteredText);
  };

  const handleBillChange = (text: string) => {
    let filteredText = text.replace(/[^\d.,]/g, '');
    filteredText = filteredText.replace(',', '.');

    const parts = filteredText.split('.');
    if (parts.length > 2) {
      filteredText = parts[0] + '.' + parts.slice(1).join('');
    }
    if (parts.length > 1) {
      parts[1] = parts[1].substring(0, 2);
      filteredText = parts[0] + '.' + parts[1];
    }
    if (filteredText.length > 9) {
      filteredText = filteredText.substring(0, 9);
    }

    setBill(filteredText);
  };

  const handleReceivedQuickAmount = (amount: number) => {
    const formatted = formatAmount(amount);
    setReceived(formatted);
  };

  const handleBillQuickAmount = (amount: number) => {
    const formatted = formatAmount(amount);
    setBill(formatted);
  };

  const handleCurrencySwap = () => {
    // Haptic feedback
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (e) {
      // Haptics not available
    }

    const newCurrency = primaryCurrency === 'BGN' ? 'EUR' : 'BGN';

    if (received) {
      const receivedNum = parseCurrencyString(received);
      if (receivedNum > 0) {
        const converted =
          newCurrency === 'EUR'
            ? convertBgnToEur(receivedNum)
            : convertEurToBgn(receivedNum);
        setReceived(converted.toFixed(2));
      }
    }

    if (bill) {
      const billNum = parseCurrencyString(bill);
      if (billNum > 0) {
        const converted =
          newCurrency === 'EUR'
            ? convertBgnToEur(billNum)
            : convertEurToBgn(billNum);
        setBill(converted.toFixed(2));
      }
    }

    setPrimaryCurrency(newCurrency);
  };

  const handleClear = () => {
    setReceived('');
    setBill('');
    setError('');
    Keyboard.dismiss();
  };

  const hasContent = received.trim() || bill.trim();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Заглавие */}
        <View style={styles.header}>
          <Text style={styles.title}>Евро Ресто</Text>
          <Text style={styles.subtitle}>
            Калкулатор за ресто при преминаване към евро
          </Text>
          <View style={styles.exchangeRateContainer}>
            <Text style={styles.exchangeRateText}>1 € = 1.95583 лв</Text>
          </View>
        </View>

        {/* Валутен селектор */}
        <View style={styles.currencySelector}>
          <TouchableOpacity
            style={[
              styles.currencyButton,
              primaryCurrency === 'BGN'
                ? styles.currencyButtonActive
                : styles.currencyButtonInactive,
            ]}
            onPress={() => setPrimaryCurrency('BGN')}
          >
            <Text
              style={[
                styles.currencyButtonText,
                primaryCurrency === 'BGN'
                  ? styles.currencyButtonTextActive
                  : styles.currencyButtonTextInactive,
              ]}
            >
              🇧🇬 Лева
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.swapButton}
            onPress={handleCurrencySwap}
          >
            <Text style={styles.swapButtonText}>⇄</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.currencyButton,
              primaryCurrency === 'EUR'
                ? styles.currencyButtonActive
                : styles.currencyButtonInactive,
            ]}
            onPress={() => setPrimaryCurrency('EUR')}
          >
            <Text
              style={[
                styles.currencyButtonText,
                primaryCurrency === 'EUR'
                  ? styles.currencyButtonTextActive
                  : styles.currencyButtonTextInactive,
              ]}
            >
              🇪🇺 Евро
            </Text>
          </TouchableOpacity>
        </View>

        {/* Input полета */}
        <View style={styles.inputsContainer}>
          {/* Поле Получих */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Получих</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                ref={receivedInputRef}
                style={[styles.input, receivedFocused && styles.inputFocused]}
                value={received}
                onChangeText={handleReceivedChange}
                onFocus={() => setReceivedFocused(true)}
                onBlur={() => setReceivedFocused(false)}
                placeholder="0.00"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
              />
              <Text style={styles.currencySymbol}>
                {primaryCurrency === 'BGN' ? 'лв' : '€'}
              </Text>
            </View>
            <QuickAmounts
              amounts={[5, 10, 20, 50, 100]}
              onSelect={handleReceivedQuickAmount}
              currency={primaryCurrency}
            />
          </View>

          {/* Поле Сметка */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Сметка</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                ref={billInputRef}
                style={[styles.input, billFocused && styles.inputFocused]}
                value={bill}
                onChangeText={handleBillChange}
                onFocus={() => setBillFocused(true)}
                onBlur={() => setBillFocused(false)}
                placeholder="0.00"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
              />
              <Text style={styles.currencySymbol}>
                {primaryCurrency === 'BGN' ? 'лв' : '€'}
              </Text>
            </View>
            <QuickAmounts
              amounts={[5, 10, 20, 50, 100]}
              onSelect={handleBillQuickAmount}
              currency={primaryCurrency}
            />
          </View>

          {/* Грешка */}
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorIcon}>⚠️</Text>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Резултат */}
          {received.trim() &&
            bill.trim() &&
            changeResult.isValid &&
            (changeResult.bgn > 0 ? (
              <ChangeDisplay
                changeBgn={changeResult.bgn}
                changeEur={changeResult.eur}
                denominations={denominationBreakdown}
                primaryCurrency={primaryCurrency}
              />
            ) : (
              <View style={styles.noChangeContainer}>
                <Text style={styles.noChangeText}>
                  ✅ Точна сума - няма ресто
                </Text>
              </View>
            ))}

          {/* Бутон за изчистване */}
          <TouchableOpacity
            style={[
              styles.clearButton,
              hasContent
                ? styles.clearButtonEnabled
                : styles.clearButtonDisabled,
            ]}
            onPress={handleClear}
            disabled={!hasContent}
          >
            <Text
              style={[
                styles.clearButtonText,
                hasContent
                  ? styles.clearButtonTextEnabled
                  : styles.clearButtonTextDisabled,
              ]}
            >
              Изчисти
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#7C3AED',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  exchangeRateContainer: {
    marginTop: 12,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  exchangeRateText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  currencySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
    gap: 10,
  },
  currencyButton: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 28,
    borderWidth: 1,
    minWidth: 115,
    alignItems: 'center',
  },
  currencyButtonActive: {
    backgroundColor: '#7C3AED',
    borderColor: '#7C3AED',
  },
  currencyButtonInactive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
  },
  currencyButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  currencyButtonTextActive: {
    color: '#FFFFFF',
  },
  currencyButtonTextInactive: {
    color: '#1F2937',
  },
  swapButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EDE9FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  swapButtonText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#7C3AED',
  },
  inputsContainer: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 10,
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 18,
    paddingRight: 55,
    fontSize: 22,
    backgroundColor: '#FFFFFF',
    color: '#1F2937',
  },
  inputFocused: {
    borderColor: '#7C3AED',
    borderWidth: 2,
  },
  currencySymbol: {
    position: 'absolute',
    right: 18,
    top: '50%',
    transform: [{ translateY: -12 }],
    fontSize: 18,
    color: '#6B7280',
    fontWeight: '500',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderColor: '#EF4444',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  errorIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#EF4444',
    flex: 1,
  },
  noChangeContainer: {
    backgroundColor: '#F0FDF4',
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    marginBottom: 20,
  },
  noChangeText: {
    fontSize: 17,
    color: '#10B981',
    textAlign: 'center',
    fontWeight: '500',
  },
  clearButton: {
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  clearButtonEnabled: {
    backgroundColor: '#EF4444',
  },
  clearButtonDisabled: {
    backgroundColor: '#F3F4F6',
  },
  clearButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  clearButtonTextEnabled: {
    color: '#FFFFFF',
  },
  clearButtonTextDisabled: {
    color: '#9CA3AF',
  },
});
