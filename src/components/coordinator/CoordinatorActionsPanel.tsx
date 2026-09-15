import React, { useState } from 'react';
import { User, Region, ActionPoint, Team } from '../../types';
import { MapPin, Plus, CheckCircle2, Shield, Navigation, AlertCircle, Calendar, Clock, Users } from 'lucide-react';
import { ActionPointModal } from '../admin/ActionPointModal';
import { TeamModal } from '../admin/TeamModal';

interface CoordinatorActionsPanelProps {
  currentUser: User;
  region?: Region;
  actionPoints: ActionPoint[];
  teams: Team[];
  users?: User[];
  regions?: Region[];
  onAddActionPoint: (point: ActionPoint) => void;
  onAddTeam?: (team: Team) => void;
}

export const CoordinatorActionsPanel: React.FC<CoordinatorActionsPanelProps> = ({
  currentUser,
  region,
  actionPoints,
  teams,
  users = [],
  regions = [],
  onAddActionPoint,
  onAddTeam
}) => {
  const [showPointModal, setShowPointModal] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Filtra apenas os pontos pertencentes à região/zona do coordenador
  const zoneRegionId = currentUser.regionId || region?.id || 'reg-norte-1';
  const myRegion: Region = region || {
    id: zoneRegionId,
    campaignId: 'cmp-manaus-2026',
    name: currentUser.regionName || 'Zona Atribuída',
    description: 'Zona de Cobertura do Coordenador'
  };

  // Encontra as equipes do coordenador e usuários da zona
  const zoneUsers = users.filter((u) => u.regionId === zoneRegionId || u.role === 'campo');
  const myTeam = teams.find((t) => t.coordinatorId === currentUser.id) || teams[0];

  const zonePoints = actionPoints.filter(
    (p) => p.regionId === zoneRegionId || p.assignedTeamId === myTeam?.id
  );

  const handleSaveActionPoint = (newPoint: ActionPoint) => {
    const pointWithCoordTeam: ActionPoint = {
      ...newPoint,
      regionId: newPoint.regionId || zoneRegionId,
      assignedTeamId: newPoint.assignedTeamId || myTeam?.id,
      assignedTeamName: newPoint.assignedTeamName || myTeam?.name
    };

    onAddActionPoint(pointWithCoordTeam);
    setShowPointModal(false);
    setSuccessMsg(`Ação "${pointWithCoordTeam.name}" criada no mapa e agendada!`);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const handleSaveTeam = (newTeam: Team) => {
    if (onAddTeam) {
      onAddTeam({
        ...newTeam,
        regionId: zoneRegionId,
        coordinatorId: currentUser.id,
        coordinatorName: currentUser.name
      });
    }
    setShowTeamModal(false);
    setSuccessMsg(`Equipe "${newTeam.name}" criada com sucesso para sua zona!`);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 font-['Inter',sans-serif]">
      {/* Cabeçalho da Zona */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <MapPin className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-extrabold text-white">
              Ações de Campo — {currentUser.regionName || myRegion.name}
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            Cadastre equipes da sua base, crie pontos de ação georreferenciados no mapa e atribua aos integrantes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onAddTeam && (
            <button
              onClick={() => setShowTeamModal(true)}
              className="flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-purple-300 font-bold px-3.5 py-2.5 rounded-xl border border-purple-500/30 transition-all text-xs"
            >
              <Users className="w-4 h-4 text-purple-400" />
              <span>+ Criar Equipe</span>
            </button>
          )}

          <button
            onClick={() => setShowPointModal(true)}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-amber-600/20 transition-all text-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Nova Ação</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="flex items-center gap-2 p-3.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs rounded-xl animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Lista de Ações da Zona */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Pontos de Ação e Eventos Agendados ({zonePoints.length})
          </h2>
        </div>

        {zonePoints.length === 0 ? (
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-8 text-center text-xs text-slate-500 space-y-2">
            <MapPin className="w-8 h-8 mx-auto text-slate-600" />
            <p>Nenhuma ação cadastrada nesta zona ainda.</p>
            <p className="text-[11px] text-slate-600">Clique em "Cadastrar Nova Ação no Mapa" acima para adicionar o local e a agenda da equipe.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {zonePoints.map((point) => (
              <div
                key={point.id}
                className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 rounded-xl p-4 space-y-2.5 transition-all shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">{point.name}</h3>
                    <p className="text-[11px] text-slate-400 line-clamp-1">{point.description}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase">
                    {point.status}
                  </span>
                </div>

                {/* Exibição de Data e Hora se agendado */}
                {point.scheduledDate && (
                  <div className="bg-indigo-950/40 border border-indigo-500/20 p-2 rounded-lg text-[11px] text-indigo-300 flex items-center justify-between font-mono">
                    <span className="flex items-center gap-1 font-semibold">
                      <Clock className="w-3.5 h-3.5 text-indigo-400" />
                      <span>📅 {point.scheduledDate}</span>
                    </span>
                    <span className="bg-indigo-500/20 px-1.5 py-0.5 rounded border border-indigo-500/30 font-bold">
                      {point.startTime || '08:00'} - {point.endTime || '18:00'}
                    </span>
                  </div>
                )}

                {/* Equipe Vinculada */}
                {point.assignedTeamName && (
                  <div className="text-[11px] text-purple-300 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-purple-400" />
                    <span>Equipe: <strong>{point.assignedTeamName}</strong></span>
                  </div>
                )}

                <div className="space-y-1 text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="truncate">{point.address}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                    <span>GPS: {point.latitude.toFixed(4)}, {point.longitude.toFixed(4)}</span>
                    <span className="text-amber-300 font-semibold">Raio: {point.radiusMeters}m</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Cadastro de Ação Completo com Mapa e Agenda */}
      {showPointModal && (
        <ActionPointModal
          actionPoint={null}
          regions={[myRegion]}
          teams={teams}
          users={[currentUser]}
          currentUser={currentUser}
          onClose={() => setShowPointModal(false)}
          onSave={handleSaveActionPoint}
        />
      )}

      {/* Modal de Cadastro de Equipe da Zona */}
      {showTeamModal && (
        <TeamModal
          team={null}
          regions={[myRegion]}
          actionPoints={zonePoints}
          users={zoneUsers}
          onClose={() => setShowTeamModal(false)}
          onSave={handleSaveTeam}
        />
      )}
    </div>
  );
};

