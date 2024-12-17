/** @type {import('tailwindcss').Config} */

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primaryx: '#97DFFC',
        secondary: '#858AE3',
        accent: '#613DC1',
        neutral: '#4E148C',
        'dark-neutral': '#2C0735',
      },
      fontFamily: {
        rammetto: ['Rammetto One'],
        poppins: ['poppins'],
      },
      backgroundImage: {
        'dark-gradient': 'radial-gradient(circle, #2c2d3e, #1a1b25)',
      },
    },
  },
  plugins: [require('tailwindcss-animated'), require('daisyui')],
}
