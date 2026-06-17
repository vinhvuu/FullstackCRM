import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#6366F1",
          hover: "#4F46E5",
          secondary: "#818CF8",
        },
        cta: {
          DEFAULT: "#10B981",
          hover: "#059669",
        },
        background: "#F5F3FF",
        "text-dark": "#1E1B4B",
        "text-muted": "#64748B",
      },
      fontFamily: {
        poppins: ["var(--font-poppins)", "sans-serif"],
        opensans: ["var(--font-opensans)", "sans-serif"],
      },
      borderRadius: {
        "2xl": "16px",
        xl: "12px",
      },
      spacing: {
        section: "48px",
        card: "24px",
      },
    },
  },
  plugins: [],
};
export default config;
