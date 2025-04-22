import React from 'react';
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipForward, RotateCcw } from "lucide-react";
import { useTheme } from "next-themes";

interface TimerControlsProps {
  isRunning: boolean;
  isPaused: boolean;
  iniciarTimer: () => void;
  pausarTimer: () => void;
  pularCiclo: () => void;
  resetarTimer: () => void;
}

const TimerControls = ({ isRunning, isPaused, iniciarTimer, pausarTimer, pularCiclo, resetarTimer }: TimerControlsProps) => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  return (
    <div className="flex items-center justify-center gap-4 mt-8">
      {isRunning && !isPaused ? (
        <Button 
          onClick={pausarTimer} 
          variant="outline" 
          size="lg" 
          className="glass-highlight text-theme-primary border-white/20 hover:bg-white/20 p-6 rounded-full"
        >
          <Pause className="h-8 w-8" />
        </Button>
      ) : (
        <Button 
          onClick={iniciarTimer} 
          variant="outline" 
          size="lg" 
          className={`shadow-lg ${
            isDarkMode 
              ? 'bg-accent/80 hover:bg-accent text-white border-accent' 
              : 'bg-green-600/90 hover:bg-green-600 text-white border-green-500'
          } p-6 rounded-full transition-all duration-200 transform hover:scale-105 ${
            isPaused ? 'bg-yellow-500/80 hover:bg-yellow-500 border-yellow-400' : ''
          }`}
        >
          <Play className="h-8 w-8" />
        </Button>
      )}
      
      <Button 
        onClick={pularCiclo} 
        variant="outline" 
        size="lg" 
        className="glass text-theme-primary border-white/20 hover:bg-white/20 p-6 rounded-full"
      >
        <SkipForward className="h-7 w-7" />
      </Button>
      
      <Button 
        onClick={resetarTimer} 
        variant="outline" 
        size="lg" 
        className="glass text-theme-primary border-white/20 hover:bg-white/20 p-6 rounded-full"
      >
        <RotateCcw className="h-7 w-7" />
      </Button>
    </div>
  );
};

export default TimerControls; 