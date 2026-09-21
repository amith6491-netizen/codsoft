import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#182231",
          50: "#f4f6f8",
          100: "#e4e9ee",
          200: "#c3ccd6",
          400: "#5c6b7e",
          600: "#33445a",
          800: "#1f2b3b",
          900: "#182231"
        },
        parchment: "#f6f3ec",
        signal: {
          DEFAULT: "#c96f3e",
          50: "#fbf0e9",
          600: "#c96f3e",
          700: "#a85830"
        },
        moss: "#3f6b52"
      },
      fontFamily: {
        display: ["'Fraunces'", "Georgia", "serif"],
        body: ["'Inter'", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
