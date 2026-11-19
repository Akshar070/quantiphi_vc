/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#040817', // deepest obsidian navy
          900: '#070d1e', // dark mode main background
          850: '#0a132c', // dark mode panel/sidebar
          800: '#0d1838', // dark mode card/bubble
          750: '#12204c', // dark mode elevated card
          700: '#182b62', // dark mode border
          600: '#233d87', // dark mode active border
          500: '#3257be', // navy accent
          400: '#547ae4', // highlight blue
          300: '#8ba6f3',
          200: '#c2d2fa',
          100: '#e5ecfd',
        },
        beige: {
          50: '#fdfbf7', // light mode pure cream
          100: '#f8f5ee', // light mode main background
          150: '#f4efe4', // light mode card background
          200: '#eee6d8', // light mode panel / hover
          300: '#e3d7c3', // light mode border
          400: '#cfbe9f',
          500: '#b8a37f',
          600: '#9a8562',
        },
        osaka: {
          orange: '#ea580c',
          'orange-hover': '#c2410c',
          'orange-light': '#fff7ed',
          'orange-glow': 'rgba(234, 88, 12, 0.25)',
          navy: '#0d1838',
          'navy-dark': '#070d1e',
          'navy-accent': '#2563eb',
        },
      },
      animation: {
        'pulse-subtle': 'pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'blink': 'blink 1s step-start infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
