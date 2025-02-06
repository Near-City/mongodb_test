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
        secondary: '#111804',
        danger: '#e3342f',
      },
      backgroundImage: {
        'satellite-image': "url('/tilesBg/mapBG.png')", // Actualiza la ruta
        'map-image': "url('/tilesBg/satelliteBG.png')", // Actualiza la ruta
        'transit-image': "url('/tilesBg/transitBG.png')", // Actualiza la ruta
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        serif: ['Merriweather', 'serif'],
      },
    },
  },
  plugins: [],
}
