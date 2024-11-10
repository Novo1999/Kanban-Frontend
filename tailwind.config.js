/** @type {import('tailwindcss').Config} */

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'primaryx': "#97DFFC",
        'secondary': '#858AE3',
        'accent': '#613DC1',
        'neutral': "#4E148C",
        'dark-neutral': "#2C0735"
      },
      fontFamily: {
        rammetto: ['Rammetto One'],
        poppins: ['poppins'],
      },
    },
  },
  plugins: [require('tailwindcss-animated'), require('daisyui')],
}
