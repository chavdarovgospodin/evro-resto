import { StyleSheet } from 'react-native';

export const calculatorStyles = StyleSheet.create({
  container: {
    flex: 1,
    maxWidth: '100%',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 100,
    maxWidth: '100%',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    maxWidth: '100%',
    overflow: 'hidden',
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
  header: {
    alignItems: 'center',
    marginBottom: 10,
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
  inputsContainer: {
    width: '100%',
    maxWidth: '100%',
  },
  inputGroup: {
    marginBottom: 18,
    maxWidth: '100%',
  },
  inputLabel: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 6,
  },
  inputHint: {
    fontSize: 13,
    fontWeight: '400',
    marginBottom: 10,
    lineHeight: 18,
  },
  inputWrapper: {
    position: 'relative',
    maxWidth: '100%',
    overflow: 'hidden',
  },
  input: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 14,
    paddingRight: 120,
    fontSize: 22,
  },
  inputFocused: {
    borderColor: '#7C3AED',
    borderWidth: 2,
  },
  currencyButtonAnimatedWrapper: {
    position: 'absolute',
    right: 12,
    top: '50%',
  },
  currencyButtonInField: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(147, 51, 234, 0.3)',
    backgroundColor: 'rgba(147, 51, 234, 0.05)',
  },
  currencyButtonInFieldText: {
    fontSize: 15,
    fontWeight: '600',
  },
  currencyButtonIcon: {
    marginLeft: 2,
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
  combinedInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: '100%',
    maxWidth: '100%',
  },
  combinedInputWrapper: {
    position: 'relative',
    flex: 1,
    minWidth: 0,
    maxWidth: '100%',
    overflow: 'hidden',
  },
  combinedInput: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    paddingRight: 60,
    fontSize: 20,
    width: '100%',
    maxWidth: '100%',
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
  quickAmountsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
    maxWidth: '100%',
  },
  quickAmountsColumn: {
    flex: 1,
    maxWidth: '100%',
    minWidth: 0,
  },
  quickAmountsLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 6,
    textAlign: 'center',
  },
});
