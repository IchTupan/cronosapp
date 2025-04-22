
import { TimerDisplay } from "@/components/timer-display";
import { TimerControls } from "@/components/timer-controls";
import { QuoteDisplay } from "@/components/quote-display";
import { MaxFocusBadge } from "./MaxFocusBadge";
import { MaxFocusToggle } from "@/components/max-focus-toggle";
import { Card } from "@/components/ui/card";

interface TimerSectionProps {
  time: number;
  totalTime: number;
  isBreak: boolean;
  running: boolean;
  quote: string;
  challengeLabel: string;
  maxFocus: boolean;
  onStart: () => void;
  onPause: () => void;
  onSkip: () => void;
  onToggleMaxFocus: () => void;
  formatTime: (time: number) => string;
}

export function TimerSection({
  time,
  totalTime,
  isBreak,
  running,
  quote,
  challengeLabel,
  maxFocus,
  onStart,
  onPause,
  onSkip,
  onToggleMaxFocus,
  formatTime,
}: TimerSectionProps) {
  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="relative glass-card p-6 flex flex-col items-center">
        {maxFocus && !isBreak && <MaxFocusBadge />}
        <h2 className="text-lg font-semibold mb-1 text-center">
          {isBreak ? "Hora de descansar" : challengeLabel}
        </h2>
        
        <TimerDisplay
          time={time}
          totalTime={totalTime}
          isBreak={isBreak}
          formatTime={formatTime}
        />
        
        <TimerControls
          isRunning={running}
          onStart={onStart}
          onPause={onPause}
          onSkip={onSkip}
          isBreak={isBreak}
          maxFocus={maxFocus}
        />
        
        <div className="mt-4 flex justify-center w-full">
          <MaxFocusToggle 
            maxFocus={maxFocus} 
            onToggleMaxFocus={onToggleMaxFocus} 
            running={running}
            onBreak={isBreak}
          />
        </div>
        
        {!isBreak && (
          <div className="mt-6 w-full">
            <QuoteDisplay quote={quote} />
          </div>
        )}
      </Card>
    </div>
  );
}
