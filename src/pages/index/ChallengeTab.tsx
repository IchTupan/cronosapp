import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Edit, Trash2 } from "lucide-react";
import { FocusChallenge } from "@/types/challenge";

interface ChallengeTabProps {
  challenges: Record<string, FocusChallenge>;
  currentChallenge: string;
  onChangeChallenge: (id: string) => void;
  onAddChallenge: (id: string, challenge: FocusChallenge) => void;
  onEditChallenge: (id: string, updated: FocusChallenge) => void;
  onDeleteChallenge: (id: string) => void;
}

const HOURS = Array.from({ length: 13 }, (_, i) => i); // 0-12 horas (máximo 12h para foco)
const MINUTES = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

export function ChallengeTab({
  challenges,
  currentChallenge,
  onChangeChallenge,
  onAddChallenge,
  onEditChallenge,
  onDeleteChallenge,
}: ChallengeTabProps) {
  const [customName, setCustomName] = useState("");
  const [customHours, setCustomHours] = useState(0);
  const [customMinutes, setCustomMinutes] = useState(25);
  
  // Para modo de edição
  const [editing, setEditing] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editHours, setEditHours] = useState(0);
  const [editMinutes, setEditMinutes] = useState(0);

  const handleAddCustom = () => {
    if (!customName.trim()) {
      toast({
        title: "O desafio precisa de um nome!",
        variant: "destructive"
      });
      return;
    }
    if (customHours === 0 && customMinutes === 0) {
      toast({
        title: "O tempo mínimo é 1 minuto.",
        variant: "destructive"
      });
      return;
    }
    const key = `custom_${Date.now()}`;
    const duration = customHours * 60 + customMinutes;
    onAddChallenge(key, {
      label: customName.trim(),
      duration
    });
    setCustomName("");
    setCustomHours(0);
    setCustomMinutes(25);
  };
  
  const startEditing = (id: string, challenge: FocusChallenge) => {
    setEditing(id);
    setEditName(challenge.label);
    setEditHours(Math.floor(challenge.duration / 60));
    setEditMinutes(challenge.duration % 60);
  };
  
  const cancelEditing = () => {
    setEditing(null);
  };
  
  const saveEditing = () => {
    if (!editName.trim()) {
      toast({
        title: "O desafio precisa de um nome!",
        variant: "destructive"
      });
      return;
    }
    
    if (editing) {
      const duration = editHours * 60 + editMinutes;
      onEditChallenge(editing, {
        label: editName.trim(),
        duration: duration > 0 ? duration : 1
      });
      setEditing(null);
    }
  };

  return (
    <Tabs defaultValue="select" className="w-full">
      <TabsList className="glass border border-white/20 rounded-full overflow-hidden shadow-lg mb-4">
        <TabsTrigger 
          value="select" 
          className="px-6 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500/30 data-[state=active]:to-teal-500/30 data-[state=active]:text-white transition-all duration-300"
        >
          Desafios
        </TabsTrigger>
        <TabsTrigger 
          value="create" 
          className="px-6 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500/30 data-[state=active]:to-teal-500/30 data-[state=active]:text-white transition-all duration-300"
        >
          Criar Novo
        </TabsTrigger>
      </TabsList>

      <TabsContent value="select">
        <Card className="glass-card border-white/20 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg text-theme-primary">Selecione um desafio</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(challenges).map(([id, challenge]) => (
                <div key={id} className="relative group">
                  {editing === id ? (
                    <Card className="glass p-3 border border-accent shadow-md">
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor={`edit-name-${id}`} className="text-theme-primary">Nome</Label>
                          <Input
                            id={`edit-name-${id}`}
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="glass-highlight border-white/20"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label htmlFor={`edit-hours-${id}`} className="text-theme-primary">Horas</Label>
                            <select
                              id={`edit-hours-${id}`}
                              className="w-full glass border-white/20 rounded-md px-2 py-2 text-theme-primary"
                              value={editHours}
                              onChange={e => setEditHours(Number(e.target.value))}
                            >
                              {HOURS.map(h => (
                                <option value={h} key={h}>{h} {h === 1 ? "hora" : "horas"}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <Label htmlFor={`edit-minutes-${id}`} className="text-theme-primary">Minutos</Label>
                            <select
                              id={`edit-minutes-${id}`}
                              className="w-full glass border-white/20 rounded-md px-2 py-2 text-theme-primary"
                              value={editMinutes}
                              onChange={e => setEditMinutes(Number(e.target.value))}
                            >
                              {MINUTES.map(m => (
                                <option value={m} key={m}>{m} min</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button onClick={saveEditing} className="flex-1 bg-accent hover:bg-accent-hover border-white/20">Salvar</Button>
                          <Button variant="outline" onClick={cancelEditing} className="flex-1 glass border-white/20 text-theme-primary">Cancelar</Button>
                        </div>
                      </div>
                    </Card>
                  ) : (
                    <Button
                      variant={id === currentChallenge ? "default" : "outline"}
                      className={`justify-between h-auto py-3 w-full glass ${
                        id === currentChallenge 
                          ? 'border border-accent/50 bg-accent/10 shadow-md' 
                          : 'border-white/20 hover:bg-white/10'
                      }`}
                      onClick={() => onChangeChallenge(id)}
                    >
                      <div className="flex flex-col items-start truncate mr-2">
                        <span className="font-medium truncate text-theme-primary">{challenge.label}</span>
                        <span className="text-xs text-theme-secondary">
                          {challenge.duration >= 60
                            ? `${Math.floor(challenge.duration / 60)}h ${challenge.duration % 60}min`
                            : `${challenge.duration}min`}
                        </span>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-accent hover:bg-white/10 rounded-full" 
                          type="button"
                          onClick={e => {
                            e.stopPropagation();
                            startEditing(id, challenge);
                          }}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-red-400 hover:bg-white/10 hover:text-red-300 rounded-full" 
                          type="button"
                          onClick={e => {
                            e.stopPropagation();
                            onDeleteChallenge(id);
                          }}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="create">
        <Card className="glass-card border-white/20 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg text-theme-primary">Criar novo desafio</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="challenge-name" className="text-theme-primary">Nome do desafio</Label>
              <Input
                id="challenge-name"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="Ex: Estudar inglês"
                className="glass-highlight border-white/20"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="challenge-hours" className="text-theme-primary">Horas</Label>
                <select
                  id="challenge-hours"
                  className="w-full glass border-white/20 rounded-md px-2 py-2 text-theme-primary"
                  value={customHours}
                  onChange={e => setCustomHours(Number(e.target.value))}
                >
                  {HOURS.map(h => (
                    <option value={h} key={h}>{h} {h === 1 ? "hora" : "horas"}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="challenge-minutes" className="text-theme-primary">Minutos</Label>
                <select
                  id="challenge-minutes"
                  className="w-full glass border-white/20 rounded-md px-2 py-2 text-theme-primary"
                  value={customMinutes}
                  onChange={e => setCustomMinutes(Number(e.target.value))}
                >
                  {MINUTES.map(m => (
                    <option value={m} key={m}>{m} min</option>
                  ))}
                </select>
              </div>
            </div>
            <Button 
              onClick={handleAddCustom} 
              className="w-full bg-gradient-to-r from-indigo-500 to-teal-500 hover:from-indigo-600 hover:to-teal-600 border-white/20 shadow-md"
            >
              Criar desafio
            </Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
