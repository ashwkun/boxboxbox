/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
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
    },
  },
  plugins: [],
} 