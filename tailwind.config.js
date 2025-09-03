/** @type {import('tailwindcss').Config} */

import daisyui from 'daisyui'
import tailwind_animated from 'tailwindcss-animated'
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
  plugins: [tailwind_animated, daisyui],
}
