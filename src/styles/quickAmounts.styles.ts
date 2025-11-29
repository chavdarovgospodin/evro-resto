import { StyleSheet } from 'react-native';

export const quickAmountsStyles = StyleSheet.create({
  container: {
    marginTop: 14,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  amountButton: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  amountButtonPressed: {
    backgroundColor: '#7C3AED',
    borderColor: '#7C3AED',
    transform: [{ scale: 0.95 }],
  },
  amountText: {
    fontSize: 18,
    fontWeight: '700',
  },
  amountTextPressed: {
    color: '#FFFFFF',
  },
  currencyText: {
    fontSize: 12,
    marginTop: 2,
  },
  currencyTextPressed: {
    color: '#FFFFFF',
  },
});

