import { Moon, Sun } from "lucide-react"
/** @jsxImportSource react */
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      className="fixed bottom-4 right-4 rounded-full bg-background/80 backdrop-blur-sm border border-primary/20 hover:bg-primary/10 transition-all shadow-lg hover:shadow-primary/20"
      aria-label={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <Sun className={`h-[1.2rem] w-[1.2rem] transition-all ${theme !== "dark" ? "" : "hidden"}`} />
      <Moon className={`absolute h-[1.2rem] w-[1.2rem] transition-all ${theme === "dark" ? "" : "hidden"}`} />
      <span className="sr-only">Alternar tema</span>
    </Button>
  )
}
