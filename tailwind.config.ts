import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        night: "#070A12",
        midnight: "#0B1020",
        nebula: "#1A1333",
        gold: "#D6B36A",
        ivory: "#E9E6DF",
      },
      boxShadow: {
        glow: "0 0 40px rgba(214,179,106,0.15)",
      },
    },
  },
  plugins: [],
} satisfies Config;