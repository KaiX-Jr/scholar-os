import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        obsidian: {
          DEFAULT: "#08080c",
          50: "#1a1a24",
          100: "#161620",
          200: "#13131c",
          300: "#101018",
          400: "#0c0c12",
          500: "#08080c",
          600: "#060609",
          700: "#040407",
          800: "#030305",
          900: "#010102",
        },
        glass: {
          surface: "rgba(255, 255, 255, 0.03)",
          surfaceHover: "rgba(255, 255, 255, 0.06)",
          border: "rgba(255, 255, 255, 0.08)",
          borderHighlight: "rgba(255, 255, 255, 0.2)",
          specular: "rgba(255, 255, 255, 0.15)",
        },
        chroma: {
          cyan: "#00f2fe",
          indigo: "#6366f1",
          violet: "#a855f7",
          emerald: "#10b981",
          amber: "#f59e0b",
          rose: "#f43f5e",
        },
      },
      backgroundImage: {
        "radial-glass": "radial-gradient(circle at 50% 0%, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.01) 70%, transparent 100%)",
        "radial-glow": "radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.15) 0%, rgba(6, 182, 212, 0.08) 40%, transparent 70%)",
        "mesh-gradient": "radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.12) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(6, 182, 212, 0.12) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(168, 85, 247, 0.1) 0px, transparent 50%), radial-gradient(at 0% 100%, rgba(16, 185, 129, 0.08) 0px, transparent 50%)",
        "specular-conic": "conic-gradient(from 180deg at 50% 50%, rgba(99, 102, 241, 0.3) 0deg, rgba(6, 182, 212, 0.4) 120deg, rgba(168, 85, 247, 0.3) 240deg, rgba(99, 102, 241, 0.3) 360deg)",
      },
      boxShadow: {
        "liquid-glass": "0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)",
        "liquid-glow": "0 0 40px -10px rgba(99, 102, 241, 0.3), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)",
        "cyan-glow": "0 0 35px -5px rgba(6, 182, 212, 0.35)",
        "specular": "inset 0 1px 1px 0 rgba(255, 255, 255, 0.25), 0 20px 40px -15px rgba(0,0,0,0.6)",
      },
      animation: {
        "shimmer": "shimmer 3s ease-in-out infinite",
        "shiny-text": "shiny-text 8s infinite",
        "pulse-glow": "pulseGlow 4s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "spin-slow": "spin 20s linear infinite",
        "border-beam": "border-beam calc(var(--duration)*1s) infinite linear",
        "gradient-text": "gradientText 6s ease infinite",
        "shimmer-slide": "shimmer-slide var(--speed) ease-in-out infinite alternate",
        "spin-around": "spin-around calc(var(--speed) * 2) infinite linear",
      },
      keyframes: {
        "shiny-text": {
          "0%, 90%, 100%": {
            "background-position": "calc(-100% - var(--shiny-width)) 0",
          },
          "30%, 60%": {
            "background-position": "calc(100% + var(--shiny-width)) 0",
          },
        },
        "shimmer-slide": {
          to: {
            transform: "translate(calc(100cqw - 100%), 0)",
          },
        },
        "spin-around": {
          "0%": {
            transform: "translateZ(0) rotate(0)",
          },
          "15%, 35%": {
            transform: "translateZ(0) rotate(90deg)",
          },
          "65%, 85%": {
            transform: "translateZ(0) rotate(270deg)",
          },
          "100%": {
            transform: "translateZ(0) rotate(360deg)",
          },
        },
        "border-beam": {
          "100%": {
            "offset-distance": "100%",
          },
        },
        gradientText: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.3", transform: "scale(1)" },
          "50%": { opacity: "0.7", transform: "scale(1.05)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "Fira Code", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
