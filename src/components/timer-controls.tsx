import { Button } from "@/components/ui/button";
import { Play, Pause, SkipForward } from "lucide-react";

interface TimerControlsProps {
  isRunning: boolean;
  maxFocus: boolean;
  isBreak: boolean;
  onStart: () => void;
  onPause: () => void;
  onSkip: () => void;
}

export function TimerControls({ 
  isRunning, 
  maxFocus, 
  isBreak,
  onStart, 
  onPause, 
  onSkip 
}: TimerControlsProps) {
  return (
    <div className="flex justify-center gap-4 my-6">
      <Button 
        onClick={onStart} 
        disabled={isRunning} 
        size="icon"
        className="w-14 h-14 rounded-full bg-gradient-to-br from-teal-500 to-indigo-500 hover:from-teal-400 hover:to-indigo-400 shadow-lg border border-white/20 backdrop-filter backdrop-blur-sm transition-all hover:scale-105 disabled:opacity-70"
      >
        <Play className="w-6 h-6 text-white" />
      </Button>
      
      <Button 
        variant="outline" 
        onClick={onPause} 
        disabled={!isRunning || maxFocus} 
        size="icon"
        className="w-14 h-14 rounded-full glass border-white/20 shadow-md transition-all hover:scale-105 hover:bg-white/10 disabled:opacity-50"
      >
        <Pause className="w-6 h-6 text-theme-primary" />
      </Button>
      
      <Button 
        variant="outline" 
        onClick={onSkip} 
        disabled={maxFocus || !isRunning} 
        size="icon"
        className="w-14 h-14 rounded-full glass border-white/20 shadow-md transition-all hover:scale-105 hover:bg-white/10 disabled:opacity-50"
      >
        <SkipForward className="w-6 h-6 text-theme-primary" />
      </Button>
    </div>
  );
}
