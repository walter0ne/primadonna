/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#C49B66',
          light: '#D4B07E',
          dark: '#A8824E',
        },
        secondary: {
          DEFAULT: '#1A1A2E',
          light: '#252547',
        },
        accent: '#E8D5B7',
        background: '#FAFAF8',
        success: '#4CAF50',
        error: '#E53935',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
