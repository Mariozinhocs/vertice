import React, { useState, useEffect } from 'react';
import { UserRole, User, Campaign, Region, ActionPoint, Team, CheckIn, AuditLog, OperationalMetrics, CheckInStatus } from './types';
import {
  INITIAL_USERS,
  INITIAL_CAMPAIGNS,
  INITIAL_REGIONS,
  INITIAL_ACTION_POINTS,
  INITIAL_TEAMS,
  INITIAL_CHECKINS,
  INITIAL_AUDIT_LOGS
} from './services/mockData';
import { Navbar } from './components/layout/Navbar';
import { CoordinatorDashboard } from './components/coordinator/CoordinatorDashboard';
import { OperationalMap } from './components/admin/OperationalMap';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AuditPanel } from './components/admin/AuditPanel';
import { ReportsPanel } from './components/admin/ReportsPanel';
import { ManagementPanel } from './components/admin/ManagementPanel';
import { saveCheckInOffline, getPendingSyncCheckIns, markCheckInAsSynced } from './services/offlineStorage';

export const App: React.FC = () => {
  // State Global da Aplicação
  const [currentRole, setCurrentRole] = useState<UserRole>('admin');
  const [activeTab, setActiveTab] = useState<string>('map');
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  // Entidades
  const [users] = useState<User[]>(INITIAL_USERS);
  const [campaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS);
  const [regions] = useState<Region[]>(INITIAL_REGIONS);
  const [actionPoints, setActionPoints] = useState<ActionPoint[]>(INITIAL_ACTION_POINTS);
  const [teams, setTeams] = useState<Team[]>(INITIAL_TEAMS);
  const [checkIns, setCheckIns] = useState<CheckIn[]>(INITIAL_CHECKINS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);

  // Filtros
  const [selectedRegionId, setSelectedRegionId] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

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

  // Muda de aba quando o papel (Role) for alterado
  const handleRoleChange = (newRole: UserRole) => {
    setCurrentRole(newRole);
    if (newRole === 'coordenador') {
      setActiveTab('coordinator-dashboard');
    } else if (activeTab === 'coordinator-dashboard') {
      setActiveTab('map');
    }
  };

  // Adiciona novo Check-in (seja online ou offline via PWA)
  const handleAddCheckIn = async (newCheckIn: CheckIn) => {
    // Salva localmente no IndexedDB
    await saveCheckInOffline(newCheckIn);

    // Atualiza estado do React
    setCheckIns((prev) => [newCheckIn, ...prev]);

    // Registra Trilha de Auditoria
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      userId: newCheckIn.coordinatorId,
      userName: newCheckIn.coordinatorName,
      userRole: 'coordenador',
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

    const currentUser = users.find((u) => u.role === currentRole) || users[0];

    const auditLog: AuditLog = {
      id: `log-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentRole,
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

  // Cálculo Dinâmico das Métricas KPIs Operacionais
  const activeCampaign = campaigns[0];
  const pendingSyncCount = checkIns.filter((c) => !c.synced).length;

  const filteredCheckIns = checkIns.filter((c) => {
    const matchRegion = selectedRegionId === 'ALL' || actionPoints.find((p) => p.id === c.actionPointId)?.regionId === selectedRegionId;
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
    pendingEvidences: checkIns.filter((c) => c.status === 'pendente_analise').length,
  };

  const currentUser = users.find((u) => u.role === currentRole) || users[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Inter',sans-serif]">
      
      {/* Navbar Superior */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isOnline={isOnline}
        pendingSyncCount={pendingSyncCount}
        onManualSync={autoSyncPendingCheckIns}
      />

      {/* Conteúdo Principal conforme Perfil e Aba Ativa */}
      <main className="flex-1">
        {currentRole === 'coordenador' ? (
          <div className="py-4">
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
          </div>
        ) : (
          <div>
            {/* Visualização de Dashboard KPIs + Mapa em Abas */}
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

            {activeTab === 'management' && (
              <div className="max-w-7xl mx-auto p-4 sm:p-6">
                <ManagementPanel
                  actionPoints={actionPoints}
                  teams={teams}
                  regions={regions}
                  users={users}
                  onAddActionPoint={(pt) => setActionPoints((prev) => [pt, ...prev])}
                  onAddTeam={(tm) => setTeams((prev) => [tm, ...prev])}
                />
              </div>
            )}
          </div>
        )}
      </main>

    </div>
  );
};
