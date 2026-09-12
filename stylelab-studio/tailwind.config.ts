import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: "#090A0F",
        charcoal: "#12141C",
        cyan: {
          glow: "#00F0FF",
        },
      },
      boxShadow: {
        "glow-cyan": "0 0 16px rgba(0, 240, 255, 0.35)",
        "glow-cyan-lg": "0 0 32px rgba(0, 240, 255, 0.5)",
      },
    },
  },
  plugins: [],
};

export default config;
