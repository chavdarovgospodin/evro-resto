import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Keyboard,
  TextInput,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
import {
  sanitizeCurrencyInput,
  MAX_AMOUNT,
  isAmountValid,
} from '../utils/input';
import { triggerHapticLight, triggerHapticMedium } from '../utils/haptics';
import { getTopPadding } from '../utils/platform';
import { useApp } from '../context/AppContext';
import { calculatorStyles as styles } from '../styles/calculator.styles';
import { getCalculatorDynamicStyles } from '../styles/theme.styles';
import type { CalculatorProps } from '../types/calculator.types';
import type { CurrencyType } from '../types';

export function Calculator({ onOpenSettings }: CalculatorProps) {
  const { settings, isDark, t } = useApp();
  const { currency: defaultCurrency, language } = settings;
  const insets = useSafeAreaInsets();
  const topPadding = getTopPadding(insets);

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

  useEffect(() => {
    setPrimaryCurrency(defaultCurrency);
  }, [defaultCurrency]);

  // Мемоизирано изчисление на рестото
  const changeResult = useMemo(
    () =>
      calculateChange(
        primaryCurrency === 'BGN'
          ? receivedBgn
          : convertEurToBgn(parseCurrencyString(received)),
        primaryCurrency === 'BGN'
          ? billBgn
          : convertEurToBgn(parseCurrencyString(bill))
      ),
    [receivedBgn, billBgn, primaryCurrency, received, bill]
  );

  useEffect(() => {
    if (!changeResult.isValid && changeResult.error) {
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

  const handleReceivedChange = useCallback(
    (text: string) => {
      const filteredText = sanitizeCurrencyInput(text);
      const amount = parseCurrencyString(filteredText);

      if (!isAmountValid(amount)) {
        setError(t('error.tooLarge'));
        return;
      }

      setReceived(filteredText);
      if (primaryCurrency === 'BGN') {
        setReceivedBgn(amount);
      } else {
        setReceivedBgn(convertEurToBgn(amount));
      }
    },
    [primaryCurrency, t]
  );

  const handleBillChange = useCallback(
    (text: string) => {
      const filteredText = sanitizeCurrencyInput(text);
      const amount = parseCurrencyString(filteredText);

      if (!isAmountValid(amount)) {
        setError(t('error.tooLarge'));
        return;
      }

      setBill(filteredText);
      if (primaryCurrency === 'BGN') {
        setBillBgn(amount);
      } else {
        setBillBgn(convertEurToBgn(amount));
      }
    },
    [primaryCurrency, t]
  );

  const handleReceivedQuickAmount = useCallback(
    (amount: number) => {
      const formatted = formatAmount(amount);
      setReceived(formatted);
      if (primaryCurrency === 'BGN') {
        setReceivedBgn(amount);
      } else {
        setReceivedBgn(convertEurToBgn(amount));
      }
    },
    [primaryCurrency]
  );

  const handleBillQuickAmount = useCallback(
    (amount: number) => {
      const formatted = formatAmount(amount);
      setBill(formatted);
      if (primaryCurrency === 'BGN') {
        setBillBgn(amount);
      } else {
        setBillBgn(convertEurToBgn(amount));
      }
    },
    [primaryCurrency]
  );

  const switchToCurrency = useCallback(
    (newCurrency: CurrencyType) => {
      if (newCurrency === primaryCurrency) return;

      triggerHapticMedium();

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
    },
    [primaryCurrency, receivedBgn, billBgn]
  );

  const handleCurrencySwap = useCallback(() => {
    const newCurrency = primaryCurrency === 'BGN' ? 'EUR' : 'BGN';
    switchToCurrency(newCurrency);
  }, [primaryCurrency, switchToCurrency]);

  const handleOpenSettings = useCallback(() => {
    triggerHapticLight();
    onOpenSettings?.();
  }, [onOpenSettings]);

  const handleClear = useCallback(() => {
    setReceived('');
    setBill('');
    setReceivedBgn(0);
    setBillBgn(0);
    setError('');
    Keyboard.dismiss();
  }, []);

  const hasContent = useMemo(
    () => received.trim() || bill.trim(),
    [received, bill]
  );

  // Мемоизирани динамични стилове
  const memoizedDynamicStyles = useMemo(
    () => getCalculatorDynamicStyles(isDark),
    [isDark]
  );

  return (
    <View style={[styles.container, memoizedDynamicStyles.container]}>
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
        <View style={styles.topBar}>
          <View
            style={[
              styles.exchangeRateBadge,
              memoizedDynamicStyles.exchangeRate,
            ]}
          >
            <Text
              style={[
                styles.exchangeRateText,
                memoizedDynamicStyles.secondaryText,
              ]}
            >
              {t('calc.exchangeRate')}
            </Text>
          </View>
          {onOpenSettings && (
            <TouchableOpacity
              style={[
                styles.settingsButton,
                memoizedDynamicStyles.settingsButton,
              ]}
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

        <View style={styles.header}>
          <Text style={styles.title}>{t('app.title')}</Text>
          <Text style={[styles.subtitle, memoizedDynamicStyles.secondaryText]}>
            {t('app.subtitle')}
          </Text>
        </View>

        <View style={styles.currencySelector}>
          <TouchableOpacity
            style={[
              styles.currencyButton,
              primaryCurrency === 'BGN'
                ? styles.currencyButtonActive
                : memoizedDynamicStyles.currencyButtonInactive,
            ]}
            onPress={() => switchToCurrency('BGN')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.currencyButtonText,
                primaryCurrency === 'BGN'
                  ? styles.currencyButtonTextActive
                  : memoizedDynamicStyles.text,
              ]}
            >
              🇧🇬 {t('currency.bgn')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.swapButton, memoizedDynamicStyles.swapButton]}
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
                : memoizedDynamicStyles.currencyButtonInactive,
            ]}
            onPress={() => switchToCurrency('EUR')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.currencyButtonText,
                primaryCurrency === 'EUR'
                  ? styles.currencyButtonTextActive
                  : memoizedDynamicStyles.text,
              ]}
            >
              🇪🇺 {t('currency.eur')}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputsContainer}>
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, memoizedDynamicStyles.text]}>
              {t('calc.received')}
            </Text>
            <View style={styles.inputWrapper}>
              <TextInput
                ref={receivedInputRef}
                style={[
                  styles.input,
                  memoizedDynamicStyles.input,
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
                style={[
                  styles.currencySymbol,
                  memoizedDynamicStyles.secondaryText,
                ]}
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

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, memoizedDynamicStyles.text]}>
              {t('calc.bill')}
            </Text>
            <View style={styles.inputWrapper}>
              <TextInput
                ref={billInputRef}
                style={[
                  styles.input,
                  memoizedDynamicStyles.input,
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
                style={[
                  styles.currencySymbol,
                  memoizedDynamicStyles.secondaryText,
                ]}
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

          {error && (
            <View style={styles.errorContainer}>
              <Ionicons
                name="alert-circle"
                size={18}
                color="#EF4444"
                style={styles.errorIcon}
              />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {received.trim() &&
            bill.trim() &&
            changeResult.isValid &&
            (changeResult.bgn > 0 || changeResult.eur > 0 ? (
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
                <Text style={styles.noChangeText}>{t('change.noChange')}</Text>
              </View>
            ))}

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
