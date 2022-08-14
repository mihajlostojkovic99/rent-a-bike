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
        accentBlue: '#008CEE',
        darkBlue: '#041522',
        gold: '#FFD700',
        redDanger: '#820000',
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        mytheme: {
          'primary': '#E3E3E3',
          'secondary': '#242929',
          'accent': '#008CEE',
          'neutral': '#E3E3E3',
          'base-100': '#ffffff',
        },
        dangertheme: {
          'primary': '#E3E3E3',
          'secondary': '#242929',
          'accent': '#820000',
          'neutral': '#E3E3E3',
          'base-100': '#ffffff',
        },
      },
    ],
  },
};
