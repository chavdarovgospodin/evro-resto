import React, { useState, useEffect, useRef } from 'react';
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
import { sanitizeCurrencyInput } from '../utils/input';
import { triggerHapticLight, triggerHapticMedium } from '../utils/haptics';
import { getTopPadding } from '../utils/platform';
import { useApp } from '../context/AppContext';
import { calculatorStyles as styles } from '../styles/calculator.styles';
import { getCalculatorDynamicStyles } from '../styles/theme.styles';
import type { CalculatorProps } from '../types/calculator.types';
import type { CurrencyType } from '../types';

export function Calculator({ onOpenSettings }: CalculatorProps) {
  const { settings, t } = useApp();
  const { currency: defaultCurrency, theme, language } = settings;
  const isDark = theme === 'dark';
  const insets = useSafeAreaInsets();
  const topPadding = getTopPadding(insets);
  const dynamicStyles = getCalculatorDynamicStyles(isDark);

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

  const changeResult = calculateChange(
    primaryCurrency === 'BGN'
      ? receivedBgn
      : convertEurToBgn(parseCurrencyString(received)),
    primaryCurrency === 'BGN'
      ? billBgn
      : convertEurToBgn(parseCurrencyString(bill))
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

  const handleReceivedChange = (text: string) => {
    const filteredText = sanitizeCurrencyInput(text);
    setReceived(filteredText);

    const amount = parseCurrencyString(filteredText);
    if (primaryCurrency === 'BGN') {
      setReceivedBgn(amount);
    } else {
      setReceivedBgn(convertEurToBgn(amount));
    }
  };

  const handleBillChange = (text: string) => {
    const filteredText = sanitizeCurrencyInput(text);
    setBill(filteredText);

    const amount = parseCurrencyString(filteredText);
    if (primaryCurrency === 'BGN') {
      setBillBgn(amount);
    } else {
      setBillBgn(convertEurToBgn(amount));
    }
  };

  const handleReceivedQuickAmount = (amount: number) => {
    const formatted = formatAmount(amount);
    setReceived(formatted);
    if (primaryCurrency === 'BGN') {
      setReceivedBgn(amount);
    } else {
      setReceivedBgn(convertEurToBgn(amount));
    }
  };

  const handleBillQuickAmount = (amount: number) => {
    const formatted = formatAmount(amount);
    setBill(formatted);
    if (primaryCurrency === 'BGN') {
      setBillBgn(amount);
    } else {
      setBillBgn(convertEurToBgn(amount));
    }
  };

  const switchToCurrency = (newCurrency: CurrencyType) => {
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
  };

  const handleCurrencySwap = () => {
    const newCurrency = primaryCurrency === 'BGN' ? 'EUR' : 'BGN';
    switchToCurrency(newCurrency);
  };

  const handleOpenSettings = () => {
    triggerHapticLight();
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

        <View style={styles.header}>
          <Text style={styles.title}>{t('app.title')}</Text>
          <Text style={[styles.subtitle, dynamicStyles.secondaryText]}>
            {t('app.subtitle')}
          </Text>
        </View>

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

        <View style={styles.inputsContainer}>
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
