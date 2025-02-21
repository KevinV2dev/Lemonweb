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
        'yellow-lemon': '#FEF168',
        'glass-lemon': '#EFEFF0',
        'night-lemon': '#323029',
        'lime-lemon': '#008859',
        'sky-lemon': '#D2E3EF',
        'silver-lemon': '#53545D',
        'heaven-lemon': '#D8D6D3',
      },
      keyframes: {
        'phone-ring': {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '5%, 15%, 25%': { transform: 'rotate(-4deg)' },
          '10%, 20%, 30%': { transform: 'rotate(4deg)' },
          '35%': { transform: 'rotate(0deg)' },
        },
        'arrow-move': {
          '0%': { transform: 'translate(0, 0)' },
          '100%': { transform: 'translate(2px, -2px)' }
        }
      },
      animation: {
        'phone-ring': 'phone-ring 2s ease-in-out infinite',
        'arrow-move': 'arrow-move 0.2s ease-out forwards'
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

export default config;
