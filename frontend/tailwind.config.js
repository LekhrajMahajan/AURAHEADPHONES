/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body:    ['Outfit', 'sans-serif'],
      },
      colors: {
        void:    '#080808',
        surface: '#1a1a1a',
        lifted:  '#2a2a2a',
        cyan:    '#00e5ff',
        signal:  '#ff3d6b',
        muted:   '#a0a0a0',
        bright:  '#f0f0f0',
      },
      screens: {
        xs: '480px',
      },
    },
  },
  plugins: [],
}