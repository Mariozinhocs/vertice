import { User, Campaign, Region, ActionPoint, Team, CheckIn, AuditLog } from '../types';

export const INITIAL_USERS: User[] = [
  // 1. Super Admin
  {
    id: 'usr-admin',
    name: 'Mario Henrique (Super Admin)',
    email: 'admin@vertice.com',
    password: 'admin123',
    role: 'admin',
    phone: '(92) 98888-1000',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    active: true,
  },

  // 2. Coordenadores de Zona (Baseados na Divisão de Áreas Oficial de Manaus - AM)
  {
    id: 'usr-coord-norte1',
    name: 'Cleusson Lima',
    email: 'zonanorte1manaus@outlook.com',
    password: 'norte123',
    role: 'coordenador',
    phone: '(92) 98474-7575',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    regionId: 'reg-norte-1',
    regionName: 'Norte 1',
    active: true,
  },
  {
    id: 'usr-coord-norte2',
    name: 'Aurilex',
    email: 'zonanorte3manaus@outlook.com',
    password: 'norte123',
    role: 'coordenador',
    phone: '(92) 99460-6409',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    regionId: 'reg-norte-2',
    regionName: 'Norte 2',
    active: true,
  },
  {
    id: 'usr-coord-norte3',
    name: 'Júnior Nunes',
    email: 'zonanorte2manaus@outlook.com',
    password: 'norte123',
    role: 'coordenador',
    phone: '(92) 99193-9058',
    avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=150',
    regionId: 'reg-norte-3',
    regionName: 'Norte 3',
    active: true,
  },
  {
    id: 'usr-coord-leste',
    name: 'Elanio Gouveia',
    email: 'zonalestemanaus@outlook.com',
    password: 'leste123',
    role: 'coordenador',
    phone: '(92) 99995-4668',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150',
    regionId: 'reg-leste',
    regionName: 'Zona Leste',
    active: true,
  },
  {
    id: 'usr-coord-sul',
    name: 'Derick Almeida',
    email: 'zonasulmanaus1@outlook.com',
    password: 'sul123',
    role: 'coordenador',
    phone: '(92) 98158-7805',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150',
    regionId: 'reg-sul',
    regionName: 'Zona Sul',
    active: true,
  },
  {
    id: 'usr-coord-centrosul',
    name: 'Emerson Castro',
    email: 'zonacentrosulmanaus@outlook.com',
    password: 'csul123',
    role: 'coordenador',
    phone: '(92) 98101-5868',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
    regionId: 'reg-centro-sul',
    regionName: 'Centro-Sul',
    active: true,
  },
  {
    id: 'usr-coord-oeste',
    name: 'Nildo',
    email: 'zonaoestemanaus@outlook.com',
    password: 'oeste123',
    role: 'coordenador',
    phone: '(92) 99233-7474',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150',
    regionId: 'reg-oeste',
    regionName: 'Zona Oeste',
    active: true,
  },
  {
    id: 'usr-coord-centrooeste',
    name: 'Sandro Maia',
    email: 'zonacentrooestemanaus1@outlook.com',
    password: 'coeste123',
    role: 'coordenador',
    phone: '(92) 99141-0856',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=150',
    regionId: 'reg-centro-oeste',
    regionName: 'Centro-Oeste',
    active: true,
  },
  {
    id: 'usr-coord-rural',
    name: 'Rosa Denise',
    email: 'zonaruralmanaus1@outlook.com',
    password: 'rural123',
    role: 'coordenador',
    phone: '(92) 99442-2025',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150',
    regionId: 'reg-rural',
    regionName: 'Zona Rural',
    active: true,
  },

  // 3. Responsáveis de Campo (Simulação de Operadores de Pontos)
  {
    id: 'usr-campo-norte1',
    name: 'Lucas Oliveira (Resp. Campo)',
    email: 'campo.norte@vertice.com',
    password: 'campo123',
    role: 'campo',
    phone: '(92) 99333-1001',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
    regionId: 'reg-norte-1',
    regionName: 'Norte 1',
    teamId: 'team-norte-1',
    teamName: 'Equipe Águia - Norte 1 (Cidade Nova)',
    assignedActionPointIds: ['pt-manaus-1'],
    active: true,
  },
  {
    id: 'usr-campo-sul',
    name: 'Mateus Santos (Resp. Campo)',
    email: 'campo.sul@vertice.com',
    password: 'campo123',
    role: 'campo',
    phone: '(92) 99333-1002',
    avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=150',
    regionId: 'reg-sul',
    regionName: 'Zona Sul',
    teamId: 'team-sul-1',
    teamName: 'Equipe Vitória - Sul (Teatro Amazonas)',
    assignedActionPointIds: ['pt-manaus-5'],
    active: true,
  },
  {
    id: 'usr-campo-oeste',
    name: 'Gabriel Silva (Resp. Campo)',
    email: 'campo.oeste@vertice.com',
    password: 'campo123',
    role: 'campo',
    phone: '(92) 99333-1003',
    avatarUrl: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&q=80&w=150',
    regionId: 'reg-oeste',
    regionName: 'Zona Oeste',
    teamId: 'team-oeste-1',
    teamName: 'Equipe Força - Oeste (Ponta Negra)',
    assignedActionPointIds: ['pt-manaus-8'],
    active: true,
  }
];

export const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: 'cmp-manaus-2026',
    name: 'Campanha David Almeida - Avante Manaus',
    description: 'Operação de mobilização e auditoria de campo por zonas eleitorais em Manaus - AM.',
    candidateName: 'David Almeida - 70',
    cityState: 'Manaus - AM',
    startDate: '2026-08-01',
    endDate: '2026-10-04',
    status: 'ativa'
  }
];

export const INITIAL_REGIONS: Region[] = [
  {
    id: 'reg-norte-1',
    campaignId: 'cmp-manaus-2026',
    name: 'Norte 1',
    description: 'Cidade Nova, Col. Santo Antônio, Monte das Oliveiras, Novo Aleixo',
    color: '#3b82f6'
  },
  {
    id: 'reg-norte-2',
    campaignId: 'cmp-manaus-2026',
    name: 'Norte 2',
    description: 'Col. Terra Nova, Lago Azul, Santa Etelvina, Nova Cidade',
    color: '#06b6d4'
  },
  {
    id: 'reg-norte-3',
    campaignId: 'cmp-manaus-2026',
    name: 'Norte 3',
    description: 'Cidade de Deus',
    color: '#0ea5e9'
  },
  {
    id: 'reg-leste',
    campaignId: 'cmp-manaus-2026',
    name: 'Zona Leste',
    description: 'Jorge Teixeira, Tancredo Neves, Coroado, São José, Colônia Antônio Aleixo, Dist. Industrial II, Zumbi',
    color: '#f97316'
  },
  {
    id: 'reg-sul',
    campaignId: 'cmp-manaus-2026',
    name: 'Zona Sul',
    description: 'Betânia, Crespo, Distrito Industrial I, Educandos, Morro da Liberdade, Cachoeirinha, Centro, Japiim, Praça 14, Petrópolis',
    color: '#ec4899'
  },
  {
    id: 'reg-centro-sul',
    campaignId: 'cmp-manaus-2026',
    name: 'Centro-Sul',
    description: 'Adrianópolis, Aleixo, Chapada, Flores, Parque 10 de Novembro, N. S. das Graças, Presidente Vargas',
    color: '#a855f7'
  },
  {
    id: 'reg-oeste',
    campaignId: 'cmp-manaus-2026',
    name: 'Zona Oeste',
    description: 'Compensa, Glória, Santo Agostinho, São Jorge, São Raimundo, Vila da Prata, Ponta Negra, Tarumã',
    color: '#10b981'
  },
  {
    id: 'reg-centro-oeste',
    campaignId: 'cmp-manaus-2026',
    name: 'Centro-Oeste',
    description: 'Alvorada, Da Paz, Dom Pedro I, Lírio do Vale, Nova Esperança, Planalto, Redenção',
    color: '#eab308'
  },
  {
    id: 'reg-rural',
    campaignId: 'cmp-manaus-2026',
    name: 'Zona Rural',
    description: 'BR-174, AM-010, Comunidades Ribeirinhas',
    color: '#84cc16'
  }
];

export const INITIAL_ACTION_POINTS: ActionPoint[] = [
  // Norte 1
  {
    id: 'pt-manaus-1',
    campaignId: 'cmp-manaus-2026',
    regionId: 'reg-norte-1',
    name: 'Terminal T3 - Cidade Nova',
    description: 'Entrada e plataformas de alta circulação no Terminal 3',
    address: 'Av. Noel Nutels, s/n - Cidade Nova, Manaus - AM',
    latitude: -3.0315,
    longitude: -59.9982,
    radiusMeters: 80,
    status: 'ativo'
  },
  {
    id: 'pt-manaus-2',
    campaignId: 'cmp-manaus-2026',
    regionId: 'reg-norte-1',
    name: 'Feira Municipal do Monte das Oliveiras',
    description: 'Ação com feirantes e moradores na Av. Preciosa',
    address: 'Av. Preciosa - Monte das Oliveiras, Manaus - AM',
    latitude: -3.0180,
    longitude: -60.0100,
    radiusMeters: 70,
    status: 'ativo'
  },

  // Norte 2 & 3
  {
    id: 'pt-manaus-3',
    campaignId: 'cmp-manaus-2026',
    regionId: 'reg-norte-2',
    name: 'Av. Margarita - Nova Cidade',
    description: 'Cruzamento principal com a Av. das Flores',
    address: 'Av. Margarita, 1500 - Nova Cidade, Manaus - AM',
    latitude: -2.9985,
    longitude: -60.0180,
    radiusMeters: 60,
    status: 'ativo'
  },
  {
    id: 'pt-manaus-4',
    campaignId: 'cmp-manaus-2026',
    regionId: 'reg-norte-3',
    name: 'Feira do Produtor / Cidade de Deus',
    description: 'Ponto de concentração popular na rotatória da Cidade de Deus',
    address: 'Av. Camapuã - Cidade de Deus, Manaus - AM',
    latitude: -3.0120,
    longitude: -59.9670,
    radiusMeters: 80,
    status: 'ativo'
  },

  // Sul
  {
    id: 'pt-manaus-5',
    campaignId: 'cmp-manaus-2026',
    regionId: 'reg-sul',
    name: 'Largo de São Sebastião / Teatro Amazonas',
    description: 'Ponto histórico e turístico de grande fluxo cultural',
    address: 'Rua 10 de Julho - Centro Histórico, Manaus - AM',
    latitude: -3.1302,
    longitude: -60.0234,
    radiusMeters: 70,
    status: 'ativo'
  },
  {
    id: 'pt-manaus-6',
    campaignId: 'cmp-manaus-2026',
    regionId: 'reg-sul',
    name: 'Praça da Matriz / Centro Comercial',
    description: 'Terminal Central e calçadão da Av. Eduardo Ribeiro',
    address: 'Av. Eduardo Ribeiro - Centro, Manaus - AM',
    latitude: -3.1360,
    longitude: -60.0255,
    radiusMeters: 90,
    status: 'ativo'
  },
  {
    id: 'pt-manaus-7',
    campaignId: 'cmp-manaus-2026',
    regionId: 'reg-sul',
    name: 'Parque Lagoa do Japiim',
    description: 'Entrada principal da pista de caminhada',
    address: 'Av. Rodrigo Otávio - Japiim, Manaus - AM',
    latitude: -3.1180,
    longitude: -59.9850,
    radiusMeters: 60,
    status: 'ativo'
  },

  // Oeste
  {
    id: 'pt-manaus-8',
    campaignId: 'cmp-manaus-2026',
    regionId: 'reg-oeste',
    name: 'Calçadão da Ponta Negra',
    description: 'Anfiteatro e orla da praia da Ponta Negra',
    address: 'Av. Coronel Teixeira - Ponta Negra, Manaus - AM',
    latitude: -3.0610,
    longitude: -60.1030,
    radiusMeters: 100,
    status: 'ativo'
  },
  {
    id: 'pt-manaus-9',
    campaignId: 'cmp-manaus-2026',
    regionId: 'reg-oeste',
    name: 'Av. Brasil - Compensa',
    description: 'Comércio popular e feira da Compensa',
    address: 'Av. Brasil, 1200 - Compensa, Manaus - AM',
    latitude: -3.1090,
    longitude: -60.0520,
    radiusMeters: 65,
    status: 'ativo'
  },

  // Centro-Sul
  {
    id: 'pt-manaus-10',
    campaignId: 'cmp-manaus-2026',
    regionId: 'reg-centro-sul',
    name: 'CSU do Parque 10 de Novembro',
    description: 'Centro Social Urbano e praça de alimentação',
    address: 'Av. Perimetral - Parque 10 de Novembro, Manaus - AM',
    latitude: -3.0870,
    longitude: -60.0080,
    radiusMeters: 75,
    status: 'ativo'
  },
  {
    id: 'pt-manaus-11',
    campaignId: 'cmp-manaus-2026',
    regionId: 'reg-centro-sul',
    name: 'Rotatória do Eldorado / Adrianópolis',
    description: 'Cruzamento com Av. Djalma Batista e bares do Eldorado',
    address: 'Av. Mário Ypiranga - Adrianópolis, Manaus - AM',
    latitude: -3.0920,
    longitude: -60.0160,
    radiusMeters: 70,
    status: 'ativo'
  },

  // Centro-Oeste
  {
    id: 'pt-manaus-12',
    campaignId: 'cmp-manaus-2026',
    regionId: 'reg-centro-oeste',
    name: 'Arena da Amazônia / Sambódromo',
    description: 'Complexo esportivo e calçadão Dom Pedro / Alvorada',
    address: 'Av. Constantino Nery - Flores / Dom Pedro, Manaus - AM',
    latitude: -3.0830,
    longitude: -60.0280,
    radiusMeters: 120,
    status: 'ativo'
  },

  // Leste
  {
    id: 'pt-manaus-13',
    campaignId: 'cmp-manaus-2026',
    regionId: 'reg-leste',
    name: 'Feira do Produtor - Jorge Teixeira',
    description: 'Rotatória da Feira do Produtor da Zona Leste',
    address: 'Av. Autaz Mirim - Jorge Teixeira, Manaus - AM',
    latitude: -3.0530,
    longitude: -59.9340,
    radiusMeters: 90,
    status: 'ativo'
  },
  {
    id: 'pt-manaus-14',
    campaignId: 'cmp-manaus-2026',
    regionId: 'reg-leste',
    name: 'Rotatória do Coroado (Bola do Coroado)',
    description: 'Confluência da Alameda Cosme Ferreira com Av. Ephigênio Salles',
    address: 'Alameda Cosme Ferreira - Coroado, Manaus - AM',
    latitude: -3.0905,
    longitude: -59.9780,
    radiusMeters: 80,
    status: 'ativo'
  }
];

export const INITIAL_TEAMS: Team[] = [
  {
    id: 'team-norte-1',
    campaignId: 'cmp-manaus-2026',
    coordinatorId: 'usr-coord-norte1',
    coordinatorName: 'Cleusson Lima',
    name: 'Equipe Águia - Norte 1 (Cidade Nova)',
    regionId: 'reg-norte-1',
    assignedPointIds: ['pt-manaus-1', 'pt-manaus-2'],
    status: 'ativa',
    members: [
      { id: 'm-1', name: 'Lucas Oliveira', role: 'Líder de Ação', phone: '(92) 99333-1001' },
      { id: 'm-2', name: 'Carla Dias', role: 'Mobilizadora', phone: '(92) 99333-1002' },
      { id: 'm-3', name: 'Marcos Vinícius', role: 'Bandeirada', phone: '(92) 99333-1003' },
      { id: 'm-4', name: 'Patrícia Rocha', role: 'Distribuição Material', phone: '(92) 99333-1004' }
    ]
  },
  {
    id: 'team-sul-1',
    campaignId: 'cmp-manaus-2026',
    coordinatorId: 'usr-coord-sul',
    coordinatorName: 'Derick Almeida',
    name: 'Equipe Vitória - Sul (Centro / Teatro)',
    regionId: 'reg-sul',
    assignedPointIds: ['pt-manaus-5', 'pt-manaus-6', 'pt-manaus-7'],
    status: 'ativa',
    members: [
      { id: 'm-5', name: 'Mateus Santos', role: 'Líder de Ação', phone: '(92) 99333-1005' },
      { id: 'm-6', name: 'Bruna Lima', role: 'Mobilizadora', phone: '(92) 99333-1006' },
      { id: 'm-7', name: 'Rodrigo Freitas', role: 'Apoio Logístico', phone: '(92) 99333-1007' }
    ]
  },
  {
    id: 'team-oeste-1',
    campaignId: 'cmp-manaus-2026',
    coordinatorId: 'usr-coord-oeste',
    coordinatorName: 'Nildo',
    name: 'Equipe Força - Oeste (Ponta Negra / Compensa)',
    regionId: 'reg-oeste',
    assignedPointIds: ['pt-manaus-8', 'pt-manaus-9'],
    status: 'ativa',
    members: [
      { id: 'm-8', name: 'Gabriel Silva', role: 'Líder de Ação', phone: '(92) 99333-1008' },
      { id: 'm-9', name: 'Juliana Pires', role: 'Mobilizadora', phone: '(92) 99333-1009' },
      { id: 'm-10', name: 'Fábio Andrade', role: 'Panfletagem', phone: '(92) 99333-1010' }
    ]
  },
  {
    id: 'team-csul-1',
    campaignId: 'cmp-manaus-2026',
    coordinatorId: 'usr-coord-centrosul',
    coordinatorName: 'Emerson Castro',
    name: 'Equipe Aliança - Centro-Sul (Parque 10 / Adrianópolis)',
    regionId: 'reg-centro-sul',
    assignedPointIds: ['pt-manaus-10', 'pt-manaus-11'],
    status: 'ativa',
    members: [
      { id: 'm-11', name: 'Thiago Costa', role: 'Líder de Ação', phone: '(92) 99333-1011' },
      { id: 'm-12', name: 'Renata Albuquerque', role: 'Mobilizadora', phone: '(92) 99333-1012' }
    ]
  },
  {
    id: 'team-leste-1',
    campaignId: 'cmp-manaus-2026',
    coordinatorId: 'usr-coord-leste',
    coordinatorName: 'Elanio Gouveia',
    name: 'Equipe União - Leste (Jorge Teixeira / Coroado)',
    regionId: 'reg-leste',
    assignedPointIds: ['pt-manaus-13', 'pt-manaus-14'],
    status: 'ativa',
    members: [
      { id: 'm-13', name: 'Diego Batista', role: 'Líder de Ação', phone: '(92) 99333-1013' },
      { id: 'm-14', name: 'Vanessa Souza', role: 'Mobilizadora', phone: '(92) 99333-1014' }
    ]
  },
  {
    id: 'team-coeste-1',
    campaignId: 'cmp-manaus-2026',
    coordinatorId: 'usr-coord-centrooeste',
    coordinatorName: 'Sandro Maia',
    name: 'Equipe Progresso - Centro-Oeste (Arena / Alvorada)',
    regionId: 'reg-centro-oeste',
    assignedPointIds: ['pt-manaus-12'],
    status: 'ativa',
    members: [
      { id: 'm-15', name: 'Alexandre Magno', role: 'Líder de Ação', phone: '(92) 99333-1015' },
      { id: 'm-16', name: 'Camila Torres', role: 'Mobilizadora', phone: '(92) 99333-1016' }
    ]
  }
];

export const INITIAL_CHECKINS: CheckIn[] = [
  {
    id: 'chk-manaus-1',
    teamId: 'team-norte-1',
    teamName: 'Equipe Águia - Norte 1 (Cidade Nova)',
    actionPointId: 'pt-manaus-1',
    pointName: 'Terminal T3 - Cidade Nova',
    coordinatorId: 'usr-coord-norte1',
    coordinatorName: 'Cleusson Lima',
    latitude: -3.0314,
    longitude: -59.9981,
    gpsAccuracyMeters: 4.8,
    distanceCalculatedMeters: 16,
    memberCount: 4,
    imageWatermarkUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&q=80&w=600',
    notes: 'Ação iniciada às 08h com excelente receptividade dos usuários no Terminal 3.',
    status: 'validado',
    statusReason: 'Dentro do raio de tolerância (16m de 80m). Evidência fotográfica nítida.',
    timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
    synced: true
  },
  {
    id: 'chk-manaus-2',
    teamId: 'team-sul-1',
    teamName: 'Equipe Vitória - Sul (Centro / Teatro)',
    actionPointId: 'pt-manaus-5',
    pointName: 'Largo de São Sebastião / Teatro Amazonas',
    coordinatorId: 'usr-coord-sul',
    coordinatorName: 'Derick Almeida',
    latitude: -3.1301,
    longitude: -60.0233,
    gpsAccuracyMeters: 5.2,
    distanceCalculatedMeters: 18,
    memberCount: 3,
    imageWatermarkUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=600',
    notes: 'Equipe posicionada em frente ao Teatro Amazonas. Distribuição de adesivos e panfletos.',
    status: 'validado',
    statusReason: 'Check-in validado com precisão GPS e foto autenticada.',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    synced: true
  },
  {
    id: 'chk-manaus-3',
    teamId: 'team-oeste-1',
    teamName: 'Equipe Força - Oeste (Ponta Negra / Compensa)',
    actionPointId: 'pt-manaus-8',
    pointName: 'Calçadão da Ponta Negra',
    coordinatorId: 'usr-coord-oeste',
    coordinatorName: 'Nildo',
    latitude: -3.0608,
    longitude: -60.1028,
    gpsAccuracyMeters: 6.0,
    distanceCalculatedMeters: 31,
    memberCount: 3,
    imageWatermarkUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=600',
    notes: 'Ação no calçadão principal. Alto fluxo de caminhada e esportes.',
    status: 'validado',
    statusReason: 'Auditado e aprovado com sucesso.',
    timestamp: new Date(Date.now() - 3600000 * 1.5).toISOString(),
    synced: true
  },
  {
    id: 'chk-manaus-4',
    teamId: 'team-csul-1',
    teamName: 'Equipe Aliança - Centro-Sul (Parque 10 / Adrianópolis)',
    actionPointId: 'pt-manaus-10',
    pointName: 'CSU do Parque 10 de Novembro',
    coordinatorId: 'usr-coord-centrosul',
    coordinatorName: 'Emerson Castro',
    latitude: -3.0868,
    longitude: -60.0078,
    gpsAccuracyMeters: 7.1,
    distanceCalculatedMeters: 29,
    memberCount: 2,
    imageWatermarkUrl: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&q=80&w=600',
    notes: 'Mobilização na praça de alimentação e comércios locais.',
    status: 'pendente_analise',
    statusReason: 'Aguardando revisão de auditoria pelo painel central.',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    synced: true
  },
  {
    id: 'chk-manaus-5',
    teamId: 'team-leste-1',
    teamName: 'Equipe União - Leste (Jorge Teixeira / Coroado)',
    actionPointId: 'pt-manaus-13',
    pointName: 'Feira do Produtor - Jorge Teixeira',
    coordinatorId: 'usr-coord-leste',
    coordinatorName: 'Elanio Gouveia',
    latitude: -3.0528,
    longitude: -59.9338,
    gpsAccuracyMeters: 5.5,
    distanceCalculatedMeters: 28,
    memberCount: 2,
    imageWatermarkUrl: 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&q=80&w=600',
    notes: 'Bandeirada e panfletagem na rotatória da feira.',
    status: 'validado',
    statusReason: 'Aprovado pelo auditor.',
    timestamp: new Date(Date.now() - 900000).toISOString(),
    synced: true
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    userId: 'usr-admin',
    userName: 'Mario Henrique',
    userRole: 'admin',
    action: 'INICIALIZACAO_OPERACAO',
    entity: 'Campanha',
    entityId: 'cmp-manaus-2026',
    details: 'Operação Manaus 2026 inicializada com 9 zonas eleitorais e 14 pontos de ação.',
    timestamp: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'log-2',
    userId: 'usr-coord-norte1',
    userName: 'Cleusson Lima',
    userRole: 'coordenador',
    action: 'CHECKIN_REGISTRADO',
    entity: 'CheckIn',
    entityId: 'chk-manaus-1',
    details: 'Check-in registrado no Terminal T3 - Cidade Nova (16m do ponto).',
    timestamp: new Date(Date.now() - 3600000 * 3).toISOString()
  },
  {
    id: 'log-3',
    userId: 'usr-admin',
    userName: 'Mario Henrique',
    userRole: 'admin',
    action: 'DECISAO_AUDITORIA',
    entity: 'CheckIn',
    entityId: 'chk-manaus-1',
    details: 'Status alterado para VALIDADO. Evidência e geolocalização aprovadas.',
    timestamp: new Date(Date.now() - 3600000 * 2.8).toISOString()
  },
  {
    id: 'log-4',
    userId: 'usr-coord-sul',
    userName: 'Derick Almeida',
    userRole: 'coordenador',
    action: 'CHECKIN_REGISTRADO',
    entity: 'CheckIn',
    entityId: 'chk-manaus-2',
    details: 'Check-in registrado no Largo de São Sebastião / Teatro Amazonas (18m do ponto).',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString()
  }
];
