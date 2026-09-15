/**
 * Configuração e Detecção de Ambientes (Prod vs Lab vs Dev) - Vértice
 */

export type AppEnvironment = 'production' | 'lab' | 'development';

export const getEnvironment = (): AppEnvironment => {
  // 1. Prioridade para variável de ambiente do Vite se explicitamente configurada
  const viteEnv = import.meta.env.VITE_APP_ENV;
  if (viteEnv === 'prod' || viteEnv === 'production') return 'production';
  if (viteEnv === 'lab' || viteEnv === 'hml' || viteEnv === 'staging') return 'lab';
  if (viteEnv === 'dev' || viteEnv === 'development') return 'development';

  // 2. Detecção automática baseada em URL (Subpasta ou Hostname)
  if (typeof window !== 'undefined') {
    const path = window.location.pathname.toLowerCase();
    const host = window.location.hostname.toLowerCase();

    if (path.includes('/lab') || path.includes('/hml') || host.includes('lab.')) {
      return 'lab';
    }
    if (host === 'localhost' || host === '127.0.0.1') {
      return 'development';
    }
  }

  // 3. Padrão para Produção (ex: https://vertice.hubdigital360.com/)
  return 'production';
};

export const isProduction = (): boolean => getEnvironment() === 'production';
export const isLab = (): boolean => getEnvironment() === 'lab';
export const isDevelopment = (): boolean => getEnvironment() === 'development';

/**
 * Define se a seção "Acesso Rápido de Demonstração" deve ser exibida na tela de login.
 * Em Produção -> FALSE (Oculto)
 * Em Lab / Homologação / Dev -> TRUE (Visível)
 */
export const showDemoQuickAccess = (): boolean => {
  if (import.meta.env.VITE_SHOW_DEMO === 'true') return true;
  if (import.meta.env.VITE_SHOW_DEMO === 'false') return false;

  // Em Produção, por padrão NUNCA exibe botões de demo
  if (isProduction()) {
    return false;
  }

  // Em Lab/HML ou Dev Local, exibe para facilitar testes
  return true;
};
