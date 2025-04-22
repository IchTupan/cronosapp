import React from 'react';
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface TimerInfoProps {
  cicloAtual: number;
  totalCiclos: number;
  tipoCiclo: string;
}

const TimerInfo = ({ cicloAtual, totalCiclos, tipoCiclo }: TimerInfoProps) => {
  const tipoVariant = {
    'Foco': "bg-violet-500/30 dark:text-violet-100 text-violet-900 border-violet-300/30",
    'Pausa Curta': "bg-emerald-500/30 dark:text-emerald-100 text-emerald-900 border-emerald-300/30",
    'Pausa Longa': "bg-blue-500/30 dark:text-blue-100 text-blue-900 border-blue-300/30"
  };

  return (
    <div className="flex flex-col items-center space-y-4 mb-6">
      <div className="flex items-center justify-center gap-2">
        <Badge className={cn("glass px-3 py-1 text-sm font-medium", tipoVariant[tipoCiclo] || tipoVariant['Foco'])}>
          {tipoCiclo}
        </Badge>
        
        {cicloAtual !== null && totalCiclos !== null && (
          <Badge className="glass bg-slate-500/30 dark:text-white text-slate-900 border-slate-300/30 px-3 py-1 text-sm font-medium">
            Ciclo {cicloAtual} de {totalCiclos}
          </Badge>
        )}
      </div>
      
      <div className="flex justify-center gap-1 mt-2">
        {Array.from({ length: totalCiclos }, (_, i) => (
          <div 
            key={i} 
            className={cn(
              "w-3 h-3 rounded-full transition-colors",
              i < cicloAtual 
                ? "bg-accent dark:bg-accent/80" 
                : i === cicloAtual - 1
                  ? "bg-accent animate-pulse"
                  : "bg-gray-300 dark:bg-white/20"
            )} 
          />
        ))}
      </div>
    </div>
  );
};

export default TimerInfo; 