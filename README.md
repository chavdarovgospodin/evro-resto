# EvroResto - ЕвроРесто

Мобилно приложение за ресторанти и хранителни услуги с Expo Router.

## 🚀 Структура

```
react-native-skeleton/
├── app/                    # Expo Router екрани
│   ├── _layout.tsx        # Root layout
│   ├── index.tsx          # Главен екран
│   └── (tabs)/            # Tab навигация
│       ├── _layout.tsx
│       └── index.tsx
├── components/             # Reusable компоненти
│   └── ui/                # UI компоненти
├── constants/             # Константи и конфигурация
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript типове
├── utils/                 # Утилити и помощни функции
└── assets/                # Статични файлове
```

## 📦 Инсталирани пакети

- **expo-router** - File-based routing
- **expo-linking** - Deep linking
- **expo-constants** - App constants
- **@react-native-async-storage/async-storage** - Локално съхранение

## 🛠️ Стартиране

```bash
# Инсталиране на зависимости
npm install

# Стартиране на development server
npm start

# Стартиране на iOS
npm run ios

# Стартиране на Android
npm run android

# Стартиране на Web
npm run web
```
