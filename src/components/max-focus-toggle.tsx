
import { Button } from "@/components/ui/button";
import { Maximize } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface MaxFocusToggleProps {
  maxFocus: boolean;
  onToggleMaxFocus: () => void;
  running: boolean;
  onBreak: boolean;
}

export function MaxFocusToggle({ maxFocus, onToggleMaxFocus, running, onBreak }: MaxFocusToggleProps) {
  const handleToggleMaxFocus = () => {
    if (onBreak) {
      onToggleMaxFocus();
    } else if (running && !maxFocus) {
      const confirmActivate = window.confirm(
        "Ativar o Modo Foco Máximo durante um ciclo em andamento impedirá você de pausar ou pular. Tem certeza?"
      );
      if (confirmActivate) {
        onToggleMaxFocus();
        toast({
          title: "Foco Máximo ativado",
          description: "Agora você não poderá pausar ou pular o foco atual."
        });
      }
    } else {
      onToggleMaxFocus();
      toast({
        title: maxFocus ? "Foco Máximo desativado" : "Foco Máximo ativado",
        description: maxFocus 
          ? "Você pode pausar ou pular o foco atual." 
          : "Agora você não poderá pausar ou pular o foco atual."
      });
    }
  };

  return (
    <Button 
      variant={maxFocus ? "default" : "outline"}
      size="sm"
      className={`flex items-center gap-2 ${maxFocus ? "bg-primary" : ""}`}
      onClick={handleToggleMaxFocus}
    >
      <Maximize className="w-4 h-4" />
      <span>Foco Máximo</span>
    </Button>
  );
}
