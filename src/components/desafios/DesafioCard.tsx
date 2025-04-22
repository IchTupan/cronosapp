import React from 'react';
import { Clock, CheckCircle2, ArrowRight, Edit, Trash2, MoreHorizontal } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const DesafioCard = ({ desafio, onSelect, onComplete, onEdit, onDelete, className }) => {
  const categoriaIcones = {
    "trabalho": "💼",
    "estudos": "📚",
    "pessoal": "🌱",
    "saúde": "💪",
    "outro": "🔍"
  };
  
  const prioridadeCores = {
    "baixa": "bg-blue-500/30 text-theme-primary border-blue-300/30",
    "média": "bg-yellow-500/30 text-theme-primary border-yellow-300/30",
    "alta": "bg-rose-500/30 text-theme-primary border-rose-300/30"
  };

  // Formatação da data se existir
  const formatarData = (dataString) => {
    if (!dataString) return null;
    try {
      return format(new Date(dataString), "dd 'de' MMMM", { locale: ptBR });
    } catch (error) {
      return dataString;
    }
  };
  
  // Progresso do desafio como porcentagem
  const progresso = desafio.ciclos_concluidos / Math.max(desafio.ciclos_previstos, 1) * 100;

  return (
    <Card className={cn(
      "glass overflow-hidden border-0 hover:bg-white/10 transition-all flex flex-col", 
      className,
      desafio.concluido && "opacity-70"
    )}>
      <div className="p-5 flex-grow">
        <div className="flex justify-between items-start">
          <div className="flex gap-3 items-center">
            <div className="text-2xl">{categoriaIcones[desafio.categoria]}</div>
            <h3 className="text-lg font-semibold text-theme-primary line-clamp-1">
              {desafio.titulo}
            </h3>
          </div>
          <Badge className={cn("glass", prioridadeCores[desafio.prioridade], "whitespace-nowrap")}>
            {desafio.prioridade}
          </Badge>
        </div>
        
        {desafio.descricao && (
          <p className="mt-2 text-theme-secondary text-sm line-clamp-2">
            {desafio.descricao}
          </p>
        )}
        
        <div className="mt-4">
          <div className="flex justify-between text-xs text-theme-secondary mb-1">
            <span>Progresso</span>
            <span>{Math.round(progresso)}%</span>
          </div>
          
          <div className="w-full bg-white/10 rounded-full h-1.5">
            <div 
              className="bg-teal-400 h-1.5 rounded-full transition-all duration-300" 
              style={{ width: `${progresso}%` }}
            ></div>
          </div>
        </div>
        
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center text-theme-secondary text-xs">
            <Clock className="h-3 w-3 mr-1" />
            <span>
              {desafio.ciclos_concluidos} / {desafio.ciclos_previstos} ciclos
            </span>
          </div>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="text-theme-secondary text-xs flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{desafio.tempo_foco || 25}min/ciclo</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Tempo personalizado por ciclo</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div className="mt-1 text-theme-secondary text-[10px]">
          {desafio.data_criacao && `Criado em ${formatarData(desafio.data_criacao)}`}
        </div>
      </div>
      
      <div className="px-4 py-3 bg-black/10 flex justify-between items-center">
        {!desafio.concluido ? (
          <Button 
            variant="ghost" 
            className="text-accent text-xs hover:bg-white/20 rounded-lg flex-grow"
            onClick={() => onSelect(desafio)}
          >
            Iniciar <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        ) : (
          <div className="text-green-300 text-xs flex items-center pl-1">
            <CheckCircle2 className="mr-1 h-3 w-3" /> Concluído
          </div>
        )}
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-theme-secondary hover:text-theme-primary hover:bg-white/10 rounded-full">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="glass border-white/20">
            <DropdownMenuItem onClick={() => onEdit(desafio)} className="text-theme-primary hover:bg-white/10 cursor-pointer">
              <Edit className="mr-2 h-4 w-4" /> Editar
            </DropdownMenuItem>
            
            {!desafio.concluido && desafio.ciclos_concluidos >= desafio.ciclos_previstos && (
              <>
                <DropdownMenuItem onClick={() => onComplete(desafio.id)} className="text-green-400 hover:bg-white/10 cursor-pointer">
                  <CheckCircle2 className="mr-2 h-4 w-4" /> Marcar completo
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
              </>
            )}
            
            <DropdownMenuItem onClick={() => onDelete(desafio.id)} className="text-rose-400 hover:bg-white/10 cursor-pointer">
              <Trash2 className="mr-2 h-4 w-4" /> Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
};

export default DesafioCard; 