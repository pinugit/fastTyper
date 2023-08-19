/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#282828",
        "primary-2": "#a89984",
        "primary-dark": "#1d2021",
        "gruv-gray": "#928374",
        "gruv-light-gray": "#fbf1c7",
        "gruv-light-yello": "#fabd2f"

      }
    },
  },
  plugins: [],
}

