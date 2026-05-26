import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#08090b",
          900: "#0d0f12",
          850: "#121417",
          800: "#181b1f",
          700: "#23272d",
          500: "#6d747f",
          300: "#b6bdc6",
          100: "#edf0f3"
        },
        mint: "#6ee7b7",
        coral: "#fb7185",
        amber: "#fbbf24",
        iris: "#a78bfa",
        cyan: "#67e8f9"
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif"
        ]
      },
      boxShadow: {
        glow: "0 20px 70px rgba(0, 0, 0, 0.36)",
        hairline: "inset 0 1px 0 rgba(255,255,255,0.08)"
      }
    }
  },
  plugins: []
} satisfies Config;
