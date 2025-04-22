import React from 'react';
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const TimerInfo = ({ cicloAtual, totalCiclos, tipo, desafio }) => {
  const tipoLabel = {
    foco: "Foco",
    pausa_curta: "Pausa Curta",
    pausa_longa: "Pausa Longa"
  };
  
  const tipoVariant = {
    foco: "bg-teal-500/30 text-teal-100 border-teal-300/30",
    pausa_curta: "bg-emerald-500/30 text-emerald-100 border-emerald-300/30",
    pausa_longa: "bg-blue-500/30 text-blue-100 border-blue-300/30"
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex items-center justify-center gap-2">
        <Badge className={cn("glass px-3 py-1 text-sm font-medium", tipoVariant[tipo])}>
          {tipoLabel[tipo]}
        </Badge>
        
        {cicloAtual !== null && totalCiclos !== null && (
          <Badge className="glass bg-slate-500/30 text-theme-primary border-slate-300/30 px-3 py-1 text-sm font-medium">
            Ciclo {cicloAtual} de {totalCiclos}
          </Badge>
        )}
      </div>
      
      {desafio && (
        <div className="glass px-4 py-2 rounded-lg max-w-sm text-center">
          <p className="text-theme-secondary font-medium">Trabalhando em:</p>
          <h3 className="text-theme-primary font-bold">{desafio.titulo}</h3>
        </div>
      )}
    </div>
  );
};

export default TimerInfo;
