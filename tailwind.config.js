/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Poppins', 'sans-serif'],
        serif: ['Playfair\\ Display'],
      },
      colors: {
        offWhite: '#E3E3E3',
        offWhite2: '#fffeff',
        justBlack: '#242929',
        accentBlue: '#54657E',
      },
    },
  },
  plugins: [require('daisyui')],
};
