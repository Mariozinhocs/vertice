import React, { useState } from 'react';
import { ActionPoint, Team, Region, User, Campaign } from '../../types';
import { Plus, MapPin, Users, Edit3, Trash2, Shield, Phone, CheckCircle2, ChevronRight, UserCheck, Map, Flag, Calendar, LayoutGrid, List, Layers, Search, Filter, Building2 } from 'lucide-react';
import { ActionPointModal } from './ActionPointModal';
import { TeamModal } from './TeamModal';
import { RegionModal } from './RegionModal';
import { UserModal } from './UserModal';
import { CampaignModal } from './CampaignModal';

interface ManagementPanelProps {
  campaign?: Campaign;
  actionPoints: ActionPoint[];
  teams: Team[];
  regions: Region[];
  users: User[];
  currentUser?: User | null;
  onAddActionPoint: (point: ActionPoint) => void;
  onUpdateActionPoint?: (point: ActionPoint) => void;
  onDeleteActionPoint?: (pointId: string) => void;
  onAddTeam: (team: Team) => void;
  onUpdateTeam?: (team: Team) => void;
  onDeleteTeam?: (teamId: string) => void;
  onAddRegion?: (region: Region) => void;
  onUpdateRegion?: (region: Region) => void;
  onDeleteRegion?: (regionId: string) => void;
  onAddUser?: (user: User) => void;
  onUpdateUser?: (user: User) => void;
  onDeleteUser?: (userId: string) => void;
  onUpdateCampaign?: (campaign: Campaign) => void;
}

export const ManagementPanel: React.FC<ManagementPanelProps> = ({
  campaign,
  actionPoints,
  teams,
  regions: initialRegions,
  users: initialUsers,
  currentUser,
  onAddActionPoint,
  onUpdateActionPoint,
  onDeleteActionPoint,
  onAddTeam,
  onUpdateTeam,
  onDeleteTeam,
  onAddRegion,
  onUpdateRegion,
  onDeleteRegion,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
  onUpdateCampaign
}) => {
  const [activeTab, setActiveTab] = useState<'points' | 'teams' | 'users' | 'regions' | 'campaign'>('points');
  const [showCampaignModal, setShowCampaignModal] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Controles Globais de Exibição e Filtros (Grade | Lista | Por Base)
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'grouped'>('grid');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [regionFilter, setRegionFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Estados Locais para Bases e Usuários (sincronizados com as props globais)
  const [regions, setRegions] = useState<Region[]>(initialRegions);
  const [users, setUsers] = useState<User[]>(initialUsers);

  React.useEffect(() => {
    setRegions(initialRegions);
  }, [initialRegions]);

  React.useEffect(() => {
    setUsers(initialUsers);
  }, [initialUsers]);

  // Modais de Ponto de Atuação
  const [showPointModal, setShowPointModal] = useState<boolean>(false);
  const [editingPoint, setEditingPoint] = useState<ActionPoint | null>(null);

  // Modais de Equipe
  const [showTeamModal, setShowTeamModal] = useState<boolean>(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);

  // Modais de Base / Zona
  const [showRegionModal, setShowRegionModal] = useState<boolean>(false);
  const [editingRegion, setEditingRegion] = useState<Region | null>(null);

  // Modais de Coordenador / Usuário
  const [showUserModal, setShowUserModal] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const handleOpenNewPoint = () => {
    setEditingPoint(null);
    setShowPointModal(true);
  };

  const handleOpenEditPoint = (point: ActionPoint) => {
    setEditingPoint(point);
    setShowPointModal(true);
  };

  const handleSavePoint = (point: ActionPoint) => {
    if (editingPoint && onUpdateActionPoint) {
      onUpdateActionPoint(point);
    } else {
      onAddActionPoint(point);
    }
  };

  const handleOpenNewTeam = () => {
    setEditingTeam(null);
    setShowTeamModal(true);
  };

  const handleOpenEditTeam = (team: Team) => {
    setEditingTeam(team);
    setShowTeamModal(true);
  };

  const handleSaveTeam = (team: Team) => {
    if (editingTeam && onUpdateTeam) {
      onUpdateTeam(team);
    } else {
      onAddTeam(team);
    }
  };

  // Handlers para Bases / Zonas
  const handleOpenNewRegion = () => {
    setEditingRegion(null);
    setShowRegionModal(true);
  };

  const handleOpenEditRegion = (region: Region) => {
    setEditingRegion(region);
    setShowRegionModal(true);
  };

  const handleSaveRegion = (region: Region) => {
    if (editingRegion) {
      setRegions((prev) => prev.map((r) => (r.id === region.id ? region : r)));
      if (onUpdateRegion) onUpdateRegion(region);
    } else {
      setRegions((prev) => [region, ...prev]);
      if (onAddRegion) onAddRegion(region);
    }
  };

  const handleDeleteRegion = (regionId: string) => {
    setRegions((prev) => prev.filter((r) => r.id !== regionId));
    if (onDeleteRegion) onDeleteRegion(regionId);
  };

  // Handlers para Coordenadores / Usuários
  const handleOpenNewUser = () => {
    setEditingUser(null);
    setShowUserModal(true);
  };

  const handleOpenEditUser = (user: User) => {
    setEditingUser(user);
    setShowUserModal(true);
  };

  const handleSaveUser = (user: User) => {
    if (editingUser) {
      setUsers((prev) => prev.map((u) => (u.id === user.id ? user : u)));
      if (onUpdateUser) onUpdateUser(user);
    } else {
      setUsers((prev) => [user, ...prev]);
      if (onAddUser) onAddUser(user);
    }
  };

  const handleDeleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    if (onDeleteUser) onDeleteUser(userId);
  };

  const [userSubTab, setUserSubTab] = useState<'coordenadores' | 'usuarios'>('coordenadores');

  const safeUsers = Array.isArray(users) ? users : [];
  const coordinators = safeUsers.filter((u) => u && u.role === 'coordenador');
  const otherUsers = safeUsers.filter((u) => u && u.role !== 'coordenador');

  // Filtragem de Pontos de Atuação
  const filteredPoints = actionPoints.filter((point) => {
    const matchDate = !selectedDate || point.scheduledDate === selectedDate;
    const matchRegion = regionFilter === 'ALL' || point.regionId === regionFilter;
    const matchSearch = !searchTerm ||
      (point.name && point.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (point.address && point.address.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchDate && matchRegion && matchSearch;
  });

  // Filtragem de Equipes
  const filteredTeams = teams.filter((team) => {
    const matchRegion = regionFilter === 'ALL' || team.regionId === regionFilter;
    const matchSearch = !searchTerm ||
      (team.name && team.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (team.coordinatorName && team.coordinatorName.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchRegion && matchSearch;
  });

  return (
    <div className="space-y-6 font-['Inter',sans-serif]">
      
      {/* Cabeçalho */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">
            <Users className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-white">Cadastros Operacionais, Bases & Equipes</h2>
            <p className="text-xs text-slate-400">
              Gerenciamento de Pontos de Atuação, Zonas Geográficas, Coordenadores e Equipes
            </p>
          </div>
        </div>

        {/* Seletor de Abas com Pills e Contadores */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('points')}
            className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'points'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Pontos ({actionPoints.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('teams')}
            className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'teams'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Equipes ({teams.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'users'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Usuários ({safeUsers.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('regions')}
            className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'regions'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            <span>Bases / Zonas ({regions.length})</span>
          </button>
          {campaign && (
            <button
              onClick={() => setActiveTab('campaign')}
              className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'campaign'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Flag className="w-3.5 h-3.5" />
              <span>Dados da Campanha</span>
            </button>
          )}
        </div>
      </div>

      {/* Barra Padronizada de Busca, Modo de Visualização (Grade / Lista / Por Base) e Filtros */}
      {activeTab !== 'campaign' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 space-y-3 shadow-md">
          <div className="flex flex-wrap items-center justify-between gap-3">
            
            {/* Campo de Busca Principal */}
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                placeholder="Buscar por ponto, equipe, coordenador ou base..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950/70 border border-slate-800 text-slate-200 placeholder-slate-500 rounded-lg pl-9 pr-4 py-1.5 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            {/* Alternador de Modo de Visualização (Grade / Lista / Por Base) */}
            <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  viewMode === 'grid'
                    ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/40 shadow-sm font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Grade</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  viewMode === 'list'
                    ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/40 shadow-sm font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>Lista</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('grouped')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  viewMode === 'grouped'
                    ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/40 shadow-sm font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Por Base</span>
              </button>
            </div>
          </div>

          {/* Segunda Linha: Filtros em Dropdown */}
          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-800/80 text-xs">
            <div className="flex items-center gap-1 text-slate-400 font-medium">
              <Filter className="w-3.5 h-3.5 text-emerald-400" />
              <span>Filtros:</span>
            </div>

            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-300 rounded-lg px-3 py-1.5 focus:ring-1 focus:ring-emerald-500 focus:outline-none cursor-pointer"
            >
              <option value="ALL">Todas as Bases ({regions.length})</option>
              {regions.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>

            {activeTab === 'points' && (
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Data de Referência:</span>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1 text-xs focus:ring-1 focus:ring-emerald-500"
                />
                {selectedDate && (
                  <button
                    onClick={() => setSelectedDate('')}
                    className="text-[10px] text-slate-400 hover:text-white underline"
                  >
                    Limpar
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ABA 1: PONTOS DE ATUAÇÃO */}
      {activeTab === 'points' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-indigo-400" />
              <span>Pontos de Ação Cadastrados ({filteredPoints.length})</span>
            </h3>
            <button
              onClick={handleOpenNewPoint}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-lg shadow-indigo-600/30 flex items-center space-x-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Ponto de Atuação</span>
            </button>
          </div>

          {/* MODO 1: GRADE (GRID) */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPoints.map((point) => {
                const region = regions.find((r) => r.id === point.regionId);
                return (
                  <div
                    key={point.id}
                    onClick={() => handleOpenEditPoint(point)}
                    className="bg-slate-900/90 hover:bg-slate-800/80 border border-slate-800 hover:border-indigo-500/50 p-4 rounded-xl space-y-3 shadow-md transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-white group-hover:text-indigo-300 transition-colors">
                          {point.name}
                        </h4>
                        <span className="text-[10px] text-indigo-400 font-semibold uppercase">
                          {region?.name || 'CENTRAL'}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        Raio: {point.radiusMeters}m
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2">{point.address}</p>

                    {point.scheduledDate && (
                      <div className="bg-slate-950 p-2 rounded-lg text-[10px] text-indigo-300 border border-slate-800 flex justify-between font-mono">
                        <span>📅 {point.scheduledDate}</span>
                        <span>⏰ {point.startTime || '08:00'} - {point.endTime || '18:00'}</span>
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                      <span>LAT: {point.latitude.toFixed(4)}</span>
                      <div className="flex items-center gap-2 font-sans font-semibold">
                        {onDeleteActionPoint && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm(`Deseja realmente excluir o ponto "${point.name}"?`)) {
                                onDeleteActionPoint(point.id);
                              }
                            }}
                            className="p-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-all text-xs flex items-center gap-1"
                            title="Excluir ponto"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <span className="text-indigo-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                          Editar <ChevronRight className="w-3 h-3 inline" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* MODO 2: LISTA (TABLE) */}
          {viewMode === 'list' && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px]">
                  <tr>
                    <th className="p-3">Nome do Ponto</th>
                    <th className="p-3">Base / Zona</th>
                    <th className="p-3">Endereço</th>
                    <th className="p-3">Raio</th>
                    <th className="p-3">Horário</th>
                    <th className="p-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredPoints.map((point) => {
                    const region = regions.find((r) => r.id === point.regionId);
                    return (
                      <tr key={point.id} onClick={() => handleOpenEditPoint(point)} className="hover:bg-slate-800/40 cursor-pointer">
                        <td className="p-3 font-bold text-white">{point.name}</td>
                        <td className="p-3 font-semibold text-indigo-400">{region?.name || 'CENTRAL'}</td>
                        <td className="p-3 text-slate-400">{point.address}</td>
                        <td className="p-3 font-mono text-emerald-400">{point.radiusMeters}m</td>
                        <td className="p-3 font-mono">{point.startTime || '08:00'} - {point.endTime || '18:00'}</td>
                        <td className="p-3 text-right">
                          <span className="text-indigo-400 font-semibold hover:underline">Editar →</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* MODO 3: POR BASE (GROUPED) */}
          {viewMode === 'grouped' && (
            <div className="space-y-6">
              {regions.map((reg) => {
                const pointsInRegion = filteredPoints.filter((p) => p.regionId === reg.id || p.name.includes(reg.name));
                if (pointsInRegion.length === 0) return null;
                return (
                  <div key={reg.id} className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: reg.color || '#6366f1' }}></span>
                        <h4 className="font-extrabold text-sm text-white">Base: {reg.name}</h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                          {pointsInRegion.length} Pontos
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {pointsInRegion.map((point) => (
                        <div
                          key={point.id}
                          onClick={() => handleOpenEditPoint(point)}
                          className="bg-slate-900 border border-slate-800 hover:border-indigo-500/40 p-3 rounded-xl space-y-2 cursor-pointer transition-all"
                        >
                          <div className="flex justify-between items-center">
                            <h5 className="font-bold text-xs text-white">{point.name}</h5>
                            <span className="text-[10px] text-emerald-400 font-mono">{point.radiusMeters}m</span>
                          </div>
                          <p className="text-[11px] text-slate-400 line-clamp-1">{point.address}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ABA 2: EQUIPES E RESPONSÁVEIS */}
      {activeTab === 'teams' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-400" />
              <span>Equipes de Campo Cadastradas ({filteredTeams.length})</span>
            </h3>
            <button
              onClick={handleOpenNewTeam}
              className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-lg shadow-purple-600/30 flex items-center space-x-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Equipe</span>
            </button>
          </div>

          {/* MODO 1: GRADE (GRID) */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTeams.map((team) => {
                const region = regions.find((r) => r.id === team.regionId);
                const assignedPoints = actionPoints.filter((p) => team.assignedPointIds.includes(p.id));

                return (
                  <div
                    key={team.id}
                    onClick={() => handleOpenEditTeam(team)}
                    className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4 shadow-md hover:border-purple-500/40 transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-base text-white">{team.name}</h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30">
                            {region?.name || 'CENTRAL'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Coordenador: <strong className="text-slate-200">{team.coordinatorName}</strong>
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEditTeam(team)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-purple-500/20 text-slate-300 hover:text-purple-300 border border-slate-700 transition-all text-xs flex items-center gap-1"
                          title="Editar equipe e membros"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Editar</span>
                        </button>
                        {onDeleteTeam && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm(`Deseja realmente excluir a equipe "${team.name}"?`)) {
                                onDeleteTeam(team.id);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-all text-xs flex items-center gap-1"
                            title="Excluir equipe"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Integrantes e Responsáveis */}
                    <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                      <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-purple-400" />
                        <span>Integrantes da Equipe ({team.members.length})</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {team.members.map((m) => (
                          <div
                            key={m.id}
                            className="bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-slate-800 text-xs flex items-center justify-between"
                          >
                            <div>
                              <span className="font-semibold text-slate-200 block text-xs">{m.name}</span>
                              <span className="text-[10px] text-purple-400 font-medium">{m.role}</span>
                            </div>
                            {m.phone && (
                              <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                                <Phone className="w-3 h-3 text-slate-500" />
                                {m.phone}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pontos de Atuação */}
                    {assignedPoints.length > 0 && (
                      <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Pontos Atribuídos ({assignedPoints.length})</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {assignedPoints.map((p) => (
                            <span key={p.id} className="text-[10px] px-2 py-1 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                              {p.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          )}

          {/* MODO 2: LISTA (TABLE) */}
          {viewMode === 'list' && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px]">
                  <tr>
                    <th className="p-3">Equipe</th>
                    <th className="p-3">Base / Zona</th>
                    <th className="p-3">Coordenador</th>
                    <th className="p-3">Agentes</th>
                    <th className="p-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredTeams.map((t) => {
                    const region = regions.find((r) => r.id === t.regionId);
                    return (
                      <tr key={t.id} onClick={() => handleOpenEditTeam(t)} className="hover:bg-slate-800/40 cursor-pointer">
                        <td className="p-3 font-bold text-white">{t.name}</td>
                        <td className="p-3 font-semibold text-purple-400">{region?.name || 'CENTRAL'}</td>
                        <td className="p-3 text-slate-200">{t.coordinatorName}</td>
                        <td className="p-3 text-slate-400">{t.members.length} Agentes</td>
                        <td className="p-3 text-right">
                          <span className="text-purple-400 font-semibold hover:underline">Editar →</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* MODO 3: POR BASE (GROUPED) */}
          {viewMode === 'grouped' && (
            <div className="space-y-6">
              {regions.map((reg) => {
                const teamsInRegion = filteredTeams.filter((t) => t.regionId === reg.id || t.name.includes(reg.name));
                if (teamsInRegion.length === 0) return null;
                return (
                  <div key={reg.id} className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: reg.color || '#a855f7' }}></span>
                        <h4 className="font-extrabold text-sm text-white">Base: {reg.name}</h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30">
                          {teamsInRegion.length} Equipes
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {teamsInRegion.map((team) => (
                        <div
                          key={team.id}
                          onClick={() => handleOpenEditTeam(team)}
                          className="bg-slate-900 border border-slate-800 hover:border-purple-500/40 p-3.5 rounded-xl space-y-2 cursor-pointer transition-all"
                        >
                          <div className="flex justify-between items-center">
                            <h5 className="font-bold text-xs text-white">{team.name}</h5>
                            <span className="text-[10px] text-purple-300">{team.members.length} Agentes</span>
                          </div>
                          <p className="text-[11px] text-slate-400">Coord: <strong className="text-slate-200">{team.coordinatorName}</strong></p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ABA 3: COORDENADORES & USUÁRIOS */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
            {/* Sub-Abas: Coordenadores vs Usuários */}
            <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
              <button
                onClick={() => setUserSubTab('coordenadores')}
                className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                  userSubTab === 'coordenadores'
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>Coordenadores ({coordinators.length})</span>
              </button>
              <button
                onClick={() => setUserSubTab('usuarios')}
                className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                  userSubTab === 'usuarios'
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Demais Usuários ({otherUsers.length})</span>
              </button>
            </div>

            <button
              onClick={handleOpenNewUser}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-600/30 flex items-center space-x-1.5 transition-all self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Usuário</span>
            </button>
          </div>

          <div className="flex justify-between items-center px-1">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {userSubTab === 'coordenadores'
                ? `Coordenadores Responsáveis por Zona (${coordinators.filter(u => (regionFilter === 'ALL' || u.regionId === regionFilter) && (!searchTerm || u.name.toLowerCase().includes(searchTerm.toLowerCase()))).length})`
                : `Demais Usuários & Perfis do Sistema (${otherUsers.filter(u => (regionFilter === 'ALL' || u.regionId === regionFilter) && (!searchTerm || u.name.toLowerCase().includes(searchTerm.toLowerCase()))).length})`}
            </h3>
          </div>

          {/* MODO 1: GRADE (GRID) */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(userSubTab === 'coordenadores' ? coordinators : otherUsers)
                .filter((u) => (regionFilter === 'ALL' || u.regionId === regionFilter) && (!searchTerm || u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || u.email?.toLowerCase().includes(searchTerm.toLowerCase())))
                .map((u) => (
                <div
                  key={u.id}
                  onClick={() => handleOpenEditUser(u)}
                  className="bg-slate-900/90 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/40 p-4 rounded-xl space-y-3 shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-xs">
                        {(u.name || 'US').substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-white group-hover:text-emerald-300 transition-colors">
                          {u.name || 'Usuário Sem Nome'}
                        </h4>
                        <span className="text-[10px] text-slate-400 block">{u.email || u.phone || 'Sem e-mail'}</span>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                      u.role === 'admin'
                        ? 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                        : u.role === 'coordenador'
                        ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                        : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'
                    }`}>
                      {u.role === 'admin' ? 'Super Admin' : u.role === 'coordenador' ? 'Coordenador' : 'Agente de Campo'}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                    <span>
                      {u.role === 'coordenador'
                        ? `Zona: ${u.regionName || 'Geral'}`
                        : u.role === 'campo'
                        ? `Equipe: ${u.teamName || 'Geral'}`
                        : `Perfil: ${u.regionName || 'Geral'}`}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Deseja realmente excluir o usuário "${u.name}"?`)) {
                            handleDeleteUser(u.id);
                          }
                        }}
                        className="p-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-all text-xs flex items-center gap-1"
                        title="Excluir usuário"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-emerald-400 font-semibold">Editar →</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* MODO 2: LISTA (TABLE) */}
          {viewMode === 'list' && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px]">
                  <tr>
                    <th className="p-3">Nome do Usuário</th>
                    <th className="p-3">Perfil / Cargo</th>
                    <th className="p-3">Base / Zona</th>
                    <th className="p-3">Contato</th>
                    <th className="p-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {(userSubTab === 'coordenadores' ? coordinators : otherUsers)
                    .filter((u) => (regionFilter === 'ALL' || u.regionId === regionFilter) && (!searchTerm || u.name?.toLowerCase().includes(searchTerm.toLowerCase())))
                    .map((u) => (
                    <tr key={u.id} onClick={() => handleOpenEditUser(u)} className="hover:bg-slate-800/40 cursor-pointer">
                      <td className="p-3 font-bold text-white">{u.name}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3 text-slate-300">{u.regionName || 'Geral'}</td>
                      <td className="p-3 text-slate-400">{u.phone || u.email || '—'}</td>
                      <td className="p-3 text-right">
                        <span className="text-emerald-400 font-semibold hover:underline">Editar →</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* MODO 3: POR BASE (GROUPED) */}
          {viewMode === 'grouped' && (
            <div className="space-y-6">
              {regions.map((reg) => {
                const usersInRegion = (userSubTab === 'coordenadores' ? coordinators : otherUsers).filter((u) => u.regionId === reg.id || u.regionName === reg.name);
                if (usersInRegion.length === 0) return null;
                return (
                  <div key={reg.id} className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: reg.color || '#10b981' }}></span>
                        <h4 className="font-extrabold text-sm text-white">Base: {reg.name}</h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                          {usersInRegion.length} Registros
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {usersInRegion.map((u) => (
                        <div
                          key={u.id}
                          onClick={() => handleOpenEditUser(u)}
                          className="bg-slate-900 border border-slate-800 hover:border-emerald-500/40 p-3.5 rounded-xl space-y-2 cursor-pointer transition-all"
                        >
                          <div className="flex justify-between items-center">
                            <h5 className="font-bold text-xs text-white">{u.name}</h5>
                            <span className="text-[10px] text-emerald-400 font-mono">{u.role}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 line-clamp-1">{u.email || u.phone || 'Sem e-mail'}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ABA 4: BASES / ZONAS */}
      {activeTab === 'regions' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Bases & Zonas Geográficas ({regions.length})
            </h3>
            <button
              onClick={handleOpenNewRegion}
              className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-lg shadow-amber-600/30 flex items-center space-x-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Base / Zona</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {regions.map((reg) => (
              <div
                key={reg.id}
                onClick={() => handleOpenEditRegion(reg)}
                className="bg-slate-900/90 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/40 p-4 rounded-xl space-y-3 shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0"
                      style={{ backgroundColor: reg.color || '#6366f1' }}
                    ></span>
                    <h4 className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors">
                      {reg.name}
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
                    Base Ativa
                  </span>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2">{reg.description || 'Bairros de abrangência'}</p>

                <div className="pt-2 border-t border-slate-800 text-[11px] font-semibold flex items-center justify-between">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Deseja realmente excluir a base/zona "${reg.name}"?`)) {
                        handleDeleteRegion(reg.id);
                      }
                    }}
                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-all text-xs flex items-center gap-1"
                    title="Excluir Base / Zona"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Excluir</span>
                  </button>
                  <span className="text-amber-400">Editar Base →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ABA 5: DADOS DA CAMPANHA */}
      {activeTab === 'campaign' && campaign && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-extrabold text-white">Configurações Gerais da Campanha</h3>
              <p className="text-xs text-slate-400">Informações oficiais exibidas nos relatórios, mapas e comprovantes</p>
            </div>
            {onUpdateCampaign && (
              <button
                onClick={() => setShowCampaignModal(true)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-lg shadow-indigo-600/30 flex items-center space-x-1.5 transition-all cursor-pointer"
              >
                <Edit3 className="w-4 h-4" />
                <span>Editar Dados da Campanha</span>
              </button>
            )}
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Nome Oficial da Campanha</span>
                <div className="text-base font-extrabold text-white">{campaign.name}</div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Candidato / Identificador</span>
                <div className="text-base font-extrabold text-indigo-300">{campaign.candidateName || 'Não especificado'}</div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Cidade / Estado</span>
                <div className="text-sm font-bold text-slate-200">{campaign.cityState || 'Não especificado'}</div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Status Operacional</span>
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase">
                    {campaign.status}
                  </span>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1 md:col-span-2">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Período de Execução</span>
                <div className="text-xs font-mono text-slate-300">
                  {campaign.startDate} a {campaign.endDate}
                </div>
              </div>

              {campaign.description && (
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1 md:col-span-2">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Descrição da Operação</span>
                  <div className="text-xs text-slate-300 leading-relaxed">{campaign.description}</div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* Modal de Ponto de Atuação (Criar / Editar) */}
      {showPointModal && (
        <ActionPointModal
          actionPoint={editingPoint}
          regions={regions}
          teams={teams}
          users={users}
          currentUser={currentUser}
          onClose={() => setShowPointModal(false)}
          onSave={handleSavePoint}
          onDelete={onDeleteActionPoint}
        />
      )}

      {/* Modal de Equipe (Criar / Editar) */}
      {showTeamModal && (
        <TeamModal
          team={editingTeam}
          regions={regions}
          actionPoints={actionPoints}
          users={users}
          onClose={() => setShowTeamModal(false)}
          onSave={handleSaveTeam}
          onDelete={onDeleteTeam}
        />
      )}

      {/* Modal de Base / Zona (Criar / Editar) */}
      {showRegionModal && (
        <RegionModal
          region={editingRegion}
          onClose={() => setShowRegionModal(false)}
          onSave={handleSaveRegion}
          onDelete={handleDeleteRegion}
        />
      )}

      {/* Modal de Coordenador / Usuário (Criar / Editar) */}
      {showUserModal && (
        <UserModal
          user={editingUser}
          regions={regions}
          teams={teams}
          onClose={() => setShowUserModal(false)}
          onSave={handleSaveUser}
          onDelete={handleDeleteUser}
        />
      )}

      {/* Modal de Campanha (Editar) */}
      {showCampaignModal && campaign && onUpdateCampaign && (
        <CampaignModal
          campaign={campaign}
          onClose={() => setShowCampaignModal(false)}
          onSave={onUpdateCampaign}
        />
      )}

    </div>
  );
};

