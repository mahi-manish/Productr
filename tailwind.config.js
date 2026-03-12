/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./client/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        eloquia: ['Eloquia', 'sans-serif'],
      },
      colors: {
        brand: {
          dark: '#0A0B1A',
          primary: "#0B1E7A",
          lightbg: "#F7F8FC"
        }
      }
    },
  },
  plugins: [],
}
