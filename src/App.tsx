import React, { useState, useEffect } from 'react';
import { User, Campaign, Region, ActionPoint, Team, CheckIn, AuditLog, OperationalMetrics, CheckInStatus } from './types';
import {
  INITIAL_USERS,
  INITIAL_CAMPAIGNS,
  INITIAL_REGIONS,
  INITIAL_ACTION_POINTS,
  INITIAL_TEAMS,
  INITIAL_CHECKINS,
  INITIAL_AUDIT_LOGS
} from './services/mockData';
import { LoginScreen } from './components/auth/LoginScreen';
import { Navbar } from './components/layout/Navbar';
import { EditProfileModal } from './components/profile/EditProfileModal';
import { CoordinatorDashboard } from './components/coordinator/CoordinatorDashboard';
import { CoordinatorActionsPanel } from './components/coordinator/CoordinatorActionsPanel';
import { FieldActionView } from './components/field/FieldActionView';
import { OperationalMap } from './components/admin/OperationalMap';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AuditPanel } from './components/admin/AuditPanel';
import { ReportsPanel } from './components/admin/ReportsPanel';
import { ManagementPanel } from './components/admin/ManagementPanel';
import { saveCheckInOffline, getPendingSyncCheckIns, markCheckInAsSynced } from './services/offlineStorage';

const AUTH_STORAGE_KEY = 'vertice_authenticated_user';

export const App: React.FC = () => {
  // Estado de Autenticação
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isEditProfileOpen, setIsEditProfileOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('map');
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  // Entidades Globais
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [campaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS);
  const [regions] = useState<Region[]>(INITIAL_REGIONS);
  const [actionPoints, setActionPoints] = useState<ActionPoint[]>(INITIAL_ACTION_POINTS);
  const [teams, setTeams] = useState<Team[]>(INITIAL_TEAMS);
  const [checkIns, setCheckIns] = useState<CheckIn[]>(INITIAL_CHECKINS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);

  // Filtros Globais
  const [selectedRegionId, setSelectedRegionId] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  // Ao logar, define a aba inicial de acordo com o perfil
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } catch (e) {
      console.warn('Storage failed', e);
    }

    if (user.role === 'admin') {
      setActiveTab('map');
    } else if (user.role === 'coordenador') {
      setActiveTab('coordinator-dashboard');
    } else if (user.role === 'campo') {
      setActiveTab('field-checkin');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  // Atualização do Perfil
  const handleUpdateProfile = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
    } catch (e) {
      console.warn('Storage failed', e);
    }
  };

  // Mutações de Pontos de Atuação
  const handleAddActionPoint = (point: ActionPoint) => {
    setActionPoints((prev) => [point, ...prev]);
  };

  const handleUpdateActionPoint = (updatedPoint: ActionPoint) => {
    setActionPoints((prev) => prev.map((p) => (p.id === updatedPoint.id ? updatedPoint : p)));
  };

  const handleDeleteActionPoint = (pointId: string) => {
    setActionPoints((prev) => prev.filter((p) => p.id !== pointId));
  };

  // Mutações de Equipes
  const handleAddTeam = (team: Team) => {
    setTeams((prev) => [team, ...prev]);
  };

  const handleUpdateTeam = (updatedTeam: Team) => {
    setTeams((prev) => prev.map((t) => (t.id === updatedTeam.id ? updatedTeam : t)));
  };

  const handleDeleteTeam = (teamId: string) => {
    setTeams((prev) => prev.filter((t) => t.id !== teamId));
  };

  // Monitora Conectividade da Rede (Online/Offline)
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      autoSyncPendingCheckIns();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Adiciona novo Check-in
  const handleAddCheckIn = async (newCheckIn: CheckIn) => {
    await saveCheckInOffline(newCheckIn);
    setCheckIns((prev) => [newCheckIn, ...prev]);

    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      userId: newCheckIn.coordinatorId,
      userName: newCheckIn.coordinatorName,
      userRole: currentUser?.role || 'campo',
      action: 'CHECKIN_REGISTRADO',
      entity: 'CheckIn',
      entityId: newCheckIn.id,
      details: `Check-in realizado para a ${newCheckIn.teamName} no ponto ${newCheckIn.pointName} (Status: ${newCheckIn.status.toUpperCase()}).`,
      timestamp: new Date().toISOString()
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Decisão de Auditoria (Aprovar / Rejeitar)
  const handleAuditDecision = (checkInId: string, newStatus: CheckInStatus, reason: string) => {
    setCheckIns((prev) =>
      prev.map((c) => (c.id === checkInId ? { ...c, status: newStatus, statusReason: reason } : c))
    );

    const auditLog: AuditLog = {
      id: `log-${Date.now()}`,
      userId: currentUser?.id || 'admin',
      userName: currentUser?.name || 'Super Admin',
      userRole: currentUser?.role || 'admin',
      action: 'DECISAO_AUDITORIA',
      entity: 'CheckIn',
      entityId: checkInId,
      details: `Status do check-in alterado para ${newStatus.toUpperCase()}. Motivo: ${reason}`,
      timestamp: new Date().toISOString()
    };

    setAuditLogs((prev) => [auditLog, ...prev]);
  };

  // Sincronização Manual dos Check-ins Salvos Offline
  const autoSyncPendingCheckIns = async () => {
    const pending = await getPendingSyncCheckIns();
    for (const item of pending) {
      await markCheckInAsSynced(item.id);
    }
    setCheckIns((prev) =>
      prev.map((c) => (c.synced ? c : { ...c, synced: true, status: 'validado' }))
    );
  };

  // Se não estiver autenticado, exibe a Tela de Login
  if (!currentUser) {
    return <LoginScreen users={users} onLoginSuccess={handleLoginSuccess} />;
  }

  // Métricas e Contextos
  const activeCampaign = campaigns[0];
  const pendingSyncCount = checkIns.filter((c) => !c.synced).length;

  const filteredCheckIns = checkIns.filter((c) => {
    const matchRegion =
      selectedRegionId === 'ALL' ||
      actionPoints.find((p) => p.id === c.actionPointId)?.regionId === selectedRegionId;
    const matchStatus = selectedStatus === 'ALL' || c.status === selectedStatus;
    return matchRegion && matchStatus;
  });

  const metrics: OperationalMetrics = {
    totalTeams: teams.length,
    teamsScheduledToday: teams.length,
    teamsActive: checkIns.filter((c) => c.status === 'validado').length,
    teamsPendingCheckIn: teams.length - checkIns.length,
    checkInsValidated: checkIns.filter((c) => c.status === 'validado').length,
    checkInsInAnalysis: checkIns.filter((c) => c.status === 'pendente_analise').length,
    checkInsRejected: checkIns.filter((c) => c.status === 'rejeitado').length,
    pointsAttended: new Set(checkIns.map((c) => c.actionPointId)).size,
    pointsUnattended: actionPoints.length - new Set(checkIns.map((c) => c.actionPointId)).size,
    pendingEvidences: checkIns.filter((c) => c.status === 'pendente_analise').length
  };

  const userRegion = regions.find((r) => r.id === currentUser.regionId);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Inter',sans-serif]">
      {/* Navbar Superior */}
      <Navbar
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenEditProfile={() => setIsEditProfileOpen(true)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isOnline={isOnline}
        pendingSyncCount={pendingSyncCount}
        onManualSync={autoSyncPendingCheckIns}
      />

      {/* Modal de Edição de Perfil */}
      {isEditProfileOpen && (
        <EditProfileModal
          currentUser={currentUser}
          onClose={() => setIsEditProfileOpen(false)}
          onSave={handleUpdateProfile}
        />
      )}

      {/* Conteúdo Principal de acordo com o Perfil */}
      <main className="flex-1">
        {/* PERFIL 1: RESPONSÁVEL DE CAMPO */}
        {currentUser.role === 'campo' && (
          <FieldActionView
            currentUser={currentUser}
            teams={teams}
            actionPoints={actionPoints}
            checkIns={checkIns}
            campaignName={activeCampaign.name}
            isOnline={isOnline}
            onAddCheckIn={handleAddCheckIn}
            onManualSync={autoSyncPendingCheckIns}
          />
        )}

        {/* PERFIL 2: COORDENADOR POR ZONA */}
        {currentUser.role === 'coordenador' && (
          <div>
            {activeTab === 'coordinator-dashboard' && (
              <CoordinatorDashboard
                currentUser={currentUser}
                teams={teams}
                actionPoints={actionPoints}
                checkIns={checkIns}
                campaignName={activeCampaign.name}
                isOnline={isOnline}
                onAddCheckIn={handleAddCheckIn}
                onManualSync={autoSyncPendingCheckIns}
              />
            )}

            {activeTab === 'coordinator-actions' && (
              <CoordinatorActionsPanel
                currentUser={currentUser}
                region={userRegion}
                actionPoints={actionPoints}
                teams={teams}
                onAddActionPoint={handleAddActionPoint}
              />
            )}
          </div>
        )}

        {/* PERFIL 3: SUPER ADMIN */}
        {currentUser.role === 'admin' && (
          <div>
            {activeTab === 'map' && (
              <div className="p-4 space-y-4 max-w-7xl mx-auto">
                <AdminDashboard
                  metrics={metrics}
                  teams={teams}
                  actionPoints={actionPoints}
                  regions={regions}
                  checkIns={checkIns}
                  selectedRegionId={selectedRegionId}
                  onRegionChange={setSelectedRegionId}
                  selectedStatus={selectedStatus}
                  onStatusChange={setSelectedStatus}
                  onNavigateToAudit={() => setActiveTab('audit')}
                />
                <OperationalMap
                  teams={teams}
                  actionPoints={actionPoints}
                  checkIns={filteredCheckIns}
                  onAuditCheckIn={handleAuditDecision}
                />
              </div>
            )}

            {activeTab === 'audit' && (
              <div className="max-w-7xl mx-auto p-4 sm:p-6">
                <AuditPanel
                  checkIns={checkIns}
                  auditLogs={auditLogs}
                  onAuditDecision={handleAuditDecision}
                />
              </div>
            )}

            {activeTab === 'management' && (
              <div className="max-w-7xl mx-auto p-4 sm:p-6">
                <ManagementPanel
                  actionPoints={actionPoints}
                  teams={teams}
                  regions={regions}
                  users={users}
                  onAddActionPoint={handleAddActionPoint}
                  onUpdateActionPoint={handleUpdateActionPoint}
                  onDeleteActionPoint={handleDeleteActionPoint}
                  onAddTeam={handleAddTeam}
                  onUpdateTeam={handleUpdateTeam}
                  onDeleteTeam={handleDeleteTeam}
                />
              </div>
            )}

            {activeTab === 'reports' && (
              <div className="max-w-7xl mx-auto p-4 sm:p-6">
                <ReportsPanel
                  campaign={activeCampaign}
                  teams={teams}
                  actionPoints={actionPoints}
                  checkIns={checkIns}
                  metrics={metrics}
                  generatedBy={currentUser.name}
                />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};
