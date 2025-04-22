import React from 'react';
import { useState, useEffect, useMemo, useCallback, lazy, Suspense } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, X, AlertTriangle, ListFilter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import DesafioCard from '../components/desafios/DesafioCard';
// Lazy load the form component to improve initial load time
const NovoDesafioForm = lazy(() => import('../components/desafios/NovoDesafioForm'));

export default function Desafios() {
  const navigate = useNavigate();
  
  // Load desafios state with data from localStorage
  const loadDesafios = useCallback(() => {
    const savedDesafios = localStorage.getItem('cronos-desafios');
    return savedDesafios ? JSON.parse(savedDesafios) : [];
  }, []);
  
  const [desafios, setDesafios] = useState(loadDesafios);
  
  // Load data from localStorage whenever component mounts
  useEffect(() => {
    setDesafios(loadDesafios());
  }, [loadDesafios]);
  
  const [filtro, setFiltro] = useState("");
  const [categoriasFiltro, setCategoriasFiltro] = useState([]);
  const [prioridadesFiltro, setPrioridadesFiltro] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tabAtiva, setTabAtiva] = useState("pendentes");
  const [desafioParaEditar, setDesafioParaEditar] = useState(null);
  const [desafioParaExcluir, setDesafioParaExcluir] = useState(null);
  const [mostrarAjuda, setMostrarAjuda] = useState(() => {
    const primeiroAcesso = localStorage.getItem('cronos-primeiro-acesso');
    return !primeiroAcesso;
  });

  // Categorias únicas dos desafios - memoized to prevent recalculation
  const categorias = useMemo(() => 
    [...new Set(desafios.map(d => d.categoria))], 
    [desafios]
  );
  
  // Salvar desafios quando mudar
  useEffect(() => {
    localStorage.setItem('cronos-desafios', JSON.stringify(desafios));
  }, [desafios]);
  
  // Marcar que o usuário já viu a ajuda
  useEffect(() => {
    if (mostrarAjuda === false) {
      localStorage.setItem('cronos-primeiro-acesso', 'false');
    }
  }, [mostrarAjuda]);

  const salvarDesafio = useCallback((desafio) => {
    if (desafioParaEditar) {
      // Editar desafio existente
      setDesafios(prev => prev.map(d => 
        d.id === desafio.id ? desafio : d
      ));
      setDesafioParaEditar(null);
    } else {
      // Adicionar novo desafio
      setDesafios(prev => [...prev, desafio]);
    }
    setMostrarForm(false);
    
    // Dispara evento para notificar outras partes do app
    const evento = new CustomEvent('desafio-alterado', { 
      detail: { 
        tipo: desafioParaEditar ? 'edicao' : 'criacao', 
        id: desafio.id 
      } 
    });
    window.dispatchEvent(evento);
    
    // Dispara um evento de storage para sincronizar entre abas
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'cronos-desafios'
    }));
  }, [desafioParaEditar]);

  const completarDesafio = useCallback((id) => {
    setDesafios(prev => prev.map(desafio => 
      desafio.id === id 
        ? {...desafio, concluido: true, data_conclusao: format(new Date(), "yyyy-MM-dd")} 
        : desafio
    ));
    
    // Dispara evento para notificar outras partes do app
    const evento = new CustomEvent('desafio-alterado', { 
      detail: { tipo: 'conclusao', id } 
    });
    window.dispatchEvent(evento);
    
    // Dispara um evento de storage para sincronizar entre abas
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'cronos-desafios'
    }));
  }, []);

  const excluirDesafio = useCallback((id) => {
    setDesafios(prev => prev.filter(desafio => desafio.id !== id));
    setDesafioParaExcluir(null);
    
    // Dispara um evento personalizado para notificar outras partes do app
    const evento = new CustomEvent('desafio-alterado', { 
      detail: { tipo: 'exclusao', id } 
    });
    window.dispatchEvent(evento);

    // Dispara um evento de storage para sincronizar entre abas
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'cronos-desafios'
    }));
  }, []);

  const selecionarDesafio = useCallback((desafio) => {
    // Salvar no localStorage para uso na página de timer
    localStorage.setItem('cronos-desafio-atual', JSON.stringify(desafio));
    // Navegar para a página do timer usando react-router
    navigate(createPageUrl("Timer"));
  }, [navigate]);

  const editarDesafio = useCallback((desafio) => {
    setDesafioParaEditar(desafio);
    setMostrarForm(true);
  }, []);

  const cancelarEdicao = useCallback(() => {
    setDesafioParaEditar(null);
    setMostrarForm(false);
  }, []);
  
  const toggleCategoriaFiltro = useCallback((categoria) => {
    setCategoriasFiltro(prev => 
      prev.includes(categoria) 
        ? prev.filter(c => c !== categoria) 
        : [...prev, categoria]
    );
  }, []);
  
  const togglePrioridadeFiltro = useCallback((prioridade) => {
    setPrioridadesFiltro(prev => 
      prev.includes(prioridade) 
        ? prev.filter(p => p !== prioridade) 
        : [...prev, prioridade]
    );
  }, []);

  // Filtrar desafios - memoized for performance
  const desafiosFiltrados = useMemo(() => 
    desafios.filter(desafio => {
      // Filtrar por texto
      const matchTexto = !filtro || 
        desafio.titulo.toLowerCase().includes(filtro.toLowerCase()) || 
        (desafio.descricao && desafio.descricao.toLowerCase().includes(filtro.toLowerCase()));
      
      // Filtrar por tab (pendentes/concluídos)
      const matchTab = 
        (tabAtiva === "pendentes" && !desafio.concluido) || 
        (tabAtiva === "concluidos" && desafio.concluido);
      
      // Filtrar por categoria
      const matchCategoria = 
        categoriasFiltro.length === 0 || 
        categoriasFiltro.includes(desafio.categoria);
      
      // Filtrar por prioridade
      const matchPrioridade = 
        prioridadesFiltro.length === 0 || 
        prioridadesFiltro.includes(desafio.prioridade);
      
      return matchTexto && matchTab && matchCategoria && matchPrioridade;
    }), 
    [desafios, filtro, tabAtiva, categoriasFiltro, prioridadesFiltro]
  );

  // Memoized components for better rendering performance
  const FormComponent = useMemo(() => {
    if (!mostrarForm) return null;
    
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <Suspense fallback={
          <div className="glass-morphism rounded-xl p-12 flex items-center justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-accent border-t-transparent rounded-full"></div>
          </div>
        }>
          <NovoDesafioForm 
            desafio={desafioParaEditar} 
            onClose={cancelarEdicao} 
            onSave={salvarDesafio} 
          />
        </Suspense>
      </div>
    );
  }, [mostrarForm, desafioParaEditar, cancelarEdicao, salvarDesafio]);

  return (
    <div className="max-w-5xl mx-auto">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-theme-primary">Meus Desafios</h1>
          <p className="text-theme-secondary">Gerencie seus projetos e metas</p>
        </div>
        <Button 
          onClick={() => {
            setDesafioParaEditar(null);
            setMostrarForm(true);
          }} 
          className="glass bg-accent hover:bg-accent/80 text-white border-0"
        >
          <Plus className="mr-1 h-4 w-4" /> Novo Desafio
        </Button>
      </div>
      
      {/* Mensagem de ajuda para novos usuários */}
      {mostrarAjuda && (
        <div className="glass border-white/20 mb-4 p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-theme-primary mb-2">Bem-vindo ao CRONOS!</h3>
              <p className="text-theme-secondary text-sm mb-3">
                Comece criando seu primeiro desafio. Defina título, categoria e tempo personalizado para cada ciclo.
                Quando estiver pronto, clique em "Iniciar" para começar a trabalhar nele usando o timer.
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-theme-secondary hover:text-theme-primary"
              onClick={() => setMostrarAjuda(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Formulário de desafio */}
      {FormComponent}

      {/* Filtros e tabs */}
      <div className="glass rounded-lg mb-8 p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <Tabs 
            defaultValue="pendentes" 
            className="w-full"
            value={tabAtiva}
            onValueChange={setTabAtiva}
          >
            <TabsList className="glass-highlight border border-white/10">
              <TabsTrigger 
                value="pendentes"
                className="data-[state=active]:bg-accent data-[state=active]:text-white text-theme-secondary"
              >
                Pendentes
              </TabsTrigger>
              <TabsTrigger 
                value="concluidos"
                className="data-[state=active]:bg-accent data-[state=active]:text-white text-theme-secondary"
              >
                Concluídos
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-theme-secondary" />
              <Input 
                placeholder="Buscar desafios..." 
                className="glass pl-9 border-white/20 text-theme-primary placeholder:text-theme-secondary"
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
              />
              {filtro && (
                <button 
                  className="absolute right-2.5 top-2.5 text-theme-secondary hover:text-theme-primary"
                  onClick={() => setFiltro("")}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="glass border-white/20 text-theme-primary">
                  <ListFilter className="mr-2 h-4 w-4" />
                  Filtros
                  {(categoriasFiltro.length > 0 || prioridadesFiltro.length > 0) && (
                    <span className="ml-2 bg-accent/80 text-white text-xs px-1.5 py-0.5 rounded-full">
                      {categoriasFiltro.length + prioridadesFiltro.length}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="glass border-white/20">
                <DropdownMenuLabel className="text-theme-primary">Categorias</DropdownMenuLabel>
                {categorias.length > 0 ? (
                  categorias.map(categoria => (
                    <DropdownMenuCheckboxItem
                      key={categoria}
                      checked={categoriasFiltro.includes(categoria)}
                      onCheckedChange={() => toggleCategoriaFiltro(categoria)}
                      className="text-theme-secondary hover:text-theme-primary"
                    >
                      {categoria === 'trabalho' && '💼 Trabalho'}
                      {categoria === 'estudos' && '📚 Estudos'}
                      {categoria === 'pessoal' && '🌱 Pessoal'}
                      {categoria === 'saúde' && '💪 Saúde'}
                      {categoria === 'outro' && '🔍 Outro'}
                    </DropdownMenuCheckboxItem>
                  ))
                ) : (
                  <div className="px-2 py-1 text-sm text-theme-secondary">Nenhuma categoria</div>
                )}
                
                <DropdownMenuSeparator className="bg-white/10" />
                
                <DropdownMenuLabel className="text-theme-primary">Prioridade</DropdownMenuLabel>
                <DropdownMenuCheckboxItem
                  checked={prioridadesFiltro.includes('alta')}
                  onCheckedChange={() => togglePrioridadeFiltro('alta')}
                  className="text-rose-400"
                >
                  Alta
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={prioridadesFiltro.includes('média')}
                  onCheckedChange={() => togglePrioridadeFiltro('média')}
                  className="text-yellow-400"
                >
                  Média
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={prioridadesFiltro.includes('baixa')}
                  onCheckedChange={() => togglePrioridadeFiltro('baixa')}
                  className="text-blue-400"
                >
                  Baixa
                </DropdownMenuCheckboxItem>
                
                {(categoriasFiltro.length > 0 || prioridadesFiltro.length > 0) && (
                  <>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <Button
                      variant="ghost"
                      className="w-full text-rose-400 hover:bg-white/10 text-xs justify-center"
                      onClick={() => {
                        setCategoriasFiltro([]);
                        setPrioridadesFiltro([]);
                      }}
                    >
                      Limpar filtros
                    </Button>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Lista de desafios */}
      {isLoading ? (
        <div className="flex justify-center py-12 text-theme-secondary">Carregando desafios...</div>
      ) : desafiosFiltrados.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
          {desafiosFiltrados.map((desafio) => (
            <DesafioCard 
              key={desafio.id}
              desafio={desafio}
              onSelect={selecionarDesafio}
              onComplete={completarDesafio}
              onEdit={(desafio) => {
                // Prevent event propagation to avoid triggering the card's onClick
                editarDesafio(desafio);
              }}
              onDelete={(id) => {
                // Prevent event propagation to avoid triggering the card's onClick
                setDesafioParaExcluir(id);
              }}
              className=""
            />
          ))}
        </div>
      ) : (
        <div className="glass rounded-lg p-12 text-center">
          <h3 className="text-theme-primary text-xl font-medium mb-2">Nenhum desafio encontrado</h3>
          <p className="text-theme-secondary mb-6">
            {tabAtiva === "pendentes" 
              ? "Crie um novo desafio para começar a gerenciar suas tarefas"
              : "Complete alguns desafios para vê-los aqui"}
          </p>
          {tabAtiva === "pendentes" && (
            <Button 
              onClick={() => {
                setDesafioParaEditar(null);
                setMostrarForm(true);
              }}
              className="glass border-accent/20 text-accent hover:bg-accent/10"
            >
              <Plus className="mr-1 h-4 w-4" /> Criar Desafio
            </Button>
          )}
        </div>
      )}
      
      {/* Dialog de confirmação para excluir */}
      <AlertDialog open={!!desafioParaExcluir} onOpenChange={(open) => !open && setDesafioParaExcluir(null)}>
        <AlertDialogContent className="glass border-white/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-theme-primary">Excluir Desafio</AlertDialogTitle>
            <AlertDialogDescription className="text-theme-secondary">
              Tem certeza que deseja excluir este desafio? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="glass border-white/20 text-theme-primary hover:bg-white/10">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              className="glass bg-rose-500/30 text-white hover:bg-rose-500/40"
              onClick={() => excluirDesafio(desafioParaExcluir)}
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 