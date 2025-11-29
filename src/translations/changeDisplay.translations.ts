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
}> = {
  bg: {
    headerLabel: 'За връщане:',
    or: 'или',
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
  },
  en: {
    headerLabel: 'Change:',
    or: 'or',
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
  },
};

