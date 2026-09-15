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
import { ChangePasswordModal } from './components/auth/ChangePasswordModal';
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
import { AccessManagerPanel } from './components/access/AccessManagerPanel';
import { saveCheckInOffline, getPendingSyncCheckIns, markCheckInAsSynced } from './services/offlineStorage';
import { apiService } from './services/apiService';

const AUTH_STORAGE_KEY = 'vertice_authenticated_user';

const loadStorage = <T,>(key: string, fallback: T): T => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
};

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

  // Entidades Globais com Persistência em LocalStorage + Servidor MySQL
  const [users, setUsers] = useState<User[]>(() => loadStorage('vertice_users', INITIAL_USERS));
  const [campaigns, setCampaigns] = useState<Campaign[]>(() => loadStorage('vertice_campaigns', INITIAL_CAMPAIGNS));
  const [regions, setRegions] = useState<Region[]>(() => loadStorage('vertice_regions', INITIAL_REGIONS));
  const [actionPoints, setActionPoints] = useState<ActionPoint[]>(() => loadStorage('vertice_action_points', []));
  const [teams, setTeams] = useState<Team[]>(() => loadStorage('vertice_teams', []));
  const [checkIns, setCheckIns] = useState<CheckIn[]>(() => loadStorage('vertice_checkins', []));
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => loadStorage('vertice_audit_logs', []));

  // Sincronização Inicial com o Banco de Dados MySQL na Hospedagem Hostinger
  useEffect(() => {
    const loadFromHostingerDB = async () => {
      try {
        const [dbRegions, dbUsers, dbPoints, dbTeams, dbCheckIns] = await Promise.all([
          apiService.getRegions(),
          apiService.getUsers(),
          apiService.getActionPoints(),
          apiService.getTeams(),
          apiService.getCheckIns()
        ]);

        if (dbRegions && Array.isArray(dbRegions) && dbRegions.length > 0) setRegions(dbRegions);
        if (dbUsers && Array.isArray(dbUsers) && dbUsers.length > 0) setUsers(dbUsers);
        if (dbPoints && Array.isArray(dbPoints)) setActionPoints(dbPoints);
        if (dbTeams && Array.isArray(dbTeams)) setTeams(dbTeams);
        if (dbCheckIns && Array.isArray(dbCheckIns)) setCheckIns(dbCheckIns);
      } catch (err) {
        console.warn('Hostinger DB fetch fallback to local cache', err);
      }
    };

    loadFromHostingerDB();
  }, []);

  // Filtros Globais
  const [selectedRegionId, setSelectedRegionId] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Auto-Salvar no LocalStorage como Cache Offline
  useEffect(() => {
    try { localStorage.setItem('vertice_users', JSON.stringify(users)); } catch (e) { console.warn(e); }
  }, [users]);

  useEffect(() => {
    try { localStorage.setItem('vertice_regions', JSON.stringify(regions)); } catch (e) { console.warn(e); }
  }, [regions]);

  useEffect(() => {
    try { localStorage.setItem('vertice_action_points', JSON.stringify(actionPoints)); } catch (e) { console.warn(e); }
  }, [actionPoints]);

  useEffect(() => {
    try { localStorage.setItem('vertice_teams', JSON.stringify(teams)); } catch (e) { console.warn(e); }
  }, [teams]);

  useEffect(() => {
    try { localStorage.setItem('vertice_checkins', JSON.stringify(checkIns)); } catch (e) { console.warn(e); }
  }, [checkIns]);

  useEffect(() => {
    try { localStorage.setItem('vertice_audit_logs', JSON.stringify(auditLogs)); } catch (e) { console.warn(e); }
  }, [auditLogs]);

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
    } else if (user.role === 'gestor_acesso') {
      setActiveTab('access-manager');
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

  const handleSaveNewPassword = (newPassword: string) => {
    if (!currentUser) return;
    const updatedUser: User = {
      ...currentUser,
      password: newPassword,
      mustChangePassword: false,
    };
    setCurrentUser(updatedUser);
    setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    apiService.saveUser(updatedUser);
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
    } catch (e) {
      console.warn('Storage failed', e);
    }
  };

  // Atualização do Perfil
  const handleUpdateProfile = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    apiService.saveUser(updatedUser);
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
    } catch (e) {
      console.warn('Storage failed', e);
    }
  };

  // Mutações de Bases / Zonas
  const handleAddRegion = (region: Region) => {
    setRegions((prev) => [region, ...prev]);
    apiService.saveRegion(region);
  };

  const handleUpdateRegion = (updatedRegion: Region) => {
    setRegions((prev) => prev.map((r) => (r.id === updatedRegion.id ? updatedRegion : r)));
    apiService.saveRegion(updatedRegion);
  };

  const handleDeleteRegion = (regionId: string) => {
    setRegions((prev) => prev.filter((r) => r.id !== regionId));
    apiService.deleteRegion(regionId);
  };

  // Mutações de Usuários / Coordenadores
  const handleAddUser = (user: User) => {
    setUsers((prev) => [user, ...prev]);
    apiService.saveUser(user);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    apiService.saveUser(updatedUser);
  };

  const handleDeleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    apiService.deleteUser(userId);
  };

  // Mutações de Pontos de Atuação
  const handleAddActionPoint = (point: ActionPoint) => {
    setActionPoints((prev) => [point, ...prev]);
    apiService.saveActionPoint(point);

    if (point.assignedTeamId) {
      setTeams((prev) =>
        prev.map((t) =>
          t.id === point.assignedTeamId && !t.assignedPointIds.includes(point.id)
            ? { ...t, assignedPointIds: [...t.assignedPointIds, point.id] }
            : t
        )
      );
    }
  };

  const handleUpdateActionPoint = (updatedPoint: ActionPoint) => {
    setActionPoints((prev) => prev.map((p) => (p.id === updatedPoint.id ? updatedPoint : p)));
    apiService.saveActionPoint(updatedPoint);

    if (updatedPoint.assignedTeamId) {
      setTeams((prev) =>
        prev.map((t) =>
          t.id === updatedPoint.assignedTeamId && !t.assignedPointIds.includes(updatedPoint.id)
            ? { ...t, assignedPointIds: [...t.assignedPointIds, updatedPoint.id] }
            : t
        )
      );
    }
  };

  const handleDeleteActionPoint = (pointId: string) => {
    setActionPoints((prev) => prev.filter((p) => p.id !== pointId));
    apiService.deleteActionPoint(pointId);
  };

  // Mutações de Equipes
  const handleAddTeam = (team: Team) => {
    setTeams((prev) => [team, ...prev]);
    apiService.saveTeam(team);
  };

  const handleUpdateTeam = (updatedTeam: Team) => {
    setTeams((prev) => prev.map((t) => (t.id === updatedTeam.id ? updatedTeam : t)));
    apiService.saveTeam(updatedTeam);
  };

  const handleDeleteTeam = (teamId: string) => {
    setTeams((prev) => prev.filter((t) => t.id !== teamId));
    apiService.deleteTeam(teamId);
  };

  // Mutações de Campanha
  const handleUpdateCampaign = (updatedCampaign: Campaign) => {
    setCampaigns((prev) => prev.map((c) => (c.id === updatedCampaign.id ? updatedCampaign : c)));
    saveStorage('vertice_campaigns', [updatedCampaign]);
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
    apiService.saveCheckIn(newCheckIn);

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

  // Exclusão de Evidência (Admin)
  const handleDeleteCheckIn = async (checkInId: string) => {
    if (!window.confirm('Tem certeza que deseja excluir esta evidência? A exclusão é permanente.')) return;
    
    setCheckIns(prev => prev.filter(c => c.id !== checkInId));
    await apiService.deleteCheckIn(checkInId);
    
    const auditLog: AuditLog = {
      id: `log-${Date.now()}`,
      userId: currentUser?.id || 'admin',
      userName: currentUser?.name || 'Super Admin',
      userRole: currentUser?.role || 'admin',
      action: 'EVIDENCIA_EXCLUIDA',
      entity: 'CheckIn',
      entityId: checkInId,
      details: `Evidência excluída permanentemente pelo painel de auditoria.`,
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

  // Reset de todos os dados para testes de validação do zero
  const handleResetAllData = async () => {
    if (
      window.confirm(
        '⚠️ ATENÇÃO: Deseja ZERAR TODOS OS DADOS (eventos, equipes, check-ins e evidências) para iniciar o teste de validação do zero?'
      )
    ) {
      setActionPoints([]);
      setTeams([]);
      setCheckIns([]);
      setAuditLogs([]);

      try {
        localStorage.removeItem('vertice_action_points');
        localStorage.removeItem('vertice_teams');
        localStorage.removeItem('vertice_checkins');
        localStorage.removeItem('vertice_audit_logs');
      } catch (e) {
        console.warn(e);
      }

      await apiService.resetOperationalData();
      alert('✅ Todos os dados operacionais foram zerados! Você pode iniciar a validação das etapas do zero.');
    }
  };

  // Se não estiver autenticado, exibe a Tela de Login
  if (!currentUser) {
    return <LoginScreen users={users} onLoginSuccess={handleLoginSuccess} />;
  }

  // Se o usuário precisa alterar a senha inicial 7070 no primeiro acesso
  if (currentUser.mustChangePassword || (currentUser.password === '7070' && currentUser.mustChangePassword !== false)) {
    return (
      <ChangePasswordModal
        user={currentUser}
        onSaveNewPassword={handleSaveNewPassword}
      />
    );
  }

  // Métricas e Contextos
  const activeCampaign = campaigns[0];
  const pendingSyncCount = checkIns.filter((c) => !c.synced).length;

  const filteredCheckIns = checkIns.filter((c) => {
    const matchRegion =
      selectedRegionId === 'ALL' ||
      actionPoints.find((p) => p.id === c.actionPointId)?.regionId === selectedRegionId;
    const matchStatus = selectedStatus === 'ALL' || c.status === selectedStatus;
    const matchDate = c.timestamp.startsWith(selectedDate);
    return matchRegion && matchStatus && matchDate;
  });

  const getUniqueCheckIns = (checkinList: CheckIn[]) => {
    const unique = new Map<string, CheckIn>();
    checkinList.forEach(c => {
      unique.set(`${c.teamId}-${c.actionPointId}`, c);
    });
    return Array.from(unique.values());
  };

  // Identifica a quantidade de equipes únicas ativas no dia selecionado
  const getActiveTeamsCountToday = (filteredCheckinsList: CheckIn[], teamsList: Team[]) => {
    const activeTeamIds = new Set<string>();
    filteredCheckinsList.forEach(c => {
      const matchedTeam = teamsList.find(
        t => t.id === c.teamId ||
             (c.teamName && t.name && t.name.toLowerCase().trim() === c.teamName.toLowerCase().trim()) ||
             t.coordinatorId === c.coordinatorId
      );
      if (matchedTeam) {
        activeTeamIds.add(matchedTeam.id);
      } else if (c.teamId) {
        activeTeamIds.add(c.teamId);
      }
    });
    return activeTeamIds.size;
  };

  const metrics: OperationalMetrics = {
    totalTeams: teams.length,
    teamsScheduledToday: teams.length,
    teamsActive: getActiveTeamsCountToday(filteredCheckIns, teams),
    teamsPendingCheckIn: teams.length - getActiveTeamsCountToday(filteredCheckIns, teams),
    checkInsValidated: getUniqueCheckIns(filteredCheckIns.filter((c) => c.status === 'validado')).length,
    checkInsInAnalysis: getUniqueCheckIns(filteredCheckIns.filter((c) => c.status === 'pendente_analise')).length,
    checkInsRejected: getUniqueCheckIns(filteredCheckIns.filter((c) => c.status === 'rejeitado')).length,
    pointsAttended: new Set(filteredCheckIns.map((c) => c.actionPointId)).size,
    pointsUnattended: actionPoints.length - new Set(filteredCheckIns.map((c) => c.actionPointId)).size,
    pendingEvidences: filteredCheckIns.filter((c) => c.status === 'pendente_analise').length
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
        onResetAllData={handleResetAllData}
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

        {/* PERFIL: GESTOR DE ACESSOS */}
        {currentUser.role === 'gestor_acesso' && (
          <AccessManagerPanel
            users={users}
            regions={regions}
            teams={teams}
            currentUser={currentUser}
            onAddUser={handleAddUser}
            onUpdateUser={handleUpdateUser}
            onDeleteUser={handleDeleteUser}
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
                users={users}
                regions={regions}
                onAddActionPoint={handleAddActionPoint}
                onAddTeam={handleAddTeam}
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
                  checkIns={filteredCheckIns}
                  selectedRegionId={selectedRegionId}
                  onRegionChange={setSelectedRegionId}
                  selectedStatus={selectedStatus}
                  onStatusChange={setSelectedStatus}
                  selectedDate={selectedDate}
                  onDateChange={setSelectedDate}
                  onNavigateToAudit={() => setActiveTab('audit')}
                  onAuditDecision={handleAuditDecision}
                />
                <OperationalMap
                  teams={teams}
                  actionPoints={actionPoints}
                  checkIns={filteredCheckIns}
                  currentUserRole={currentUser.role}
                  onAuditCheckIn={handleAuditDecision}
                  onDeleteCheckIn={handleDeleteCheckIn}
                />
              </div>
            )}

            {activeTab === 'audit' && (
              <div className="max-w-7xl mx-auto p-4 sm:p-6">
                <AuditPanel
                  checkIns={filteredCheckIns}
                  auditLogs={auditLogs}
                  onAuditDecision={handleAuditDecision}
                  onDeleteCheckIn={handleDeleteCheckIn}
                  currentUserRole={currentUser.role}
                />
              </div>
            )}

            {activeTab === 'management' && (
              <div className="max-w-7xl mx-auto p-4 sm:p-6">
                <ManagementPanel
                  campaign={activeCampaign}
                  actionPoints={actionPoints}
                  teams={teams}
                  regions={regions}
                  users={users}
                  currentUser={currentUser}
                  onAddActionPoint={handleAddActionPoint}
                  onUpdateActionPoint={handleUpdateActionPoint}
                  onDeleteActionPoint={handleDeleteActionPoint}
                  onAddTeam={handleAddTeam}
                  onUpdateTeam={handleUpdateTeam}
                  onDeleteTeam={handleDeleteTeam}
                  onAddRegion={handleAddRegion}
                  onUpdateRegion={handleUpdateRegion}
                  onDeleteRegion={handleDeleteRegion}
                  onAddUser={handleAddUser}
                  onUpdateUser={handleUpdateUser}
                  onDeleteUser={handleDeleteUser}
                  onUpdateCampaign={handleUpdateCampaign}
                />
              </div>
            )}

            {activeTab === 'reports' && (
              <div className="max-w-7xl mx-auto p-4 sm:p-6">
                <ReportsPanel
                  campaign={activeCampaign}
                  teams={teams}
                  regions={regions}
                  users={users}
                  actionPoints={actionPoints}
                  checkIns={checkIns}
                  metrics={metrics}
                  generatedBy={currentUser.name}
                  onUpdateCampaign={handleUpdateCampaign}
                />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};
