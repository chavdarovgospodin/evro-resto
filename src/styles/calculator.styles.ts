import { StyleSheet } from 'react-native';

export const calculatorStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
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

