export type UserRole = 'admin' | 'coordenador' | 'campo';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  phone?: string;
  avatarUrl?: string;
  active: boolean;
  regionId?: string; // Para coordenadores vinculados à zona
  regionName?: string;
  teamId?: string; // Para responsáveis de campo
  teamName?: string;
  assignedActionPointIds?: string[];
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  candidateName: string;
  cityState: string;
  startDate: string;
  endDate: string;
  status: 'ativa' | 'concluida' | 'planejamento';
}

export interface Region {
  id: string;
  campaignId: string;
  name: string; // Ex: "Zona Sul", "Centro", "Bairro Flores"
  description?: string;
  color?: string;
}

export interface ActionPoint {
  id: string;
  regionId: string;
  campaignId: string;
  name: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  radiusMeters: number; // Raio permitido para check-in (ex: 50m, 100m)
  status: 'ativo' | 'inativo';
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  phone?: string;
}

export interface Team {
  id: string;
  campaignId: string;
  coordinatorId: string;
  coordinatorName: string;
  name: string; // Ex: "Equipe Alpha - Zona Sul"
  regionId: string;
  assignedPointIds: string[];
  members: TeamMember[];
  status: 'ativa' | 'inativa';
}

export type CheckInStatus = 'validado' | 'pendente_analise' | 'rejeitado' | 'pendente_sync';

export interface CheckIn {
  id: string;
  teamId: string;
  teamName: string;
  actionPointId: string;
  pointName: string;
  coordinatorId: string;
  coordinatorName: string;
  latitude: number;
  longitude: number;
  gpsAccuracyMeters: number;
  distanceCalculatedMeters: number;
  memberCount: number;
  imageUrl?: string;
  imageWatermarkUrl?: string;
  notes?: string;
  status: CheckInStatus;
  statusReason?: string; // Ex: "Fora do raio em 120m"
  timestamp: string; // ISO 8601
  synced: boolean;
  offlineCreated?: boolean;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  entity: string;
  entityId: string;
  details: string;
  ipAddress?: string;
  timestamp: string;
}

export interface OperationalMetrics {
  totalTeams: number;
  teamsScheduledToday: number;
  teamsActive: number;
  teamsPendingCheckIn: number;
  checkInsValidated: number;
  checkInsInAnalysis: number;
  checkInsRejected: number;
  pointsAttended: number;
  pointsUnattended: number;
  pendingEvidences: number;
}
