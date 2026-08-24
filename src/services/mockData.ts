import { User, Campaign, Region, ActionPoint, Team, CheckIn, AuditLog } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-admin',
    name: 'Mario Henrique',
    email: 'admin@vertice.com',
    password: 'admin123',
    role: 'admin',
    phone: '(11) 98888-1000',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    active: true,
  },
  {
    id: 'usr-coord-norte',
    name: 'Carlos Mendes',
    email: 'coordenador.norte@vertice.com',
    password: 'coord123',
    role: 'coordenador',
    phone: '(11) 97777-2003',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    regionId: 'reg-3',
    regionName: 'Zona Norte',
    active: true,
  },
  {
    id: 'usr-coord-centro',
    name: 'João Silva',
    email: 'coordenador.centro@vertice.com',
    password: 'coord123',
    role: 'coordenador',
    phone: '(11) 97777-2001',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    regionId: 'reg-1',
    regionName: 'Região Central',
    active: true,
  },
  {
    id: 'usr-campo-alpha',
    name: 'Lucas Oliveira (Resp. Campo)',
    email: 'campo.alpha@vertice.com',
    password: 'campo123',
    role: 'campo',
    phone: '(11) 96666-4001',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
    regionId: 'reg-3',
    regionName: 'Zona Norte',
    teamId: 'team-3',
    teamName: 'Equipe Gamma - Zona Norte',
    assignedActionPointIds: ['pt-4'],
    active: true,
  }
];

export const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: 'cmp-2026-1',
    name: 'Campanha Eleitoral 2026 - Mudança com Responsabilidade',
    description: 'Operação de campo em praças, terminais e locais de alta circulação.',
    candidateName: 'Dr. Roberto Mendes - 15',
    cityState: 'São Paulo - SP',
    startDate: '2026-08-01',
    endDate: '2026-10-04',
    status: 'ativa'
  }
];

export const INITIAL_REGIONS: Region[] = [
  { id: 'reg-1', campaignId: 'cmp-2026-1', name: 'Região Central', description: 'Calçadões, terminais e praças do centro', color: '#6366f1' },
  { id: 'reg-2', campaignId: 'cmp-2026-1', name: 'Zona Sul', description: 'Avenidas e centros comerciais', color: '#10b981' },
  { id: 'reg-3', campaignId: 'cmp-2026-1', name: 'Zona Norte', description: 'Bairros residenciais e feiras livres', color: '#f59e0b' }
];

export const INITIAL_ACTION_POINTS: ActionPoint[] = [
  {
    id: 'pt-1',
    campaignId: 'cmp-2026-1',
    regionId: 'reg-1',
    name: 'Praça da Sé - Ponto A',
    description: 'Entrada principal do metrô Sé',
    address: 'Praça da Sé, s/n - Sé, São Paulo - SP',
    latitude: -23.550520,
    longitude: -46.633308,
    radiusMeters: 60,
    status: 'ativo'
  },
  {
    id: 'pt-2',
    campaignId: 'cmp-2026-1',
    regionId: 'reg-1',
    name: 'Terminal Parque Dom Pedro',
    description: 'Plataforma 1 de desembarque de ônibus',
    address: 'Av. do Exterior - Centro Histórico, São Paulo - SP',
    latitude: -23.545800,
    longitude: -46.628500,
    radiusMeters: 80,
    status: 'ativo'
  },
  {
    id: 'pt-3',
    campaignId: 'cmp-2026-1',
    regionId: 'reg-2',
    name: 'Avenida Paulista x Augusta',
    description: 'Cruzamento em frente ao Conjunto Nacional',
    address: 'Av. Paulista, 2073 - Bela Vista, São Paulo - SP',
    latitude: -23.558300,
    longitude: -46.660100,
    radiusMeters: 50,
    status: 'ativo'
  },
  {
    id: 'pt-4',
    campaignId: 'cmp-2026-1',
    regionId: 'reg-3',
    name: 'Metrô Santana - Praça da Cruz',
    description: 'Saída da estação de metrô Santana',
    address: 'Av. Cruzeiro do Sul, 3173 - Santana, São Paulo - SP',
    latitude: -23.502800,
    longitude: -46.624700,
    radiusMeters: 70,
    status: 'ativo'
  }
];

export const INITIAL_TEAMS: Team[] = [
  {
    id: 'tm-101',
    campaignId: 'cmp-2026-1',
    coordinatorId: 'usr-coord-1',
    coordinatorName: 'João Silva',
    name: 'Equipe Alpha (Centro)',
    regionId: 'reg-1',
    assignedPointIds: ['pt-1', 'pt-2'],
    members: [
      { id: 'm1', name: 'Lucas Gabriel', role: 'Bandeirante' },
      { id: 'm2', name: 'Ana Paula', role: 'Panfletagem' },
      { id: 'm3', name: 'Marcos Vinicius', role: 'Logística' }
    ],
    status: 'ativa'
  },
  {
    id: 'tm-102',
    campaignId: 'cmp-2026-1',
    coordinatorId: 'usr-coord-2',
    coordinatorName: 'Maria Souza',
    name: 'Equipe Beta (Paulista)',
    regionId: 'reg-2',
    assignedPointIds: ['pt-3'],
    members: [
      { id: 'm4', name: 'Rafael Santos', role: 'Bandeirante' },
      { id: 'm5', name: 'Juliana Costa', role: 'Panfletagem' }
    ],
    status: 'ativa'
  },
  {
    id: 'tm-103',
    campaignId: 'cmp-2026-1',
    coordinatorId: 'usr-coord-3',
    coordinatorName: 'Carlos Lima',
    name: 'Equipe Gamma (Zona Norte)',
    regionId: 'reg-3',
    assignedPointIds: ['pt-4'],
    members: [
      { id: 'm6', name: 'Diego Ferreira', role: 'Bandeirante' },
      { id: 'm7', name: 'Patricia Rocha', role: 'Apoio' }
    ],
    status: 'ativa'
  }
];

export const INITIAL_CHECKINS: CheckIn[] = [
  {
    id: 'chk-1',
    teamId: 'tm-101',
    teamName: 'Equipe Alpha (Centro)',
    actionPointId: 'pt-1',
    pointName: 'Praça da Sé - Ponto A',
    coordinatorId: 'usr-coord-1',
    coordinatorName: 'João Silva',
    latitude: -23.550540,
    longitude: -46.633320,
    gpsAccuracyMeters: 12,
    distanceCalculatedMeters: 24,
    memberCount: 4,
    imageUrl: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&q=80&w=800',
    imageWatermarkUrl: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&q=80&w=800',
    notes: 'Equipe posicionada às 08:15. Distribuição de panfletos em andamento.',
    status: 'validado',
    statusReason: 'Dentro do raio permitido de 60m (distância: 24m)',
    timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(), // Há 2 horas
    synced: true
  },
  {
    id: 'chk-2',
    teamId: 'tm-102',
    teamName: 'Equipe Beta (Paulista)',
    actionPointId: 'pt-3',
    pointName: 'Avenida Paulista x Augusta',
    coordinatorId: 'usr-coord-2',
    coordinatorName: 'Maria Souza',
    latitude: -23.559100,
    longitude: -46.661200,
    gpsAccuracyMeters: 25,
    distanceCalculatedMeters: 145,
    memberCount: 3,
    imageUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800',
    imageWatermarkUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800',
    notes: 'Ponto ajustado para o recuo do metrô Consolação devido à chuva.',
    status: 'pendente_analise',
    statusReason: 'Perto do raio (145m do ponto; raio de 50m). Aguardando validação do supervisor.',
    timestamp: new Date(Date.now() - 1 * 3600 * 1000).toISOString(), // Há 1 hora
    synced: true
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    userId: 'usr-coord-1',
    userName: 'João Silva',
    userRole: 'coordenador',
    action: 'CHECKIN_REALIZADO',
    entity: 'CheckIn',
    entityId: 'chk-1',
    details: 'Check-in georreferenciado realizado com sucesso na Praça da Sé (Validado).',
    timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString()
  },
  {
    id: 'log-2',
    userId: 'usr-coord-2',
    userName: 'Maria Souza',
    userRole: 'coordenador',
    action: 'CHECKIN_REALIZADO',
    entity: 'CheckIn',
    entityId: 'chk-2',
    details: 'Check-in realizado com divergência de raio (145m). Encaminhado para análise.',
    timestamp: new Date(Date.now() - 1 * 3600 * 1000).toISOString()
  }
];
