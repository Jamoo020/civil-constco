module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        steel: "#2B3A4A",
        concrete: "#BFC7C9",
        sand: "#D6C4A6",
        coast: "#0E7490"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"]
      }
    }
  },
  plugins: []
};
