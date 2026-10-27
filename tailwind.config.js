/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: "#fe008b",
        brandDark: "#0b0b0f",
      },
    },
  },
  plugins: [],
};