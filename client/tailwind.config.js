/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#8B5A2B',
          light:   '#A8703E',
          dark:    '#6B3F18',
          hover:   '#5A3010',
        },
        secondary: {
          DEFAULT: '#2D1A0E',
          light:   '#4A2E18',
        },
        accent: {
          DEFAULT: '#E8D5B7',
          light:   '#F5ECD8',
          warm:    '#D4B896',
        },
        beige: {
          DEFAULT: '#F5ECD8',
          light:   '#FBF7F1',
          warm:    '#EDD9BB',
        },
        surface: '#FBF7F1',
        background: '#F5ECD8',
        success: '#5A9E6B',
        error:   '#C0392B',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans:  ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'soft':   '0 2px 16px 0 rgba(139,90,43,0.10)',
        'card':   '0 4px 24px 0 rgba(139,90,43,0.12)',
        'strong': '0 8px 40px 0 rgba(139,90,43,0.22)',
        'btn':    '0 4px 16px 0 rgba(139,90,43,0.35)',
      },
    },
  },
  plugins: [],
};
