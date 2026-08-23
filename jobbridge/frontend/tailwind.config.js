/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#080B12",
          900: "#0A0E17",
          800: "#121826",
          700: "#1A2233",
          600: "#232B3D",
          500: "#2E3850",
        },
        signal: {
          violet: "#6E5BFF",
          cyan: "#22D3EE",
          amber: "#F5B942",
        },
        mist: {
          100: "#E8ECF4",
          300: "#B7C0D4",
          500: "#8B94A8",
        },
        ok: "#34D399",
        warn: "#F5B942",
        bad: "#F87171",
      },
      fontFamily: {
        display: ["Sora", "sans-serif"],
        body: ["Space Grotesk", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      backgroundImage: {
        "grid-fade":
          "linear-gradient(to bottom, rgba(110,91,255,0.08), transparent 60%)",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(110,91,255,0.25), 0 0 24px rgba(110,91,255,0.15)",
        "glow-cyan": "0 0 0 1px rgba(34,211,238,0.25), 0 0 24px rgba(34,211,238,0.12)",
      },
      keyframes: {
        pulseLine: {
          "0%, 100%": { opacity: 0.3 },
          "50%": { opacity: 1 },
        },
        drift: {
          "0%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
          "100%": { transform: "translateY(0px)" },
        },
      },
      animation: {
        pulseLine: "pulseLine 2.4s ease-in-out infinite",
        drift: "drift 5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
