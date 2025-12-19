import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
    children: React.ReactNode
    defaultTheme?: Theme
    storageKey?: string
}

type ThemeProviderState = {
    theme: Theme
    setTheme: (theme: Theme) => void
    radius: number
    setRadius: (radius: number) => void
}

const initialState: ThemeProviderState = {
    theme: "system",
    setTheme: () => null,
    radius: 1,
    setRadius: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
    children,
    defaultTheme = "system",
    storageKey = "vite-ui-theme",
}: ThemeProviderProps) {
    // Theme Mode
    const [theme, setTheme] = useState<Theme>(
        () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
    )

    // Radius
    const [radius, setRadius] = useState<number>(
        () => parseFloat(localStorage.getItem("vite-ui-radius") || "1")
    )

    useEffect(() => {
        const root = window.document.documentElement

        // Mode
        root.classList.remove("light", "dark")

        if (theme === "system") {
            const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
                .matches
                ? "dark"
                : "light"

            root.classList.add(systemTheme)
            root.setAttribute("data-theme", systemTheme)
        } else {
            root.classList.add(theme)
            root.setAttribute("data-theme", theme)
        }

        // Enforce Emerald Accent
        root.setAttribute("data-accent", "emerald")

        // Radius
        root.setAttribute("data-radius", radius.toString())

    }, [theme, radius])

    const value = {
        theme,
        setTheme: (theme: Theme) => {
            localStorage.setItem(storageKey, theme)
            setTheme(theme)
        },
        radius,
        setRadius: (radius: number) => {
            localStorage.setItem("vite-ui-radius", radius.toString())
            setRadius(radius)
        }
    }

    return (
        <ThemeProviderContext.Provider value={value}>
            {children}
        </ThemeProviderContext.Provider>
    )
}

export const useTheme = () => {
    const context = useContext(ThemeProviderContext)

    if (context === undefined)
        throw new Error("useTheme must be used within a ThemeProvider")

    return context
}
