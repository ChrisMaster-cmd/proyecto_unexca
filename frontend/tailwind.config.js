/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'unexca-blue': '#003366',
        'unexca-bg': '#eef1f5',
        'unexca-light': '#0056b3',
      },
    },
  },
  plugins: [],
}