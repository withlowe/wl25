import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)"],
        mono: ["var(--font-mono)"],
        serif: ["var(--font-serif)"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "none",
            color: "hsl(var(--foreground))",
            fontFamily: "'Charter', serif",
            fontSize: "1.125rem",
            lineHeight: "1.75",
            a: {
              color: "hsl(var(--foreground))",
              textDecoration: "underline",
              textUnderlineOffset: "4px",
              "&:hover": {
                color: "hsl(var(--muted-foreground))",
              },
            },
            h1: {
              color: "hsl(var(--foreground))",
              fontWeight: 400,
              fontFamily: "'Charter', serif",
              letterSpacing: "-0.025em",
            },
            h2: {
              color: "hsl(var(--foreground))",
              fontWeight: 400,
              fontFamily: "'Charter', serif",
              letterSpacing: "-0.025em",
            },
            h3: {
              color: "hsl(var(--foreground))",
              fontWeight: 400,
              fontFamily: "'Charter', serif",
              letterSpacing: "-0.025em",
            },
            h4: {
              color: "hsl(var(--foreground))",
              fontWeight: 400,
              fontFamily: "'Charter', serif",
              letterSpacing: "-0.025em",
            },
            p: {
              marginTop: "1.25em",
              marginBottom: "1.25em",
            },
            blockquote: {
              color: "hsl(var(--muted-foreground))",
              borderLeftColor: "hsl(var(--border))",
              fontStyle: "italic",
              fontFamily: "'Charter', serif",
            },
            code: {
              color: "hsl(var(--foreground))",
            },
            strong: {
              color: "hsl(var(--foreground))",
              fontWeight: 700,
            },
          },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
}
export default config
