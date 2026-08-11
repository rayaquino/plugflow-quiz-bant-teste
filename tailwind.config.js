/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // `fundo` veio do site real (plugflow.com.br), conferido no computed
        // style: e bem mais escuro que o roxo do manual e e ele que da o ar de
        // "site com acabamento". O roxo do manual continua valendo pras
        // superficies (cards, blocos), nao pro fundo da pagina.
        fundo: '#0C0024',
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
      // O site real usa Lexend em TUDO, titulo e corpo, conferido no computed
      // style. O guia de marca sugeria Public Sans no corpo, mas quem manda e
      // o que esta no ar.
      fontFamily: {
        display: ['Lexend', 'system-ui', 'sans-serif'],
        sans: ['Lexend', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'brand-grad': 'linear-gradient(90deg, #F18E99 0%, #CD4994 100%)',
      },
    },
  },
  plugins: [],
}
