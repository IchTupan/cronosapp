import { ReactNode, useState, useEffect } from "react";
import { Timer, ListTodo, BarChart2, Settings, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { useTheme } from "next-themes";

interface AppLayoutProps {
  children: ReactNode;
  audioRef?: React.RefObject<HTMLAudioElement>;
}

// Add global style to hide scrollbar but keep scrolling functionality
const scrollbarStyle = `
  body {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  body::-webkit-scrollbar {
    display: none;
  }
`;

export function AppLayout({ children, audioRef }: AppLayoutProps) {
  // Use next-themes
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  const links = [
    { name: "Timer", icon: Timer, href: "/timer" },
    { name: "Desafios", icon: ListTodo, href: "/desafios" },
    { name: "Estatísticas", icon: BarChart2, href: "/estatisticas" },
    { name: "Configurações", icon: Settings, href: "/configuracoes" }
  ];
  
  const location = useLocation();

  useEffect(() => {
    // Apply the scrollbar style
    const style = document.createElement("style");
    style.innerHTML = scrollbarStyle;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className={cn(
      "min-h-screen flex flex-col",
      isDarkMode 
        ? "bg-gradient-to-br from-gray-900 to-teal-900" 
        : "bg-gradient-to-br from-teal-50 to-blue-100"
    )}>
      {audioRef && (
        <audio
          ref={audioRef}
          src="https://actions.google.com/sounds/v1/alarms/beep_short.ogg"
          preload="auto"
        />
      )}
      
      {/* Estilos de tema */}
      <style jsx global>{`
        :root {
          --glass-color: ${isDarkMode ? 'rgba(30, 40, 40, 0.3)' : 'rgba(255, 255, 255, 0.25)'};
          --glass-highlight: ${isDarkMode ? 'rgba(50, 70, 70, 0.4)' : 'rgba(255, 255, 255, 0.4)'};
          --glass-border: ${isDarkMode ? 'rgba(70, 90, 90, 0.3)' : 'rgba(255, 255, 255, 0.4)'};
          --glass-shadow: ${isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'};
          --text-primary: ${isDarkMode ? 'rgba(255, 255, 255, 0.95)' : 'rgba(30, 60, 60, 0.95)'};
          --text-secondary: ${isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(30, 60, 60, 0.7)'};
          --accent-color: ${isDarkMode ? '#4fd1c5' : '#0d9488'};
          --accent-color-hover: ${isDarkMode ? '#38b2ac' : '#0f766e'};
        }
        
        /* Estilos globais para melhorar compatibilidade mobile */
        body {
          -webkit-tap-highlight-color: transparent;
          overscroll-behavior: contain;
          touch-action: manipulation;
        }
        
        /* Desabilitar zoom em inputs em iOS */
        input, select, textarea {
          font-size: 16px; /* Evita zoom em inputs no iOS */
        }
        
        /* Ajustes para espaçamento em dispositivos móveis */
        @media (max-width: 767px) {
          .container {
            padding-left: 1rem;
            padding-right: 1rem;
          }
        }
        
        /* Ajustes para notch em iPhones */
        @supports (padding: max(0px)) {
          .mobile-safe-bottom {
            padding-bottom: max(0.5rem, env(safe-area-inset-bottom));
          }
        }
        
        .glass {
          background: var(--glass-color);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid var(--glass-border);
          box-shadow: 0 4px 30px var(--glass-shadow);
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

      <div className="flex flex-col h-full min-h-screen pb-16 md:pb-20">
        {/* Header com logo e toggle de tema */}
        <header className="glass sticky top-0 z-30 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-violet-500 flex items-center justify-center mr-2">
                <Timer className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-xl font-bold text-theme-primary">CRONOS</h1>
            </div>
            
            <ThemeToggle />
          </div>
        </header>
        
        {/* Conteúdo principal */}
        <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
          {children}
        </main>
        
        {/* Barra de navegação inferior */}
        <nav className="glass fixed bottom-0 left-0 right-0 z-30 border-t border-white/10 mobile-safe-bottom">
          <div className="max-w-md mx-auto px-4 py-2 md:py-3 flex items-center justify-around">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={cn(
                  "flex flex-col items-center gap-1 px-2 md:px-3 py-2 rounded-lg text-theme-secondary hover:text-theme-primary hover:bg-white/10 transition-colors",
                  "active:bg-white/20 touch-none select-none",
                  location.pathname === link.href && "bg-white/15 text-accent font-medium"
                )}
              >
                <link.icon className="h-5 w-5" />
                <span className="text-xs">{link.name}</span>
              </Link>
            ))}
          </div>
        </nav>
      </div>
      
      <Toaster />
    </div>
  );
}
