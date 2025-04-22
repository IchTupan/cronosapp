import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from "@/components/ui/use-toast";

interface TimerContextProps {
  time: number;
  isRunning: boolean;
  isPaused: boolean;
  cycleType: 'focus' | 'short-break' | 'long-break';
  currentCycle: number;
  totalCycles: number;
  selectedChallenge: string | null;
  challengeCompleted: boolean;
  showCelebration: boolean;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  skipTimer: () => void;
  setCycleType: (type: 'focus' | 'short-break' | 'long-break') => void;
  setSelectedChallenge: (id: string | null) => void;
  closeCelebration: () => void;
}

const defaultContext: TimerContextProps = {
  time: 25 * 60, // 25 minutes in seconds
  isRunning: false,
  isPaused: false,
  cycleType: 'focus',
  currentCycle: 1,
  totalCycles: 4,
  selectedChallenge: null,
  challengeCompleted: false,
  showCelebration: false,
  startTimer: () => {},
  pauseTimer: () => {},
  resetTimer: () => {},
  skipTimer: () => {},
  setCycleType: () => {},
  setSelectedChallenge: () => {},
  closeCelebration: () => {},
};

const TimerContext = createContext<TimerContextProps>(defaultContext);

export const useTimer = () => useContext(TimerContext);

interface TimerProviderProps {
  children: ReactNode;
}

export function TimerProvider({ children }: TimerProviderProps) {
  const { toast } = useToast();
  const [time, setTime] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [cycleType, setCycleType] = useState<'focus' | 'short-break' | 'long-break'>('focus');
  const [currentCycle, setCurrentCycle] = useState(1);
  const [totalCycles, setTotalCycles] = useState(4);
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);
  const [challengeCompleted, setChallengeCompleted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [currentChallengeData, setCurrentChallengeData] = useState<any>(null);

  // Get default times for each cycle type
  const getCycleTime = (type: 'focus' | 'short-break' | 'long-break') => {
    switch (type) {
      case 'focus':
        return 25 * 60; // 25 minutes
      case 'short-break':
        return 5 * 60; // 5 minutes
      case 'long-break':
        return 15 * 60; // 15 minutes
    }
  };

  // Reset timer based on cycle type
  const resetTimerByCycle = (type: 'focus' | 'short-break' | 'long-break') => {
    setTime(getCycleTime(type));
  };

  // Timer logic
  useEffect(() => {
    let interval: number | null = null;

    if (isRunning && !isPaused) {
      interval = window.setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(interval!);
            handleCycleComplete();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, isPaused]);

  // Load current challenge data when selectedChallenge changes
  useEffect(() => {
    if (selectedChallenge) {
      const savedDesafios = localStorage.getItem('cronos-desafios');
      if (savedDesafios) {
        const desafios = JSON.parse(savedDesafios);
        const currentDesafio = desafios.find((d: any) => d.id === selectedChallenge);
        if (currentDesafio) {
          // Check if the challenge is already completed
          if (currentDesafio.concluido) {
            // Clear the selected challenge if it's already completed
            setSelectedChallenge(null);
            setCurrentChallengeData(null);
            return;
          }
          setCurrentChallengeData(currentDesafio);
          setTotalCycles(currentDesafio.ciclos_previstos || 4);
        } else {
          // Challenge not found (possibly deleted)
          setSelectedChallenge(null);
          setCurrentChallengeData(null);
        }
      }
    } else {
      setCurrentChallengeData(null);
      setTotalCycles(4); // Reset to default
      setChallengeCompleted(false);
    }
  }, [selectedChallenge]);

  // Notification when app is in background
  useEffect(() => {
    // Request notification permission on component mount
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  }, []);

  const showNotification = (title: string, body: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      // Create and show the notification
      const notification = new Notification(title, {
        body: body,
        icon: '/favicon.ico',
        tag: 'timer-notification',
        requireInteraction: true
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    } else {
      // Fallback to toast if notifications aren't available
      toast({
        title: title,
        description: body,
        duration: 5000,
      });
    }
  };

  const closeCelebration = () => {
    setShowCelebration(false);
  };

  const updateChallengeCompletionStatus = () => {
    if (!selectedChallenge || !currentChallengeData) return;
    
    const savedDesafios = localStorage.getItem('cronos-desafios');
    if (!savedDesafios) return;
    
    const desafios = JSON.parse(savedDesafios);
    const index = desafios.findIndex((d: any) => d.id === selectedChallenge);
    
    if (index !== -1) {
      // Check if all cycles are completed
      if (currentCycle >= currentChallengeData.ciclos_previstos) {
        // Mark challenge as complete
        desafios[index] = {
          ...desafios[index],
          concluido: true,
          ciclos_concluidos: currentChallengeData.ciclos_previstos,
          data_conclusao: new Date().toISOString().split('T')[0]
        };
        
        // Save back to localStorage
        localStorage.setItem('cronos-desafios', JSON.stringify(desafios));
        
        setChallengeCompleted(true);
        setShowCelebration(true);
        
        // Remove from localStorage so we don't trigger the notification again
        localStorage.removeItem('cronos-desafio-atual');
        
        // Once completed, we'll clear the selected challenge to force user to select a new one
        setSelectedChallenge(null);
        setCurrentChallengeData(null);
        
        // Disparar evento de conclusão de desafio
        const evento = new CustomEvent('desafio-alterado', { 
          detail: { tipo: 'conclusao', id: selectedChallenge } 
        });
        window.dispatchEvent(evento);
        
        // Disparar evento de storage para sincronizar entre abas
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'cronos-desafios'
        }));
        
        // Only show notification once
        showNotification(
          "Parabéns! 🎉", 
          `Você completou o desafio "${currentChallengeData.titulo}"!`
        );
      } else {
        // Just update cycles completed
        desafios[index] = {
          ...desafios[index],
          ciclos_concluidos: currentCycle
        };
        
        localStorage.setItem('cronos-desafios', JSON.stringify(desafios));
        
        // Update current challenge data
        setCurrentChallengeData(desafios[index]);
      }
    }
  };

  const handleCycleComplete = () => {
    // Play notification sound
    const audio = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");
    audio.play();

    const currentCycleType = cycleType;
    let nextCycleType: 'focus' | 'short-break' | 'long-break';
    let nextCycle = currentCycle;
    
    // Record session
    const session = {
      id: Date.now().toString(),
      tipo: currentCycleType === 'focus' ? 'foco' : 
            currentCycleType === 'short-break' ? 'pausa_curta' : 'pausa_longa',
      duracao: currentCycleType === 'focus' ? 25 : 
               currentCycleType === 'short-break' ? 5 : 15,
      data_inicio: new Date(Date.now() - getCycleTime(currentCycleType) * 1000).toISOString(),
      data_fim: new Date().toISOString(),
      concluida: true,
      desafio_id: selectedChallenge
    };
    
    // Save session to localStorage
    const savedSessoes = localStorage.getItem('cronos-sessoes');
    const sessoes = savedSessoes ? JSON.parse(savedSessoes) : [];
    sessoes.push(session);
    localStorage.setItem('cronos-sessoes', JSON.stringify(sessoes));
    
    if (currentCycleType === 'focus') {
      // If we're on a focus cycle, update challenge completion status
      if (selectedChallenge) {
        updateChallengeCompletionStatus();
      }
      
      // After focus cycle, check if we need a long break
      if (currentCycle % 4 === 0) {
        nextCycleType = 'long-break';
        showNotification(
          "Tempo de foco concluído!", 
          "Você merece uma pausa longa. Descanse bem para retornar com mais energia!"
        );
      } else {
        nextCycleType = 'short-break';
        showNotification(
          "Tempo de foco concluído!", 
          "Hora de uma pequena pausa. Respire, alongue-se e prepare-se para o próximo ciclo."
        );
      }
    } else {
      nextCycleType = 'focus';
      if (currentCycleType === 'long-break') {
        nextCycle = currentCycle + 1;
        showNotification(
          "Pausa longa concluída!", 
          "Hora de voltar ao foco! Você está pronto para novos desafios."
        );
      } else {
        nextCycle = currentCycle + 1;
        showNotification(
          "Pausa curta concluída!", 
          "Hora de voltar ao foco! Mantenha o momentum."
        );
      }
      
      // Check if we exceeded totalCycles
      if (nextCycle > totalCycles) {
        nextCycle = totalCycles;
      }
    }

    setCycleType(nextCycleType);
    setCurrentCycle(nextCycle);
    resetTimerByCycle(nextCycleType);
    setIsRunning(false);
    setIsPaused(false);
  };

  const startTimer = () => {
    if (challengeCompleted) {
      return;
    }
    
    setIsRunning(true);
    setIsPaused(false);
  };

  const pauseTimer = () => {
    setIsPaused(true);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsPaused(false);
    resetTimerByCycle(cycleType);
  };

  const skipTimer = () => {
    if (challengeCompleted) {
      return;
    }
    
    handleCycleComplete();
  };

  const handleSetCycleType = (type: 'focus' | 'short-break' | 'long-break') => {
    setCycleType(type);
    resetTimerByCycle(type);
    setIsRunning(false);
    setIsPaused(false);
  };

  const handleSetSelectedChallenge = (id: string | null) => {
    setSelectedChallenge(id);
    setChallengeCompleted(false);
    setCurrentCycle(1);
    setCycleType('focus');
    resetTimerByCycle('focus');
  };

  return (
    <TimerContext.Provider
      value={{
        time,
        isRunning,
        isPaused,
        cycleType,
        currentCycle,
        totalCycles,
        selectedChallenge,
        challengeCompleted,
        showCelebration,
        startTimer,
        pauseTimer,
        resetTimer,
        skipTimer,
        setCycleType: handleSetCycleType,
        setSelectedChallenge: handleSetSelectedChallenge,
        closeCelebration,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
} 