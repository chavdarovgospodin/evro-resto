// Color constants
export const colors = {
  // Light theme
  light: {
    background: '#FFFFFF',
    backgroundSecondary: '#F3F4F6',
    backgroundTertiary: '#F9FAFB',
    text: '#1F2937',
    textSecondary: '#6B7280',
    textMuted: '#9CA3AF',
    border: '#E5E7EB',
    primary: '#7C3AED',
    primaryLight: '#EDE9FE',
    success: '#10B981',
    successLight: '#F0FDF4',
    successDark: '#065F46',
    successBorder: '#D1FAE5',
    error: '#EF4444',
    errorLight: '#FEF2F2',
  },
  // Dark theme
  dark: {
    background: '#1F2937',
    backgroundSecondary: '#374151',
    backgroundTertiary: '#374151',
    text: '#F9FAFB',
    textSecondary: '#9CA3AF',
    textMuted: '#9CA3AF',
    border: '#4B5563',
    primary: '#A78BFA',
    primaryLight: '#3B3B6D',
    success: '#10B981',
    successLight: '#065F46',
    successDark: '#064E3B',
    successBorder: '#10B981',
    error: '#EF4444',
    errorLight: '#450A0A',
  },
};

/**
 * Get calculator dynamic styles based on theme
 */
export const getCalculatorDynamicStyles = (isDark: boolean) => ({
  safeArea: {
    backgroundColor: isDark ? colors.dark.background : colors.light.background,
  },
  container: {
    backgroundColor: isDark ? colors.dark.background : colors.light.background,
  },
  settingsButton: {
    backgroundColor: isDark
      ? colors.dark.backgroundSecondary
      : colors.light.backgroundSecondary,
  },
  text: {
    color: isDark ? colors.dark.text : colors.light.text,
  },
  secondaryText: {
    color: isDark ? colors.dark.textSecondary : colors.light.textSecondary,
  },
  input: {
    backgroundColor: isDark
      ? colors.dark.backgroundSecondary
      : colors.light.background,
    borderColor: isDark ? colors.dark.border : colors.light.border,
    color: isDark ? colors.dark.text : colors.light.text,
  },
  exchangeRate: {
    backgroundColor: isDark
      ? colors.dark.backgroundSecondary
      : colors.light.backgroundSecondary,
  },
  currencyButtonInactive: {
    backgroundColor: isDark
      ? colors.dark.backgroundSecondary
      : colors.light.background,
    borderColor: isDark ? colors.dark.border : colors.light.border,
  },
  swapButton: {
    backgroundColor: isDark
      ? colors.dark.primaryLight
      : colors.light.primaryLight,
  },
});

/**
 * Get change display dynamic styles based on theme
 */
export const getChangeDisplayDynamicStyles = (isDark: boolean) => ({
  container: {
    backgroundColor: isDark
      ? colors.dark.successLight
      : colors.light.successLight,
  },
  headerLabel: {
    color: isDark ? '#A7F3D0' : colors.light.successDark,
  },
  currencyBox: {
    backgroundColor: isDark
      ? colors.dark.successDark
      : colors.light.background,
    borderColor: isDark ? colors.dark.success : colors.light.successBorder,
  },
  currencyAmount: {
    color: isDark ? '#A7F3D0' : colors.light.successDark,
  },
  currencyLabel: {
    color: isDark ? '#6EE7B7' : '#059669',
  },
  dividerText: {
    color: isDark ? colors.dark.textSecondary : colors.light.textSecondary,
  },
  denominationsTitle: {
    color: isDark ? '#A7F3D0' : colors.light.successDark,
  },
  switchButton: {
    backgroundColor: isDark ? colors.dark.success : colors.light.successBorder,
  },
  switchButtonText: {
    color: isDark ? colors.dark.text : '#059669',
  },
  denominationItem: {
    backgroundColor: isDark
      ? colors.dark.successDark
      : colors.light.background,
    borderColor: isDark ? colors.dark.success : colors.light.successBorder,
  },
  denominationCount: {
    color: isDark ? '#A7F3D0' : colors.light.successDark,
  },
  denominationValue: {
    color: isDark ? '#6EE7B7' : '#059669',
  },
});

/**
 * Get quick amounts dynamic styles based on theme
 */
export const getQuickAmountsDynamicStyles = (isDark: boolean) => ({
  title: {
    color: colors.light.textMuted,
  },
  buttonNormal: {
    backgroundColor: isDark
      ? colors.dark.backgroundSecondary
      : colors.light.backgroundTertiary,
    borderColor: isDark ? colors.dark.border : colors.light.border,
  },
  textNormal: {
    color: isDark ? colors.dark.text : colors.light.text,
  },
  currencyNormal: {
    color: isDark ? colors.dark.textMuted : colors.light.textSecondary,
  },
});

/**
 * Get settings dynamic styles based on theme
 */
export const getSettingsDynamicStyles = (isDark: boolean) => ({
  container: {
    backgroundColor: isDark ? colors.dark.background : colors.light.background,
  },
  text: {
    color: isDark ? colors.dark.text : colors.light.text,
  },
  secondaryText: {
    color: isDark ? colors.dark.textSecondary : colors.light.textSecondary,
  },
  card: {
    backgroundColor: isDark
      ? colors.dark.backgroundSecondary
      : colors.light.backgroundTertiary,
    borderColor: isDark ? colors.dark.border : colors.light.border,
  },
  optionInactive: {
    backgroundColor: isDark ? colors.dark.background : colors.light.background,
    borderColor: isDark ? colors.dark.border : colors.light.border,
  },
});

