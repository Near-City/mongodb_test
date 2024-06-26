/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2B4E89',
        secondary: '#97B3E3',
        danger: '#e3342f',
      },
    },
  },
  plugins: [],
}