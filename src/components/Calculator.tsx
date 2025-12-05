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
import { ChangeDisplayV3 as ChangeDisplay } from './ChangeDisplayV3';
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
  const [receivedCurrency, setReceivedCurrency] =
    useState<CurrencyType>(defaultCurrency);
  const [billCurrency, setBillCurrency] =
    useState<CurrencyType>(defaultCurrency);
  const [error, setError] = useState<string>('');
  const [receivedFocused, setReceivedFocused] = useState(false);
  const [billFocused, setBillFocused] = useState(false);

  const billInputRef = useRef<TextInput>(null);
  const receivedInputRef = useRef<TextInput>(null);

  useEffect(() => {
    setReceivedCurrency(defaultCurrency);
    setBillCurrency(defaultCurrency);
  }, [defaultCurrency]);

  // Мемоизирано изчисление на рестото
  const changeResult = useMemo(
    () =>
      calculateChange(
        receivedCurrency === 'BGN'
          ? receivedBgn
          : convertEurToBgn(parseCurrencyString(received)),
        billCurrency === 'BGN'
          ? billBgn
          : convertEurToBgn(parseCurrencyString(bill))
      ),
    [receivedBgn, billBgn, receivedCurrency, billCurrency, received, bill]
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
      if (receivedCurrency === 'BGN') {
        setReceivedBgn(amount);
      } else {
        setReceivedBgn(convertEurToBgn(amount));
      }
    },
    [receivedCurrency, t]
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
      if (billCurrency === 'BGN') {
        setBillBgn(amount);
      } else {
        setBillBgn(convertEurToBgn(amount));
      }
    },
    [billCurrency, t]
  );

  const handleReceivedQuickAmount = useCallback(
    (amount: number) => {
      const formatted = formatAmount(amount);
      setReceived(formatted);
      if (receivedCurrency === 'BGN') {
        setReceivedBgn(amount);
      } else {
        setReceivedBgn(convertEurToBgn(amount));
      }
    },
    [receivedCurrency]
  );

  const handleBillQuickAmount = useCallback(
    (amount: number) => {
      const formatted = formatAmount(amount);
      setBill(formatted);
      if (billCurrency === 'BGN') {
        setBillBgn(amount);
      } else {
        setBillBgn(convertEurToBgn(amount));
      }
    },
    [billCurrency]
  );

  const handleReceivedCurrencySwitch = useCallback(() => {
    const newCurrency = receivedCurrency === 'BGN' ? 'EUR' : 'BGN';
    triggerHapticLight();

    // Обновяваме BGN стойността базирано на новата валута и текущата стойност в полето
    if (received.trim()) {
      const amount = parseCurrencyString(received);
      if (newCurrency === 'BGN') {
        setReceivedBgn(amount);
      } else {
        setReceivedBgn(convertEurToBgn(amount));
      }
    } else {
      setReceivedBgn(0);
    }

    setReceivedCurrency(newCurrency);
  }, [receivedCurrency, received]);

  const handleBillCurrencySwitch = useCallback(() => {
    const newCurrency = billCurrency === 'BGN' ? 'EUR' : 'BGN';
    triggerHapticLight();

    // Обновяваме BGN стойността базирано на новата валута и текущата стойност в полето
    if (bill.trim()) {
      const amount = parseCurrencyString(bill);
      if (newCurrency === 'BGN') {
        setBillBgn(amount);
      } else {
        setBillBgn(convertEurToBgn(amount));
      }
    } else {
      setBillBgn(0);
    }

    setBillCurrency(newCurrency);
  }, [billCurrency, bill]);

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
          <View style={styles.header}>
            <Text style={styles.title}>{t('app.subtitle')}</Text>
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

        <View style={styles.inputsContainer}>
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
              <TouchableOpacity
                style={[
                  styles.currencyButtonInField,
                  memoizedDynamicStyles.currencyButtonInField,
                ]}
                onPress={handleBillCurrencySwitch}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.currencyButtonInFieldText,
                    memoizedDynamicStyles.text,
                  ]}
                >
                  {billCurrency === 'BGN' ? '🇧🇬' : '🇪🇺'}{' '}
                  {billCurrency === 'BGN'
                    ? t('currency.lv')
                    : t('currency.euro')}
                </Text>
                <Ionicons
                  name="swap-horizontal"
                  size={16}
                  color={isDark ? '#9CA3AF' : '#6B7280'}
                  style={styles.currencyButtonIcon}
                />
              </TouchableOpacity>
            </View>
            <QuickAmounts
              amounts={[5, 10, 20, 50, 100]}
              onSelect={handleBillQuickAmount}
              currency={billCurrency}
              isDark={isDark}
              language={language}
            />
          </View>

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
              <TouchableOpacity
                style={[
                  styles.currencyButtonInField,
                  memoizedDynamicStyles.currencyButtonInField,
                ]}
                onPress={handleReceivedCurrencySwitch}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.currencyButtonInFieldText,
                    memoizedDynamicStyles.text,
                  ]}
                >
                  {receivedCurrency === 'BGN' ? '🇧🇬' : '🇪🇺'}{' '}
                  {receivedCurrency === 'BGN'
                    ? t('currency.lv')
                    : t('currency.euro')}
                </Text>
                <Ionicons
                  name="swap-horizontal"
                  size={16}
                  color={isDark ? '#9CA3AF' : '#6B7280'}
                  style={styles.currencyButtonIcon}
                />
              </TouchableOpacity>
            </View>
            <QuickAmounts
              amounts={[5, 10, 20, 50, 100]}
              onSelect={handleReceivedQuickAmount}
              currency={receivedCurrency}
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
                primaryCurrency={receivedCurrency}
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
