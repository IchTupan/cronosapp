import React from 'react';
import { cn } from "@/lib/utils";

const TimerCircle = ({ minutes, seconds, progress, type }) => {
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  const colorVariants = {
    foco: 'stroke-teal-400 dark:stroke-teal-300',
    pausa_curta: 'stroke-emerald-400 dark:stroke-emerald-300',
    pausa_longa: 'stroke-blue-400 dark:stroke-blue-300',
  };

  const strokeColor = colorVariants[type] || colorVariants.foco;

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
          strokeDashoffset={strokeDashoffset}
          fill="none"
          className={cn(strokeColor, "transition-all duration-1000 ease-in-out")}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="glass rounded-xl px-10 py-8 text-center">
          <div className="text-7xl font-bold text-theme-primary tracking-tighter">
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimerCircle; 