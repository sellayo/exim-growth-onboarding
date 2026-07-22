/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ocean: {
          50: '#F0F5FF',
          100: '#E0ECFF',
          200: '#BA94FF',
          300: '#7FAEFF',
          400: '#478BFF',
          500: '#1D68F0',
          600: '#1052D4',
          700: '#0B3FAD',
          800: '#082F88',
          900: '#062060',
          950: '#041544',
        },
        gold: {
          50: '#FFF8ED',
          100: '#FFEED4',
          200: '#FFDAA8',
          300: '#FFBF70',
          400: '#FB9A34',
          500: '#F57E13',
          600: '#E06208',
          700: '#BA4907',
          800: '#943A0D',
          900: '#78320F',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'glow-gold': '0 0 25px -5px rgba(245, 126, 19, 0.4)',
        'glow-ocean': '0 0 25px -5px rgba(11, 63, 173, 0.3)',
        'card-hover': '0 20px 30px -10px rgba(4, 21, 68, 0.08), 0 4px 6px -2px rgba(4, 21, 68, 0.03)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
