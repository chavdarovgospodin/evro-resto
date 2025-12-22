/**
 * Демо компонент за показване на различни варианти за плащане с две валути
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { calculatorStyles as styles } from '../styles/calculator.styles';
import { getCalculatorDynamicStyles } from '../styles/theme.styles';

export function PaymentOptionsDemo() {
  const { isDark, t } = useApp();
  const memoizedDynamicStyles = getCalculatorDynamicStyles(isDark);

  // Вариант 1: State
  const [variant1SecondVisible, setVariant1SecondVisible] = useState(false);
  const [variant1First, setVariant1First] = useState('');
  const [variant1Second, setVariant1Second] = useState('');
  const [variant1FirstCurrency, setVariant1FirstCurrency] = useState<'BGN' | 'EUR'>('BGN');
  const [variant1SecondCurrency, setVariant1SecondCurrency] = useState<'BGN' | 'EUR'>('EUR');

  // Вариант 2: State
  const [variant2First, setVariant2First] = useState('');
  const [variant2Second, setVariant2Second] = useState('');
  const [variant2FirstCurrency, setVariant2FirstCurrency] = useState<'BGN' | 'EUR'>('BGN');
  const [variant2SecondCurrency, setVariant2SecondCurrency] = useState<'BGN' | 'EUR'>('EUR');

  // Вариант 3: State
  const [variant3SplitMode, setVariant3SplitMode] = useState(false);
  const [variant3First, setVariant3First] = useState('');
  const [variant3Second, setVariant3Second] = useState('');
  const [variant3FirstCurrency, setVariant3FirstCurrency] = useState<'BGN' | 'EUR'>('BGN');
  const [variant3SecondCurrency, setVariant3SecondCurrency] = useState<'BGN' | 'EUR'>('EUR');

  // Вариант 4: State
  const [variant4Bgn, setVariant4Bgn] = useState('');
  const [variant4Eur, setVariant4Eur] = useState('');

  const getVariantContainerStyle = () => [
    demoStyles.variantContainer,
    {
      backgroundColor: isDark ? '#374151' : '#F9FAFB',
      borderColor: isDark ? '#4B5563' : '#E5E7EB',
    },
  ];

  return (
    <ScrollView
      style={[styles.container, memoizedDynamicStyles.container]}
      contentContainerStyle={demoStyles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Вариант 1: Бутон "+ Добави валута" */}
      <View style={getVariantContainerStyle()}>
        <Text style={[demoStyles.variantTitle, memoizedDynamicStyles.text]} allowFontScaling={true}
              maxFontSizeMultiplier={1.1}>
          {t('demo.variant1')}
        </Text>
        <View style={demoStyles.inputGroup}>
          <Text style={[demoStyles.label, memoizedDynamicStyles.text]} allowFontScaling={true}
              maxFontSizeMultiplier={1.1}>
            {t('calc.received')}
          </Text>
          <View style={demoStyles.inputWrapper}>
            <TextInput
              style={[
                demoStyles.input,
                memoizedDynamicStyles.input,
              ]}
              value={variant1First}
              onChangeText={setVariant1First}
              placeholder={t('demo.placeholder')}
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              allowFontScaling={true}
              maxFontSizeMultiplier={1.1}
            />
            <TouchableOpacity
              style={[demoStyles.currencyButton, memoizedDynamicStyles.currencyButtonInField]}
              onPress={() => setVariant1FirstCurrency(variant1FirstCurrency === 'BGN' ? 'EUR' : 'BGN')}
            >
              <Text style={[demoStyles.currencyText, memoizedDynamicStyles.text]} allowFontScaling={true}
              maxFontSizeMultiplier={1.1}>
                {variant1FirstCurrency === 'BGN' ? '🇧🇬' : '🇪🇺'} {variant1FirstCurrency === 'BGN' ? t('currency.lv') : t('currency.euro')}
              </Text>
              <Ionicons name="swap-horizontal" size={16} color={isDark ? '#9CA3AF' : '#6B7280'} />
            </TouchableOpacity>
          </View>

          {variant1SecondVisible ? (
            <View style={demoStyles.secondInputContainer}>
              <View style={[demoStyles.inputWrapper, { flex: 1 }]}>
                <TextInput
                  style={[
                    demoStyles.input,
                    memoizedDynamicStyles.input,
                  ]}
                  value={variant1Second}
                  onChangeText={setVariant1Second}
                  placeholder={t('demo.placeholder')}
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
              allowFontScaling={true}
              maxFontSizeMultiplier={1.1}
                />
                <TouchableOpacity
                  style={[demoStyles.currencyButton, memoizedDynamicStyles.currencyButtonInField]}
                  onPress={() => setVariant1SecondCurrency(variant1SecondCurrency === 'BGN' ? 'EUR' : 'BGN')}
                >
                  <Text style={[demoStyles.currencyText, memoizedDynamicStyles.text]} allowFontScaling={true}
              maxFontSizeMultiplier={1.1}>
                    {variant1SecondCurrency === 'BGN' ? '🇧🇬' : '🇪🇺'} {variant1SecondCurrency === 'BGN' ? t('currency.lv') : t('currency.euro')}
                  </Text>
                  <Ionicons name="swap-horizontal" size={16} color={isDark ? '#9CA3AF' : '#6B7280'} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={demoStyles.removeButton}
                onPress={() => {
                  setVariant1SecondVisible(false);
                  setVariant1Second('');
                }}
              >
                <Ionicons name="close-circle" size={24} color="#EF4444" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={[demoStyles.addButton, memoizedDynamicStyles.currencyButtonInField]}
              onPress={() => setVariant1SecondVisible(true)}
            >
              <Ionicons name="add-circle-outline" size={20} color={isDark ? '#A78BFA' : '#7C3AED'} />
              <Text style={[demoStyles.addButtonText, { color: isDark ? '#A78BFA' : '#7C3AED' }]} allowFontScaling={true}
              maxFontSizeMultiplier={1.1}>
                {t('demo.addCurrency')}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Вариант 2: Две полета по подразбиране */}
      <View style={getVariantContainerStyle()}>
        <Text style={[demoStyles.variantTitle, memoizedDynamicStyles.text]} allowFontScaling={true}
              maxFontSizeMultiplier={1.1}>
          {t('demo.variant2')}
        </Text>
        <View style={demoStyles.inputGroup}>
          <Text style={[demoStyles.label, memoizedDynamicStyles.text]} allowFontScaling={true}
              maxFontSizeMultiplier={1.1}>
            {t('calc.received')} 1
          </Text>
          <View style={demoStyles.inputWrapper}>
            <TextInput
              style={[
                demoStyles.input,
                memoizedDynamicStyles.input,
              ]}
              value={variant2First}
              onChangeText={setVariant2First}
              placeholder={t('demo.placeholder')}
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              allowFontScaling={true}
              maxFontSizeMultiplier={1.1}
            />
            <TouchableOpacity
              style={[demoStyles.currencyButton, memoizedDynamicStyles.currencyButtonInField]}
              onPress={() => setVariant2FirstCurrency(variant2FirstCurrency === 'BGN' ? 'EUR' : 'BGN')}
            >
              <Text style={[demoStyles.currencyText, memoizedDynamicStyles.text]} allowFontScaling={true}
              maxFontSizeMultiplier={1.1}>
                {variant2FirstCurrency === 'BGN' ? '🇧🇬' : '🇪🇺'} {variant2FirstCurrency === 'BGN' ? t('currency.lv') : t('currency.euro')}
              </Text>
              <Ionicons name="swap-horizontal" size={16} color={isDark ? '#9CA3AF' : '#6B7280'} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={demoStyles.inputGroup}>
          <Text style={[demoStyles.label, memoizedDynamicStyles.text]} allowFontScaling={true}
              maxFontSizeMultiplier={1.1}>
            {t('demo.receivedOptional')}
          </Text>
          <View style={demoStyles.inputWrapper}>
            <TextInput
              style={[
                demoStyles.input,
                memoizedDynamicStyles.input,
              ]}
              value={variant2Second}
              onChangeText={setVariant2Second}
              placeholder={t('demo.placeholderOptional')}
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              allowFontScaling={true}
              maxFontSizeMultiplier={1.1}
            />
            <TouchableOpacity
              style={[demoStyles.currencyButton, memoizedDynamicStyles.currencyButtonInField]}
              onPress={() => setVariant2SecondCurrency(variant2SecondCurrency === 'BGN' ? 'EUR' : 'BGN')}
            >
              <Text style={[demoStyles.currencyText, memoizedDynamicStyles.text]} allowFontScaling={true}
              maxFontSizeMultiplier={1.1}>
                {variant2SecondCurrency === 'BGN' ? '🇧🇬' : '🇪🇺'} {variant2SecondCurrency === 'BGN' ? t('currency.lv') : t('currency.euro')}
              </Text>
              <Ionicons name="swap-horizontal" size={16} color={isDark ? '#9CA3AF' : '#6B7280'} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Вариант 3: Split Payment режим */}
      <View style={getVariantContainerStyle()}>
        <View style={demoStyles.splitHeader}>
          <Text style={[demoStyles.variantTitle, memoizedDynamicStyles.text]} allowFontScaling={true}
              maxFontSizeMultiplier={1.1}>
            {t('demo.variant3')}
          </Text>
          <TouchableOpacity
            style={[
              demoStyles.splitToggle,
              variant3SplitMode && demoStyles.splitToggleActive,
              memoizedDynamicStyles.currencyButtonInField,
            ]}
            onPress={() => setVariant3SplitMode(!variant3SplitMode)}
          >
            <Ionicons
              name={variant3SplitMode ? 'checkmark-circle' : 'add-circle-outline'}
              size={20}
              color={variant3SplitMode ? '#10B981' : (isDark ? '#9CA3AF' : '#6B7280')}
            />
            <Text
              style={[
                demoStyles.splitToggleText,
                { color: variant3SplitMode ? '#10B981' : (isDark ? '#9CA3AF' : '#6B7280') },
              ]}
            >
              {t('demo.splitPayment')}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={demoStyles.inputGroup}>
          <Text style={[demoStyles.label, memoizedDynamicStyles.text]} allowFontScaling={true}
              maxFontSizeMultiplier={1.1}>
            {t('calc.received')}
          </Text>
          <View style={demoStyles.inputWrapper}>
            <TextInput
              style={[
                demoStyles.input,
                memoizedDynamicStyles.input,
              ]}
              value={variant3First}
              onChangeText={setVariant3First}
              placeholder={t('demo.placeholder')}
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              allowFontScaling={true}
              maxFontSizeMultiplier={1.1}
            />
            <TouchableOpacity
              style={[demoStyles.currencyButton, memoizedDynamicStyles.currencyButtonInField]}
              onPress={() => setVariant3FirstCurrency(variant3FirstCurrency === 'BGN' ? 'EUR' : 'BGN')}
            >
              <Text style={[demoStyles.currencyText, memoizedDynamicStyles.text]} allowFontScaling={true}
              maxFontSizeMultiplier={1.1}>
                {variant3FirstCurrency === 'BGN' ? '🇧🇬' : '🇪🇺'} {variant3FirstCurrency === 'BGN' ? t('currency.lv') : t('currency.euro')}
              </Text>
              <Ionicons name="swap-horizontal" size={16} color={isDark ? '#9CA3AF' : '#6B7280'} />
            </TouchableOpacity>
          </View>
          {variant3SplitMode && (
            <View style={demoStyles.inputWrapper}>
              <TextInput
                style={[
                  demoStyles.input,
                  memoizedDynamicStyles.input,
                ]}
                value={variant3Second}
                onChangeText={setVariant3Second}
                placeholder={t('demo.placeholder')}
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
              allowFontScaling={true}
              maxFontSizeMultiplier={1.1}
              />
              <TouchableOpacity
                style={[demoStyles.currencyButton, memoizedDynamicStyles.currencyButtonInField]}
                onPress={() => setVariant3SecondCurrency(variant3SecondCurrency === 'BGN' ? 'EUR' : 'BGN')}
              >
                <Text style={[demoStyles.currencyText, memoizedDynamicStyles.text]} allowFontScaling={true}
              maxFontSizeMultiplier={1.1}>
                  {variant3SecondCurrency === 'BGN' ? '🇧🇬' : '🇪🇺'} {variant3SecondCurrency === 'BGN' ? t('currency.lv') : t('currency.euro')}
                </Text>
                <Ionicons name="swap-horizontal" size={16} color={isDark ? '#9CA3AF' : '#6B7280'} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* Вариант 4: Комбинирано поле */}
      <View style={getVariantContainerStyle()}>
        <Text style={[demoStyles.variantTitle, memoizedDynamicStyles.text]} allowFontScaling={true}
              maxFontSizeMultiplier={1.1}>
          {t('demo.variant4')}
        </Text>
        <View style={demoStyles.inputGroup}>
          <Text style={[demoStyles.label, memoizedDynamicStyles.text]} allowFontScaling={true}
              maxFontSizeMultiplier={1.1}>
            {t('calc.received')}
          </Text>
          <View style={demoStyles.combinedInputContainer}>
            <View style={demoStyles.combinedInputWrapper}>
              <TextInput
                style={[
                  demoStyles.combinedInput,
                  memoizedDynamicStyles.input,
                ]}
                value={variant4Bgn}
                onChangeText={setVariant4Bgn}
                placeholder={t('demo.placeholder')}
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
              allowFontScaling={true}
              maxFontSizeMultiplier={1.1}
              />
              <Text style={[demoStyles.combinedCurrency, memoizedDynamicStyles.secondaryText]} allowFontScaling={true}
              maxFontSizeMultiplier={1.1}>
                🇧🇬 {t('currency.lv')}
              </Text>
            </View>
            <Text style={[demoStyles.combinedSeparator, memoizedDynamicStyles.secondaryText]} allowFontScaling={true}
              maxFontSizeMultiplier={1.1}>
              +
            </Text>
            <View style={demoStyles.combinedInputWrapper}>
              <TextInput
                style={[
                  demoStyles.combinedInput,
                  memoizedDynamicStyles.input,
                ]}
                value={variant4Eur}
                onChangeText={setVariant4Eur}
                placeholder={t('demo.placeholder')}
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
              allowFontScaling={true}
              maxFontSizeMultiplier={1.1}
              />
              <Text style={[demoStyles.combinedCurrency, memoizedDynamicStyles.secondaryText]} allowFontScaling={true}
              maxFontSizeMultiplier={1.1}>
                🇪🇺 {t('currency.euro')}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const demoStyles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  variantContainer: {
    marginBottom: 32,
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
  },
  variantTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    paddingRight: 110,
    fontSize: 20,
  },
  currencyButton: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -18 }],
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  currencyText: {
    fontSize: 15,
    fontWeight: '600',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    marginTop: 8,
    gap: 8,
  },
  addButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  secondInputContainer: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    width: '100%',
  },
  removeButton: {
    padding: 4,
  },
  splitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  splitToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  splitToggleActive: {
    backgroundColor: '#D1FAE5',
  },
  splitToggleText: {
    fontSize: 14,
    fontWeight: '600',
  },
  combinedInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: '100%',
  },
  combinedInputWrapper: {
    position: 'relative',
    flex: 1,
    minWidth: 0,
  },
  combinedInput: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    paddingRight: 60,
    fontSize: 18,
    width: '100%',
  },
  combinedCurrency: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -10 }],
    fontSize: 13,
    fontWeight: '600',
  },
  combinedSeparator: {
    fontSize: 20,
    fontWeight: '700',
    minWidth: 24,
    textAlign: 'center',
  },
});

