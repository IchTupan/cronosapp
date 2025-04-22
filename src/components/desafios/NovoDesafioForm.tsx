import React from 'react';
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { Plus, X, Save, Clock, Info, Settings, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Desafio } from "@/types/schema";
import { useTheme } from "next-themes";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Categories for the challenges
const categorias = [
  { valor: "trabalho", rotulo: "💼 Trabalho", cor: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  { valor: "estudos", rotulo: "📚 Estudos", cor: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  { valor: "pessoal", rotulo: "🌱 Pessoal", cor: "bg-green-500/20 text-green-400 border-green-500/30" },
  { valor: "saúde", rotulo: "💪 Saúde", cor: "bg-rose-500/20 text-rose-400 border-rose-500/30" },
  { valor: "outro", rotulo: "🔍 Outro", cor: "bg-purple-500/20 text-purple-400 border-purple-500/30" }
];

// Priority levels
const prioridades = [
  { valor: "baixa", rotulo: "Baixa", className: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  { valor: "média", rotulo: "Média", className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  { valor: "alta", rotulo: "Alta", className: "bg-rose-500/20 text-rose-400 border-rose-500/30" }
];

// Time options for estimation
const minutos = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
const horas = Array.from({ length: 5 }, (_, i) => i); // Reduced to 5 hours max for better UX

interface NovoDesafioFormProps {
  desafio?: Partial<Desafio>;
  onClose: () => void;
  onSave: (desafio: Desafio) => void;
}

const NovoDesafioForm = ({ desafio, onClose, onSave }: NovoDesafioFormProps) => {
  const editMode = !!desafio;
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  // Form state with defaults
  const [formState, setFormState] = useState<Partial<Desafio> & { horas: number; minutos: number }>({
    id: desafio?.id || Date.now().toString(),
    titulo: desafio?.titulo || "",
    descricao: desafio?.descricao || "",
    categoria: desafio?.categoria || "trabalho",
    prioridade: desafio?.prioridade || "média",
    ciclos_previstos: desafio?.ciclos_previstos || 4,
    ciclos_concluidos: desafio?.ciclos_concluidos || 0,
    concluido: desafio?.concluido || false,
    data_criacao: desafio?.data_criacao || format(new Date(), "yyyy-MM-dd"),
    data_conclusao: desafio?.data_conclusao || null,
    tempo_foco: 25, // Fixed to 25 minutes (standard Pomodoro)
    tempo_pausa_curta: desafio?.tempo_pausa_curta || 5,
    tempo_pausa_longa: desafio?.tempo_pausa_longa || 15,
    horas: 0,
    minutos: 25
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editMode && desafio) {
      // Calculate time estimation from cycles for edit mode
      const horasEstimadas = Math.floor((desafio.ciclos_previstos || 4) * 25 / 60);
      const minutosEstimados = ((desafio.ciclos_previstos || 4) * 25) % 60;
      
      setFormState(prev => ({
        ...prev,
        horas: horasEstimadas,
        minutos: minutosEstimados === 0 ? 25 : minutosEstimados
      }));
    }
  }, [editMode, desafio]);

  const handleChange = (field: string, value: string | number | boolean) => {
    setFormState(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Real-time validation
    if (field === "titulo") {
      if (!value.toString().trim()) {
        setErrors(prev => ({ ...prev, titulo: "O título é obrigatório" }));
      } else {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.titulo;
          return newErrors;
        });
      }
    }
  };

  const calcularCiclosEstimados = () => {
    const minutosTotal = (formState.horas || 0) * 60 + (formState.minutos || 25);
    // Calculate the number of 25-minute focus sessions needed
    const ciclos = Math.max(1, Math.ceil(minutosTotal / 25));
    
    // Make sure we have at least one cycle
    return ciclos;
  };
  
  const calcularTempoTotalComPausas = () => {
    const ciclosEstimados = calcularCiclosEstimados();
    const tempoFoco = 25 * ciclosEstimados; // Each cycle is 25 minutes
    
    // Calculate short breaks (one after each focus session except the last one)
    const numeroPausasCurtas = Math.max(0, ciclosEstimados - 1); 
    const pausasCurtas = numeroPausasCurtas * (formState.tempo_pausa_curta || 5);
    
    // Calculate long breaks (one after every 4 focus sessions)
    const numeroPausasLongas = Math.floor((ciclosEstimados - 1) / 4);
    const pausasLongas = numeroPausasLongas * (formState.tempo_pausa_longa || 15);
    
    const tempoTotal = tempoFoco + pausasCurtas + pausasLongas;
    const horas = Math.floor(tempoTotal / 60);
    const minutos = tempoTotal % 60;
    
    return { horas, minutos, totalMinutos: tempoTotal };
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Final validation
    const newErrors: Record<string, string> = {};
    if (!formState.titulo?.trim()) {
      newErrors.titulo = "O título é obrigatório";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsSubmitting(true);

    try {
      const ciclosEstimados = calcularCiclosEstimados();
      
      const desafioSalvar = {
        ...formState,
        ciclos_previstos: ciclosEstimados,
        tempo_foco: 25, // Always use fixed 25-minute focus time
        categoria: formState.categoria as Desafio['categoria'],
        prioridade: formState.prioridade as Desafio['prioridade'],
      } as Desafio;
      
      // Remove auxiliary fields
      delete (desafioSalvar as Desafio & { horas?: number; minutos?: number }).horas;
      delete (desafioSalvar as Desafio & { horas?: number; minutos?: number }).minutos;
      
      onSave(desafioSalvar);
    } catch (error) {
      console.error("Erro ao salvar desafio:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCategoriaInfo = (valor?: string) => {
    return categorias.find(cat => cat.valor === valor) || categorias[0];
  };
  
  const getPrioridadeInfo = (valor?: string) => {
    return prioridades.find(prio => prio.valor === valor) || prioridades[1];
  };

  // Calculate the estimated time
  const tempoEstimado = calcularTempoTotalComPausas();
  const ciclosEstimados = calcularCiclosEstimados();

  return (
    <div className={cn(
      "rounded-xl shadow-2xl backdrop-blur-xl border overflow-hidden max-w-lg w-full mx-auto",
      isDarkMode 
        ? "glass-morphism border-white/20 bg-gray-900/50" 
        : "bg-white/80 border-gray-200/50 shadow-xl"
    )}>
      <div className={cn(
        "flex justify-between items-center p-4 border-b",
        isDarkMode
          ? "border-white/10 bg-gradient-to-r from-accent/30 to-purple-500/20"
          : "border-gray-200/50 bg-gradient-to-r from-green-50 to-blue-50"
      )}>
        <h3 className="text-xl font-semibold text-theme-primary flex items-center gap-2">
          {editMode ? (
            <>
              <Settings className="h-5 w-5 text-accent animate-pulse" />
              Editar Desafio
            </>
          ) : (
            <>
              <Plus className="h-5 w-5 text-accent animate-pulse" />
              Novo Desafio
            </>
          )}
        </h3>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose}
          className="text-theme-secondary hover:bg-white/10 hover:text-rose-400 transition-all duration-300"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className={cn(
        "p-5 space-y-4",
        isDarkMode 
          ? "bg-gradient-to-b from-transparent to-accent/5" 
          : "bg-gradient-to-b from-gray-50/50 to-white/90"
      )}>
        {/* Essential information section */}
        <div className="mb-4">
          <Label 
            htmlFor="titulo" 
            className={cn(
              "text-theme-primary mb-2 block font-medium flex items-center",
              errors.titulo ? "text-rose-400" : ""
            )}
          >
            <span className="text-accent mr-1">*</span> Título do Desafio
          </Label>
          <Input
            id="titulo"
            value={formState.titulo}
            onChange={(e) => handleChange("titulo", e.target.value)}
            required
            placeholder="O que você quer completar?"
            className={cn(
              "glass-input text-theme-primary placeholder:text-theme-secondary/70 transition-all duration-300",
              "border-2 focus:border-accent/70 focus:ring-2 focus:ring-accent/30",
              isDarkMode ? "border-white/20" : "border-gray-300"
            )}
          />
          {errors.titulo && (
            <p className="text-xs text-rose-400 mt-1 font-medium">{errors.titulo}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor="categoria" className="text-theme-primary mb-2 block font-medium">Categoria</Label>
            <Select
              value={formState.categoria}
              onValueChange={(value) => handleChange("categoria", value)}
            >
              <SelectTrigger className="glass-input border-white/20 text-theme-primary focus:ring-2 focus:ring-accent/30 focus:border-accent/70 transition-all duration-300">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent className="glass-morphism border-white/20 text-theme-primary backdrop-blur-xl">
                {categorias.map((cat) => (
                  <SelectItem 
                    key={cat.valor} 
                    value={cat.valor}
                    className="focus:bg-white/10 dark:focus:text-white focus:text-slate-900"
                  >
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={cn(cat.cor, "px-2 py-0.5")}>
                        {cat.rotulo.split(' ')[0]}
                      </Badge>
                      <span>{cat.rotulo.split(' ')[1]}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="prioridade" className="text-theme-primary mb-2 block font-medium">Prioridade</Label>
            <Select
              value={formState.prioridade}
              onValueChange={(value) => handleChange("prioridade", value)}
            >
              <SelectTrigger className="glass-input border-white/20 text-theme-primary focus:ring-2 focus:ring-accent/30 focus:border-accent/70 transition-all duration-300">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent className="glass-morphism border-white/20 text-theme-primary backdrop-blur-xl">
                {prioridades.map((prio) => (
                  <SelectItem 
                    key={prio.valor} 
                    value={prio.valor}
                    className="focus:bg-white/10 dark:focus:text-white focus:text-slate-900"
                  >
                    <Badge variant="outline" className={cn(prio.className, "px-2 py-0.5")}>
                      {prio.rotulo}
                    </Badge>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Estimated time section */}
        <div className="mb-4 glass-card p-4 rounded-lg border border-white/10 shadow-inner bg-gradient-to-br from-white/5 to-transparent">
          <Label className="text-theme-primary mb-3 block font-medium flex items-center">
            <Clock className="h-4 w-4 text-accent mr-2" />
            Quanto tempo você vai dedicar?
          </Label>
          <div className="flex gap-3 mb-3">
            <div className="flex-1">
              <Select
                value={formState.horas?.toString()}
                onValueChange={(value) => handleChange("horas", parseInt(value))}
              >
                <SelectTrigger className="glass-input border-white/20 text-theme-primary focus:ring-2 focus:ring-accent/30 focus:border-accent/70 transition-all duration-300">
                  <SelectValue placeholder="Horas" />
                </SelectTrigger>
                <SelectContent className="glass-morphism border-white/20 text-theme-primary backdrop-blur-xl">
                  {horas.map((h) => (
                    <SelectItem 
                      key={h} 
                      value={h.toString()} 
                      className="focus:bg-white/10 dark:focus:text-white focus:text-slate-900"
                    >
                      {h} {h === 1 ? "hora" : "horas"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1">
              <Select
                value={formState.minutos?.toString()}
                onValueChange={(value) => handleChange("minutos", parseInt(value))}
              >
                <SelectTrigger className="glass-input border-white/20 text-theme-primary focus:ring-2 focus:ring-accent/30 focus:border-accent/70 transition-all duration-300">
                  <SelectValue placeholder="Minutos" />
                </SelectTrigger>
                <SelectContent className="glass-morphism border-white/20 text-theme-primary backdrop-blur-xl max-h-[300px]">
                  {minutos
                    .filter(m => formState.horas > 0 || m > 0) // Only show 0 minutes when at least 1 hour is selected
                    .map((m) => (
                    <SelectItem 
                      key={m} 
                      value={m.toString()}
                      className="focus:bg-white/10 dark:focus:text-white focus:text-slate-900"
                    >
                      {m} minutos
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Estimated pomodoro count */}
          <div className="flex items-center justify-between glass-input rounded-lg px-4 py-2.5 mt-3 border border-white/10">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-accent" />
              <span className="text-sm text-theme-primary">Ciclos estimados:</span>
            </div>
            <Badge variant="outline" className="bg-accent/20 text-accent border-accent/30 px-2.5 py-0.5">
              {ciclosEstimados} ciclos de 25 min
            </Badge>
          </div>
          
          {/* Show total time with breaks */}
          <div className="flex items-center justify-between glass-input rounded-lg px-4 py-2.5 mt-2 border border-white/10">
            <span className="text-sm text-theme-primary">Tempo total com pausas:</span>
            <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/30 px-2.5 py-0.5">
              {tempoEstimado.horas > 0 ? 
                `${tempoEstimado.horas}h ${tempoEstimado.minutos}min` : 
                `${tempoEstimado.minutos}min`
              }
            </Badge>
          </div>
        </div>

        {/* Advanced settings toggle */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
            className="text-accent text-sm flex items-center gap-1.5 hover:text-accent/80 transition-colors"
          >
            {showAdvancedOptions ? (
              <>
                <X className="h-3.5 w-3.5" /> Ocultar opções avançadas
              </>
            ) : (
              <>
                <Plus className="h-3.5 w-3.5" /> Mostrar opções avançadas
              </>
            )}
          </button>
        </div>

        {/* Advanced settings (optional) */}
        {showAdvancedOptions && (
          <div className="space-y-4 rounded-lg p-4 glass-card bg-gradient-to-br from-white/5 to-transparent mt-2 border border-white/10 shadow-inner">
            <div className="mb-3">
              <Label htmlFor="descricao" className="text-theme-primary mb-2 block font-medium">Descrição (opcional)</Label>
              <Textarea
                id="descricao"
                value={formState.descricao}
                onChange={(e) => handleChange("descricao", e.target.value)}
                placeholder="Detalhes sobre o que você pretende realizar"
                className={cn(
                  "glass-input text-theme-primary placeholder:text-theme-secondary/70 min-h-[80px] transition-all duration-300",
                  "border-2 focus:border-accent/70 focus:ring-2 focus:ring-accent/30",
                  isDarkMode ? "border-white/20" : "border-gray-300"
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-5">
              <div>
                <Label htmlFor="tempo_pausa_curta" className="text-theme-primary mb-1 block font-medium flex justify-between">
                  <span>Pausa curta</span>
                  <span className="text-accent text-xs font-semibold">{formState.tempo_pausa_curta} min</span>
                </Label>
                <div className="mt-2 px-1">
                  <input
                    id="tempo_pausa_curta"
                    type="range"
                    min="1"
                    max="15"
                    step="1"
                    value={formState.tempo_pausa_curta}
                    onChange={(e) => handleChange("tempo_pausa_curta", parseInt(e.target.value))}
                    className={cn(
                      "w-full slider-range",
                      isDarkMode ? "dark-slider" : "light-slider"
                    )}
                  />
                </div>
                <div className="flex justify-between text-xs text-theme-secondary mt-1 px-1">
                  <span>1 min</span>
                  <span>15 min</span>
                </div>
              </div>
              
              <div>
                <Label htmlFor="tempo_pausa_longa" className="text-theme-primary mb-1 block font-medium flex justify-between">
                  <span>Pausa longa</span>
                  <span className="text-accent text-xs font-semibold">{formState.tempo_pausa_longa} min</span>
                </Label>
                <div className="mt-2 px-1">
                  <input
                    id="tempo_pausa_longa"
                    type="range"
                    min="5"
                    max="30"
                    step="5"
                    value={formState.tempo_pausa_longa}
                    onChange={(e) => handleChange("tempo_pausa_longa", parseInt(e.target.value))}
                    className={cn(
                      "w-full slider-range",
                      isDarkMode ? "dark-slider" : "light-slider"
                    )}
                  />
                </div>
                <div className="flex justify-between text-xs text-theme-secondary mt-1 px-1">
                  <span>5 min</span>
                  <span>30 min</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between pt-4 border-t border-white/10 mt-4">
          <Button
            type="button"
            onClick={onClose}
            variant="outline"
            className="glass-button border-white/20 text-theme-primary hover:bg-white/10 transition-all duration-300"
          >
            Cancelar
          </Button>
          
          <Button 
            type="submit" 
            disabled={isSubmitting || Object.keys(errors).length > 0}
            className={cn(
              "bg-green-500 hover:bg-green-600 border-green-400 text-white transition-all duration-300",
              isSubmitting || Object.keys(errors).length > 0 
                ? "opacity-70 cursor-not-allowed" 
                : "hover:shadow-green-500/30 hover:shadow-lg"
            )}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <span className="animate-spin h-4 w-4 mr-2 border-b-2 border-white rounded-full"></span>
                Salvando...
              </span>
            ) : (
              <span className="flex items-center">
                <Save className="w-4 h-4 mr-2" />
                {editMode ? "Atualizar" : "Criar"}
              </span>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NovoDesafioForm; 