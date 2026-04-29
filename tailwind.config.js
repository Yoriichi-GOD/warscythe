export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          core: '#c5a059',
          glow: 'rgba(197, 160, 89, 0.25)',
          bright: '#e8d0a0',
        },
        red: {
          core: '#9e1b1b',
          hot: '#ff3c3c',
          glow: 'rgba(158, 27, 27, 0.35)',
        }
      },
      fontFamily: {
        display: ['Cinzel', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
        main: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
