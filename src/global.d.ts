// Declare missing modules to fix TypeScript errors
declare module 'react' {
  interface ReactElement {
    // Add empty interface to satisfy TypeScript
  }
  
  export function useState<T>(initialState: T | (() => T)): [T, (newState: T | ((prevState: T) => T)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: readonly any[]): void;
  export function useContext<T>(context: React.Context<T>): T;
  export function createContext<T>(defaultValue: T): React.Context<T>;
  export function useRef<T>(initialValue: T | null): { current: T | null };
  export const createElement: any;
  export const Fragment: any;
  export function forwardRef<T, P = {}>(render: (props: P, ref: React.Ref<T>) => React.ReactElement | null): (props: P & { ref?: React.Ref<T> }) => React.ReactElement | null;
  export type ElementRef<T> = T;
  export type ComponentPropsWithoutRef<T> = any;
  export type HTMLAttributes<T> = any;
  export type ReactNode = React.ReactNode;
  
  // Adicionando as funções faltantes para corrigir os linter errors
  export function useMemo<T>(factory: () => T, deps: readonly any[] | undefined): T;
  export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: readonly any[] | undefined): T;
  export function lazy<T extends React.ComponentType<any>>(factory: () => Promise<{ default: T }>): T;
  export function Suspense(props: { children?: React.ReactNode, fallback: React.ReactNode }): React.ReactElement | null;
  
  // Add event types
  export interface SyntheticEvent<T = Element, E = Event> {
    nativeEvent: E;
    currentTarget: T;
    target: EventTarget;
    bubbles: boolean;
    cancelable: boolean;
    defaultPrevented: boolean;
    eventPhase: number;
    isTrusted: boolean;
    preventDefault(): void;
    stopPropagation(): void;
    timeStamp: number;
    type: string;
  }
  
  export interface FormEvent<T = Element> extends SyntheticEvent<T, Event> {
    // FormEvent specific properties
  }
  
  export interface ChangeEvent<T = Element> extends SyntheticEvent<T, Event> {
    target: EventTarget & T;
  }
  
  export interface MouseEvent<T = Element, E = MouseEvent> extends SyntheticEvent<T, E> {
    altKey: boolean;
    button: number;
    buttons: number;
    clientX: number;
    clientY: number;
    ctrlKey: boolean;
    metaKey: boolean;
    pageX: number;
    pageY: number;
    screenX: number;
    screenY: number;
    shiftKey: boolean;
  }
}

declare module 'react/jsx-runtime' {
  export const jsx: any;
  export const jsxs: any;
  export const Fragment: any;
}

declare module 'lucide-react' {
  export const Moon: any;
  export const Sun: any;
  // Add other Lucide icons used in the project
  export const Check: any;
  export const ChevronDown: any;
  export const ChevronUp: any;
  export const Circle: any;
  export const Clock: any;
  export const Play: any;
  export const Pause: any;
  export const Trash: any;
  export const Plus: any;
  export const BellIcon: any;
  export const PlusCircleIcon: any;
  export const CheckCircleIcon: any;
  export const ClockIcon: any;
  export const ArrowRightIcon: any;
  export const RefreshCwIcon: any;
  export const ChevronDownIcon: any;
  export const XIcon: any;
  export const PlayIcon: any;
  export const PauseIcon: any;
  export const SkipForwardIcon: any;
  export const RotateCcwIcon: any;
  export const SkipForward: any;
  export const RotateCcw: any;
  export const X: any;
  export const Search: any;
  export const AlertTriangle: any;
  export const ListFilter: any;
  // Novos ícones
  export const Bell: any;
  export const PlusCircle: any;
  export const CheckCircle: any;
  export const ArrowRight: any; 
  export const ListRestart: any;
  export const Pencil: any;
  export const Calendar: any;
  export const ListChecks: any;
  export const Save: any;
  export const Timer: any;
  export const Info: any;
  export const Settings: any;
  export const Home: any;
  export const ListTodo: any;
  export const BarChart2: any;
  export const ClipboardList: React.FC<React.SVGProps<SVGSVGElement>>;
}

declare namespace React {
  interface Context<T> {
    Provider: any;
    Consumer: any;
  }
  
  interface HTMLAttributes<T> {
    className?: string;
    [key: string]: any;
  }
  
  type Ref<T> = any;
}

// Shadcn UI components
declare module '@/components/ui/button' {
  export const Button: any;
  export const buttonVariants: any;
}

declare module '@/components/ui/card' {
  export const Card: any;
  export const CardHeader: any;
  export const CardTitle: any;
  export const CardContent: any;
}

declare module '@/components/ui/input' {
  export const Input: any;
}

declare module '@/components/ui/label' {
  export const Label: any;
}

declare module '@/components/ui/tabs' {
  export const Tabs: any;
  export const TabsContent: any;
  export const TabsList: any;
  export const TabsTrigger: any;
}

declare module '@/components/ui/select' {
  export const Select: any;
  export const SelectContent: any;
  export const SelectItem: any;
  export const SelectTrigger: any;
  export const SelectValue: any;
}

declare module '@/components/ui/textarea' {
  export const Textarea: any;
}

declare module '@/components/ui/alert-dialog' {
  export const AlertDialog: any;
  export const AlertDialogAction: any;
  export const AlertDialogCancel: any;
  export const AlertDialogContent: any;
  export const AlertDialogDescription: any;
  export const AlertDialogFooter: any;
  export const AlertDialogHeader: any;
  export const AlertDialogTitle: any;
  export const AlertDialogTrigger: any;
}

declare module '@/components/ui/badge' {
  export const Badge: any;
}

declare module '@/components/ui/tooltip' {
  export const Tooltip: any;
  export const TooltipContent: any;
  export const TooltipProvider: any;
  export const TooltipTrigger: any;
}

declare module '@/hooks/use-toast' {
  export const toast: any;
}

declare module '@/types/schema' {
  export interface Desafio {
    id: string;
    titulo: string;
    descricao?: string;
    ciclos_previstos: number;
    ciclos_concluidos: number;
    concluido: boolean;
    data_criacao: string;
    data_conclusao?: string | null;
    categoria: 'trabalho' | 'estudos' | 'pessoal' | 'saúde' | 'outro';
    prioridade: 'baixa' | 'média' | 'alta';
    tempo_foco: number;
    tempo_pausa_curta: number;
    tempo_pausa_longa: number;
  }
  
  export interface Sessao {
    id: string;
    desafio_id?: string;
    tipo: 'foco' | 'pausa_curta' | 'pausa_longa';
    duracao: number;
    data_inicio: string;
    data_fim?: string;
    concluida: boolean;
  }
}

declare module 'next-themes' {
  export interface ThemeProviderProps {
    children: React.ReactNode;
    defaultTheme?: string;
    storageKey?: string;
    themes?: string[];
    enableSystem?: boolean;
    enableColorScheme?: boolean;
    disableTransitionOnChange?: boolean;
    forcedTheme?: string;
    attribute?: string;
  }
  
  export function ThemeProvider(props: ThemeProviderProps): JSX.Element;
  
  export function useTheme(): {
    theme: string | undefined;
    setTheme: (theme: string) => void;
    resolvedTheme: string | undefined;
    themes: string[];
    systemTheme: string | undefined;
  };
} 