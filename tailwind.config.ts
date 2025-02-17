import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#1D1C19",
        secondary: "#F5F5F5",
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

export default config;
