import { StyleSheet } from 'react-native';

export const changeDisplayStyles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  headerLabel: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  currencyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  currencyBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 2,
  },
  currencyFlag: {
    fontSize: 24,
    marginBottom: 4,
  },
  currencyAmount: {
    fontSize: 32,
    fontWeight: '700',
  },
  currencyLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 2,
  },
  divider: {
    paddingHorizontal: 12,
  },
  dividerText: {
    fontSize: 14,
    fontWeight: '500',
  },
  noChangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noChangeText: {
    fontSize: 17,
    fontWeight: '500',
    color: '#10B981',
    textAlign: 'center',
  },
  denominationsSection: {
    borderTopWidth: 1,
    borderTopColor: '#D1FAE5',
    paddingTop: 14,
    marginTop: 16,
  },
  denominationsHeader: {
    alignItems: 'center',
    marginBottom: 12,
  },
  denominationsTitle: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  switchButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  switchButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  denominationsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  denominationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
  },
  denominationIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  denominationCount: {
    fontSize: 14,
    fontWeight: '700',
    marginRight: 4,
  },
  denominationValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  warning: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    borderColor: '#EF4444',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginTop: 14,
  },
  warningText: {
    fontSize: 14,
    color: '#EF4444',
    textAlign: 'center',
  },
});

