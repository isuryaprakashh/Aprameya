/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["selector", '[data-theme="dark"]'],
    content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                // DESIGN.md v3 Tokens
                ink: "var(--ink)",
                paper: "var(--paper)",
                surface: {
                    DEFAULT: "var(--surface-1)",
                    1: "var(--surface-1)",
                    2: "var(--surface-2)",
                    3: "var(--surface-3)",
                },
                text: {
                    DEFAULT: "var(--paper)",
                    2: "var(--text-2)",
                    mute: "var(--mute)",
                    disabled: "var(--text-disabled)",
                },
                hairline: {
                    DEFAULT: "var(--hairline)",
                    2: "var(--hairline-2)",
                    3: "var(--hairline-3)",
                },
                signal: {
                    DEFAULT: "var(--signal)",
                    hover: "var(--signal-hover)",
                    press: "var(--signal-press)",
                    text: "var(--signal-text)",
                    soft: "var(--signal-soft)",
                    line: "var(--signal-line)",
                },
                invert: {
                    bg: "var(--invert-bg)",
                    text: "var(--invert-text)",
                },
                ok: {
                    DEFAULT: "var(--ok)",
                    soft: "var(--ok-soft)",
                },
                warn: {
                    DEFAULT: "var(--warn)",
                    soft: "var(--warn-soft)",
                },
                info: {
                    DEFAULT: "var(--info)",
                    soft: "var(--info-soft)",
                },

                // Backward-compatibility aliases
                bg: "var(--ink)",
                "text-3": "var(--mute)",
                border: "var(--hairline)",
                "border-strong": "var(--hairline-2)",
                red: {
                    DEFAULT: "var(--signal)",
                    hover: "var(--signal-hover)",
                    text: "var(--signal-text)",
                    soft: "var(--signal-soft)",
                    line: "var(--signal-line)",
                },
                success: {
                    DEFAULT: "var(--ok)",
                    soft: "var(--ok-soft)",
                },
                warning: {
                    DEFAULT: "var(--warn)",
                    soft: "var(--warn-soft)",
                },
                background: "var(--ink)",
                foreground: "var(--paper)",
                card: {
                    DEFAULT: "var(--surface-1)",
                    foreground: "var(--paper)",
                },
                popover: {
                    DEFAULT: "var(--surface-2)",
                    foreground: "var(--paper)",
                },
                primary: {
                    DEFAULT: "var(--signal)",
                    foreground: "var(--on-signal)",
                },
                secondary: {
                    DEFAULT: "var(--surface-2)",
                    foreground: "var(--paper)",
                },
                muted: {
                    DEFAULT: "var(--surface-2)",
                    foreground: "var(--text-2)",
                },
                accent: {
                    DEFAULT: "var(--surface-2)",
                    foreground: "var(--paper)",
                },
                destructive: {
                    DEFAULT: "var(--signal)",
                    foreground: "var(--on-signal)",
                },
                ring: "var(--focus)",
                input: "var(--hairline-2)",
            },
            borderRadius: {
                1: "var(--r-1)",
                2: "var(--r-2)",
                3: "var(--r-3)",
                4: "var(--r-4)",
                5: "var(--r-5)",
                sm: "var(--r-1)",
                md: "var(--r-2)",
                lg: "var(--r-3)",
                full: "999px",
            },
            fontFamily: {
                sans: ["'Bricolage Grotesque'", "'Hanken Grotesk'", "system-ui", "sans-serif"],
                display: ["'Bricolage Grotesque'", "'Hanken Grotesk'", "system-ui", "sans-serif"],
                body: ["'Bricolage Grotesque'", "'Hanken Grotesk'", "system-ui", "sans-serif"],
                mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
            },
            fontSize: {
                display: "var(--fs-display)",
                h1: "var(--fs-h1)",
                h2: "var(--fs-h2)",
                h3: "var(--fs-h3)",
                lead: "var(--fs-lead)",
                data: "var(--fs-data)",
                "data-lg": "var(--fs-data-lg)",
            },
            transitionTimingFunction: {
                out: "var(--ease-out)",
                in: "var(--ease-in)",
                inout: "var(--ease-inout)",
                snap: "var(--ease-snap)",
                DEFAULT: "var(--ease-out)",
            },
            transitionDuration: {
                instant: "80ms",
                fast: "140ms",
                base: "220ms",
                slow: "360ms",
            },
            zIndex: {
                sticky: "50",
                dock: "60",
                dropdown: "70",
                sheet: "80",
                dialog: "90",
                toast: "100",
                palette: "110",
            },
            maxWidth: {
                container: "1200px",
                prose: "66ch",
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
                "accordion-down": "accordion-down 0.22s var(--ease-inout)",
                "accordion-up": "accordion-up 0.22s var(--ease-inout)",
                "live-pulse": "live-pulse 1.6s ease-in-out infinite",
            },
        },
    },
    plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};
