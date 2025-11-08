/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        hanBlue: "#3559E0",
        dancheongRed: "#E63946",
        dancheongGreen: "#2A9D8F",
        dancheongYellow: "#F4A261",
        dancheongNavy: "#1D3557"
      },
      fontFamily: {
        heading: ["\"Pretendard\"", "system-ui", "sans-serif"],
        body: ["\"Pretendard\"", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};
