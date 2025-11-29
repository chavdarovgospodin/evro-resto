import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Keyboard,
  StyleSheet,
  TextInput,
  Platform,
  StatusBar as RNStatusBar,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { ChangeDisplay } from './ChangeDisplay';
import { QuickAmounts } from './QuickAmounts';
import {
  calculateChange,
  parseCurrencyString,
  convertBgnToEur,
  convertEurToBgn,
} from '../utils/calculator';
import { formatAmount } from '../utils/formatter';
import { useApp, CurrencyType } from '../context/AppContext';

interface CalculatorProps {
  onOpenSettings?: () => void;
}

export function Calculator({ onOpenSettings }: CalculatorProps) {
  const { settings, t } = useApp();
  const { currency: defaultCurrency, theme, language } = settings;
  const isDark = theme === 'dark';
  const insets = useSafeAreaInsets();

  // На iOS използваме safe area insets, на Android използваме StatusBar height
  const topPadding =
    Platform.OS === 'ios'
      ? Math.max(insets.top, 20) + 10 // iOS: safe area + малко допълнително
      : (RNStatusBar.currentHeight || 24) + 10; // Android: status bar height + малко допълнително

  // Запазваме оригиналните стойности в BGN за да избегнем грешки при закръгляване
  const [receivedBgn, setReceivedBgn] = useState<number>(0);
  const [billBgn, setBillBgn] = useState<number>(0);
  const [received, setReceived] = useState('');
  const [bill, setBill] = useState('');
  const [primaryCurrency, setPrimaryCurrency] =
    useState<CurrencyType>(defaultCurrency);
  const [error, setError] = useState<string>('');
  const [receivedFocused, setReceivedFocused] = useState(false);
  const [billFocused, setBillFocused] = useState(false);

  const billInputRef = useRef<TextInput>(null);
  const receivedInputRef = useRef<TextInput>(null);

  // Синхронизиране на валутата с настройките
  useEffect(() => {
    setPrimaryCurrency(defaultCurrency);
  }, [defaultCurrency]);

  const changeResult = calculateChange(
    parseCurrencyString(received),
    parseCurrencyString(bill)
  );

  useEffect(() => {
    if (!changeResult.isValid && changeResult.error) {
      // Превеждаме грешката
      if (
        changeResult.error.includes('Недостатъчна') ||
        changeResult.error.includes('Insufficient')
      ) {
        setError(t('error.insufficient'));
      } else {
        setError(t('error.invalid'));
      }
    } else {
      setError('');
    }
  }, [changeResult, t]);

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

    // Запазваме стойността в BGN
    const numValue = parseCurrencyString(filteredText);
    if (primaryCurrency === 'BGN') {
      setReceivedBgn(numValue);
    } else {
      setReceivedBgn(convertEurToBgn(numValue));
    }
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

    // Запазваме стойността в BGN
    const numValue = parseCurrencyString(filteredText);
    if (primaryCurrency === 'BGN') {
      setBillBgn(numValue);
    } else {
      setBillBgn(convertEurToBgn(numValue));
    }
  };

  const handleReceivedQuickAmount = (amount: number) => {
    const formatted = formatAmount(amount);
    setReceived(formatted);
    // Запазваме в BGN
    if (primaryCurrency === 'BGN') {
      setReceivedBgn(amount);
    } else {
      setReceivedBgn(convertEurToBgn(amount));
    }
  };

  const handleBillQuickAmount = (amount: number) => {
    const formatted = formatAmount(amount);
    setBill(formatted);
    // Запазваме в BGN
    if (primaryCurrency === 'BGN') {
      setBillBgn(amount);
    } else {
      setBillBgn(convertEurToBgn(amount));
    }
  };

  // Обща функция за смяна на валута с превалутиране
  const switchToCurrency = (newCurrency: CurrencyType) => {
    if (newCurrency === primaryCurrency) return;

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (e) {
      // Haptics not available
    }

    // Конвертираме от запазените BGN стойности за да избегнем натрупване на грешки
    if (receivedBgn > 0) {
      const converted =
        newCurrency === 'EUR' ? convertBgnToEur(receivedBgn) : receivedBgn;
      setReceived(formatAmount(converted));
    }

    if (billBgn > 0) {
      const converted =
        newCurrency === 'EUR' ? convertBgnToEur(billBgn) : billBgn;
      setBill(formatAmount(converted));
    }

    setPrimaryCurrency(newCurrency);
  };

  const handleCurrencySwap = () => {
    const newCurrency = primaryCurrency === 'BGN' ? 'EUR' : 'BGN';
    switchToCurrency(newCurrency);
  };

  const handleOpenSettings = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (e) {
      // Haptics not available
    }
    onOpenSettings?.();
  };

  const handleClear = () => {
    setReceived('');
    setBill('');
    setReceivedBgn(0);
    setBillBgn(0);
    setError('');
    Keyboard.dismiss();
  };

  const hasContent = received.trim() || bill.trim();

  // Динамични стилове за тъмна тема
  const dynamicStyles = {
    safeArea: {
      backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
    },
    container: {
      backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
    },
    settingsButton: {
      backgroundColor: isDark ? '#374151' : '#F3F4F6',
    },
    text: {
      color: isDark ? '#F9FAFB' : '#1F2937',
    },
    secondaryText: {
      color: isDark ? '#9CA3AF' : '#6B7280',
    },
    input: {
      backgroundColor: isDark ? '#374151' : '#FFFFFF',
      borderColor: isDark ? '#4B5563' : '#E5E7EB',
      color: isDark ? '#F9FAFB' : '#1F2937',
    },
    exchangeRate: {
      backgroundColor: isDark ? '#374151' : '#F3F4F6',
    },
    currencyButtonInactive: {
      backgroundColor: isDark ? '#374151' : '#FFFFFF',
      borderColor: isDark ? '#4B5563' : '#E5E7EB',
    },
    swapButton: {
      backgroundColor: isDark ? '#3B3B6D' : '#EDE9FE',
    },
  };

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: topPadding },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Горна лента: курс вляво, настройки вдясно */}
        <View style={styles.topBar}>
          <View style={[styles.exchangeRateBadge, dynamicStyles.exchangeRate]}>
            <Text
              style={[styles.exchangeRateText, dynamicStyles.secondaryText]}
            >
              {t('calc.exchangeRate')}
            </Text>
          </View>
          {onOpenSettings && (
            <TouchableOpacity
              style={[styles.settingsButton, dynamicStyles.settingsButton]}
              onPress={handleOpenSettings}
              activeOpacity={0.7}
            >
              <Ionicons
                name="settings-outline"
                size={22}
                color={isDark ? '#9CA3AF' : '#6B7280'}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Заглавие */}
        <View style={styles.header}>
          <Text style={styles.title}>{t('app.title')}</Text>
          <Text style={[styles.subtitle, dynamicStyles.secondaryText]}>
            {t('app.subtitle')}
          </Text>
        </View>

        {/* Валутен селектор */}
        <View style={styles.currencySelector}>
          <TouchableOpacity
            style={[
              styles.currencyButton,
              primaryCurrency === 'BGN'
                ? styles.currencyButtonActive
                : dynamicStyles.currencyButtonInactive,
            ]}
            onPress={() => switchToCurrency('BGN')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.currencyButtonText,
                primaryCurrency === 'BGN'
                  ? styles.currencyButtonTextActive
                  : dynamicStyles.text,
              ]}
            >
              🇧🇬 {t('currency.bgn')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.swapButton, dynamicStyles.swapButton]}
            onPress={handleCurrencySwap}
            activeOpacity={0.7}
          >
            <Ionicons
              name="swap-horizontal"
              size={24}
              color={isDark ? '#A78BFA' : '#7C3AED'}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.currencyButton,
              primaryCurrency === 'EUR'
                ? styles.currencyButtonActive
                : dynamicStyles.currencyButtonInactive,
            ]}
            onPress={() => switchToCurrency('EUR')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.currencyButtonText,
                primaryCurrency === 'EUR'
                  ? styles.currencyButtonTextActive
                  : dynamicStyles.text,
              ]}
            >
              🇪🇺 {t('currency.eur')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Input полета */}
        <View style={styles.inputsContainer}>
          {/* Поле Получих */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, dynamicStyles.text]}>
              {t('calc.received')}
            </Text>
            <View style={styles.inputWrapper}>
              <TextInput
                ref={receivedInputRef}
                style={[
                  styles.input,
                  dynamicStyles.input,
                  receivedFocused && styles.inputFocused,
                ]}
                value={received}
                onChangeText={handleReceivedChange}
                onFocus={() => setReceivedFocused(true)}
                onBlur={() => setReceivedFocused(false)}
                placeholder="0.00"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
              />
              <Text
                style={[styles.currencySymbol, dynamicStyles.secondaryText]}
              >
                {primaryCurrency === 'BGN'
                  ? t('currency.lv')
                  : t('currency.euro')}
              </Text>
            </View>
            <QuickAmounts
              amounts={[5, 10, 20, 50, 100]}
              onSelect={handleReceivedQuickAmount}
              currency={primaryCurrency}
              isDark={isDark}
              language={language}
            />
          </View>

          {/* Поле Сметка */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, dynamicStyles.text]}>
              {t('calc.bill')}
            </Text>
            <View style={styles.inputWrapper}>
              <TextInput
                ref={billInputRef}
                style={[
                  styles.input,
                  dynamicStyles.input,
                  billFocused && styles.inputFocused,
                ]}
                value={bill}
                onChangeText={handleBillChange}
                onFocus={() => setBillFocused(true)}
                onBlur={() => setBillFocused(false)}
                placeholder="0.00"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
              />
              <Text
                style={[styles.currencySymbol, dynamicStyles.secondaryText]}
              >
                {primaryCurrency === 'BGN'
                  ? t('currency.lv')
                  : t('currency.euro')}
              </Text>
            </View>
            <QuickAmounts
              amounts={[5, 10, 20, 50, 100]}
              onSelect={handleBillQuickAmount}
              currency={primaryCurrency}
              isDark={isDark}
              language={language}
            />
          </View>

          {/* Грешка */}
          {error && (
            <View style={styles.errorContainer}>
              <Ionicons
                name="warning-outline"
                size={18}
                color="#EF4444"
                style={styles.errorIcon}
              />
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
                primaryCurrency={primaryCurrency}
                isDark={isDark}
                language={language}
              />
            ) : (
              <View
                style={[
                  styles.noChangeContainer,
                  isDark && styles.noChangeContainerDark,
                ]}
              >
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color="#10B981"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.noChangeText}>{t('change.noChange')}</Text>
              </View>
            ))}

          {/* Бутон за изчистване */}
          <TouchableOpacity
            style={[
              styles.clearButton,
              hasContent
                ? styles.clearButtonEnabled
                : isDark
                ? styles.clearButtonDisabledDark
                : styles.clearButtonDisabled,
            ]}
            onPress={handleClear}
            disabled={!hasContent}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.clearButtonText,
                hasContent
                  ? styles.clearButtonTextEnabled
                  : styles.clearButtonTextDisabled,
              ]}
            >
              {t('calc.clear')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    // paddingTop се задава динамично
    paddingBottom: 100,
  },
  // Горна лента с курс и настройки
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  exchangeRateBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  exchangeRateText: {
    fontSize: 12,
    fontWeight: '500',
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Заглавие
  header: {
    alignItems: 'center',
    marginBottom: 22,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: '#7C3AED',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
  },
  currencySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 10,
  },
  currencyButton: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 28,
    borderWidth: 1,
    minWidth: 140,
    alignItems: 'center',
  },
  currencyButtonActive: {
    backgroundColor: '#7C3AED',
    borderColor: '#7C3AED',
  },
  currencyButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  currencyButtonTextActive: {
    color: '#FFFFFF',
  },
  swapButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
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
    marginBottom: 18,
  },
  inputLabel: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 10,
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 14,
    paddingRight: 55,
    fontSize: 22,
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
    marginRight: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#EF4444',
    flex: 1,
  },
  noChangeContainer: {
    flexDirection: 'row',
    backgroundColor: '#F0FDF4',
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  noChangeContainerDark: {
    backgroundColor: '#065F46',
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
    backgroundColor: '#7e44e3',
  },
  clearButtonDisabled: {
    backgroundColor: '#F3F4F6',
  },
  clearButtonDisabledDark: {
    backgroundColor: '#374151',
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
