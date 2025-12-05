import type { LanguageType } from '../types';

export const translations: Record<LanguageType, Record<string, string>> = {
  bg: {
    // Заглавия
    'app.title': 'Евро Ресто',
    'app.subtitle': 'Изчисли рестото',
    'app.version': 'Евро Ресто v1.0.0',

    // Калкулатор
    'calc.received': 'Плащане',
    'calc.bill': 'Сметка',
    'calc.clear': 'Изчисти',
    'calc.quickAmounts': 'Чести суми',
    'calc.exchangeRate': '1 € = 1.95583 лв',

    // Валути
    'currency.bgn': 'Лева',
    'currency.eur': 'Евро',
    'currency.lv': 'лв',
    'currency.euro': '€',
    'currency.stotinki': 'ст',
    'currency.cents': 'цент',

    // Ресто
    'change.title': 'За връщане:',
    'change.or': 'или',
    'change.leva': 'лева',
    'change.euro': 'евро',
    'change.breakdown': 'Разбивка в',
    'change.showIn': 'Покажи в',
    'change.noChange': '✅ Точна сума - няма ресто',
    'change.warning': '⚠️ Проверете сумата - голямо ресто!',

    // Грешки
    'error.insufficient': 'Недостатъчна сума',
    'error.invalid': 'Невалидна сметка',
    'error.tooLarge': 'Сумата е твърде голяма',

    // Настройки
    'settings.title': 'Настройки',
    'settings.currency': 'Основна валута',
    'settings.language': 'Език',
    'settings.theme': 'Тема',
    'settings.back': '← Назад',
    'settings.bgn': 'Лева (BGN)',
    'settings.eur': 'Евро (EUR)',
    'settings.bulgarian': 'Български',
    'settings.english': 'English',
    'settings.light': 'Светла',
    'settings.dark': 'Тъмна',
    'settings.system': 'Системна',
  },
  en: {
    // Titles
    'app.title': 'Euro Change',
    'app.subtitle': 'Calculate Change',
    'app.version': 'Euro Change v1.0.0',

    // Calculator
    'calc.received': 'Payment',
    'calc.bill': 'Bill',
    'calc.clear': 'Clear',
    'calc.quickAmounts': 'Quick amounts',
    'calc.exchangeRate': '1 € = 1.95583 BGN',

    // Currencies
    'currency.bgn': 'Leva',
    'currency.eur': 'Euro',
    'currency.lv': 'lv',
    'currency.euro': '€',
    'currency.stotinki': 'st',
    'currency.cents': 'cent',

    // Change
    'change.title': 'Change:',
    'change.or': 'or',
    'change.leva': 'leva',
    'change.euro': 'euro',
    'change.breakdown': 'Breakdown in',
    'change.showIn': 'Show in',
    'change.noChange': '✅ Exact amount - no change',
    'change.warning': '⚠️ Check the amount - large change!',

    // Errors
    'error.insufficient': 'Insufficient amount',
    'error.invalid': 'Invalid bill',
    'error.tooLarge': 'Amount is too large',

    // Settings
    'settings.title': 'Settings',
    'settings.currency': 'Default Currency',
    'settings.language': 'Language',
    'settings.theme': 'Theme',
    'settings.back': '← Back',
    'settings.bgn': 'Leva (BGN)',
    'settings.eur': 'Euro (EUR)',
    'settings.bulgarian': 'Български',
    'settings.english': 'English',
    'settings.light': 'Light',
    'settings.dark': 'Dark',
    'settings.system': 'System',
  },
};

