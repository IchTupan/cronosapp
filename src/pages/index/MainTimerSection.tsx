
import { TimerDisplay } from "@/components/timer-display";
import { TimerControls } from "@/components/timer-controls";
import { QuoteDisplay } from "@/components/quote-display";

interface MainTimerSectionProps {
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
  formatTime: (time: number) => string;
}

export function MainTimerSection({
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
  formatTime,
}: MainTimerSectionProps) {
  return (
    <div className="w-full bg-card/80 dark:bg-white/10 border border-primary/10 glass-card p-5 rounded-2xl flex flex-col gap-2 items-center shadow-xl">
      <TimerDisplay
        time={time}
        totalTime={totalTime}
        isBreak={isBreak}
        formatTime={formatTime}
      />
      <p className="mb-2 text-base font-semibold text-center">
        {isBreak ? "Tempo de descanso" : challengeLabel}
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center my-2">
        <TimerControls
          isRunning={running}
          maxFocus={maxFocus}
          isBreak={isBreak}
          onStart={onStart}
          onPause={onPause}
          onSkip={onSkip}
        />
      </div>
      <div className="mt-2 w-full max-w-md">
        <QuoteDisplay quote={quote} />
      </div>
    </div>
  );
}
