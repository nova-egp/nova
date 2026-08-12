/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0E1330',
          50: '#F4F5F9',
          100: '#E4E6EF',
          200: '#C2C6DA',
          300: '#9098BD',
          400: '#5B639A',
          500: '#333B72',
          600: '#1E2452',
          700: '#141936',
          800: '#0E1330',
          900: '#080B1C',
        },
        cream: {
          DEFAULT: '#F8F5EE',
          100: '#FFFFFF',
          200: '#F8F5EE',
          300: '#EFE9DA',
        },
        gold: {
          DEFAULT: '#C6A15B',
          light: '#DCC088',
          dim: '#A9873F',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        body: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        widest2: '.28em',
      },
      maxWidth: {
        content: '1280px',
      },
    },
  },
  plugins: [],
};
