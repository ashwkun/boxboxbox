/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1E88E5',
        secondary: '#3949AB',
        accent: '#FF4081',
        background: {
          light: '#f9f9f9',
          dark: '#121212',
        },
        text: {
          primary: '#333',
          light: '#767676',
        },
        card: '#fff',
        border: '#e0e0e0',
        success: '#4CAF50',
        error: '#F44336',
        warning: '#FFC107',
        info: '#2196F3',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.1)',
        'hover': '0 8px 16px rgba(0, 0, 0, 0.15)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      aspectRatio: {
        'poster': '2/3',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
    },
  },
  plugins: [],
} 