/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'exo2': ['"Exo 2"', 'sans-serif'],
        'exo': ['"Exo"', 'sans-serif'],
      },
      colors: {
        'gadget-bg': 'rgba(0,0,0,0.3)',
      },
    },
  },
  plugins: [],
}
