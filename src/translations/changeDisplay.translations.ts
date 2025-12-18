import type { LanguageType } from '../types';

export const changeDisplayTranslations: Record<LanguageType, {
  headerLabel: string;
  or: string;
  leva: string;
  euro: string;
  breakdownIn: string;
  showIn: string;
  noChange: string;
  warning: string;
  stotinki: string;
  cents: string;
  lv: string;
  euroSymbol: string;
  info: string;
  euroWarning: string;
}> = {
  bg: {
    headerLabel: 'За връщане:',
    or: 'равно на',
    leva: 'лева',
    euro: 'евро',
    breakdownIn: 'Разбивка в',
    showIn: 'Покажи в',
    noChange: 'Точна сума - няма ресто',
    warning: 'Проверете сумата - голямо ресто!',
    stotinki: 'ст',
    cents: 'цент',
    lv: 'лв',
    euroSymbol: '€',
    info: 'Рестото се изчислява автоматично',
    euroWarning: 'От 1 януари 2026 рестото се връща само в евро!',
  },
  en: {
    headerLabel: 'Change:',
    or: 'equal to',
    leva: 'leva',
    euro: 'euro',
    breakdownIn: 'Breakdown in',
    showIn: 'Show in',
    noChange: 'Exact amount - no change',
    warning: 'Check the amount - large change!',
    stotinki: 'st',
    cents: 'cent',
    lv: 'lv',
    euroSymbol: '€',
    info: 'Change is calculated automatically',
    euroWarning: 'From January 1, 2026, change must be returned only in euros!',
  },
};

