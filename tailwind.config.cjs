/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // that is animation class
      animation: {
        fade: 'fadeOut 1.5s ease-in-out',
      },

      // that is actual animation
      keyframes: theme => ({
        fadeOut: {
          '0%': { opacity: 100 },
          '100%': { opacity: 0 },
        },
      }),
    },
  },
  plugins: [],
}