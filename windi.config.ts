import { defineConfig } from 'windicss/helpers';
import questionMark from '@windicss/plugin-question-mark';

export default defineConfig({
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        phone: '320px',
        iPad: '1024px',
        sm: '1280px',
        md: '1366px',
        lg: '1440px',
        xl: '1920px',
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '48px',
      },
    },
    borderRadius: {
      none: '0',
      sm: '2px',
      DEFAULT: '4px',
      md: '6px',
      lg: '8px',
      full: '9999px',
      large: '12px',
    },
    fontSize: {
      xs: '12px',
      sm: '14px',
      tiny: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '30px',
      '4xl': '36px',
      '5xl': '48px',
      '6xl': '64px',
      '7xl': '80px',
    },
  },
  plugins: [questionMark],
});
