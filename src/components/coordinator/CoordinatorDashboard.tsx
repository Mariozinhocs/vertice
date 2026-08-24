import React, { useState } from 'react';
import { Team, ActionPoint, CheckIn, User } from '../../types';
import { CheckInFlow } from './CheckInFlow';
import { Smartphone, MapPin, CheckCircle2, Clock, AlertCircle, Plus, Users, ShieldCheck, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';

interface CoordinatorDashboardProps {
  currentUser: User;
  teams: Team[];
  actionPoints: ActionPoint[];
  checkIns: CheckIn[];
  campaignName: string;
  isOnline: boolean;
  onAddCheckIn: (checkIn: CheckIn) => void;
  onManualSync: () => void;
}

export const CoordinatorDashboard: React.FC<CoordinatorDashboardProps> = ({
  currentUser,
  teams,
  actionPoints,
  checkIns,
  campaignName,
  isOnline,
  onAddCheckIn,
  onManualSync
}) => {
  const [showCheckInFlow, setShowCheckInFlow] = useState<boolean>(false);

  // Filtra as equipes pertencentes a este coordenador
  const myTeam = teams.find((t) => t.coordinatorId === currentUser.id) || teams[0];
  const myCheckIns = checkIns.filter((c) => c.coordinatorId === currentUser.id || c.teamId === myTeam?.id);
  const myPoints = actionPoints.filter((p) => myTeam?.assignedPointIds.includes(p.id));

  const pendingSyncCount = myCheckIns.filter((c) => !c.synced).length;

  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-6">
      
      {/* Cards de Status do Coordenador */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950/80 p-5 rounded-2xl border border-indigo-500/20 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">{myTeam?.name || 'Equipe de Campo'}</h2>
              <p className="text-xs text-slate-300">Coordenador: {currentUser.name}</p>
            </div>
          </div>
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            {myTeam?.status.toUpperCase() || 'ATIVA'}
          </span>
        </div>

        <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-2 text-xs">
          <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase">Pontos Designados</span>
            <span className="text-white font-bold text-sm">{myPoints.length} locais</span>
          </div>
          <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase">Check-ins Hoje</span>
            <span className="text-indigo-400 font-bold text-sm">{myCheckIns.length} registros</span>
          </div>
        </div>
      </div>

      {/* Botão de Ação Principal: Iniciar Check-in */}
      {!showCheckInFlow ? (
        <button
          onClick={() => setShowCheckInFlow(true)}
          className="w-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-500 hover:from-indigo-500 hover:to-emerald-400 text-white font-extrabold text-base py-4 px-6 rounded-2xl shadow-xl shadow-indigo-600/25 flex items-center justify-center space-x-3 transition-all active:scale-98"
        >
          <Plus className="w-6 h-6 bg-white/20 rounded-full p-1" />
          <span>REALIZAR CHECK-IN DA EQUIPE</span>
        </button>
      ) : (
        <CheckInFlow
          team={myTeam}
          actionPoints={myPoints.length > 0 ? myPoints : actionPoints}
          campaignName={campaignName}
          isOnline={isOnline}
          onCompleteCheckIn={(newCheckIn) => {
            onAddCheckIn(newCheckIn);
            setShowCheckInFlow(false);
          }}
          onCancel={() => setShowCheckInFlow(false)}
        />
      )}

      {/* Alerta de Sincronização Pendente */}
      {pendingSyncCount > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl flex items-center justify-between text-xs text-amber-200">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <p className="font-bold">{pendingSyncCount} check-in(s) salvo(s) offline</p>
              <p className="text-[11px] text-amber-300/80">Sincronização automática pendente</p>
            </div>
          </div>
          <button
            onClick={onManualSync}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg flex items-center space-x-1 shadow"
          >
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>Sincronizar</span>
          </button>
        </div>
      )}

      {/* Histórico dos Check-ins de Hoje do Coordenador */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-2">
          <Clock className="w-4 h-4 text-indigo-400" />
          <span>Registros da Sua Equipe Hoje</span>
        </h3>

        {myCheckIns.length === 0 ? (
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 text-center text-xs text-slate-400 space-y-2">
            <MapPin className="w-8 h-8 text-slate-600 mx-auto" />
            <p>Nenhum check-in registrado para esta equipe hoje.</p>
            <p className="text-[11px] text-slate-500">Clique no botão acima para iniciar.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {myCheckIns.map((chk) => (
              <div
                key={chk.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 shadow-md hover:border-slate-700 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-white">{chk.pointName}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                      chk.status === 'validado'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : chk.status === 'pendente_analise'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        : chk.status === 'rejeitado'
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
                    }`}
                  >
                    {chk.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                  <div>
                    <span className="text-[10px] text-slate-400 block">HORÁRIO</span>
                    <span>{format(new Date(chk.timestamp), 'HH:mm')}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">DISTÂNCIA</span>
                    <span>{chk.distanceCalculatedMeters} m do ponto</span>
                  </div>
                </div>

                {chk.imageWatermarkUrl && (
                  <div className="relative rounded-lg overflow-hidden border border-slate-800 h-28">
                    <img
                      src={chk.imageWatermarkUrl}
                      alt="Evidência"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-1 right-1 bg-slate-950/80 text-[10px] text-emerald-400 font-semibold px-2 py-0.5 rounded border border-slate-800">
                      Evidência Anexa
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
