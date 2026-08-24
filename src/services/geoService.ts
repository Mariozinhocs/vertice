import { CheckInStatus } from '../types';

/**
 * Calcula a distância em metros entre duas coordenadas de latitude e longitude usando a Fórmula de Haversine.
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // Raio da Terra em metros
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Avalia as coordenadas e precisão do GPS contra o Ponto de Atuação e classifica o check-in.
 */
export function evaluateCheckInGeofence(
  coordLat: number,
  coordLng: number,
  targetLat: number,
  targetLng: number,
  allowedRadiusMeters: number,
  gpsAccuracyMeters: number
): { distanceMeters: number; status: CheckInStatus; reason: string } {
  const distanceMeters = calculateHaversineDistance(coordLat, coordLng, targetLat, targetLng);

  // Se a precisão do GPS for muito ruim (> 80m), coloca em análise por segurança
  if (gpsAccuracyMeters > 80) {
    return {
      distanceMeters,
      status: 'pendente_analise',
      reason: `Precisão do GPS baixa (${gpsAccuracyMeters}m). Registro encaminhado para auditoria.`
    };
  }

  // Dentro do raio permitido
  if (distanceMeters <= allowedRadiusMeters) {
    return {
      distanceMeters,
      status: 'validado',
      reason: `Dentro do raio permitido de ${allowedRadiusMeters}m (distância: ${distanceMeters}m).`
    };
  }

  // Tolerância de até 1.5x o raio ou variação da precisão do GPS
  const maxTolerance = allowedRadiusMeters * 1.5 + (gpsAccuracyMeters / 2);
  if (distanceMeters <= maxTolerance) {
    return {
      distanceMeters,
      status: 'pendente_analise',
      reason: `Perto do raio (${distanceMeters}m do ponto; raio de ${allowedRadiusMeters}m). Aguardando validação do supervisor.`
    };
  }

  // Totalmente fora do raio
  return {
    distanceMeters,
    status: 'rejeitado',
    reason: `Fora do raio configurado. Distância: ${distanceMeters}m (Máximo permitido: ${allowedRadiusMeters}m).`
  };
}

/**
 * Utilitário para formatar distâncias de forma amigável
 */
export function formatDistance(meters: number): string {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(2)} km`;
  }
  return `${meters} m`;
}
