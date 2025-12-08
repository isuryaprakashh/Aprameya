import { Moon, Sun, Check } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


export function ThemeCustomizer() {
    const { theme, setTheme, accent, setAccent } = useTheme()

    const accents = [
        { name: "Emerald", value: "emerald", class: "bg-emerald-500" },
        { name: "Blue", value: "blue", class: "bg-blue-500" },
        { name: "Violet", value: "violet", class: "bg-violet-500" },
        { name: "Amber", value: "amber", class: "bg-amber-500" },
        { name: "Rose", value: "rose", class: "bg-rose-500" },
    ]

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative text-[var(--text-primary)] hover:bg-[var(--accent)]/10 hover:text-[hsl(var(--accent))]">
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Customize Theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>Theme Customizer</DropdownMenuLabel>
                <DropdownMenuSeparator />

                {/* Mode Selection */}
                <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">Mode</DropdownMenuLabel>
                <div className="grid grid-cols-2 gap-1 p-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        className={`h-8 w-full justify-start px-2 rounded-lg ${theme === 'light' ? 'bg-[hsl(var(--accent))] text-[var(--bg-body)] hover:bg-[hsl(var(--accent))]/90 hover:text-[var(--bg-body)]' : 'text-[var(--text-primary)] hover:bg-[var(--text-primary)]/5'}`}
                        onClick={() => setTheme("light")}
                    >
                        <Sun className="h-4 w-4 mr-2" />
                        <span className="text-xs">Light</span>
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className={`h-8 w-full justify-start px-2 rounded-lg ${theme === 'dark' ? 'bg-[hsl(var(--accent))] text-[var(--bg-body)] hover:bg-[hsl(var(--accent))]/90 hover:text-[var(--bg-body)]' : 'text-[var(--text-primary)] hover:bg-[var(--text-primary)]/5'}`}
                        onClick={() => setTheme("dark")}
                    >
                        <Moon className="h-4 w-4 mr-2" />
                        <span className="text-xs">Dark</span>
                    </Button>
                </div>

                <DropdownMenuSeparator />

                {/* Accent Selection */}
                <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">Accent Color</DropdownMenuLabel>
                <div className="grid grid-cols-5 gap-1 p-2">
                    {accents.map((a) => (
                        <button
                            key={a.value}
                            className={`h-6 w-6 rounded-full ${a.class} flex items-center justify-center border-2 ${accent === a.value ? "border-primary" : "border-transparent"}`}
                            onClick={() => setAccent(a.value)}
                            title={a.name}
                        >
                            {accent === a.value && <Check className="h-3 w-3 text-white" />}
                        </button>
                    ))}
                </div>

            </DropdownMenuContent>
        </DropdownMenu>
    )
}
