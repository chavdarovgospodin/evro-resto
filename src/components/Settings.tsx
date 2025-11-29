import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { useApp, CurrencyType, LanguageType, ThemeType } from '../context/AppContext';

export function Settings() {
  const { settings, setCurrency, setLanguage, setTheme, t } = useApp();
  const { currency, language, theme } = settings;

  const triggerHaptic = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (e) {
      // Haptics not available
    }
  };

  const handleCurrencyChange = (value: CurrencyType) => {
    triggerHaptic();
    setCurrency(value);
  };

  const handleLanguageChange = (value: LanguageType) => {
    triggerHaptic();
    setLanguage(value);
  };

  const handleThemeChange = (value: ThemeType) => {
    triggerHaptic();
    setTheme(value);
  };

  const isDark = theme === 'dark';

  const dynamicStyles = {
    container: {
      backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
    },
    text: {
      color: isDark ? '#F9FAFB' : '#1F2937',
    },
    secondaryText: {
      color: isDark ? '#9CA3AF' : '#6B7280',
    },
    card: {
      backgroundColor: isDark ? '#374151' : '#F9FAFB',
      borderColor: isDark ? '#4B5563' : '#E5E7EB',
    },
    optionInactive: {
      backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
      borderColor: isDark ? '#4B5563' : '#E5E7EB',
    },
  };

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, dynamicStyles.text]}>{t('settings.title')}</Text>
        </View>

        {/* Основна валута */}
        <View style={[styles.settingCard, dynamicStyles.card]}>
          <Text style={[styles.settingLabel, dynamicStyles.text]}>
            {t('settings.currency')}
          </Text>
          <View style={styles.optionsRow}>
            <TouchableOpacity
              style={[
                styles.option,
                currency === 'BGN' ? styles.optionActive : dynamicStyles.optionInactive,
              ]}
              onPress={() => handleCurrencyChange('BGN')}
            >
              <Text style={styles.optionIcon}>🇧🇬</Text>
              <Text
                style={[
                  styles.optionText,
                  currency === 'BGN' ? styles.optionTextActive : dynamicStyles.text,
                ]}
              >
                {t('settings.bgn')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.option,
                currency === 'EUR' ? styles.optionActive : dynamicStyles.optionInactive,
              ]}
              onPress={() => handleCurrencyChange('EUR')}
            >
              <Text style={styles.optionIcon}>🇪🇺</Text>
              <Text
                style={[
                  styles.optionText,
                  currency === 'EUR' ? styles.optionTextActive : dynamicStyles.text,
                ]}
              >
                {t('settings.eur')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Език */}
        <View style={[styles.settingCard, dynamicStyles.card]}>
          <Text style={[styles.settingLabel, dynamicStyles.text]}>
            {t('settings.language')}
          </Text>
          <View style={styles.optionsRow}>
            <TouchableOpacity
              style={[
                styles.option,
                language === 'bg' ? styles.optionActive : dynamicStyles.optionInactive,
              ]}
              onPress={() => handleLanguageChange('bg')}
            >
              <Text style={styles.optionIcon}>🇧🇬</Text>
              <Text
                style={[
                  styles.optionText,
                  language === 'bg' ? styles.optionTextActive : dynamicStyles.text,
                ]}
              >
                {t('settings.bulgarian')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.option,
                language === 'en' ? styles.optionActive : dynamicStyles.optionInactive,
              ]}
              onPress={() => handleLanguageChange('en')}
            >
              <Text style={styles.optionIcon}>🇬🇧</Text>
              <Text
                style={[
                  styles.optionText,
                  language === 'en' ? styles.optionTextActive : dynamicStyles.text,
                ]}
              >
                {t('settings.english')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Тема */}
        <View style={[styles.settingCard, dynamicStyles.card]}>
          <Text style={[styles.settingLabel, dynamicStyles.text]}>
            {t('settings.theme')}
          </Text>
          <View style={styles.optionsRow}>
            <TouchableOpacity
              style={[
                styles.option,
                theme === 'light' ? styles.optionActive : dynamicStyles.optionInactive,
              ]}
              onPress={() => handleThemeChange('light')}
            >
              <Ionicons 
                name="sunny-outline" 
                size={20} 
                color={theme === 'light' ? '#FFFFFF' : (isDark ? '#F9FAFB' : '#1F2937')} 
              />
              <Text
                style={[
                  styles.optionText,
                  theme === 'light' ? styles.optionTextActive : dynamicStyles.text,
                ]}
              >
                {t('settings.light')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.option,
                theme === 'dark' ? styles.optionActive : dynamicStyles.optionInactive,
              ]}
              onPress={() => handleThemeChange('dark')}
            >
              <Ionicons 
                name="moon-outline" 
                size={20} 
                color={theme === 'dark' ? '#FFFFFF' : (isDark ? '#F9FAFB' : '#1F2937')} 
              />
              <Text
                style={[
                  styles.optionText,
                  theme === 'dark' ? styles.optionTextActive : dynamicStyles.text,
                ]}
              >
                {t('settings.dark')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Версия */}
        <Text style={[styles.versionText, dynamicStyles.secondaryText]}>
          {t('app.version')}
        </Text>
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
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
  },
  settingCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
  },
  settingLabel: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 16,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  option: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 2,
    gap: 8,
  },
  optionActive: {
    backgroundColor: '#7C3AED',
    borderColor: '#7C3AED',
  },
  optionIcon: {
    fontSize: 20,
  },
  optionText: {
    fontSize: 15,
    fontWeight: '600',
  },
  optionTextActive: {
    color: '#FFFFFF',
  },
  versionText: {
    textAlign: 'center',
    fontSize: 14,
    marginTop: 24,
  },
});
