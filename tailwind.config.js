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
        offWhite1: '#efd7bc',
        offWhite2: '#fffeff',
        justBlack: '#242929',
        accentBlue: '#5382f6',
      },
    },
  },
  plugins: [require('daisyui')],
};
