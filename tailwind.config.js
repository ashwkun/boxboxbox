/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Clash Display', 'sans-serif'],
        body: ['Space Grotesk', 'sans-serif'],
      },
      colors: {
        primary: {
          start: '#FF4D8F',
          end: '#FF8D4D',
        },
        emotion: {
          love: '#FF4D8F',
          like: '#FF8D4D',
          meh: '#FFD84D',
          nope: '#4D4D4D',
          thinking: '#4DCCFF',
        },
        background: {
          dark: '#121212',
          card: '#1E1E1E',
        },
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
      },
    },
  },
  plugins: [],
} 