import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/theme-provider"

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark")
    }

    return (
        <button
            className="w-9 h-9 rounded-[10px] border border-hairline bg-surface-2 hover:bg-surface-3 hover:border-hairline-2 flex items-center justify-center text-paper transition-all duration-fast cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
            onClick={toggleTheme}
            aria-label="Toggle Theme"
        >
            {theme === "light" ? (
                <Moon className="w-4 h-4 text-paper" />
            ) : (
                <Sun className="w-4 h-4 text-paper" />
            )}
        </button>
    )
}
