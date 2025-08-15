/** @type {import('tailwindcss').Config} */

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#fff',
        secondary: '#fff',
        accent: '#fff',
        neutral: '#fff',
        'dark-neutral': '#fff',
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
