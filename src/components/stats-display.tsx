
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Clock, Flame } from "lucide-react";

interface StatsDisplayProps {
  streak: number;
  todayCycles: number;
  todayMinutes: number;
}

export function StatsDisplay({ streak, todayCycles, todayMinutes }: StatsDisplayProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full my-6">
      <Card className="bg-card/60 backdrop-blur-sm">
        <CardContent className="flex items-center p-4">
          <div className="bg-primary/10 p-2 rounded-full mr-4">
            <Flame className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Sequência</p>
            <p className="font-medium flex items-center">
              {streak} {streak === 1 ? 'dia' : 'dias'}
              {streak >= 3 && <Badge className="ml-2 bg-orange-500">🔥</Badge>}
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-card/60 backdrop-blur-sm">
        <CardContent className="flex items-center p-4">
          <div className="bg-primary/10 p-2 rounded-full mr-4">
            <Brain className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Ciclos hoje</p>
            <p className="font-medium">{todayCycles}</p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-card/60 backdrop-blur-sm">
        <CardContent className="flex items-center p-4">
          <div className="bg-primary/10 p-2 rounded-full mr-4">
            <Clock className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Minutos em foco</p>
            <p className="font-medium">{todayMinutes} min</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
