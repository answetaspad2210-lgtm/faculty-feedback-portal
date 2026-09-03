// client/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // A restrained academic palette - deep navy primary, muted accents.
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#3b4fbf',
          600: '#2f3fa0',
          700: '#263280',
        },
        surface: '#f6f7fb',
      },
    },
  },
  plugins: [],
};
