import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#080c14",
        surface: "#0f1626",
        "surface-card": "#131b2e",
        "surface-card-hover": "#17223b",
        "surface-border": "rgba(255, 255, 255, 0.08)",
        "surface-glass": "rgba(19, 27, 46, 0.65)",
        brand: {
          purple: "#8b5cf6",
          violet: "#a855f7",
          cyan: "#06b6d4",
          teal: "#14b8a6",
          pink: "#ec4899",
          emerald: "#10b981",
          rose: "#f43f5e",
          amber: "#f59e0b",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-card-primary": "linear-gradient(135deg, #7c3aed 0%, #2563eb 50%, #06b6d4 100%)",
        "gradient-card-secondary": "linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #3b82f6 100%)",
        "gradient-card-dark": "linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)",
        "gradient-glass": "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        glow: "0 0 25px -5px rgba(139, 92, 246, 0.3)",
        "glow-cyan": "0 0 25px -5px rgba(6, 182, 212, 0.3)",
        card: "0 10px 30px -10px rgba(0, 0, 0, 0.5)",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
