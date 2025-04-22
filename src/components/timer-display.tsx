import { cn } from "@/lib/utils";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface TimerDisplayProps {
  time: number;
  totalTime: number;
  isBreak: boolean;
  formatTime: (time: number) => string;
}

export function TimerDisplay({ time, totalTime, isBreak, formatTime }: TimerDisplayProps) {
  const percentage = Math.round((time / totalTime) * 100);
  const color = isBreak ? "rgb(74, 222, 128)" : "var(--accent-color)"; 
  
  // Format the time as string for the text prop
  const formattedTime = formatTime(time);

  return (
    <div className="relative w-64 h-64 mx-auto my-6 flex flex-col items-center justify-center">
      <div className="absolute inset-0 rounded-full glass-highlight" style={{ opacity: 0.3 }}></div>
      <CircularProgressbar
        value={percentage}
        text={formattedTime}
        styles={buildStyles({
          textSize: '20px',
          textColor: 'var(--text-primary)',
          pathColor: color,
          trailColor: 'rgba(255,255,255,0.2)',
          backgroundColor: 'rgba(255,255,255,0.1)',
          pathTransition: 'stroke-dashoffset 0.5s ease 0s',
        })}
      />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 translate-y-8 glass py-1 px-3 rounded-full shadow-md">
        {isBreak ? (
          <span className="text-green-400 font-semibold">Pausa</span>
        ) : (
          <span className="text-accent font-semibold">Foco</span>
        )}
      </div>
    </div>
  );
}
