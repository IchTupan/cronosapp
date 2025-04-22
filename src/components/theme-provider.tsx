import * as React from "react"
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
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  )

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light"

      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)
  }, [theme])

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme)
      setTheme(theme)
    },
  }

  const darkMode = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {/* Estilos de tema Glassmorphism */}
      <style jsx global>{`
        :root {
          --glass-color: ${darkMode ? 'rgba(30, 40, 40, 0.3)' : 'rgba(255, 255, 255, 0.25)'};
          --glass-highlight: ${darkMode ? 'rgba(50, 70, 70, 0.4)' : 'rgba(255, 255, 255, 0.4)'};
          --glass-border: ${darkMode ? 'rgba(70, 90, 90, 0.3)' : 'rgba(255, 255, 255, 0.4)'};
          --glass-shadow: ${darkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'};
          --text-primary: ${darkMode ? 'rgba(255, 255, 255, 0.95)' : 'rgba(30, 60, 60, 0.95)'};
          --text-secondary: ${darkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(30, 60, 60, 0.7)'};
          --accent-color: ${darkMode ? '#4fd1c5' : '#0d9488'};
          --accent-color-hover: ${darkMode ? '#38b2ac' : '#0f766e'};
        }
        
        .glass {
          background: var(--glass-color);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid var(--glass-border);
          box-shadow: 0 4px 30px var(--glass-shadow);
        }
        
        .glass-card {
          background: var(--glass-color);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid var(--glass-border);
          box-shadow: 0 4px 30px var(--glass-shadow);
          border-radius: 0.5rem;
        }
        
        .glass-highlight {
          background: var(--glass-highlight);
        }
        
        .text-theme-primary {
          color: var(--text-primary);
        }
        
        .text-theme-secondary {
          color: var(--text-secondary);
        }
        
        .text-accent {
          color: var(--accent-color);
        }
        
        .border-accent {
          border-color: var(--accent-color);
        }
        
        .bg-accent {
          background-color: var(--accent-color);
        }
        
        .hover-accent:hover {
          background-color: var(--accent-color-hover);
        }
      `}</style>
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
