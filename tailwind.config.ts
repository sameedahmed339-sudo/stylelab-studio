import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#0C0B0A",
        paper: "#F3F0EA",
        ink: "#EDEAE3",
        graphite: "#87817A",
        line: "rgba(237,234,227,0.12)",
        brass: "#B08D57",
        whatsapp: "#25D366",
      },
      fontFamily: {
        sans: ["var(--font-bricolage)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
