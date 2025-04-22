import React from 'react';
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import confetti from 'canvas-confetti';

interface TimerCircleProps {
  segundos: number;
  isRunning: boolean;
  cicloAtual: 'focus' | 'short-break' | 'long-break';
}

const TimerCircle = ({ segundos, isRunning, cicloAtual }: TimerCircleProps) => {
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  
  // Convertendo segundos para minutos e segundos
  const minutes = Math.floor(segundos / 60);
  const seconds = segundos % 60;
  
  // Calculando progresso
  const totalSeconds = getTotalSeconds(cicloAtual);
  const progress = segundos / totalSeconds;
  const strokeDashoffset = circumference * (1 - progress);

  // Check if timer is complete
  const isComplete = segundos === 0;

  // Trigger confetti when timer completes
  React.useEffect(() => {
    if (isComplete && cicloAtual === 'focus') {
      // Trigger confetti
      const duration = 2 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 30 * (timeLeft / duration);
        
        // since particles fall down, start a bit higher than random
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
      }, 250);

      return () => {
        clearInterval(interval);
      };
    }
  }, [isComplete, cicloAtual]);

  const colorVariants = {
    'focus': 'stroke-violet-400 dark:stroke-violet-300',
    'short-break': 'stroke-emerald-400 dark:stroke-emerald-300',
    'long-break': 'stroke-blue-400 dark:stroke-blue-300',
    'complete': 'stroke-green-500 dark:stroke-green-400',
  };

  const strokeColor = isComplete ? colorVariants.complete : colorVariants[cicloAtual] || colorVariants.focus;
  
  function getTotalSeconds(type: 'focus' | 'short-break' | 'long-break'): number {
    switch (type) {
      case 'focus':
        return 25 * 60; // 25 minutes
      case 'short-break':
        return 5 * 60; // 5 minutes
      case 'long-break':
        return 15 * 60; // 15 minutes
      default:
        return 25 * 60;
    }
  }

  return (
    <div className="relative flex items-center justify-center">
      <svg width="280" height="280" viewBox="0 0 280 280" className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx="140"
          cy="140"
          r={radius}
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="12"
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx="140"
          cy="140"
          r={radius}
          stroke="currentColor"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={isComplete ? 0 : strokeDashoffset}
          fill="none"
          className={cn(strokeColor, "transition-all duration-1000 ease-in-out")}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className={cn(
          "glass rounded-xl px-10 py-8 text-center transition-all duration-500",
          isRunning && !isComplete && "shadow-glow",
          isComplete && "shadow-green-500/30"
        )}>
          {isComplete ? (
            <div className="flex justify-center items-center h-[84px]">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                <Check className="h-10 w-10 text-green-500" />
              </div>
            </div>
          ) : (
            <div className="text-7xl font-bold text-theme-primary tracking-tighter">
              {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimerCircle; 