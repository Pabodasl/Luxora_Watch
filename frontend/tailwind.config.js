/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FFF3EB',
          100: '#FFE1D0',
          200: '#FFC2A1',
          300: '#FFA06E',
          400: '#FF7D3D',
          500: '#F25912',
          600: '#D94F10',
          700: '#B8410D',
          800: '#8C3009',
          900: '#612106',
        },
        accent: {
          100: '#E6DBFF',
          200: '#CDBBFF',
          300: '#B39FF6',
          400: '#8C75D8',
          500: '#5C3E94',
          600: '#4A2F7A',
        },
        dark: {
          50: '#EEEAF8',
          100: '#D4CCE8',
          200: '#B2A4D4',
          300: '#8E7BC0',
          400: '#6A54A6',
          500: '#533E8A',
          600: '#44306F',
          700: '#412B6B',
          800: '#2C1F4B',
          900: '#211832',
        },
        border: '#3C306B'
      },
      fontFamily: {
        'sans': ['Inter', 'Poppins', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        }
      }
    },
  },
  plugins: [],
}
