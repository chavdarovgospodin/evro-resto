import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { triggerHapticLight } from '../utils/haptics';
import { getTopPadding } from '../utils/platform';
import { settingsStyles as styles } from '../styles/settings.styles';
import { getSettingsDynamicStyles } from '../styles/theme.styles';
import type { CurrencyType, LanguageType, ThemeType } from '../types';

export function Settings() {
  const { settings, isDark, setCurrency, setLanguage, setTheme, t, resetOnboarding } = useApp();
  const { currency, language, theme } = settings;
  const insets = useSafeAreaInsets();
  const topPadding = getTopPadding(insets);
  const dynamicStyles = getSettingsDynamicStyles(isDark);

  const handleCurrencyChange = (value: CurrencyType) => {
    triggerHapticLight();
    setCurrency(value);
  };

  const handleLanguageChange = (value: LanguageType) => {
    triggerHapticLight();
    setLanguage(value);
  };

  const handleThemeChange = (value: ThemeType) => {
    triggerHapticLight();
    setTheme(value);
  };

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: topPadding + 20 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.title, dynamicStyles.text]}>
            {t('settings.title')}
          </Text>
        </View>

        <View style={[styles.settingCard, dynamicStyles.card]}>
          <Text style={[styles.settingLabel, dynamicStyles.text]}>
            {t('settings.currency')}
          </Text>
          <View style={styles.optionsRow}>
            <TouchableOpacity
              style={[
                styles.option,
                currency === 'EUR'
                  ? styles.optionActive
                  : dynamicStyles.optionInactive,
              ]}
              onPress={() => handleCurrencyChange('EUR')}
            >
              <Text style={styles.optionIcon}>🇪🇺</Text>
              <Text
                style={[
                  styles.optionText,
                  currency === 'EUR'
                    ? styles.optionTextActive
                    : dynamicStyles.text,
                ]}
              >
                {t('settings.eur')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.option,
                currency === 'BGN'
                  ? styles.optionActive
                  : dynamicStyles.optionInactive,
              ]}
              onPress={() => handleCurrencyChange('BGN')}
            >
              <Text style={styles.optionIcon}>🇧🇬</Text>
              <Text
                style={[
                  styles.optionText,
                  currency === 'BGN'
                    ? styles.optionTextActive
                    : dynamicStyles.text,
                ]}
              >
                {t('settings.bgn')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.settingCard, dynamicStyles.card]}>
          <Text style={[styles.settingLabel, dynamicStyles.text]}>
            {t('settings.language')}
          </Text>
          <View style={styles.optionsRow}>
            <TouchableOpacity
              style={[
                styles.option,
                language === 'bg'
                  ? styles.optionActive
                  : dynamicStyles.optionInactive,
              ]}
              onPress={() => handleLanguageChange('bg')}
            >
              <Text style={styles.optionIcon}>🇧🇬</Text>
              <Text
                style={[
                  styles.optionText,
                  language === 'bg'
                    ? styles.optionTextActive
                    : dynamicStyles.text,
                ]}
              >
                {t('settings.bulgarian')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.option,
                language === 'en'
                  ? styles.optionActive
                  : dynamicStyles.optionInactive,
              ]}
              onPress={() => handleLanguageChange('en')}
            >
              <Text style={styles.optionIcon}>🇬🇧</Text>
              <Text
                style={[
                  styles.optionText,
                  language === 'en'
                    ? styles.optionTextActive
                    : dynamicStyles.text,
                ]}
              >
                {t('settings.english')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.settingCard, dynamicStyles.card]}>
          <Text style={[styles.settingLabel, dynamicStyles.text]}>
            {t('settings.theme')}
          </Text>
          <View style={styles.optionsRowThree}>
            <TouchableOpacity
              style={[
                styles.optionSmall,
                theme === 'light'
                  ? styles.optionActive
                  : dynamicStyles.optionInactive,
              ]}
              onPress={() => handleThemeChange('light')}
            >
              <Ionicons
                name="sunny-outline"
                size={18}
                color={
                  theme === 'light' ? '#FFFFFF' : isDark ? '#F9FAFB' : '#1F2937'
                }
              />
              <Text
                style={[
                  styles.optionTextSmall,
                  theme === 'light'
                    ? styles.optionTextActive
                    : dynamicStyles.text,
                ]}
              >
                {t('settings.light')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.optionSmall,
                theme === 'dark'
                  ? styles.optionActive
                  : dynamicStyles.optionInactive,
              ]}
              onPress={() => handleThemeChange('dark')}
            >
              <Ionicons
                name="moon-outline"
                size={18}
                color={
                  theme === 'dark' ? '#FFFFFF' : isDark ? '#F9FAFB' : '#1F2937'
                }
              />
              <Text
                style={[
                  styles.optionTextSmall,
                  theme === 'dark'
                    ? styles.optionTextActive
                    : dynamicStyles.text,
                ]}
              >
                {t('settings.dark')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.optionSmall,
                theme === 'system'
                  ? styles.optionActive
                  : dynamicStyles.optionInactive,
              ]}
              onPress={() => handleThemeChange('system')}
            >
              <Ionicons
                name="phone-portrait-outline"
                size={18}
                color={
                  theme === 'system'
                    ? '#FFFFFF'
                    : isDark
                    ? '#F9FAFB'
                    : '#1F2937'
                }
              />
              <Text
                style={[
                  styles.optionTextSmall,
                  theme === 'system'
                    ? styles.optionTextActive
                    : dynamicStyles.text,
                ]}
              >
                {t('settings.system')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.settingCard, dynamicStyles.card]}>
          <TouchableOpacity
            style={styles.tutorialButton}
            onPress={() => {
              triggerHapticLight();
              resetOnboarding();
            }}
            activeOpacity={0.7}
          >
            <Ionicons
              name="school-outline"
              size={20}
              color={isDark ? '#A78BFA' : '#7C3AED'}
            />
            <Text style={[styles.tutorialButtonText, dynamicStyles.text]}>
              {t('settings.showTutorial')}
            </Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={isDark ? '#9CA3AF' : '#6B7280'}
            />
          </TouchableOpacity>
        </View>

        <Text style={[styles.versionText, dynamicStyles.secondaryText]}>
          {t('app.version')}
        </Text>
      </ScrollView>
    </View>
  );
}
