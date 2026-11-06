module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        navy: "#142B3A",
        steel: "#355A72",
        concrete: "#C5CBCB",
        sand: "#D7C6A7",
        coast: "#315E72",
        paper: "#F7F6F2",
        ink: "#1D2B35",
        muted: "#586873",
        line: "#DCE1E2",
        brand: {
          navy: "#142B3A",
          steel: "#355A72",
          concrete: "#C5CBCB",
          sand: "#D7C6A7",
          coast: "#315E72",
          paper: "#F7F6F2",
          surface: "#FFFFFF",
          ink: "#1D2B35",
          muted: "#586873",
          line: "#DCE1E2",
          focus: "#14799A"
        }
      },
      fontFamily: {
        sans: ["Aptos", "Segoe UI", "Helvetica Neue", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};
