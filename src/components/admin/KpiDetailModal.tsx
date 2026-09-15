import React, { useState } from 'react';
import { Team, ActionPoint, CheckIn, OperationalMetrics, CheckInStatus, Region } from '../../types';
import { getImageUrl } from '../../services/imageService';
import {
  X,
  Users,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Clock,
  Shield,
  Camera,
  Eye,
  ChevronRight,
  XCircle,
  LayoutGrid,
  List,
  Layers,
  Search,
  Filter,
  Building2,
  User as UserIcon
} from 'lucide-react';
import { format } from 'date-fns';

export type KpiModalType = 'teams' | 'validated' | 'pending' | 'points' | null;

interface KpiDetailModalProps {
  type: KpiModalType;
  metrics: OperationalMetrics;
  teams: Team[];
  actionPoints: ActionPoint[];
  regions?: Region[];
  checkIns: CheckIn[];
  selectedDate?: string;
  onClose: () => void;
  onNavigateToAudit?: () => void;
  onAuditDecision?: (checkInId: string, newStatus: CheckInStatus, reason: string) => void;
}

export const KpiDetailModal: React.FC<KpiDetailModalProps> = ({
  type,
  metrics,
  teams,
  actionPoints,
  regions = [],
  checkIns,
  selectedDate,
  onClose,
  onNavigateToAudit,
  onAuditDecision
}) => {
  const [selectedCheckIn, setSelectedCheckIn] = useState<CheckIn | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<ActionPoint | null>(null);

  // Controle de Filtros e Modos de Visualização das Equipes
  const [teamViewMode, setTeamViewMode] = useState<'grid' | 'list' | 'grouped'>('grid');
  const [teamSearchTerm, setTeamSearchTerm] = useState<string>('');
  const [teamRegionFilter, setTeamRegionFilter] = useState<string>('ALL');
  const [teamStatusFilter, setTeamStatusFilter] = useState<string>('ALL');

  if (!type) return null;

  const validatedCheckIns = checkIns.filter((c) => c.status === 'validado');
  const pendingCheckIns = checkIns.filter((c) => c.status === 'pendente_analise');

  // Identifica atividade da equipe estritamente na data selecionada (somente do dia)
  const getTeamActivityOnDate = (team: Team) => {
    const teamCheckInsOnDate = checkIns.filter((c) => {
      const matchDate = !selectedDate || c.timestamp.startsWith(selectedDate);
      const matchTeam =
        c.teamId === team.id ||
        (c.teamName && team.name && c.teamName.toLowerCase().trim() === team.name.toLowerCase().trim()) ||
        c.coordinatorId === team.coordinatorId;
      return matchDate && matchTeam;
    });

    return {
      isActive: teamCheckInsOnDate.length > 0,
      count: teamCheckInsOnDate.length,
      checkIns: teamCheckInsOnDate
    };
  };

  const activeTeamsCount = teams.filter((t) => getTeamActivityOnDate(t).isActive).length;

  // Manipulador de clique em Equipe
  const handleTeamClick = (team: Team) => {
    const activity = getTeamActivityOnDate(team);
    if (activity.checkIns.length > 0) {
      setSelectedCheckIn(activity.checkIns[0]);
    } else {
      setSelectedTeam(team);
    }
  };

  // Manipulador de clique em Ponto de Atuação
  const handlePointClick = (point: ActionPoint) => {
    const pointChk = checkIns.find(
      (c) =>
        c.actionPointId === point.id ||
        c.pointName?.toLowerCase().trim() === point.name?.toLowerCase().trim() ||
        (point.name && c.pointName && (point.name.toLowerCase().includes(c.pointName.toLowerCase()) || c.pointName.toLowerCase().includes(point.name.toLowerCase()))) ||
        (point.assignedTeamId && c.teamId === point.assignedTeamId)
    );

    if (pointChk) {
      setSelectedCheckIn(pointChk);
    } else {
      setSelectedPoint(point);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn font-['Inter',sans-serif]">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-5 max-h-[88vh] flex flex-col relative">
        
        {/* Cabeçalho do Modal Principal */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 shrink-0">
          <div className="flex items-center gap-2.5">
            {type === 'teams' && (
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Users className="w-4 h-4" />
              </div>
            )}
            {type === 'validated' && (
              <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            )}
            {type === 'pending' && (
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <AlertTriangle className="w-4 h-4" />
              </div>
            )}
            {type === 'points' && (
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <MapPin className="w-4 h-4" />
              </div>
            )}

            <div>
              <h2 className="text-base font-bold text-white">
                {type === 'teams' && `Equipes Cadastradas & Ativas Hoje (${activeTeamsCount}/${teams.length})`}
                {type === 'validated' && `Check-ins Validados & Auditados (${validatedCheckIns.length})`}
                {type === 'pending' && `Check-ins em Análise de Auditoria (${pendingCheckIns.length})`}
                {type === 'points' && `Cobertura dos Pontos de Ação (${metrics.pointsAttended}/${actionPoints.length})`}
              </h2>
              <p className="text-[11px] text-slate-400">
                💡 Clique em qualquer item para detalhes
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-all text-xs"
            title="Fechar Modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Conteúdo Dinâmico com Cards Clicáveis */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
          
          {/* TIPO 1: EQUIPES ATIVAS & CADASTRADAS */}
          {type === 'teams' && (
            <div className="space-y-4">
              {/* Barra de Filtros e Modos de Exibição */}
              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  
                  {/* Busca por Nome / Coordenador / Base */}
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Buscar por equipe, coordenador ou base..."
                      value={teamSearchTerm}
                      onChange={(e) => setTeamSearchTerm(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:ring-1 focus:ring-emerald-500 focus:outline-none placeholder:text-slate-500"
                    />
                  </div>

                  {/* Seleção de Modo de Exibição: Grade, Lista, Grupo por Base */}
                  <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-800">
                    <button
                      type="button"
                      onClick={() => setTeamViewMode('grid')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1.5 transition-all ${
                        teamViewMode === 'grid'
                          ? 'bg-emerald-600 text-white shadow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                      title="Exibir em Grade"
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Grade</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTeamViewMode('list')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1.5 transition-all ${
                        teamViewMode === 'list'
                          ? 'bg-emerald-600 text-white shadow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                      title="Exibir em Lista"
                    >
                      <List className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Lista</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTeamViewMode('grouped')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1.5 transition-all ${
                        teamViewMode === 'grouped'
                          ? 'bg-emerald-600 text-white shadow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                      title="Exibir em Grupo por Base"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Por Base</span>
                    </button>
                  </div>

                </div>

                {/* Filtros por Base e por Status no Dia */}
                <div className="flex flex-wrap items-center gap-3 text-xs pt-1 border-t border-slate-800/80">
                  <div className="flex items-center gap-1 text-slate-400">
                    <Filter className="w-3 h-3 text-emerald-400" />
                    <span>Filtros:</span>
                  </div>

                  <div>
                    <select
                      value={teamRegionFilter}
                      onChange={(e) => setTeamRegionFilter(e.target.value)}
                      className="bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1 text-[11px] focus:ring-1 focus:ring-emerald-500 focus:outline-none cursor-pointer"
                    >
                      <option value="ALL">Todas as Bases ({regions.length})</option>
                      {regions.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <select
                      value={teamStatusFilter}
                      onChange={(e) => setTeamStatusFilter(e.target.value)}
                      className="bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1 text-[11px] focus:ring-1 focus:ring-emerald-500 focus:outline-none cursor-pointer"
                    >
                      <option value="ALL">Status no dia (Todas)</option>
                      <option value="ACTIVE_TODAY">🟢 Ativas Hoje ({activeTeamsCount})</option>
                      <option value="INACTIVE_TODAY">⚪ Sem Check-in Hoje ({teams.length - activeTeamsCount})</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Lógica de Filtragem das Equipes */}
              {(() => {
                const filteredTeamsList = teams.filter((team) => {
                  const activity = getTeamActivityOnDate(team);
                  const baseName = regions.find((r) => r.id === team.regionId)?.name || team.regionName || '';

                  // Filtro por Busca de Texto
                  const matchesSearch =
                    !teamSearchTerm ||
                    team.name.toLowerCase().includes(teamSearchTerm.toLowerCase()) ||
                    (team.coordinatorName && team.coordinatorName.toLowerCase().includes(teamSearchTerm.toLowerCase())) ||
                    baseName.toLowerCase().includes(teamSearchTerm.toLowerCase());

                  // Filtro por Base / Região
                  const matchesRegion =
                    teamRegionFilter === 'ALL' || team.regionId === teamRegionFilter;

                  // Filtro por Status no Dia
                  const matchesStatus =
                    teamStatusFilter === 'ALL' ||
                    (teamStatusFilter === 'ACTIVE_TODAY' && activity.isActive) ||
                    (teamStatusFilter === 'INACTIVE_TODAY' && !activity.isActive);

                  return matchesSearch && matchesRegion && matchesStatus;
                });

                if (filteredTeamsList.length === 0) {
                  return (
                    <div className="text-center py-8 text-slate-500 space-y-2 bg-slate-950/40 rounded-xl border border-slate-800">
                      <Users className="w-8 h-8 text-slate-600 mx-auto" />
                      <p>Nenhuma equipe encontrada com os filtros selecionados.</p>
                    </div>
                  );
                }

                {/* Renderização individual do Card da Equipe */}
                const renderTeamCard = (team: Team) => {
                  const activity = getTeamActivityOnDate(team);
                  const baseName = regions.find((r) => r.id === team.regionId)?.name || team.regionName || 'Base Não Definida';

                  return (
                    <div
                      key={team.id}
                      onClick={() => handleTeamClick(team)}
                      className={`bg-slate-950/70 hover:bg-slate-950 border rounded-xl p-3.5 space-y-2.5 cursor-pointer transition-all group shadow-md ${
                        activity.isActive
                          ? 'border-emerald-500/40 hover:border-emerald-400 bg-emerald-950/10'
                          : 'border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {/* Top Header: Nome da Equipe e Badge de Atividade do Dia */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-bold text-white text-sm group-hover:text-emerald-300 transition-colors flex items-center gap-1.5">
                            <span>{team.name}</span>
                            <Eye className="w-3.5 h-3.5 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </h3>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase border shrink-0 ${
                            activity.isActive
                              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                              : 'bg-slate-800/80 text-slate-400 border-slate-700'
                          }`}
                        >
                          {activity.isActive ? `🟢 ATIVA HOJE (${activity.count})` : '⚪ SEM CHECK-IN HOJE'}
                        </span>
                      </div>

                      {/* Exibição Obrigatória do Nome da Base e do Coordenador */}
                      <div className="grid grid-cols-2 gap-2 text-xs bg-slate-900/90 p-2 rounded-lg border border-slate-800">
                        <div className="flex items-center space-x-1.5 text-slate-300">
                          <Building2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                          <div className="truncate">
                            <span className="text-[9px] text-slate-500 uppercase block leading-none">Base / Zona</span>
                            <span className="font-semibold text-slate-200 text-[11px] truncate block">{baseName}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-1.5 text-slate-300">
                          <UserIcon className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <div className="truncate">
                            <span className="text-[9px] text-slate-500 uppercase block leading-none">Coordenador</span>
                            <span className="font-semibold text-slate-200 text-[11px] truncate block">{team.coordinatorName || 'Não atribuído'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Integrantes e Rodapé com Ação */}
                      <div className="pt-1 flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-1 text-slate-400">
                          <Users className="w-3 h-3 text-slate-500" />
                          <span>{team.members.length} integrante(s)</span>
                          {team.assignedPointIds && team.assignedPointIds.length > 0 && (
                            <span className="text-slate-500">• {team.assignedPointIds.length} ponto(s)</span>
                          )}
                        </div>
                        <span className="text-[10px] font-bold text-emerald-400 opacity-80 group-hover:opacity-100 flex items-center gap-1 shrink-0">
                          <span>Ver detalhes</span>
                          <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  );
                };

                {/* VISUALIZADOR 1: GRADE (GRID) */}
                if (teamViewMode === 'grid') {
                  return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {filteredTeamsList.map(renderTeamCard)}
                    </div>
                  );
                }

                {/* VISUALIZADOR 2: LISTA (LIST) */}
                if (teamViewMode === 'list') {
                  return (
                    <div className="space-y-2">
                      {filteredTeamsList.map(renderTeamCard)}
                    </div>
                  );
                }

                {/* VISUALIZADOR 3: GRUPO POR BASE (GROUPED) */}
                if (teamViewMode === 'grouped') {
                  const groupedMap = new Map<string, { baseName: string; teams: Team[] }>();
                  filteredTeamsList.forEach((t) => {
                    const bName = regions.find((r) => r.id === t.regionId)?.name || t.regionName || 'Bases Diversas';
                    if (!groupedMap.has(bName)) {
                      groupedMap.set(bName, { baseName: bName, teams: [] });
                    }
                    groupedMap.get(bName)!.teams.push(t);
                  });

                  return (
                    <div className="space-y-4">
                      {Array.from(groupedMap.values()).map((group) => {
                        const activeInGroup = group.teams.filter((t) => getTeamActivityOnDate(t).isActive).length;
                        return (
                          <div key={group.baseName} className="bg-slate-950/40 p-3 rounded-xl border border-slate-800/80 space-y-2.5">
                            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                              <div className="flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-indigo-400" />
                                <h4 className="font-extrabold text-white text-xs">{group.baseName}</h4>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                                  {group.teams.length} equipe(s)
                                </span>
                              </div>
                              <span className="text-[10px] text-emerald-400 font-semibold">
                                {activeInGroup} ativas hoje
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {group.teams.map(renderTeamCard)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                }
              })()}
            </div>
          )}

          {/* TIPO 2: CHECK-INS VALIDADOS */}
          {type === 'validated' && (
            <div className="space-y-2.5">
              {validatedCheckIns.length === 0 ? (
                <div className="text-center py-8 text-slate-500 space-y-2">
                  <Clock className="w-8 h-8 text-slate-600 mx-auto" />
                  <p>Nenhum check-in validado até o momento.</p>
                </div>
              ) : (
                validatedCheckIns.map((chk) => (
                  <div
                    key={chk.id}
                    onClick={() => setSelectedCheckIn(chk)}
                    className="bg-slate-950/70 hover:bg-slate-950 border border-slate-800 hover:border-indigo-500/50 rounded-xl p-3.5 flex flex-col sm:flex-row gap-3 items-start cursor-pointer transition-all group shadow-md"
                  >
                    {(chk.imageWatermarkUrl || chk.imageUrl) ? (
                      <div className="relative w-full sm:w-28 h-20 rounded-lg overflow-hidden border border-slate-800 shrink-0 bg-slate-900">
                        <img
                          src={getImageUrl(chk.imageWatermarkUrl || chk.imageUrl)}
                          alt="Evidência"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                          <Camera className="w-4 h-4" />
                        </div>
                      </div>
                    ) : (
                      <div className="w-full sm:w-28 h-20 rounded-lg border border-slate-800 shrink-0 bg-slate-900 flex items-center justify-center text-slate-600 text-[10px]">
                        Sem Foto
                      </div>
                    )}
                    <div className="flex-1 space-y-1 w-full">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-white text-sm group-hover:text-indigo-300 transition-colors">{chk.pointName}</h3>
                        <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                          {chk.distanceCalculatedMeters}m do ponto (OK)
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300">{chk.teamName} • {chk.coordinatorName}</p>
                      {chk.notes && <p className="text-[11px] text-slate-400 italic">"{chk.notes}"</p>}
                      <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-indigo-400" />
                          <span>{format(new Date(chk.timestamp), 'dd/MM/yyyy HH:mm')}</span>
                        </span>
                        <span className="text-indigo-400 font-semibold group-hover:underline flex items-center gap-0.5">
                          <span>Ampliar foto</span>
                          <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TIPO 3: PENDENTES DE AUDITORIA */}
          {type === 'pending' && (
            <div className="space-y-3">
              {pendingCheckIns.length === 0 ? (
                <div className="text-center py-8 text-slate-500 space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                  <p>Todos os check-ins do dia foram auditados com sucesso!</p>
                </div>
              ) : (
                pendingCheckIns.map((chk) => (
                  <div
                    key={chk.id}
                    onClick={() => setSelectedCheckIn(chk)}
                    className="bg-slate-950/70 hover:bg-slate-950 border border-amber-500/30 hover:border-amber-500 rounded-xl p-3.5 space-y-2 cursor-pointer transition-all group shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-white text-sm group-hover:text-amber-300 transition-colors">{chk.pointName}</h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                        Aguardando Auditoria
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300">{chk.teamName} • Distância: {chk.distanceCalculatedMeters}m</p>
                    {chk.notes && <p className="text-[11px] text-slate-400 italic">"{chk.notes}"</p>}
                    <div className="flex items-center justify-between text-[10px] pt-1 text-slate-500">
                      <span>Horário: {format(new Date(chk.timestamp), 'HH:mm:ss')}</span>
                      <span className="text-amber-400 font-bold group-hover:underline flex items-center gap-0.5">
                        <span>Auditar agora</span>
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))
              )}

              {onNavigateToAudit && pendingCheckIns.length > 0 && (
                <button
                  onClick={() => {
                    onClose();
                    onNavigateToAudit();
                  }}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center justify-center gap-2 transition-all shadow"
                >
                  <Shield className="w-4 h-4" />
                  <span>Ir para Central de Auditoria Completa</span>
                </button>
              )}
            </div>
          )}

          {/* TIPO 4: PONTOS DE ATUAÇÃO */}
          {type === 'points' && (
            <div className="space-y-2.5">
              {actionPoints.map((point) => {
                const attendedCheckIn = checkIns.find(
                  (c) =>
                    c.actionPointId === point.id ||
                    c.pointName?.toLowerCase().trim() === point.name?.toLowerCase().trim() ||
                    (point.name && c.pointName && (point.name.toLowerCase().includes(c.pointName.toLowerCase()) || c.pointName.toLowerCase().includes(point.name.toLowerCase()))) ||
                    (point.assignedTeamId && c.teamId === point.assignedTeamId)
                );

                return (
                  <div
                    key={point.id}
                    onClick={() => handlePointClick(point)}
                    className={`bg-slate-950/70 hover:bg-slate-950 border rounded-xl p-3.5 space-y-2 cursor-pointer transition-all group shadow-md ${
                      attendedCheckIn
                        ? 'border-emerald-500/50 hover:border-emerald-400 bg-emerald-950/10'
                        : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-white text-xs group-hover:text-emerald-300 transition-colors flex items-center gap-1.5">
                          <span>{point.name}</span>
                          {attendedCheckIn && <Camera className="w-3.5 h-3.5 text-emerald-400" />}
                        </h3>
                        <p className="text-[11px] text-slate-400">{point.address}</p>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase border flex items-center gap-1 ${
                          attendedCheckIn
                            ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        {attendedCheckIn ? '🟢 ATENDIDO HOJE' : '⚪ PENDENTE'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1.5 border-t border-slate-800/80">
                      <span>Raio: {point.radiusMeters}m • Agenda: {point.startTime || '08:00'} - {point.endTime || '18:00'}</span>
                      {attendedCheckIn ? (
                        <span className="text-emerald-400 font-bold group-hover:underline flex items-center gap-0.5">
                          <span>📸 Ver Evidência Fotográfica</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      ) : (
                        <span className="text-slate-400 font-semibold group-hover:underline flex items-center gap-0.5">
                          <span>Ver Detalhes do Ponto</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>

      </div>

      {/* SUB-MODAL 1: VISUALIZADOR DE EVIDÊNCIA FOTOGRÁFICA / CHECK-IN SELECIONADO */}
      {selectedCheckIn && (
        <div className="fixed inset-0 z-[60] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block">Inspeção da Evidência</span>
                <h3 className="text-base font-extrabold text-white">{selectedCheckIn.pointName}</h3>
              </div>
              <button
                onClick={() => setSelectedCheckIn(null)}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-all text-xs"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Foto da Evidência com Marca d'água */}
            {(selectedCheckIn.imageWatermarkUrl || selectedCheckIn.imageUrl) ? (
              <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-slate-950">
                <img
                  src={getImageUrl(selectedCheckIn.imageWatermarkUrl || selectedCheckIn.imageUrl)}
                  alt="Evidência Fotográfica Georreferenciada"
                  className="w-full max-h-80 object-contain mx-auto"
                />
                <div className="absolute bottom-2 right-2 bg-slate-950/80 text-[10px] text-emerald-400 font-bold px-2.5 py-1 rounded border border-slate-800">
                  ✓ Evidência Georreferenciada
                </div>
              </div>
            ) : (
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-center text-xs text-slate-400">
                Nenhuma foto registrada para este check-in.
              </div>
            )}

            {/* Se houver múltiplas evidências no mesmo ponto */}
            {(() => {
              const pointCheckIns = checkIns.filter(
                (c) => c.actionPointId === selectedCheckIn.actionPointId || 
                (c.pointName && selectedCheckIn.pointName && c.pointName.toLowerCase().trim() === selectedCheckIn.pointName.toLowerCase().trim())
              );
              if (pointCheckIns.length > 1) {
                return (
                  <div className="bg-indigo-950/50 border border-indigo-500/30 p-2.5 rounded-xl space-y-2 mt-2">
                    <div className="flex items-center justify-between text-xs font-bold text-indigo-300">
                      <span>📸 Evidências Registradas ({pointCheckIns.length})</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {pointCheckIns.findIndex((c) => c.id === selectedCheckIn.id) + 1} / {pointCheckIns.length}
                      </span>
                    </div>

                    <div className="flex gap-1.5 overflow-x-auto pb-1">
                      {pointCheckIns.map((chk, idx) => (
                        <button
                          key={chk.id}
                          onClick={() => setSelectedCheckIn(chk)}
                          className={`text-[10px] px-2.5 py-1.5 rounded-lg border font-semibold flex items-center gap-1 shrink-0 ${
                            chk.id === selectedCheckIn.id
                              ? 'bg-indigo-600 text-white border-indigo-400 shadow'
                              : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500'
                          }`}
                        >
                          <span>Evidência #{idx + 1}</span>
                          <span className="text-[9px] opacity-75">({format(new Date(chk.timestamp), 'HH:mm')})</span>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              }
              return null;
            })()}

            {/* Metadados e Precisão GPS */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-0.5">
                <span className="text-slate-400 block text-[10px] uppercase">Equipe Responsável</span>
                <span className="text-white font-bold text-sm">{selectedCheckIn.teamName}</span>
                <span className="text-[11px] text-slate-400 block">Coord.: {selectedCheckIn.coordinatorName}</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-0.5">
                <span className="text-slate-400 block text-[10px] uppercase">Status & Auditoria</span>
                <span className={`font-extrabold text-sm block uppercase ${
                  selectedCheckIn.status === 'validado' ? 'text-emerald-400' : selectedCheckIn.status === 'pendente_analise' ? 'text-amber-400' : 'text-rose-400'
                }`}>
                  {selectedCheckIn.status.replace('_', ' ')}
                </span>
                <span className="text-[10px] text-slate-400 block">Distância: {selectedCheckIn.distanceCalculatedMeters}m (Precisão: ±{selectedCheckIn.gpsAccuracyMeters}m)</span>
              </div>
            </div>

            {selectedCheckIn.notes && (
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                <span className="text-slate-400 block text-[10px] uppercase">Observações do Registro:</span>
                <p className="text-slate-200 italic">"{selectedCheckIn.notes}"</p>
              </div>
            )}

            {/* Botões de Ação de Auditoria no Modal (se pendente) */}
            {onAuditDecision && selectedCheckIn.status === 'pendente_analise' && (
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <span className="text-xs font-bold text-amber-400 block">Decisão de Auditoria Rápida:</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      onAuditDecision(selectedCheckIn.id, 'validado', 'Aprovado diretamente pelo modal de KPI.');
                      setSelectedCheckIn(null);
                    }}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2.5 rounded-xl transition-all shadow flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Aprovar Evidência</span>
                  </button>
                  <button
                    onClick={() => {
                      onAuditDecision(selectedCheckIn.id, 'rejeitado', 'Rejeitado diretamente pelo modal de KPI.');
                      setSelectedCheckIn(null);
                    }}
                    className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs py-2.5 rounded-xl transition-all shadow flex items-center justify-center gap-1.5"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Rejeitar Evidência</span>
                  </button>
                </div>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedCheckIn(null)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl text-xs font-bold transition-all"
              >
                Voltar à lista
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-MODAL 2: DETALHES DE EQUIPE SELECIONADA */}
      {selectedTeam && (
        <div className="fixed inset-0 z-[60] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">Ficha da Equipe</span>
                <h3 className="text-base font-extrabold text-white">{selectedTeam.name}</h3>
              </div>
              <button
                onClick={() => setSelectedTeam(null)}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-all text-xs"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Coordenador Responsável:</span>
                <span className="font-bold text-white">{selectedTeam.coordinatorName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Status Operacional:</span>
                <span className="font-bold text-emerald-400 uppercase">{selectedTeam.status}</span>
              </div>
              <div className="py-1">
                <span className="text-slate-400 block mb-1.5 font-semibold">Integrantes da Equipe ({selectedTeam.members.length}):</span>
                <div className="space-y-1.5">
                  {selectedTeam.members.map((m) => (
                    <div key={m.id} className="bg-slate-900 p-2 rounded-lg border border-slate-800 flex justify-between text-[11px]">
                      <span className="font-bold text-white">{m.name}</span>
                      <span className="text-slate-400">{m.role}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedTeam(null)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl text-xs font-bold transition-all"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-MODAL 3: DETALHES DE PONTO DE AÇÃO SELECIONADO */}
      {selectedPoint && (
        <div className="fixed inset-0 z-[60] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 block">Ponto de Ação</span>
                <h3 className="text-base font-extrabold text-white">{selectedPoint.name}</h3>
              </div>
              <button
                onClick={() => setSelectedPoint(null)}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-all text-xs"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] uppercase block">Endereço Registrado</span>
                <p className="text-white font-bold">{selectedPoint.address}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase block">Horário Previsto</span>
                  <span className="text-indigo-300 font-bold">{selectedPoint.startTime || '08:00'} - {selectedPoint.endTime || '18:00'}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase block">Raio do GPS</span>
                  <span className="text-purple-400 font-bold">{selectedPoint.radiusMeters} metros</span>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase block">Coordenadas GPS</span>
                <span className="font-mono text-slate-300">{selectedPoint.latitude}, {selectedPoint.longitude}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedPoint(null)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl text-xs font-bold transition-all"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
