import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Timer, ListTodo, BarChart2, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const location = useLocation();
  
  const links = [
    { name: "Timer", icon: Timer, href: "/timer" },
    { name: "Desafios", icon: ListTodo, href: "/desafios" },
    { name: "Estatísticas", icon: BarChart2, href: "/estatisticas" },
    { name: "Configurações", icon: Settings, href: "/configuracoes" }
  ];

  return (
    <div className="w-[260px] fixed inset-y-0 left-0 z-40 bg-card/70 backdrop-blur-md border-r border-card/20">
      <div className="flex flex-col h-full py-4">
        <div className="px-4 mb-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-violet-500 flex items-center justify-center">
              <Timer className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold">Cronos</h1>
          </Link>
        </div>
        
        <nav className="space-y-1 px-2 flex-1">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                location.pathname === link.href 
                  ? "bg-accent/15 text-accent font-medium" 
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/10"
              )}
            >
              <link.icon className="h-5 w-5" />
              <span>{link.name}</span>
            </Link>
          ))}
        </nav>
        
        <div className="px-3 py-4 mt-auto">
          <div className="text-xs text-muted-foreground">
            Cronos © {new Date().getFullYear()}
          </div>
        </div>
      </div>
    </div>
  );
} 