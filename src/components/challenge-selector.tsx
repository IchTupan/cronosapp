import { useState, useEffect } from "react";
/** @jsxImportSource react */
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { FocusChallenge } from "@/types/challenge";

interface ChallengeSelectorProps {
  challenges: Record<string, FocusChallenge>;
  currentChallenge: string;
  onChangeChallenge: (id: string) => void;
  onAddChallenge: (id: string, challenge: FocusChallenge) => void;
}

export function ChallengeSelector({ 
  challenges, 
  currentChallenge, 
  onChangeChallenge, 
  onAddChallenge 
}: ChallengeSelectorProps) {
  const [customName, setCustomName] = useState("");
  const [customHours, setCustomHours] = useState(0);
  const [customMinutes, setCustomMinutes] = useState(25);
  const [activeTab, setActiveTab] = useState("select");

  // Redirect to create tab if no challenges exist
  useEffect(() => {
    if (Object.keys(challenges).length === 0) {
      setActiveTab("create");
    }
  }, [challenges]);

  const handleAddCustom = () => {
    if (!customName.trim()) {
      toast({
        title: "O desafio precisa de um nome!",
        variant: "destructive"
      });
      return;
    }
    
    if (customHours > 24 || customMinutes > 59) {
      toast({
        title: "Limite: 24h e 59min.",
        variant: "destructive"
      });
      return;
    }
    
    const key = `custom_${Date.now()}`;
    const duration = customHours * 60 + customMinutes || 1; // Mínimo 1 minuto
    
    onAddChallenge(key, { 
      label: customName.trim(), 
      duration
    });
    
    setCustomName("");
    setCustomHours(0);
    setCustomMinutes(25);
    setActiveTab("select");
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="select">Desafios</TabsTrigger>
        <TabsTrigger value="create">Criar Novo</TabsTrigger>
      </TabsList>
      
      <TabsContent value="select">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Selecione um desafio</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(challenges).map(([id, challenge]) => (
                <Button
                  key={id}
                  variant={id === currentChallenge ? "default" : "outline"}
                  className={`justify-start h-auto py-3 relative overflow-hidden ${
                    id === currentChallenge 
                      ? 'bg-primary/10 border-primary border-2' 
                      : 'hover:bg-primary/5'
                  }`}
                  onClick={() => onChangeChallenge(id)}
                >
                  <div className="flex flex-col items-start w-full">
                    <span className="font-medium">{challenge.label}</span>
                    <span className="text-xs text-muted-foreground">
                      {challenge.duration >= 60 
                        ? `${Math.floor(challenge.duration / 60)}h ${challenge.duration % 60}min` 
                        : `${challenge.duration}min`}
                    </span>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="create">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Criar novo desafio</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do desafio</Label>
              <Input
                id="name"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="Ex: Estudar para prova"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hours">Horas</Label>
                <Input
                  id="hours"
                  type="number"
                  min="0"
                  max="24"
                  value={customHours}
                  onChange={(e) => setCustomHours(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minutes">Minutos</Label>
                <Input
                  id="minutes"
                  type="number"
                  min="0"
                  max="59"
                  value={customMinutes}
                  onChange={(e) => setCustomMinutes(Number(e.target.value))}
                />
              </div>
            </div>
            <Button 
              className="w-full" 
              onClick={handleAddCustom}
            >
              Criar Desafio
            </Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
