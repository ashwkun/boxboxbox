module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
        background: 'rgb(var(--color-background) / <alpha-value>)',
        card: 'rgb(var(--color-card) / <alpha-value>)',
        border: 'rgb(var(--color-border) / <alpha-value>)',
        // F1 Team Colors
        mercedes: '#00D2BE',
        redbull: '#0600EF',
        ferrari: '#DC0000',
        mclaren: '#FF8700',
        astonmartin: '#006F62',
        alpine: '#0090FF',
        williams: '#005AFF',
        alphatauri: '#2B4562',
        alfaromeo: '#900000',
        haas: '#FFFFFF'
      },
      fontFamily: {
        display: ['"Clash Display"', 'sans-serif'],
        body: ['"Space Grotesk"', 'sans-serif']
      },
      spacing: {
        // custom spacing if needed
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
} 