import { createConfig } from '@gluestack-ui/themed';

const config = createConfig({
  tokens: {
    colors: {
      primary: {
        50: '#F5F3FF',
        100: '#EDE9FE',
        200: '#DDD6FE',
        300: '#C4B5FD',
        400: '#A78BFA',
        500: '#8B5CF6',
        600: '#7C3AED',
        700: '#6D28D9',
        800: '#5B21B6',
        900: '#4C1D95',
      },
      success: {
        500: '#10B981',
        600: '#059669',
        700: '#047857',
      },
      error: {
        500: '#EF4444',
        600: '#DC2626',
        700: '#B91C1C',
      },
      warning: {
        500: '#F59E0B',
        600: '#D97706',
      },
      border: {
        300: '#E0E0E0',
      },
      text: {
        50: '#FAFAFA',
        100: '#F5F5F5',
        200: '#EEEEEE',
        300: '#E0E0E0',
        400: '#BDBDBD',
        500: '#9E9E9E',
        600: '#757575',
        700: '#616161',
        800: '#424242',
        900: '#212121',
      },
      background: {
        0: '#FFFFFF',
        50: '#FAFAFA',
        100: '#F5F5F5',
        200: '#EEEEEE',
        300: '#E0E0E0',
      },
    },
  },
});

export { config };
export { config as gluestackConfig };
