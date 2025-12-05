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
    marginBottom: 20,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flex: 1,
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
    paddingRight: 120,
    fontSize: 22,
  },
  inputFocused: {
    borderColor: '#7C3AED',
    borderWidth: 2,
  },
  currencyButtonInField: {
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
});

