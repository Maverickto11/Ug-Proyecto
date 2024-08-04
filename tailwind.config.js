/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {

      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
      colors: {
        'black': '#000000',
        'gray-800': '#2d2d2d',
        'gray-700': '#3d3d3d',
        'red-600': '#e50914',
        'red-700': '#b10610',     
      },
      boxShadow: {
          'neumorphism': '10px 10px 20px #cbced1, -10px -10px 20px #ffffff',
          
      },
    },
  },
  plugins: [],
}

