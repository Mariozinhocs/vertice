import { CheckIn } from '../types';

/**
 * Configuração de regras operacionais para envio de evidências fotográficas por evento
 */
export const EVIDENCE_RULES = {
  /**
   * Limite máximo de fotos por usuário/equipe por evento.
   * Alterar este valor para 2, 3, etc. libera múltiplos envios por ação.
   */
  maxPhotosPerUserPerEvent: 1,

  /**
   * Habilita/Desabilita a restrição de foto única.
   * Defina como `false` para permitir envios ilimitados.
   */
  enforcePhotoLimit: true,
};

/**
 * Interface de retorno da validação de limite
 */
export interface EvidenceLimitCheckResult {
  isBlocked: boolean;
  existingCount: number;
  maxAllowed: number;
  existingCheckIn?: CheckIn;
}

/**
 * Verifica se um usuário ou equipe já atingiu o limite de fotos permitidas para um evento.
 */
export function hasReachedPhotoLimit(
  checkIns: CheckIn[] = [],
  actionPointId: string,
  userId?: string,
  teamId?: string
): EvidenceLimitCheckResult {
  if (!EVIDENCE_RULES.enforcePhotoLimit) {
    return {
      isBlocked: false,
      existingCount: 0,
      maxAllowed: EVIDENCE_RULES.maxPhotosPerUserPerEvent,
    };
  }

  // Filtra check-ins efetuados no mesmo ponto de ação por este usuário ou pela mesma equipe
  const userCheckIns = checkIns.filter(
    (c) =>
      c.actionPointId === actionPointId &&
      ((userId && (c.coordinatorId === userId || c.coordinatorName?.toLowerCase() === userId.toLowerCase())) ||
       (teamId && c.teamId === teamId))
  );

  const existingCount = userCheckIns.length;
  const isBlocked = existingCount >= EVIDENCE_RULES.maxPhotosPerUserPerEvent;

  return {
    isBlocked,
    existingCount,
    maxAllowed: EVIDENCE_RULES.maxPhotosPerUserPerEvent,
    existingCheckIn: userCheckIns[0],
  };
}
