
import { useState, useEffect, useRef } from "react";
import { toast } from "@/hooks/use-toast";
import useStats from "@/hooks/useStats";
import { FocusChallenge } from "@/types/challenge";

const BREAK_DURATION = 5 * 60;

export default function useTimer(
  initialChallenges: Record<string, FocusChallenge>,
  initialChallenge: string
) {
  const [challenges, setChallenges] = useState<Record<string, FocusChallenge>>(initialChallenges);
  const [currentChallenge, setCurrentChallenge] = useState<string>(initialChallenge);
  const [time, setTime] = useState<number>(() => initialChallenges[initialChallenge].duration * 60);
  const [running, setRunning] = useState<boolean>(false);
  const [onBreak, setOnBreak] = useState<boolean>(false);
  const [maxFocus, setMaxFocus] = useState<boolean>(() => 
    localStorage.getItem("maxFocus") === "true"
  );
  const [streak, setStreak] = useState<number>(() => 
    parseInt(localStorage.getItem("streak") || "0", 10)
  );
  const [lastComplete, setLastComplete] = useState<string | null>(() => 
    localStorage.getItem("lastComplete")
  );
  const beepRef = useRef<HTMLAudioElement | null>(null);
  const beepIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const { saveCycle } = useStats();

  useEffect(() => {
    localStorage.setItem("challenges", JSON.stringify(challenges));
  }, [challenges]);
  
  useEffect(() => {
    localStorage.setItem("currentChallenge", currentChallenge);
    if (!onBreak) {
      setTime(challenges[currentChallenge].duration * 60);
    }
  }, [currentChallenge, challenges, onBreak]);
  
  useEffect(() => {
    localStorage.setItem("maxFocus", maxFocus.toString());
  }, [maxFocus]);

  useEffect(() => {
    let interval: number | undefined;
    if (running && time > 0) {
      interval = window.setInterval(() => setTime(prev => prev - 1), 1000);
    } else if (running && time === 0) {
      const title = onBreak ? "Pausa encerrada!" : "Ciclo concluído! 🎉";
      const description = onBreak 
        ? "Hora de voltar ao foco." 
        : "Você completou mais um ciclo com sucesso!";
      
      toast({
        title,
        description,
        variant: onBreak ? "default" : "default",
      });
      setRunning(false);
      if (!onBreak) {
        saveCycle(challenges[currentChallenge].duration);
        handleStreakUpdate();
        setOnBreak(true);
        setTime(BREAK_DURATION);
      } else {
        setOnBreak(false);
        setTime(challenges[currentChallenge].duration * 60);
      }
    }
    return () => clearInterval(interval);
  }, [running, time, onBreak, challenges, currentChallenge, saveCycle]);

  useEffect(() => {
    if (window.Notification && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    function handleVisibility() {
      if (document.hidden && running && !onBreak) {
        if (window.Notification && Notification.permission === "granted") {
          new Notification("Ei! Não abandone seu foco 😄", {
            body: maxFocus
              ? "Modo Foco Máximo: volte para o app para continuar seu ciclo. Um beep será tocado até que você volte!"
              : "Volte para o app para continuar seu ciclo.",
            icon: "/favicon.ico",
          });
        }
        if (maxFocus) {
          if (beepRef.current) {
            beepRef.current.volume = 1.0;
            beepRef.current.loop = false;
          }
          if (!beepIntervalRef.current) {
            beepIntervalRef.current = setInterval(() => {
              if (beepRef.current) {
                beepRef.current.currentTime = 0;
                beepRef.current.play();
              }
            }, 800);
          }
        }
        setRunning(false);
      } else {
        if (beepIntervalRef.current) {
          clearInterval(beepIntervalRef.current);
          beepIntervalRef.current = null;
        }
        if (beepRef.current) {
          beepRef.current.pause();
          beepRef.current.currentTime = 0;
        }
      }
    }
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      if (beepIntervalRef.current) {
        clearInterval(beepIntervalRef.current);
        beepIntervalRef.current = null;
      }
      if (beepRef.current) {
        beepRef.current.pause();
        beepRef.current.currentTime = 0;
      }
    };
  }, [running, onBreak, maxFocus]);

  function handleStreakUpdate() {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    let newStreak = 1;
    if (lastComplete === yesterday) {
      newStreak = streak + 1;
    }
    setStreak(newStreak);
    setLastComplete(today);
    localStorage.setItem("streak", newStreak.toString());
    localStorage.setItem("lastComplete", today);
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleStart = () => {
    setRunning(true);
  };
  
  const handlePause = () => {
    if (maxFocus && !onBreak) {
      toast({
        title: "Modo Foco Máximo ativado",
        description: "Desative o modo foco máximo para pausar",
        variant: "destructive",
      });
      return;
    }
    setRunning(false);
  };
  
  const handleSkip = () => {
    if (maxFocus && !onBreak) {
      toast({
        title: "Modo Foco Máximo ativado",
        description: "Desative o modo foco máximo para pular",
        variant: "destructive",
      });
      return;
    }
    setRunning(false);
    if (!onBreak) {
      setOnBreak(true);
      setTime(BREAK_DURATION);
    } else {
      setOnBreak(false);
      setTime(challenges[currentChallenge].duration * 60);
    }
  };
  
  const handleToggleMaxFocus = () => {
    if (onBreak) {
      setMaxFocus(prev => !prev);
    } else if (running && !maxFocus) {
      const confirmActivate = window.confirm(
        "Ativar o Modo Foco Máximo durante um ciclo em andamento impedirá você de pausar ou pular. Tem certeza?"
      );
      if (confirmActivate) {
        setMaxFocus(true);
      }
    } else {
      setMaxFocus(prev => !prev);
    }
  };

  const handleChangeChallenge = (id: string) => {
    if (running) {
      toast({
        title: "Timer em andamento",
        description: "Pare o timer antes de mudar o desafio",
        variant: "destructive",
      });
      return;
    }
    setCurrentChallenge(id);
  };
  
  const handleAddChallenge = (id: string, challenge: FocusChallenge) => {
    setChallenges(prev => ({
      ...prev,
      [id]: challenge
    }));
    setCurrentChallenge(id);
  };

  const handleDeleteChallenge = (id: string) => {
    setChallenges(prev => {
      const copy = { ...prev };
      delete copy[id];
      if (id === currentChallenge) {
        const fallback = Object.keys(copy)[0] || "uso_excessivo_celular";
        setCurrentChallenge(fallback);
        setTime((copy[fallback] || initialChallenges["uso_excessivo_celular"]).duration * 60);
      }
      return copy;
    });
  };

  const handleEditChallenge = (id: string, updated: FocusChallenge) => {
    setChallenges(prev => ({
      ...prev,
      [id]: updated,
    }));
    
    if (id === currentChallenge && !onBreak && !running) {
      setTime(updated.duration * 60);
    }
  };

  return {
    challenges,
    currentChallenge,
    time,
    running,
    onBreak,
    maxFocus,
    beepRef,
    formatTime,
    totalTime: onBreak ? BREAK_DURATION : challenges[currentChallenge].duration * 60,
    handleStart,
    handlePause,
    handleSkip,
    handleToggleMaxFocus,
    handleChangeChallenge,
    handleAddChallenge,
    handleDeleteChallenge,
    handleEditChallenge
  };
}
