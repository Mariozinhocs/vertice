import React, { useState } from 'react';
import { User, ActionPoint, Team, CheckIn } from '../../types';
import { CheckInFlow } from '../coordinator/CheckInFlow';
import { ActionPointDetailModal } from '../common/ActionPointDetailModal';
import { FieldActionNotificationModal } from './FieldActionNotificationModal';
import { getImageUrl } from '../../services/imageService';
import { Smartphone, MapPin, CheckCircle2, Clock, ShieldCheck, AlertCircle, Plus, RefreshCw, Camera, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { format } from 'date-fns';

interface FieldActionViewProps {
  currentUser: User;
  teams: Team[];
  actionPoints: ActionPoint[];
  checkIns: CheckIn[];
  campaignName: string;
  isOnline: boolean;
  onAddCheckIn: (checkIn: CheckIn) => void;
  onManualSync: () => void;
}

export const FieldActionView: React.FC<FieldActionViewProps> = ({
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
  const [showNotificationModal, setShowNotificationModal] = useState<boolean>(true);
  const [selectedDetailPoint, setSelectedDetailPoint] = useState<ActionPoint | null>(null);
  const [selectedCheckInPointId, setSelectedCheckInPointId] = useState<string | undefined>(undefined);
  const [activePointIndex, setActivePointIndex] = useState<number>(0);

  // Encontra a equipe e os pontos de ação designados para este responsável de campo
  const myTeam = teams.find(
    (t) =>
      t.id === currentUser.teamId ||
      t.members.some((m) => m.id === currentUser.id || m.name?.toLowerCase() === currentUser.name?.toLowerCase()) ||
      t.coordinatorId === currentUser.id
  ) || teams[0];

  const assignedPoints = actionPoints.filter(
    (p) =>
      p.assignedTeamId === myTeam?.id ||
      currentUser.assignedActionPointIds?.includes(p.id) ||
      myTeam?.assignedPointIds?.includes(p.id) ||
      (currentUser.regionId && p.regionId === currentUser.regionId)
  );

  const pointsToUse = assignedPoints.length > 0 ? assignedPoints : actionPoints;
  const currentActivePoint = pointsToUse[activePointIndex] || pointsToUse[0];

  const myCheckIns = checkIns.filter(
    (c) =>
      c.coordinatorId === currentUser.id ||
      c.coordinatorName?.toLowerCase() === currentUser.name?.toLowerCase() ||
      c.teamId === myTeam?.id ||
      pointsToUse.some((p) => p.id === c.actionPointId)
  );

  const pendingSyncCount = myCheckIns.filter((c) => !c.synced).length;

  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-5 font-['Inter',sans-serif]">
      {/* Card da Ação de Campo */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 p-5 rounded-2xl border border-emerald-500/30 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Agente de Campo</span>
              <h2 className="text-base font-bold text-white">{currentUser.name}</h2>
              <p className="text-xs text-slate-400">{currentUser.teamName || myTeam?.name}</p>
            </div>
          </div>
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            {myTeam?.status.toUpperCase() || 'EM AÇÃO'}
          </span>
        </div>

        {/* Info do(s) Ponto(s) Atribuído(s) */}
        {pointsToUse.length > 0 && (
          <div className="space-y-2">
            {/* Se houver mais de 1 ponto no dia, exibe seletor rápido */}
            {pointsToUse.length > 1 && (
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Suas Ações Hoje ({pointsToUse.length})</span>
                </span>
                <span className="text-[10px] text-slate-400">
                  Ponto {activePointIndex + 1} de {pointsToUse.length}
                </span>
              </div>
            )}

            {pointsToUse.length > 1 && (
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {pointsToUse.map((pt, idx) => (
                  <button
                    key={pt.id}
                    type="button"
                    onClick={() => {
                      setActivePointIndex(idx);
                      setSelectedCheckInPointId(pt.id);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
                      idx === activePointIndex
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20 font-bold'
                        : 'bg-slate-950/80 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {idx + 1}. {pt.name}
                  </button>
                ))}
              </div>
            )}

            {/* Card Detalhe do Ponto Ativo */}
            <div
              onClick={() => setSelectedDetailPoint(currentActivePoint)}
              className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 hover:border-emerald-500/50 space-y-1.5 cursor-pointer transition-all group shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="text-[11px] font-semibold text-slate-400 uppercase flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Ponto Selecionado para Ação</span>
                </div>
                <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                  <span>Ver Mapa</span>
                  <ChevronRight className="w-3 h-3 inline" />
                </span>
              </div>
              <div className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                {currentActivePoint?.name || 'Ponto de Ação Principal'}
              </div>
              <div className="text-xs text-slate-400 line-clamp-1">
                {currentActivePoint?.address || 'Endereço registrado para a campanha'}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Botão de Registro de Check-in */}
      {!showCheckInFlow ? (
        <button
          onClick={() => {
            setSelectedCheckInPointId(currentActivePoint?.id);
            setShowCheckInFlow(true);
          }}
          className="w-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 font-extrabold text-base py-4 px-6 rounded-2xl shadow-xl shadow-emerald-600/20 flex items-center justify-center space-x-3 transition-all active:scale-[0.99]"
        >
          <Camera className="w-6 h-6 p-1 bg-slate-950/20 rounded-full text-slate-950" />
          <span>FAZER CHECK-IN & FOTO DE EVIDÊNCIA</span>
        </button>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-2xl">
          <CheckInFlow
            team={myTeam}
            actionPoints={pointsToUse}
            initialPointId={selectedCheckInPointId || currentActivePoint?.id}
            campaignName={campaignName}
            isOnline={isOnline}
            checkIns={checkIns}
            userId={currentUser.id}
            onCompleteCheckIn={(newCheckIn) => {
              onAddCheckIn(newCheckIn);
              setShowCheckInFlow(false);
              setSelectedCheckInPointId(undefined);
            }}
            onCancel={() => {
              setShowCheckInFlow(false);
              setSelectedCheckInPointId(undefined);
            }}
          />
        </div>
      )}

      {/* Alerta de Sincronização Pendente */}
      {pendingSyncCount > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/30 p-3.5 rounded-xl flex items-center justify-between text-xs text-amber-200">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <p className="font-bold">{pendingSyncCount} check-in(s) salvo(s) offline</p>
              <p className="text-[11px] text-amber-300/80">Serão sincronizados ao reconectar</p>
            </div>
          </div>
          <button
            onClick={onManualSync}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-2.5 py-1 rounded text-xs flex items-center space-x-1"
          >
            <RefreshCw className="w-3 h-3 animate-spin" />
            <span>Sincronizar</span>
          </button>
        </div>
      )}

      {/* Histórico dos Check-ins de Hoje */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-2">
          <Clock className="w-4 h-4 text-emerald-400" />
          <span>Suas Evidências Registradas Hoje</span>
        </h3>

        {myCheckIns.length === 0 ? (
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 text-center text-xs text-slate-500 space-y-1.5">
            <MapPin className="w-7 h-7 text-slate-600 mx-auto" />
            <p>Nenhum check-in registrado para esta ação hoje.</p>
            <p className="text-[11px] text-slate-600">Ao chegar no local, clique no botão acima para validar.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {myCheckIns.map((chk) => (
              <div
                key={chk.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-white">{chk.pointName}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                      chk.status === 'validado'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : chk.status === 'pendente_analise'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
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
                    <span className="text-[10px] text-slate-400 block">PRECISÃO GPS</span>
                    <span>{chk.distanceCalculatedMeters}m do raio</span>
                  </div>
                </div>

                {(chk.imageWatermarkUrl || chk.imageUrl) ? (
                  <div className="relative rounded-lg overflow-hidden border border-slate-800 h-36 bg-slate-950">
                    <img
                      src={getImageUrl(chk.imageWatermarkUrl || chk.imageUrl)}
                      alt="Evidência Fotográfica"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Se falhar o carregamento (ex: Base64 antigo truncado), esconde a imagem quebrada
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <div className="absolute bottom-1.5 right-1.5 bg-slate-950/85 text-[10px] text-emerald-400 font-semibold px-2 py-0.5 rounded border border-slate-800 shadow">
                      Evidência Georreferenciada
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed border-slate-800 p-4 text-center text-slate-500 text-xs flex items-center justify-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-slate-600" />
                    <span>Check-in registrado sem foto de evidência</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Detalhes da Ação & Mapa */}
      {selectedDetailPoint && (
        <ActionPointDetailModal
          point={selectedDetailPoint}
          checkIns={checkIns}
          team={myTeam}
          onClose={() => setSelectedDetailPoint(null)}
          onCollectEvidence={(pt) => {
            setSelectedCheckInPointId(pt.id);
            setShowCheckInFlow(true);
          }}
        />
      )}

      {/* Modal de Notificação de Novas Ações de Campo ao Logar */}
      {showNotificationModal && pointsToUse.length > 0 && (
        <FieldActionNotificationModal
          currentUser={currentUser}
          team={myTeam}
          actionPoints={pointsToUse}
          onClose={() => setShowNotificationModal(false)}
          onSelectPoint={(pt) => {
            const ptIdx = pointsToUse.findIndex((p) => p.id === pt.id);
            if (ptIdx !== -1) setActivePointIndex(ptIdx);
            setSelectedDetailPoint(pt);
          }}
        />
      )}
    </div>
  );
};
