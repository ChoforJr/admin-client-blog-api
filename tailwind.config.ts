import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#13221d",
        forest: "#174a39",
        mint: "#dcefe3",
        lime: "#c8ee79",
        paper: "#f5f7f2",
      },
    },
  },
  plugins: [],
};

export default config;
