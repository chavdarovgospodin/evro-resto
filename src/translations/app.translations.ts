import type { LanguageType } from '../types';

export const translations: Record<LanguageType, Record<string, string>> = {
  bg: {
    // Заглавия
    'app.title': 'Евро Ресто',
    'app.subtitle': 'Изчисли рестото',
    'app.version': 'Евро Ресто v1.0.2',

    // Калкулатор
    'calc.received': 'Плащане',
    'calc.receivedHint':
      'С колко плаща клиентът (може в лева, евро или комбинирано)',
    'calc.bill': 'Сметка',
    'calc.billHint': 'Въведете сумата на сметката (може в лева или евро)',
    'calc.billCurrencyHint': 'Натиснете бутона с валутата за смяна',
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
    'settings.showTutorial': 'Покажи tutorial',

    // Tutorial/Onboarding
    'tutorial.skip': 'Пропусни',
    'tutorial.welcomeTitle': 'Добре дошли в Евро Ресто! 🇧🇬🇪🇺',
    'tutorial.welcomeSubtitle':
      'Най-лесният начин за изчисляване на ресто при преминаването към евро',
    'tutorial.next': 'Напред',
    'tutorial.howItWorksTitle': 'Как работи?',
    'tutorial.step1': '1️⃣ Въведете сумата на сметката (в лева или евро)',
    'tutorial.step2':
      '2️⃣ Въведете с колко плаща клиентът (може в лева, евро или комбинирано)',
    'tutorial.step3':
      '3️⃣ Рестото се изчислява и показва автоматично в двете валути!',
    'tutorial.specialFeaturesTitle': 'Специални функции',
    'tutorial.feature1': '✨ Смесено плащане (лева + евро)',
    'tutorial.feature2': '🔄 Ресто в двете валути',
    'tutorial.feature3': '📱 Работи без интернет',
    'tutorial.feature4': '🇪🇺 Официален курс 1.95583',
    'tutorial.start': 'Започни',
  },
  en: {
    // Titles
    'app.title': 'Euro Change',
    'app.subtitle': 'Calculate Change',
    'app.version': 'Euro Change v1.0.2',

    // Calculator
    'calc.received': 'Payment',
    'calc.receivedHint': 'What was paid (can be in leva, euro, or combined)',
    'calc.bill': 'Bill',
    'calc.billHint': 'Enter the bill amount (can be in leva or euro)',
    'calc.billCurrencyHint': 'Tap the currency button to switch',
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
    'settings.showTutorial': 'Show tutorial',

    // Error messages
    'error.title': 'Something went wrong',
    'error.message': 'An unexpected error occurred. Please try again.',
    'error.retry': 'Try again',

    // Demo/Payment Options
    'demo.variant1': 'Variant 1: "+ Add currency" button',
    'demo.variant2': 'Variant 2: Two fields by default',
    'demo.variant3': 'Variant 3: Split Payment mode',
    'demo.variant4': 'Variant 4: Combined field',
    'demo.addCurrency': 'Add currency',
    'demo.receivedOptional': 'Received 2 (optional)',
    'demo.splitPayment': 'Split Payment',
    'demo.placeholder': '0.00',
    'demo.placeholderOptional': '0.00 (optional)',

    // Tutorial/Onboarding
    'tutorial.skip': 'Skip',
    'tutorial.welcomeTitle': 'Welcome to Euro Change! 🇧🇬🇪🇺',
    'tutorial.welcomeSubtitle':
      'The easiest way to calculate change during the euro transition',
    'tutorial.next': 'Next',
    'tutorial.howItWorksTitle': 'How does it work?',
    'tutorial.step1': '1️⃣ Enter the bill amount (in leva or euro)',
    'tutorial.step2':
      '2️⃣ Enter how much the customer paid (can be in leva, euro, or combined)',
    'tutorial.step3':
      '3️⃣ Change is calculated and displayed automatically in both currencies!',
    'tutorial.specialFeaturesTitle': 'Special features',
    'tutorial.feature1': '✨ Mixed payment (leva + euro)',
    'tutorial.feature2': '🔄 Change in both currencies',
    'tutorial.feature3': '📱 Works offline',
    'tutorial.feature4': '🇪🇺 Official rate 1.95583',
    'tutorial.start': 'Get started',
  },
};
