/**
 * Schema definitions for the application data models
 */

/**
 * Desafio (Challenge) schema
 * 
 * Defines the structure of a pomodoro challenge in the application
 */
export interface Desafio {
  /** Unique identifier for the challenge */
  id: string;
  /** Title of the challenge (required) */
  titulo: string;
  /** Detailed description of the challenge (optional) */
  descricao?: string;
  /** Number of Pomodoro cycles planned to complete the challenge (required) */
  ciclos_previstos: number;
  /** Number of Pomodoro cycles already completed (default: 0) */
  ciclos_concluidos: number;
  /** Completion status of the challenge (default: false) */
  concluido: boolean;
  /** Creation date of the challenge (format: date) */
  data_criacao: string;
  /** Completion date of the challenge (format: date, optional) */
  data_conclusao?: string | null;
  /** Category of the challenge (enum) */
  categoria: 'trabalho' | 'estudos' | 'pessoal' | 'saúde' | 'outro';
  /** Priority of the challenge (enum) */
  prioridade: 'baixa' | 'média' | 'alta';
  /** Focus time duration in minutes (25 minutes fixed) */
  tempo_foco: number;
  /** Short break duration in minutes */
  tempo_pausa_curta: number;
  /** Long break duration in minutes */
  tempo_pausa_longa: number;
}

/**
 * Sessao (Session) schema
 * 
 * Defines the structure of a pomodoro session in the application
 */
export interface Sessao {
  /** Unique identifier for the session */
  id: string;
  /** ID of the related challenge, if any */
  desafio_id?: string;
  /** Type of session (enum) */
  tipo: 'foco' | 'pausa_curta' | 'pausa_longa';
  /** Duration of the session in minutes */
  duracao: number;
  /** Start date and time of the session (format: date-time) */
  data_inicio: string;
  /** End date and time of the session (format: date-time, optional) */
  data_fim?: string;
  /** Indicates if the session was completed or interrupted (default: false) */
  concluida: boolean;
} 