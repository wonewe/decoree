/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#ffffff",
        "paper-muted": "#f8f8f8",
        ink: "#111619",
        "ink-muted": "#5b6168",
        accent: "#1a8917",
        hanBlue: "#3559E0",
        dancheongRed: "#E63946",
        dancheongGreen: "#2A9D8F",
        dancheongYellow: "#F4A261",
        dancheongNavy: "#1D3557"
      },
      fontFamily: {
        heading: ["\"Source Serif 4\"", "\"Pretendard\"", "\"Inter\"", "serif"],
        body: ["\"Pretendard\"", "\"Inter\"", "system-ui", "sans-serif"]
      },
      boxShadow: {
        card: "0 30px 80px rgba(15, 23, 42, 0.08)"
      },
      borderRadius: {
        "3xl": "1.75rem"
      }
    }
  },
  plugins: []
};
