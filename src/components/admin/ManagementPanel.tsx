import React, { useState } from 'react';
import { ActionPoint, Team, Region, User } from '../../types';
import { Plus, MapPin, Users, Edit3, Trash2, Shield, Phone, CheckCircle2, ChevronRight } from 'lucide-react';
import { ActionPointModal } from './ActionPointModal';
import { TeamModal } from './TeamModal';

interface ManagementPanelProps {
  actionPoints: ActionPoint[];
  teams: Team[];
  regions: Region[];
  users: User[];
  onAddActionPoint: (point: ActionPoint) => void;
  onUpdateActionPoint?: (point: ActionPoint) => void;
  onDeleteActionPoint?: (pointId: string) => void;
  onAddTeam: (team: Team) => void;
  onUpdateTeam?: (team: Team) => void;
  onDeleteTeam?: (teamId: string) => void;
}

export const ManagementPanel: React.FC<ManagementPanelProps> = ({
  actionPoints,
  teams,
  regions,
  users,
  onAddActionPoint,
  onUpdateActionPoint,
  onDeleteActionPoint,
  onAddTeam,
  onUpdateTeam,
  onDeleteTeam
}) => {
  const [activeTab, setActiveTab] = useState<'points' | 'teams'>('points');

  // Modais de Ponto de Atuação
  const [showPointModal, setShowPointModal] = useState<boolean>(false);
  const [editingPoint, setEditingPoint] = useState<ActionPoint | null>(null);

  // Modais de Equipe
  const [showTeamModal, setShowTeamModal] = useState<boolean>(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);

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

  return (
    <div className="space-y-6 font-['Inter',sans-serif]">
      
      {/* Cabeçalho */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">
            <Users className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-white">Cadastros Operacionais & Equipes</h2>
            <p className="text-xs text-slate-400">
              Gerenciamento de Pontos de Atuação, Zonas Geográficas e Escalas das Equipes
            </p>
          </div>
        </div>

        {/* Seletor de Abas */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('points')}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === 'points'
                ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Pontos de Atuação ({actionPoints.length})
          </button>
          <button
            onClick={() => setActiveTab('teams')}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === 'teams'
                ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Equipes ({teams.length})
          </button>
        </div>
      </div>

      {/* ABA 1: PONTOS DE ATUAÇÃO */}
      {activeTab === 'points' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Pontos de Ação Cadastrados ({actionPoints.length})
            </h3>
            <button
              onClick={handleOpenNewPoint}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-lg shadow-indigo-600/30 flex items-center space-x-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Ponto de Atuação</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {actionPoints.map((point) => {
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
                      <span className="text-[10px] text-slate-400 font-medium">
                        {region?.name || 'Manaus'}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      Raio: {point.radiusMeters}m
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2">{point.address}</p>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span>LAT: {point.latitude.toFixed(5)}</span>
                    <span className="text-indigo-400 font-sans font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                      Editar <ChevronRight className="w-3 h-3 inline" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ABA 2: EQUIPES E RESPONSÁVEIS */}
      {activeTab === 'teams' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Equipes de Campo Cadastradas ({teams.length})
            </h3>
            <button
              onClick={handleOpenNewTeam}
              className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-lg shadow-purple-600/30 flex items-center space-x-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Equipe</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teams.map((team) => {
              const region = regions.find((r) => r.id === team.regionId);
              const assignedPoints = actionPoints.filter((p) => team.assignedPointIds.includes(p.id));

              return (
                <div
                  key={team.id}
                  className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4 shadow-md hover:border-purple-500/40 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-base text-white">{team.name}</h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30">
                          {region?.name || 'Zona'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Coordenador: <strong className="text-slate-200">{team.coordinatorName}</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditTeam(team)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-purple-500/20 text-slate-300 hover:text-purple-300 border border-slate-700 transition-all text-xs"
                        title="Editar equipe e membros"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      {onDeleteTeam && (
                        <button
                          onClick={() => {
                            if (confirm(`Deseja excluir a equipe "${team.name}"?`)) {
                              onDeleteTeam(team.id);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-300 border border-slate-700 transition-all text-xs"
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

                  {/* Pontos Atribuídos */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Pontos de Atuação Vinculados ({assignedPoints.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {assignedPoints.length === 0 ? (
                        <span className="text-[11px] text-slate-500 italic">Nenhum ponto vinculado</span>
                      ) : (
                        assignedPoints.map((pt) => (
                          <span
                            key={pt.id}
                            className="bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800 text-[11px] text-slate-300 flex items-center gap-1"
                          >
                            <MapPin className="w-3 h-3 text-indigo-400 shrink-0" />
                            <span className="truncate max-w-[180px]">{pt.name}</span>
                          </span>
                        ))
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal de Ponto de Atuação (Criar / Editar) */}
      {showPointModal && (
        <ActionPointModal
          actionPoint={editingPoint}
          regions={regions}
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

    </div>
  );
};
