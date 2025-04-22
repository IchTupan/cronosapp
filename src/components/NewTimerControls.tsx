import React from 'react';
import { Button } from "@/components/ui/button";

// Utilize os mesmos ícones que estão sendo usados no componente principal
const NewTimerControls = ({ isRunning, onStart, onPause, onSkip, onReset }) => {
  return (
    <div className="flex items-center justify-center gap-4 mt-8">
      {isRunning ? (
        <Button 
          onClick={onPause} 
          variant="outline" 
          size="lg" 
          className="glass-highlight text-theme-primary border-white/20 hover:bg-white/20 p-6 rounded-full"
        >
          <span className="h-8 w-8 flex items-center justify-center">⏸</span>
        </Button>
      ) : (
        <Button 
          onClick={onStart} 
          variant="outline" 
          size="lg" 
          className="glass-highlight text-accent border-accent/20 hover:bg-accent/10 p-6 rounded-full"
        >
          <span className="h-8 w-8 flex items-center justify-center">▶️</span>
        </Button>
      )}
      
      <Button 
        onClick={onSkip} 
        variant="outline" 
        size="lg" 
        className="glass text-theme-primary border-white/20 hover:bg-white/20 p-6 rounded-full"
      >
        <span className="h-7 w-7 flex items-center justify-center">⏭</span>
      </Button>
      
      <Button 
        onClick={onReset} 
        variant="outline" 
        size="lg" 
        className="glass text-theme-primary border-white/20 hover:bg-white/20 p-6 rounded-full"
      >
        <span className="h-7 w-7 flex items-center justify-center">🔄</span>
      </Button>
    </div>
  );
};

export default NewTimerControls; 