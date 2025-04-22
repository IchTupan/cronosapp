import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import TimerCircle from '../components/timer/TimerCircle';
import TimerControls from '../components/timer/TimerControls';
import TimerInfo from '../components/timer/TimerInfo';
import DesafioCard from '../components/desafios/DesafioCard';
import CelebrationModal from '../components/CelebrationModal';
import { useNavigate } from "react-router-dom";
import { format } from 'date-fns';
import { Bell, PlusCircle, CheckCircle, Clock, ArrowRight, ListRestart, ChevronDown, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTimer } from '@/contexts/TimerContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";

export default function Timer() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Usando o TimerContext para manter o estado entre navegações
  const {
    time: tempoRestante,
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
    setCycleType,
    setSelectedChallenge,
    closeCelebration
  } = useTimer();
  
  // Estados locais
  const [config, setConfig] = useState(() => {
    const savedConfig = localStorage.getItem('cronos-config');
    return savedConfig ? JSON.parse(savedConfig) : {
      som_notificacao: true,
      notificacoes_desktop: true,
      iniciar_automaticamente: true
    };
  });
  
  const [desafioAtual, setDesafioAtual] = useState(() => {
    const savedDesafio = localStorage.getItem('cronos-desafio-atual');
    return savedDesafio ? JSON.parse(savedDesafio) : null;
  });
  
  const [desafiosPendentes, setDesafiosPendentes] = useState(() => {
    const savedDesafios = localStorage.getItem('cronos-desafios');
    return savedDesafios ? JSON.parse(savedDesafios).filter(d => !d.concluido) : [];
  });
  
  const [mostrarSeletorDesafios, setMostrarSeletorDesafios] = useState(false);
  
  // Cached values using useMemo for performance improvement
  const mapCycleType = useMemo(() => ({
    'focus': 'foco',
    'short-break': 'pausa_curta',
    'long-break': 'pausa_longa'
  }), []);
  
  const reverseMapCycleType = useMemo(() => ({
    'foco': 'focus',
    'pausa_curta': 'short-break',
    'pausa_longa': 'long-break'
  }), []);
  
  // Helper function for verification
  const verificarDesafio = useCallback((desafio) => {
    if (!desafio) return false;
    
    // Check in localStorage for the latest status
    const savedDesafios = localStorage.getItem('cronos-desafios');
    if (!savedDesafios) return false;
    
    const desafios = JSON.parse(savedDesafios);
    const desafioAtualizado = desafios.find(d => d.id === desafio.id);
    
    // Challenge not found or completed - remove it
    if (!desafioAtualizado || desafioAtualizado.concluido) {
      return false;
    }
    
    return true;
  }, []);
  
  // Initial verification on component mount
  useEffect(() => {
    const verificaECarregaDesafios = () => {
      const savedDesafios = localStorage.getItem('cronos-desafios');
      if (savedDesafios) {
        const desafios = JSON.parse(savedDesafios);
        const pendentes = desafios.filter(d => !d.concluido);
        setDesafiosPendentes(pendentes);
        
        // Verify that current challenge is still valid
        if (desafioAtual) {
          const isValid = verificarDesafio(desafioAtual);
          if (!isValid) {
            // Remove invalid challenge
            setDesafioAtual(null);
            setSelectedChallenge(null);
            
            // Auto-select a pending challenge if available
            if (pendentes.length > 0) {
              setTimeout(() => {
                selecionarDesafio(pendentes[0]);
              }, 300);
            } else {
              // Notify user to create a challenge
              toast({
                title: "Seu desafio atual foi concluído ou removido",
                description: "Você precisa criar um novo desafio para usar o timer",
                action: (
                  <Button variant="default" onClick={() => navigate('/desafios')}>
                    Criar Desafio
                  </Button>
                ),
              });
            }
          }
        }
        // If no challenge is selected, auto-select first pending
        else if (pendentes.length > 0 && !selectedChallenge) {
          selecionarDesafio(pendentes[0]);
        } 
        // No challenges available
        else if (pendentes.length === 0 && !selectedChallenge) {
          toast({
            title: "Nenhum desafio disponível",
            description: "Você precisa criar um desafio para usar o timer",
            action: (
              <Button variant="default" onClick={() => navigate('/desafios')}>
                Criar Desafio
              </Button>
            ),
          });
        }
      }
    };
    
    verificaECarregaDesafios();
    
    // Setup interval for periodic verification (every 30 seconds)
    const interval = setInterval(verificaECarregaDesafios, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Observe when the last challenge is completed
  useEffect(() => {
    if (challengeCompleted && desafiosPendentes.length <= 1) {
      setTimeout(() => {
        toast({
          title: "Todos os desafios concluídos!",
          description: "Você precisa criar um novo desafio para continuar",
          action: (
            <Button variant="default" onClick={() => navigate('/desafios')}>
              Criar Desafio
            </Button>
          ),
          duration: 8000,
        });
      }, 3500);
    }
  }, [challengeCompleted, desafiosPendentes.length, toast, navigate]);
  
  // Prevent starting timer if no challenge is selected
  const handleStartTimer = useCallback(() => {
    // Verify the selected challenge
    if (desafioAtual && !verificarDesafio(desafioAtual)) {
      toast({
        title: "Desafio inválido",
        description: "O desafio selecionado foi concluído ou removido. Selecione outro.",
        action: (
          <Button variant="default" onClick={() => navigate('/desafios')}>
            Criar Desafio
          </Button>
        ),
      });
      return;
    }
    
    if (!selectedChallenge) {
      toast({
        title: "Nenhum desafio selecionado",
        description: "Selecione ou crie um desafio para usar o timer",
        action: (
          <Button variant="default" onClick={() => navigate('/desafios')}>
            Criar Desafio
          </Button>
        ),
      });
      return;
    }
    
    startTimer();
  }, [desafioAtual, selectedChallenge, verificarDesafio, toast, navigate, startTimer]);
  
  // Sincronizar desafio atual com o contexto
  useEffect(() => {
    if (desafioAtual && desafioAtual.id !== selectedChallenge) {
      setSelectedChallenge(desafioAtual.id);
    }
  }, [desafioAtual, selectedChallenge, setSelectedChallenge]);
  
  // Sincronizar desafio do contexto com o estado local
  useEffect(() => {
    if (selectedChallenge && (!desafioAtual || desafioAtual.id !== selectedChallenge)) {
      const desafio = desafiosPendentes.find(d => d.id === selectedChallenge);
      if (desafio) {
        setDesafioAtual(desafio);
      }
    }
  }, [selectedChallenge, desafioAtual, desafiosPendentes]);
  
  // Salvar configurações do localStorage
  useEffect(() => {
    localStorage.setItem('cronos-config', JSON.stringify(config));
  }, [config]);
  
  // Salvar desafio atual quando mudar
  useEffect(() => {
    if (desafioAtual) {
      localStorage.setItem('cronos-desafio-atual', JSON.stringify(desafioAtual));
    } else {
      localStorage.removeItem('cronos-desafio-atual');
    }
  }, [desafioAtual]);
  
  // Listen for challenge completion status changes to update the UI
  useEffect(() => {
    if (challengeCompleted) {
      // Update the pending challenges list
      const savedDesafios = localStorage.getItem('cronos-desafios');
      if (savedDesafios) {
        const desafios = JSON.parse(savedDesafios);
        const pendingDesafios = desafios.filter(d => !d.concluido);
        setDesafiosPendentes(pendingDesafios);
        
        // Clear current challenge
        setDesafioAtual(null);
        
        // Only auto-select next challenge if we have more pending challenges
        // and we don't have too many challenges (<= 5) to avoid showing too many prompts
        if (pendingDesafios.length > 0 && pendingDesafios.length <= 5) {
          // Use setTimeout to avoid multiple state updates in same cycle
          setTimeout(() => {
            // Check if we still need to select a challenge (user might have selected one manually)
            if (!desafioAtual) {
              selecionarDesafio(pendingDesafios[0]);
            }
          }, 5000); // Aumentado para 5 segundos para dar mais tempo para a comemoração
        }
      }
    }
  }, [challengeCompleted]);
  
  // Memoized functions for better performance
  const selecionarDesafio = useCallback((desafio) => {
    setDesafioAtual(desafio);
    setMostrarSeletorDesafios(false);
    
    // Atualizar tipo de ciclo e tempo baseado no desafio
    setCycleType('focus');
  }, [setCycleType]);
  
  const removerDesafioAtual = useCallback(() => {
    setDesafioAtual(null);
    setSelectedChallenge(null);
    resetTimer();
    
    // If there are pending challenges, select the first one automatically
    if (desafiosPendentes.length > 0) {
      setTimeout(() => {
        selecionarDesafio(desafiosPendentes[0]);
      }, 300);
    } else {
      // Show notification if no challenges are available, com atraso maior
      setTimeout(() => {
        toast({
          title: "Nenhum desafio disponível",
          description: "Você precisa criar um desafio para usar o timer",
          action: (
            <Button variant="default" onClick={() => navigate('/desafios')}>
              Criar Desafio
            </Button>
          ),
          duration: 5000,
        });
      }, 4000); // Atraso de 4 segundos para dar tempo ao usuário após o fechamento da tela de congratulação
    }
  }, [desafiosPendentes, resetTimer, setSelectedChallenge, selecionarDesafio, toast, navigate]);
  
  const irParaDesafios = useCallback(() => {
    navigate('/desafios');
  }, [navigate]);
  
  const formataCiclo = useCallback(() => {
    switch (cycleType) {
      case 'focus':
        return 'Foco';
      case 'short-break':
        return 'Pausa Curta';
      case 'long-break':
        return 'Pausa Longa';
      default:
        return 'Foco';
    }
  }, [cycleType]);
  
  // Memoized UI components for better performance
  const TimerInfoMemo = useMemo(() => (
    <TimerInfo 
      cicloAtual={currentCycle} 
      totalCiclos={totalCycles} 
      tipoCiclo={formataCiclo()} 
    />
  ), [currentCycle, totalCycles, formataCiclo]);
  
  const TimerCircleMemo = useMemo(() => (
    <TimerCircle 
      segundos={tempoRestante} 
      isRunning={isRunning} 
      cicloAtual={cycleType}
    />
  ), [tempoRestante, isRunning, cycleType]);
  
  const TimerControlsMemo = useMemo(() => (
    <TimerControls 
      isRunning={isRunning} 
      isPaused={isPaused}
      iniciarTimer={handleStartTimer} 
      pausarTimer={pauseTimer} 
      resetarTimer={resetTimer} 
      pularCiclo={skipTimer} 
    />
  ), [isRunning, isPaused, handleStartTimer, pauseTimer, resetTimer, skipTimer]);
  
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Celebration Modal */}
      <CelebrationModal 
        isOpen={showCelebration} 
        onClose={closeCelebration}
        challengeTitle={desafioAtual?.titulo}
      />

      <div className="glass-morphism rounded-xl p-6 max-w-md mx-auto backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden">
        {/* Área de informações do ciclo atual */}
        {TimerInfoMemo}
        
        {/* Círculo do timer */}
        {TimerCircleMemo}
        
        {/* Controles do timer */}
        {TimerControlsMemo}

        {/* Área do desafio selecionado */}
        <div className="mt-6 glass-card rounded-lg p-4 border border-white/10 shadow-inner">
          <div className="flex items-center justify-between mb-3">
            <h3 className="dark:text-white text-slate-900 text-sm font-medium">Desafio Atual</h3>
            
            <div className="flex items-center gap-2">
              {desafioAtual ? (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7 rounded-full dark:text-white/70 text-slate-700 hover:dark:text-white hover:text-slate-900 hover:bg-white/10"
                  onClick={removerDesafioAtual}
                >
                  <X className="h-4 w-4" />
                </Button>
              ) : null}
              
              <Button 
                variant="ghost" 
                size="icon"
                className="h-7 w-7 rounded-full dark:text-white/70 text-slate-700 hover:dark:text-white hover:text-slate-900 hover:bg-white/10"
                onClick={() => setMostrarSeletorDesafios(!mostrarSeletorDesafios)}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {desafioAtual ? (
            <div className={`glass rounded-lg p-3 border ${challengeCompleted ? 'border-green-500/30 bg-green-500/10' : 'border-white/10'}`}>
              <div className="flex gap-3 items-center">
                <div className="text-lg">
                  {
                    {
                      "trabalho": "💼",
                      "estudos": "📚",
                      "pessoal": "🌱",
                      "saúde": "💪",
                      "outro": "🔍"
                    }[desafioAtual.categoria] || "🎯"
                  }
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold dark:text-white text-slate-900 line-clamp-1">
                    {desafioAtual.titulo}
                  </h3>
                  <div className="flex items-center dark:text-white/60 text-slate-700 text-xs mt-1">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>
                      {desafioAtual.ciclos_concluidos} / {desafioAtual.ciclos_previstos} ciclos
                    </span>
                  </div>
                </div>
                {challengeCompleted && (
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-7 h-7 rounded-full bg-green-500/20">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                    </div>
                  </div>
                )}
              </div>
              
              {/* Show completed status and action buttons */}
              {challengeCompleted && (
                <div className="mt-3 pt-3 border-t border-white/10">
                  <div className="flex items-center text-green-400 text-sm mb-2">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    <span>Desafio concluído com sucesso!</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs glass-button border-white/20 dark:text-white text-slate-900 hover:bg-white/10"
                      onClick={() => setMostrarSeletorDesafios(true)}
                    >
                      <PlusCircle className="h-3.5 w-3.5 mr-1" />
                      Escolher outro
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs glass-button border-white/20 dark:text-white text-slate-900 hover:bg-white/10"
                      onClick={irParaDesafios}
                    >
                      <PlusCircle className="h-3.5 w-3.5 mr-1" />
                      Criar novo
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-3">
              <p className="dark:text-white/60 text-slate-700 text-xs mb-2">Nenhum desafio selecionado</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs glass-button border-white/20 dark:text-white text-slate-900 bg-transparent hover:bg-white/10"
                onClick={() => setMostrarSeletorDesafios(true)}
              >
                <PlusCircle className="h-3.5 w-3.5 mr-1" />
                Escolher Desafio
              </Button>
            </div>
          )}
          
          {/* Seletor de desafios */}
          {mostrarSeletorDesafios && (
            <div className="mt-4 max-h-48 overflow-y-auto pr-1">
              <h4 className="dark:text-white text-slate-900 text-xs font-medium mb-2">Selecionar Desafio:</h4>
              
              {desafiosPendentes.length > 0 ? (
                <div className="space-y-2">
                  {desafiosPendentes.map(desafio => (
                    <button
                      key={desafio.id}
                      className="w-full text-left hover:bg-white/10 rounded-lg transition-colors p-1"
                      onClick={() => selecionarDesafio(desafio)}
                    >
                      <div className="glass rounded-lg p-2 border border-white/10">
                        <div className="flex gap-2 items-center">
                          <div className="text-lg">
                            {
                              {
                                "trabalho": "💼",
                                "estudos": "📚",
                                "pessoal": "🌱",
                                "saúde": "💪",
                                "outro": "🔍"
                              }[desafio.categoria] || "🎯"
                            }
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold dark:text-white text-slate-900 truncate max-w-[200px]">
                              {desafio.titulo}
                            </h3>
                            <div className="flex items-center dark:text-white/60 text-slate-700 text-xs mt-1">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>
                                {desafio.ciclos_concluidos} / {desafio.ciclos_previstos} ciclos
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-3">
                  <p className="dark:text-white/60 text-slate-700 text-xs mb-2">Nenhum desafio pendente</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs glass-button border-white/20 dark:text-white text-slate-900 bg-transparent hover:bg-white/10"
                    onClick={irParaDesafios}
                  >
                    <PlusCircle className="h-3.5 w-3.5 mr-1" />
                    Criar Novo Desafio
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 