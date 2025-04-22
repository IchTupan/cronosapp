import React from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle theme"
      className={cn(
        "rounded-full glass border-none hover:bg-white/20",
        "flex items-center justify-center gap-2"
      )}
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-yellow-300" />
      ) : (
        <Moon className="h-4 w-4 text-indigo-400" />
      )}
      <span className="text-xs font-medium hidden sm:inline">
        {isDark ? "Claro" : "Escuro"}
      </span>
    </Button>
  );
} 