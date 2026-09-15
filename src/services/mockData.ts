import { User, Campaign, Region, ActionPoint, Team, CheckIn, AuditLog } from '../types';

export const INITIAL_USERS: User[] = [
  // 1. Super Admin
  {
    id: 'usr-admin',
    name: 'Mario Henrique',
    username: 'mario.henrique',
    email: 'admin@vertice.com',
    password: 'admin123',
    mustChangePassword: false,
    role: 'admin',
    phone: '(92) 98888-1000',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    active: true,
  },

  // 1.5. Gestor de Acessos
  {
    id: 'usr-gestor',
    name: 'Gabriel Acessos',
    username: 'gabriel.acessos',
    email: 'acessos@vertice.com',
    password: 'vertice2026',
    mustChangePassword: false,
    role: 'gestor_acesso',
    phone: '(92) 98888-2000',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    active: true,
  },

  // 2. Coordenador Principal
  {
    id: 'usr-coord-marcelo',
    name: 'Marcelo Campbell',
    username: 'marcelo.campbell',
    email: 'marcelo.campbell@vertice.com',
    password: 'vertice2026',
    mustChangePassword: false,
    role: 'coordenador',
    phone: '(92) 99999-9999',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    regionId: 'reg-central',
    regionName: 'Central',
    active: true,
  },

  // 3. Coordenadores de Zona (Baseados na Divisão de Áreas Oficial de Manaus - AM)
  {
    id: 'usr-coord-norte1',
    name: 'Cleusson Lima',
    username: 'cleusson.lima',
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
    id: 'usr-campo-mario',
    name: 'Mario',
    username: 'mario',
    email: 'mario@vertice.com',
    password: '7070',
    mustChangePassword: true,
    role: 'campo',
    phone: '(92) 99333-1000',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
    regionId: 'reg-norte-1',
    regionName: 'Zona Leste',
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
    id: 'reg-central',
    campaignId: 'cmp-manaus-2026',
    name: 'Central',
    description: 'Base Central da Operação',
    color: '#6366f1'
  },
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

export const INITIAL_ACTION_POINTS: ActionPoint[] = [];

export const INITIAL_TEAMS: Team[] = [];

export const INITIAL_CHECKINS: CheckIn[] = [];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [];

