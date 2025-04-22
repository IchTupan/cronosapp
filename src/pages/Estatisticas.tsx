import React, { useState, useEffect, useCallback } from 'react';
import { Clock, CheckCircle, Trash, RotateCcw } from "lucide-react";
import Cookies from 'js-cookie';
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";

import EstatsCard from '../components/estatisticas/EstatsCard';
import GraficoCiclos from '../components/estatisticas/GraficoCiclos';
import GraficoCategoria from '../components/estatisticas/GraficoCategoria';

// Interface para as estatísticas calculadas
interface Estatisticas {
  totalSessoes: number;
  totalMinutosFoco: number;
  totalDesafios: number;
  desafiosConcluidos: number;
  desafiosPendentes: number;
  melhorDiaSemana: string;
  melhorHorario: string;
  mediaFocoDia: number;
  ciclosPorDiaSemana: number[];
  categorias: { categoria: string; quantidade: number }[];
}

export default function Estatisticas() {
  const [estatisticas, setEstatisticas] = useState<Estatisticas>({
    totalSessoes: 0,
    totalMinutosFoco: 0,
    totalDesafios: 0,
    desafiosConcluidos: 0,
    desafiosPendentes: 0,
    melhorDiaSemana: '-',
    melhorHorario: '-',
    mediaFocoDia: 0,
    ciclosPorDiaSemana: [0, 0, 0, 0, 0, 0, 0],
    categorias: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  // Limpar sessões de desafios excluídos
  const limparSessoesDesafiosExcluidos = useCallback(() => {
    try {
      const sessoes = JSON.parse(localStorage.getItem('cronos-sessoes') || '[]');
      const desafios = JSON.parse(localStorage.getItem('cronos-desafios') || '[]');
      
      // Obter IDs de desafios ativos
      const desafiosIds = desafios.map((d: any) => d.id);
      
      // Filtrar sessões, removendo as que têm desafio_id que não existe mais
      const sessoesAtualizadas = sessoes.filter((s: any) => {
        // Manter sessões sem desafio associado
        if (!s.desafio_id) return true;
        // Manter sessões cujo desafio ainda existe
        return desafiosIds.includes(s.desafio_id);
      });
      
      // Salvar sessões atualizadas no localStorage
      if (sessoesAtualizadas.length !== sessoes.length) {
        localStorage.setItem('cronos-sessoes', JSON.stringify(sessoesAtualizadas));
        console.log(`Removidas ${sessoes.length - sessoesAtualizadas.length} sessões de desafios excluídos`);
      }
    } catch (error) {
      console.error("Erro ao limpar sessões de desafios excluídos:", error);
    }
  }, []);

  const carregarEstatisticas = useCallback(async () => {
    setIsLoading(true);
    try {
      // Limpar sessões de desafios excluídos antes de calcular estatísticas
      limparSessoesDesafiosExcluidos();
      
      // Se não houver cookie ou ocorrer um erro, calcular a partir do localStorage
      const sessoes = JSON.parse(localStorage.getItem('cronos-sessoes') || '[]');
      const desafios = JSON.parse(localStorage.getItem('cronos-desafios') || '[]');
      
      // Calcular estatísticas básicas
      const sessoesFoco = sessoes.filter((s: any) => s.tipo === 'foco' && s.concluida);
      const totalMinutosFoco = sessoesFoco.reduce((acc: number, s: any) => acc + (s.duracao || 0), 0);
      const desafiosConcluidos = desafios.filter((d: any) => d.concluido);
      const desafiosPendentes = desafios.filter((d: any) => !d.concluido);
      
      // Calcular média por dia
      const diasUnicos = new Set(
        sessoesFoco.map((s: any) => new Date(s.data_inicio).toLocaleDateString())
      );
      const mediaFocoDia = diasUnicos.size > 0 
        ? Math.round((totalMinutosFoco / diasUnicos.size) * 10) / 10 
        : 0;
      
      // Estatísticas de ciclos por dia da semana
      const ciclosPorDiaSemana = [0, 0, 0, 0, 0, 0, 0];
      
      sessoesFoco.forEach((sessao: any) => {
        try {
          const data = new Date(sessao.data_inicio);
          ciclosPorDiaSemana[data.getDay()]++;
        } catch (e) {
          console.error("Erro ao processar data da sessão:", e);
        }
      });
      
      // Estatísticas de melhor dia e horário
      let melhorDiaSemana = '-';
      let melhorHorario = '-';
      
      if (sessoesFoco.length > 0) {
        // Encontrar o dia com mais sessões
        const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
        const maxDia = Math.max(...ciclosPorDiaSemana);
        melhorDiaSemana = maxDia > 0 ? diasSemana[ciclosPorDiaSemana.indexOf(maxDia)] : '-';
        
        // Contar sessões por hora do dia
        const contagemHoras = Array(24).fill(0);
        
        sessoesFoco.forEach((sessao: any) => {
          try {
            const data = new Date(sessao.data_inicio);
            contagemHoras[data.getHours()]++;
          } catch (e) {
            console.error("Erro ao processar hora da sessão:", e);
          }
        });
        
        // Encontrar a hora com mais sessões
        const maxHora = Math.max(...contagemHoras);
        if (maxHora > 0) {
          const melhorHora = contagemHoras.indexOf(maxHora);
          melhorHorario = `${melhorHora}:00 - ${melhorHora + 1}:00`;
        }
      }
      
      // Calcular estatísticas por categoria de desafio
      const contagemCategorias: Record<string, number> = {};
      
      desafios.forEach((desafio: any) => {
        const categoria = desafio.categoria || 'outro';
        contagemCategorias[categoria] = (contagemCategorias[categoria] || 0) + 1;
      });
      
      const categorias = Object.keys(contagemCategorias).map(categoria => ({
        categoria,
        quantidade: contagemCategorias[categoria]
      }));
      
      // Salvar estatísticas calculadas
      const novasEstatisticas = {
        totalSessoes: sessoesFoco.length,
        totalMinutosFoco,
        totalDesafios: desafios.length,
        desafiosConcluidos: desafiosConcluidos.length,
        desafiosPendentes: desafiosPendentes.length,
        melhorDiaSemana,
        melhorHorario,
        mediaFocoDia,
        ciclosPorDiaSemana,
        categorias
      };
      
      // Salvar nos cookies (válido por 30 dias)
      Cookies.set('cronos-estatisticas', JSON.stringify(novasEstatisticas), { expires: 30 });
      
      setEstatisticas(novasEstatisticas);
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
    } finally {
      setIsLoading(false);
    }
  }, [limparSessoesDesafiosExcluidos]);
  
  // Função para monitorar mudanças no localStorage
  const configurarMonitoramentoDesafios = useCallback(() => {
    // Função para verificar se houve mudança nos desafios
    const verificarMudancas = () => {
      setLastUpdate(Date.now()); // Força a recarga das estatísticas
    };
    
    // Ouvinte específico para o evento personalizado 'desafio-alterado'
    const handleDesafioAlterado = (e: CustomEvent) => {
      console.log('Evento desafio-alterado recebido:', e.detail);
      // Forçar atualização imediata das estatísticas
      setTimeout(() => {
        carregarEstatisticas();
      }, 100);
    };
    
    // Adicionar ouvinte para o evento personalizado
    window.addEventListener('desafio-alterado', handleDesafioAlterado as EventListener);
    
    // Usando o evento de storage para detectar mudanças entre abas
    window.addEventListener('storage', (e) => {
      if (e.key === 'cronos-desafios') {
        verificarMudancas();
      }
    });
    
    // Monitorando o localStorage dentro da mesma aba
    const desafiosAtuais = localStorage.getItem('cronos-desafios');
    let ultimosDesafios = desafiosAtuais;
    
    // Intervalo curto para verificar mudanças no localStorage (a cada 1 segundo)
    const interval = setInterval(() => {
      const desafiosNovos = localStorage.getItem('cronos-desafios');
      if (desafiosNovos !== ultimosDesafios) {
        ultimosDesafios = desafiosNovos;
        verificarMudancas();
      }
    }, 1000);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', verificarMudancas);
      window.removeEventListener('desafio-alterado', handleDesafioAlterado as EventListener);
    };
  }, [carregarEstatisticas]);
  
  // Efeito para carregar estatísticas iniciais e configurar monitoramento
  useEffect(() => {
    carregarEstatisticas();
    
    // Configurar monitoramento de mudanças nos desafios
    const cleanupMonitoramento = configurarMonitoramentoDesafios();
    
    // Recalcular estatísticas periodicamente (a cada 5 minutos)
    const intervaloAtualizacao = setInterval(() => {
      carregarEstatisticas();
    }, 5 * 60 * 1000);
    
    return () => {
      clearInterval(intervaloAtualizacao);
      cleanupMonitoramento();
    };
  }, [carregarEstatisticas, configurarMonitoramentoDesafios]);
  
  // Efeito para recarregar quando o lastUpdate mudar
  useEffect(() => {
    if (lastUpdate > 0) {
      carregarEstatisticas();
    }
  }, [lastUpdate, carregarEstatisticas]);

  const resetarEstatisticas = () => {
    try {
      // Remover as sessões
      localStorage.removeItem('cronos-sessoes');
      // Remover o cookie de estatísticas
      Cookies.remove('cronos-estatisticas');
      
      // Reiniciar as estatísticas
      setEstatisticas({
        totalSessoes: 0,
        totalMinutosFoco: 0,
        totalDesafios: 0,
        desafiosConcluidos: 0,
        desafiosPendentes: 0,
        melhorDiaSemana: '-',
        melhorHorario: '-',
        mediaFocoDia: 0,
        ciclosPorDiaSemana: [0, 0, 0, 0, 0, 0, 0],
        categorias: []
      });
      
      toast({
        title: "Estatísticas reiniciadas",
        description: "Todos os dados de sessões foram removidos.",
        duration: 3000,
      });
    } catch (error) {
      console.error("Erro ao resetar estatísticas:", error);
      toast({
        title: "Erro ao resetar",
        description: "Ocorreu um erro ao resetar suas estatísticas.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setShowResetDialog(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12 text-theme-secondary">
        Carregando estatísticas...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-theme-primary">Estatísticas</h1>
          <p className="text-theme-secondary">Acompanhe seu progresso e produtividade</p>
        </div>
        
        <Button 
          variant="outline" 
          className="glass border-rose-500/30 text-rose-400 hover:bg-rose-500/10 mt-4 md:mt-0"
          onClick={() => setShowResetDialog(true)}
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Resetar Estatísticas
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <EstatsCard 
          titulo="Sessões de Foco" 
          valor={estatisticas.totalSessoes} 
          descricao="Total de sessões completadas" 
          icone={Clock} 
        />
        <EstatsCard 
          titulo="Minutos Focados" 
          valor={estatisticas.totalMinutosFoco} 
          descricao="Tempo total de foco" 
          icone={Clock} 
        />
        <EstatsCard 
          titulo="Desafios" 
          valor={`${estatisticas.desafiosConcluidos}/${estatisticas.totalDesafios}`} 
          descricao="Desafios concluídos" 
          icone={CheckCircle} 
        />
        <EstatsCard 
          titulo="Média Diária" 
          valor={`${estatisticas.mediaFocoDia} min`} 
          descricao="Média de foco por dia" 
          icone={Clock} 
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="glass rounded-lg p-6">
          <h3 className="text-lg font-medium text-theme-primary mb-4">Insights de Produtividade</h3>
          
          <div className="grid grid-cols-1 gap-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-violet-500/20 rounded-lg">
                <CheckCircle className="h-5 w-5 text-violet-300" />
              </div>
              <div>
                <p className="text-theme-secondary text-sm">Seu melhor dia da semana</p>
                <p className="text-theme-primary font-medium text-lg">{estatisticas.melhorDiaSemana}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-3 bg-rose-500/20 rounded-lg">
                <Clock className="h-5 w-5 text-rose-300" />
              </div>
              <div>
                <p className="text-theme-secondary text-sm">Seu horário mais produtivo</p>
                <p className="text-theme-primary font-medium text-lg">{estatisticas.melhorHorario}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="glass rounded-lg p-6">
          <h3 className="text-lg font-medium text-theme-primary mb-4">Seu Progresso</h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-theme-secondary mb-1">
                <span>Desafios concluídos</span>
                <span>{Math.round((estatisticas.desafiosConcluidos / Math.max(estatisticas.totalDesafios, 1)) * 100)}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div 
                  className="bg-violet-500 h-2 rounded-full" 
                  style={{ width: `${(estatisticas.desafiosConcluidos / Math.max(estatisticas.totalDesafios, 1)) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm text-theme-secondary mb-1">
                <span>Desafios pendentes</span>
                <span>{estatisticas.desafiosPendentes}</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div 
                  className="bg-teal-500 h-2 rounded-full" 
                  style={{ width: `${(estatisticas.desafiosPendentes / Math.max(estatisticas.totalDesafios, 1)) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <GraficoCiclos dadosSemanais={estatisticas.ciclosPorDiaSemana} />
        <GraficoCategoria dadosCategorias={estatisticas.categorias} />
      </div>
      
      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent className="glass border-white/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-theme-primary">Resetar estatísticas</AlertDialogTitle>
            <AlertDialogDescription className="text-theme-secondary">
              Esta ação irá apagar todo o histórico de sessões e reiniciar suas estatísticas.
              Os desafios não serão afetados. Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="glass border-white/20 text-theme-primary hover:bg-white/10">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              className="glass bg-rose-500/30 text-white hover:bg-rose-500/40"
              onClick={resetarEstatisticas}
            >
              <Trash className="w-4 h-4 mr-2" />
              Resetar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 