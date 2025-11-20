import type { Config } from 'tailwindcss'

export default {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        gsBlue: "#00A3FF",
        gsDark: "#0a0f1f",
        gsNeon: "#2cf2ff",
        gsOrange: "#ff9d3b",
      },
      fontFamily: {
        display: ["Inter", "Roboto Flex", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      boxShadow: {
        neon: "0 0 25px rgba(0,163,255,0.45)",
      },
      backdropBlur: {
        xs: "2px",
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
} satisfies Config
