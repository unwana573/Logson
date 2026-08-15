/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0C0E14",
        panel: "#171B24",
        panel2: "#151A24",
        border: "#262C3A",
        border2: "#232A38",
        brass: "#C6A15B",
        brassDark: "#1A140B",
        text: "#ECEEF3",
        muted: "#9AA1B4",
        faint: "#656C80",
        mint: "#6EE7B7",
        amber: "#E39A6B",
        accentBlue: "#3B6BE0",
        accentRed: "#D8433F",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
