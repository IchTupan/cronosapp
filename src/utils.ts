/**
 * Funções utilitárias para a aplicação
 */

/**
 * Cria uma URL para navegação entre páginas
 * @param page Nome da página para qual navegar
 * @returns URL formatada
 */
export const createPageUrl = (page: string): string => {
  return `/${page.toLowerCase()}`;
}; 