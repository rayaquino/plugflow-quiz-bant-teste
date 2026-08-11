/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Manual de identidade PlugFlow (pagina 13)
        roxo: {
          950: '#0D0D12',
          900: '#1F0052',
          800: '#2A0A63',
          700: '#3A1470',
          600: '#5A2A9E',
        },
        rosa: '#F18E99',
        magenta: '#CD4994',
        cinza: '#DEDEDE',
        creme: '#EDE3D2',
      },
      fontFamily: {
        display: ['Lexend', 'system-ui', 'sans-serif'],
        sans: ['"Public Sans"', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'brand-grad': 'linear-gradient(90deg, #F18E99 0%, #CD4994 100%)',
      },
    },
  },
  plugins: [],
}
