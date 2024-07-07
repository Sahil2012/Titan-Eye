/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors : {
        blue : {
          500 : "#146EB4"
        },
        grey : {
          500 : "#4D4D4D",
          300 : "#FFFFFF",
          700 : '#F2F2F2'
        },
        black : {
          500 : "#1A181E"
        },
        violet : {
          500 : "#1E2640",
          300 : "#353C53"
        }
      }
    },
  },
  plugins: [],
}

