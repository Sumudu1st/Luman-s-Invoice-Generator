/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        script: ['Dancing Script', 'cursive'],
      },
      colors: {
        brand: {
          red: '#D32F2F',
          yellow: '#FBC02D',
          dark: '#212121',
        }
      }
    },
  },
  plugins: [],
}