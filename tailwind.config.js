/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E6F0FF',
          100: '#B2D0FF',
          200: '#B2D0FF',
          400: '#3985FF',
          500: '#0866FF',
          600: '#075DE8',
          700: '#0648B5',
          800: '#04388C',
          900: '#032B6B',
        },
        secondary: {
          50: '#FFF6E6',
          100: '#FFE2B2',
          200: '#FFE2B2',
          500: '#FFA108',
          900: '#6B4403',
        },
        greyscale: {
          2: '#FDFDFD',
          3: '#F5F6F6',
          4: '#F1F1F1',
          5: '#DBDCDC',
          7: '#949596',
          8: '#646667',
          9: '#515354',
          10: '#353738',
          11: '#2E3031',
          12: '#242728',
          disabled: '#F5F5F5'
        },
        borderColor: '#D9D9D9',
        alert: {
          // yellow: '#F7C752',
          yellow: {
            base: '#F7C752',
            dark: '#755118',
            35: 'rgba(247, 199, 82, 0.35)'
          },
          red: {
            base: '#EF665B',
            dark: '#71192F',
            35: 'rgba(239, 102, 91, 0.35)'
          },
          green: {
            base: '#84D65A',
            dark: '#2B641E',
            35: 'rgba(132, 214, 90, 0.35)'
          }
        }
      },
      fontFamily: {
        mullish: ["Mulish", 'sans-serif'],
        spaceGrotesk: ["Space Grotesk", 'sans-serif'],
        inter: ["Inter", 'sans-serif'],
        archivo: ["Archivo", 'sans-serif'],
      },
      screens: {
        "smmd": '700px',
        "3xl": '2000px',
        "4xl": '2500px',
      },
      boxShadow: {
        'custom': '15px 12.38px 7px 2px rgba(71, 56, 180, 0.47), 15px 20px 1px 2px rgba(8, 102, 255, 1)', // Black and blue shadows
      },
    },
  },
  plugins: [],
}