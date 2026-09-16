import { AgentProfile, AgentDisclaimerLog, AgentActionHistory, CheckIn, Team } from '../types';

/**
 * Serviço responsável por buscar e fornecer informações detalhadas de perfil do agente,
 * incluindo seu histórico diário de aceites do disclaimer e galeria de fotos de ações.
 */
export const getAgentProfileDetail = (
  agentName: string,
  agentRole: string = 'Agente de Campo',
  team?: Team | null,
  checkIns: CheckIn[] = []
): AgentProfile => {
  const agentId = `agent-${agentName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
  const teamName = team?.name || 'Equipe de Campo';
  const regionName = team?.regionName || 'Zona de Atuação';

  // Fotos de demonstração georreferenciadas
  const mockEvidences = [
    'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80'
  ];

  // Filtra check-ins que mencionam o agente ou a equipe dele
  const agentCheckIns = checkIns.filter(
    (c) =>
      (c.agentName && c.agentName.toLowerCase().includes(agentName.toLowerCase())) ||
      (team && (c.teamId === team.id || c.teamName?.toLowerCase() === team.name.toLowerCase()))
  );

  // Gera histórico diário de aceites de disclaimer (últimos 5 dias)
  const todayStr = '16/09/2026';
  const mockDates = [
    { dateStr: '16/09/2026', time: '07:42:15', status: 'accepted' as const },
    { dateStr: '15/09/2026', time: '07:58:30', status: 'accepted' as const },
    { dateStr: '14/09/2026', time: '08:05:10', status: 'accepted' as const },
    { dateStr: '13/09/2026', time: '07:35:48', status: 'accepted' as const },
    { dateStr: '12/09/2026', time: '07:50:00', status: 'accepted' as const }
  ];

  const disclaimerLogs: AgentDisclaimerLog[] = mockDates.map((d, index) => ({
    id: `disc-log-${agentId}-${index}`,
    agentId,
    agentName,
    acceptedAtUtc: `2026-09-${16 - index}T11:${d.time}Z`,
    agentLocalTimestamp: `${d.dateStr} ${d.time}`,
    timezoneOffset: 'UTC-4 (Horário de Manaus)',
    latitude: -3.1190 + (index * 0.001),
    longitude: -60.0217 - (index * 0.001),
    ipAddress: `189.122.${10 + index}.${100 + index}`,
    deviceModel: 'Samsung Galaxy A54 (Android 14)',
    appVersion: 'v2.4.1-field',
    status: d.status
  }));

  // Monta o histórico de ações com fotos de evidência
  const actionHistory: AgentActionHistory[] = [
    {
      id: `act-hist-1`,
      agentId,
      actionPointId: 'pt-1',
      actionPointName: 'Ponto Centro-Sul - Ação de Abordagem',
      regionName,
      date: '16/09/2026',
      photos: (agentCheckIns.length > 0 ? agentCheckIns : [null]).map((c, i) => ({
        id: `photo-1-${i}`,
        url: c?.imageUrl || mockEvidences[i % mockEvidences.length],
        watermarkUrl: c?.imageWatermarkUrl || c?.imageUrl || mockEvidences[i % mockEvidences.length],
        timestamp: c?.timestamp || '16/09/2026 09:30:00',
        latitude: c?.latitude || -3.0935,
        longitude: c?.longitude || -60.0570,
        locationName: c?.pointName || 'Centro-Sul 1'
      }))
    },
    {
      id: `act-hist-2`,
      agentId,
      actionPointId: 'pt-2',
      actionPointName: 'Praça Central - Panfletagem e Atendimento',
      regionName,
      date: '15/09/2026',
      photos: [
        {
          id: `photo-2-0`,
          url: mockEvidences[1],
          watermarkUrl: mockEvidences[1],
          timestamp: '15/09/2026 14:15:22',
          latitude: -3.1020,
          longitude: -60.0310,
          locationName: 'Praça da Matriz'
        }
      ]
    }
  ];

  return {
    id: agentId,
    name: agentName,
    role: agentRole,
    teamName,
    regionName,
    todayDisclaimerStatus: 'accepted',
    todayDisclaimerTime: '16/09/2026 07:42:15',
    disclaimerLogs,
    actionHistory
  };
};
