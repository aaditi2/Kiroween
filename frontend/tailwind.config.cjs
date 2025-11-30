/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        pumpkin: "#ff6b35",
        midnight: "#0b1021",
        mist: "#c7d2fe",
        toxic: "#96f550"
      },
      fontFamily: {
        display: ["'Creepster'", "cursive", "Inter", "sans-serif"],
      },
      boxShadow: {
        candle: "0 0 20px rgba(255, 107, 53, 0.6)",
      }
    },
  },
  plugins: [],
};