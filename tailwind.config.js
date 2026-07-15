/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: { 50: '#f1f6fc', 100: '#e3edf8', 600: '#285b98', 700: '#1d477b', 800: '#173963', 900: '#102a56', 950: '#0a1b38' }
      },
      boxShadow: { panel: '0 12px 36px rgba(15, 23, 42, 0.08)' }
    }
  },
  plugins: []
};
