import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
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
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        "business-central": {
          DEFAULT: "hsl(var(--business-central))",
          foreground: "hsl(var(--business-central-foreground))",
        },
        sales: {
          DEFAULT: "hsl(var(--sales))",
          foreground: "hsl(var(--sales-foreground))",
        },
        marketing: {
          DEFAULT: "hsl(var(--marketing))",
          foreground: "hsl(var(--marketing-foreground))",
        },
        crm: {
          DEFAULT: "hsl(var(--crm))",
          foreground: "hsl(var(--crm-foreground))",
        },
        finance: {
          DEFAULT: "hsl(var(--finance))",
          foreground: "hsl(var(--finance-foreground))",
        },
        "supply-chain": {
          DEFAULT: "hsl(var(--supply-chain))",
          foreground: "hsl(var(--supply-chain-foreground))",
        },
        "finance-supply": {
          DEFAULT: "hsl(var(--finance-supply))",
          foreground: "hsl(var(--finance-supply-foreground))",
        },
        copilot: {
          DEFAULT: "hsl(var(--copilot))",
          foreground: "hsl(var(--copilot-foreground))",
        },
        agents: {
          DEFAULT: "hsl(var(--agents))",
          foreground: "hsl(var(--agents-foreground))",
        },
        "customer-service": {
          DEFAULT: "hsl(var(--customer-service))",
          foreground: "hsl(var(--customer-service-foreground))",
        },
        "field-service": {
          DEFAULT: "hsl(var(--field-service))",
          foreground: "hsl(var(--field-service-foreground))",
        },
        "contact-center": {
          DEFAULT: "hsl(var(--contact-center))",
          foreground: "hsl(var(--contact-center-foreground))",
        },
        "project-operations": {
          DEFAULT: "hsl(var(--project-operations))",
          foreground: "hsl(var(--project-operations-foreground))",
        },
        "human-resources": {
          DEFAULT: "hsl(var(--human-resources))",
          foreground: "hsl(var(--human-resources-foreground))",
        },
        "cta-orange": {
          DEFAULT: "hsl(var(--cta-orange))",
          hover: "hsl(var(--cta-orange-hover))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        positive: {
          DEFAULT: "hsl(var(--positive))",
          foreground: "hsl(var(--positive-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        // ─── Beslutsmognadsindex (mapped to site design tokens) ───
        // Prefixed bm-* to avoid colliding with site design tokens.
        "bm-paper": "hsl(var(--background))",
        "bm-paper-edge": "hsl(var(--muted))",
        "bm-ink": "hsl(var(--foreground))",
        "bm-ink-soft": "hsl(var(--foreground) / 0.8)",
        "bm-ink-muted": "hsl(var(--muted-foreground))",
        "bm-accent": "hsl(var(--accent))",
        "bm-accent-soft": "hsl(var(--accent) / 0.14)",
        "bm-accent-deep": "hsl(var(--accent))",
        "bm-highlight": "hsl(var(--primary))",
        "bm-highlight-soft": "hsl(var(--primary) / 0.18)",
        "bm-rule": "hsl(var(--border))",
        "bm-rule-strong": "hsl(var(--foreground) / 0.25)",
      },
      fontFamily: {
        "bm-display": ['Playfair Display', 'Georgia', 'serif'],
        "bm-body": ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        shimmer: {
          "0%": {
            transform: "translateX(-100%)",
          },
          "100%": {
            transform: "translateX(100%)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        shimmer: "shimmer 3s ease-in-out infinite",
        marquee: "marquee var(--marquee-duration, 60s) linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
