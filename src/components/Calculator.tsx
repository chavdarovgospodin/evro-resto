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
  const [receivedEur, setReceivedEur] = useState<number>(0);
  const [receivedBgnText, setReceivedBgnText] = useState('');
  const [receivedEurText, setReceivedEurText] = useState('');
  const [billBgn, setBillBgn] = useState<number>(0);
  const [bill, setBill] = useState('');
  const [billCurrency, setBillCurrency] =
    useState<CurrencyType>(defaultCurrency);
  const [error, setError] = useState<string>('');
  const [receivedBgnFocused, setReceivedBgnFocused] = useState(false);
  const [receivedEurFocused, setReceivedEurFocused] = useState(false);
  const [billFocused, setBillFocused] = useState(false);

  const billInputRef = useRef<TextInput>(null);
  const receivedBgnInputRef = useRef<TextInput>(null);
  const receivedEurInputRef = useRef<TextInput>(null);

  useEffect(() => {
    setBillCurrency(defaultCurrency);
  }, [defaultCurrency]);

  // Мемоизирано изчисление на рестото
  const changeResult = useMemo(
    () => {
      // Сумираме плащането в лева (BGN + конвертираното EUR)
      const totalReceivedBgn = receivedBgn + convertEurToBgn(receivedEur);
      const totalBillBgn = billCurrency === 'BGN'
        ? billBgn
        : convertEurToBgn(parseCurrencyString(bill));
      
      return calculateChange(totalReceivedBgn, totalBillBgn);
    },
    [receivedBgn, receivedEur, billBgn, billCurrency, bill]
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

  const handleReceivedBgnChange = useCallback(
    (text: string) => {
      const filteredText = sanitizeCurrencyInput(text);
      const amount = parseCurrencyString(filteredText);

      if (!isAmountValid(amount)) {
        setError(t('error.tooLarge'));
        return;
      }

      setReceivedBgnText(filteredText);
      setReceivedBgn(amount);
    },
    [t]
  );

  const handleReceivedBgnBlur = useCallback(() => {
    setReceivedBgnFocused(false);
    if (receivedBgnText.trim()) {
      const amount = parseCurrencyString(receivedBgnText);
      if (amount > 0) {
        setReceivedBgnText(formatAmount(amount));
      }
    }
  }, [receivedBgnText]);

  const handleReceivedEurChange = useCallback(
    (text: string) => {
      const filteredText = sanitizeCurrencyInput(text);
      const amount = parseCurrencyString(filteredText);

      if (!isAmountValid(amount)) {
        setError(t('error.tooLarge'));
        return;
      }

      setReceivedEurText(filteredText);
      setReceivedEur(amount);
    },
    [t]
  );

  const handleReceivedEurBlur = useCallback(() => {
    setReceivedEurFocused(false);
    if (receivedEurText.trim()) {
      const amount = parseCurrencyString(receivedEurText);
      if (amount > 0) {
        setReceivedEurText(formatAmount(amount));
      }
    }
  }, [receivedEurText]);

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

  const handleBillBlur = useCallback(() => {
    setBillFocused(false);
    if (bill.trim()) {
      const amount = parseCurrencyString(bill);
      if (amount > 0) {
        setBill(formatAmount(amount));
      }
    }
  }, [bill]);

  const handleReceivedBgnQuickAmount = useCallback(
    (amount: number) => {
      const formatted = formatAmount(amount);
      setReceivedBgnText(formatted);
      setReceivedBgn(amount);
    },
    []
  );

  const handleReceivedEurQuickAmount = useCallback(
    (amount: number) => {
      const formatted = formatAmount(amount);
      setReceivedEurText(formatted);
      setReceivedEur(amount);
    },
    []
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
    setReceivedBgnText('');
    setReceivedEurText('');
    setBill('');
    setReceivedBgn(0);
    setReceivedEur(0);
    setBillBgn(0);
    setError('');
    Keyboard.dismiss();
  }, []);

  const hasContent = useMemo(
    () => receivedBgnText.trim() || receivedEurText.trim() || bill.trim(),
    [receivedBgnText, receivedEurText, bill]
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
          <Text style={styles.title}>{t('app.subtitle')}</Text>
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
                  onBlur={handleBillBlur}
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
            <View style={styles.combinedInputContainer}>
              <View style={styles.combinedInputWrapper}>
                <TextInput
                  ref={receivedBgnInputRef}
                  style={[
                    styles.combinedInput,
                    memoizedDynamicStyles.input,
                    receivedBgnFocused && styles.inputFocused,
                  ]}
                  value={receivedBgnText}
                  onChangeText={handleReceivedBgnChange}
                  onFocus={() => setReceivedBgnFocused(true)}
                  onBlur={handleReceivedBgnBlur}
                  placeholder="0.00"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                />
                <Text
                  style={[
                    styles.combinedCurrency,
                    memoizedDynamicStyles.secondaryText,
                  ]}
                >
                  🇧🇬 {t('currency.lv')}
                </Text>
              </View>
              <Text
                style={[
                  styles.combinedSeparator,
                  memoizedDynamicStyles.secondaryText,
                ]}
              >
                +
              </Text>
              <View style={styles.combinedInputWrapper}>
                <TextInput
                  ref={receivedEurInputRef}
                  style={[
                    styles.combinedInput,
                    memoizedDynamicStyles.input,
                    receivedEurFocused && styles.inputFocused,
                  ]}
                  value={receivedEurText}
                  onChangeText={handleReceivedEurChange}
                  onFocus={() => setReceivedEurFocused(true)}
                  onBlur={handleReceivedEurBlur}
                  placeholder="0.00"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                />
                <Text
                  style={[
                    styles.combinedCurrency,
                    memoizedDynamicStyles.secondaryText,
                  ]}
                >
                  🇪🇺 {t('currency.euro')}
                </Text>
              </View>
            </View>
            <View style={styles.quickAmountsRow}>
              <View style={styles.quickAmountsColumn}>
                <Text
                  style={[
                    styles.quickAmountsLabel,
                    memoizedDynamicStyles.secondaryText,
                  ]}
                >
                  {t('currency.lv')}
                </Text>
                <QuickAmounts
                  amounts={[5, 10, 20, 50, 100]}
                  onSelect={handleReceivedBgnQuickAmount}
                  currency="BGN"
                  isDark={isDark}
                  language={language}
                  size="small"
                />
              </View>
              <View style={styles.quickAmountsColumn}>
                <Text
                  style={[
                    styles.quickAmountsLabel,
                    memoizedDynamicStyles.secondaryText,
                  ]}
                >
                  {t('currency.euro')}
                </Text>
                <QuickAmounts
                  amounts={[5, 10, 20, 50, 100]}
                  onSelect={handleReceivedEurQuickAmount}
                  currency="EUR"
                  isDark={isDark}
                  language={language}
                  size="small"
                />
              </View>
            </View>
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

          {(receivedBgnText.trim() || receivedEurText.trim()) &&
            bill.trim() &&
            changeResult.isValid &&
            (changeResult.bgn > 0 || changeResult.eur > 0 ? (
              <ChangeDisplay
                changeBgn={changeResult.bgn}
                changeEur={changeResult.eur}
                primaryCurrency="BGN"
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
