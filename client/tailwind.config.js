/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["selector", '[data-theme="dark"]'],
    content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                bg: "var(--bg)",
                surface: "var(--surface)",
                "surface-2": "var(--surface-2)",
                text: "var(--text)",
                "text-2": "var(--text-2)",
                "text-3": "var(--text-3)",
                border: "var(--border)",
                "border-strong": "var(--border-strong)",
                red: {
                    DEFAULT: "var(--red)",
                    hover: "var(--red-hover)",
                    text: "var(--red-text)",
                    soft: "var(--red-soft)",
                    line: "var(--red-line)",
                },
                success: {
                    DEFAULT: "var(--success)",
                    soft: "var(--success-soft)",
                },
                warning: {
                    DEFAULT: "var(--warning)",
                    soft: "var(--warning-soft)",
                },
                info: {
                    DEFAULT: "var(--info)",
                    soft: "var(--info-soft)",
                },
                invert: {
                    bg: "var(--invert-bg)",
                    text: "var(--invert-text)",
                },
                // Shadcn / generic mappings
                background: "var(--bg)",
                foreground: "var(--text)",
                card: {
                    DEFAULT: "var(--surface)",
                    foreground: "var(--text)",
                },
                popover: {
                    DEFAULT: "var(--surface-2)",
                    foreground: "var(--text)",
                },
                primary: {
                    DEFAULT: "var(--red)",
                    foreground: "var(--on-red)",
                },
                secondary: {
                    DEFAULT: "var(--surface-2)",
                    foreground: "var(--text)",
                },
                muted: {
                    DEFAULT: "var(--surface-2)",
                    foreground: "var(--text-2)",
                },
                accent: {
                    DEFAULT: "var(--surface-2)",
                    foreground: "var(--text)",
                },
                destructive: {
                    DEFAULT: "var(--red)",
                    foreground: "var(--on-red)",
                },
                ring: "var(--focus-ring)",
                input: "var(--border-strong)",
            },
            borderRadius: {
                sm: "6px",
                md: "10px",
                lg: "14px",
                full: "999px",
            },
            fontFamily: {
                sans: ["'Inter'", "system-ui", "sans-serif"],
                display: ["'Space Grotesk'", "system-ui", "sans-serif"],
                body: ["'Inter'", "system-ui", "sans-serif"],
                mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
            },
            transitionTimingFunction: {
                DEFAULT: "cubic-bezier(0.2, 0, 0, 1)",
            },
            transitionDuration: {
                fast: "120ms",
                base: "200ms",
                slow: "400ms",
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
                "live-pulse": {
                    "0%, 100%": { opacity: "1" },
                    "50%": { opacity: "0.4" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s cubic-bezier(0.2, 0, 0, 1)",
                "accordion-up": "accordion-up 0.2s cubic-bezier(0.2, 0, 0, 1)",
                "live-pulse": "live-pulse 1.6s ease-in-out infinite",
            },
        },
    },
    plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};
