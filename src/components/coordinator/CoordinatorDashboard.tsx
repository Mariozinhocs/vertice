import React, { useState } from 'react';
import { Team, ActionPoint, CheckIn, User } from '../../types';
import { CheckInFlow } from './CheckInFlow';
import { ActionPointDetailModal } from '../common/ActionPointDetailModal';
import { getImageUrl } from '../../services/imageService';
import { Smartphone, MapPin, CheckCircle2, Clock, AlertCircle, Plus, Users, ShieldCheck, RefreshCw, Camera, ChevronRight, Eye, Navigation } from 'lucide-react';
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
  const [selectedPhotoModal, setSelectedPhotoModal] = useState<CheckIn | null>(null);
  const [selectedDetailPoint, setSelectedDetailPoint] = useState<ActionPoint | null>(null);
  const [selectedCheckInPointId, setSelectedCheckInPointId] = useState<string | undefined>(undefined);

  // 1. Encontra TODAS as equipes sob a gestão deste coordenador (por ID, Nome ou Região)
  const myTeams = teams.filter(
    (t) =>
      t.coordinatorId === currentUser.id ||
      t.coordinatorName?.toLowerCase() === currentUser.name?.toLowerCase() ||
      (currentUser.regionId && t.regionId === currentUser.regionId) ||
      t.id === currentUser.teamId
  );

  const fallbackTeams = myTeams.length > 0 ? myTeams : teams;
  const myTeam = fallbackTeams[0];
  const myTeamIds = new Set(fallbackTeams.map((t) => t.id));

  // 2. Filtra os Pontos de Ação / Eventos atribuídos a esta zona ou equipes
  const myPoints = actionPoints.filter(
    (p) =>
      (p.assignedTeamId && myTeamIds.has(p.assignedTeamId)) ||
      fallbackTeams.some((t) => t.assignedPointIds?.includes(p.id)) ||
      (currentUser.assignedActionPointIds && currentUser.assignedActionPointIds.includes(p.id)) ||
      (currentUser.regionId && p.regionId === currentUser.regionId)
  );

  const myPointIds = new Set(myPoints.map((p) => p.id));

  // 3. Filtra TODOS os Check-ins e Evidências enviados pelos responsáveis de campo destas equipes ou pontos
  const myCheckIns = checkIns.filter(
    (c) =>
      c.coordinatorId === currentUser.id ||
      c.coordinatorName?.toLowerCase() === currentUser.name?.toLowerCase() ||
      myTeamIds.has(c.teamId) ||
      myPointIds.has(c.actionPointId)
  );

  const pendingSyncCount = myCheckIns.filter((c) => !c.synced).length;
  const validatedCount = myCheckIns.filter((c) => c.status === 'validado').length;
  const inAnalysisCount = myCheckIns.filter((c) => c.status === 'pendente_analise').length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6 font-['Inter',sans-serif]">
      
      {/* Cabeçalho do Painel da Zona / Coordenador */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/70 p-6 rounded-2xl border border-indigo-500/20 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center shadow-lg shadow-indigo-600/20">
              <ShieldCheck className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                  Painel de Coordenação de Zona
                </span>
                {currentUser.regionName && (
                  <span className="text-[10px] font-bold uppercase text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    📍 {currentUser.regionName}
                  </span>
                )}
              </div>
              <h1 className="text-xl font-extrabold text-white mt-0.5">
                Coordenador: {currentUser.name}
              </h1>
              <p className="text-xs text-slate-400">
                Acompanhamento em tempo real dos eventos, equipes e evidências fotográficas de campo.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!showCheckInFlow && (
              <button
                onClick={() => setShowCheckInFlow(true)}
                className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-500 hover:from-indigo-500 hover:to-emerald-400 text-white font-extrabold text-xs py-3 px-5 rounded-xl shadow-lg shadow-indigo-600/25 flex items-center space-x-2 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Registrar Check-in Direto</span>
              </button>
            )}
          </div>
        </div>

        {/* Métricas da Zona */}
        <div className="pt-3 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Equipes Ativas</span>
            <span className="text-white font-bold text-base">{fallbackTeams.length} equipe(s)</span>
          </div>
          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Pontos / Eventos</span>
            <span className="text-white font-bold text-base">{myPoints.length} local(is)</span>
          </div>
          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Evidências Coletadas</span>
            <span className="text-emerald-400 font-bold text-base">{myCheckIns.length} registro(s)</span>
          </div>
          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Validados no Raio GPS</span>
            <span className="text-indigo-400 font-bold text-base">{validatedCount} aprovados</span>
          </div>
        </div>
      </div>

      {/* Seção de Check-in em Fluxo (se aberto) */}
      {showCheckInFlow && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-2xl">
          <CheckInFlow
            team={myTeam}
            actionPoints={myPoints.length > 0 ? myPoints : actionPoints}
            initialPointId={selectedCheckInPointId}
            campaignName={campaignName}
            isOnline={isOnline}
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
        <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl flex items-center justify-between text-xs text-amber-200 shadow">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <p className="font-bold">{pendingSyncCount} check-in(s) salvo(s) offline em campo</p>
              <p className="text-[11px] text-amber-300/80">Sincronização pendente com o servidor central</p>
            </div>
          </div>
          <button
            onClick={onManualSync}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg flex items-center space-x-1 shadow transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>Sincronizar Agora</span>
          </button>
        </div>
      )}

      {/* Grid Principal: Evidências Recebidas vs Eventos Agendados */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Coluna 1 & 2: Evidências Fotográficas Coletadas pelos Integrantes de Campo */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
              <Camera className="w-4 h-4 text-emerald-400" />
              <span>Evidências Fotográficas Recebidas da Equipe ({myCheckIns.length})</span>
            </h2>
            <span className="text-[11px] text-slate-400">Atualização em Tempo Real</span>
          </div>

          {myCheckIns.length === 0 ? (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-10 text-center text-xs text-slate-400 space-y-3 shadow-md">
              <Camera className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="font-bold text-slate-200 text-sm">Nenhuma evidência recebida para esta equipe hoje.</p>
              <p className="max-w-md mx-auto text-slate-400">
                Assim que os responsáveis de campo tirarem a foto e realizarem o check-in no aplicativo, as fotos com marca d'água e GPS aparecerão instantaneamente aqui.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {myCheckIns.map((chk) => (
                <div
                  key={chk.id}
                  onClick={() => setSelectedPhotoModal(chk)}
                  className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-4 space-y-3 shadow-md cursor-pointer transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
                      {chk.pointName}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border shrink-0 ${
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

                  {/* Foto da Evidência com Marca d'água */}
                  {(chk.imageWatermarkUrl || chk.imageUrl) ? (
                    <div className="relative rounded-xl overflow-hidden border border-slate-800 h-44 bg-slate-950">
                      <img
                        src={getImageUrl(chk.imageWatermarkUrl || chk.imageUrl)}
                        alt="Evidência Fotográfica"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-bold gap-1.5 backdrop-blur-[2px]">
                        <Eye className="w-4 h-4" />
                        <span>Ver Foto Ampliada</span>
                      </div>
                      <div className="absolute bottom-1.5 right-1.5 bg-slate-950/80 text-[10px] text-emerald-400 font-semibold px-2 py-0.5 rounded border border-slate-800">
                        ✓ Evidência Georreferenciada
                      </div>
                    </div>
                  ) : (
                    <div className="h-28 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-600 text-xs">
                      Sem Foto Anexa
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 pt-1 border-t border-slate-800/80">
                    <div>
                      <span className="text-[10px] text-slate-400 block">ENVIADO POR</span>
                      <span className="font-semibold text-white text-[11px] truncate block">{chk.coordinatorName}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">HORÁRIO / RAIO</span>
                      <span className="font-mono text-indigo-300 text-[11px]">
                        {format(new Date(chk.timestamp), 'HH:mm')} • {chk.distanceCalculatedMeters}m
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Coluna 3: Pontos de Ação e Eventos Agendados para a Equipe */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-indigo-400" />
              <span>Eventos & Pontos Designados ({myPoints.length})</span>
            </h2>
          </div>

          {myPoints.length === 0 ? (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 text-center text-xs text-slate-400 space-y-2">
              <MapPin className="w-7 h-7 text-slate-600 mx-auto" />
              <p>Nenhum evento agendado para esta zona hoje.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {myPoints.map((point) => {
                const isAttended = myCheckIns.some((c) => c.actionPointId === point.id);
                return (
                  <div
                    key={point.id}
                    onClick={() => setSelectedDetailPoint(point)}
                    className={`bg-slate-900 border rounded-xl p-4 space-y-2.5 text-xs shadow-md transition-all cursor-pointer group hover:border-indigo-500/50 ${
                      isAttended ? 'border-emerald-500/40 bg-emerald-950/10' : 'border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-white text-sm group-hover:text-indigo-300 transition-colors">{point.name}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full uppercase border ${
                          isAttended
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        {isAttended ? '🟢 Atendido' : '⚪ Pendente'}
                      </span>
                    </div>

                    <p className="text-slate-400 text-[11px] line-clamp-1">{point.address}</p>

                    {point.scheduledDate && (
                      <div className="text-[10px] text-indigo-300 font-mono bg-slate-950 p-1.5 rounded border border-slate-800/80 flex items-center justify-between">
                        <span>📅 {point.scheduledDate}</span>
                        <span>{point.startTime || '08:00'} - {point.endTime || '18:00'}</span>
                      </div>
                    )}

                    <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                      <span className="text-indigo-400 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                        <span>📍 Ver Detalhes & Mapa</span>
                        <ChevronRight className="w-3 h-3 inline" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* Modal de Foto Ampliada */}
      {selectedPhotoModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="relative max-w-3xl w-full bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-emerald-400">Inspeção de Evidência de Campo</span>
                <h3 className="text-base font-extrabold text-white">{selectedPhotoModal.pointName}</h3>
              </div>
              <button
                onClick={() => setSelectedPhotoModal(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-all text-xs"
              >
                ✕
              </button>
            </div>

            {(selectedPhotoModal.imageWatermarkUrl || selectedPhotoModal.imageUrl) && (
              <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-slate-950">
                <img
                  src={getImageUrl(selectedPhotoModal.imageWatermarkUrl || selectedPhotoModal.imageUrl)}
                  alt="Foto Evidência"
                  className="w-full max-h-[60vh] object-contain mx-auto"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-950 p-3 rounded-xl border border-slate-800">
              <div>
                <span className="text-slate-400 block text-[10px]">ENVIADO POR:</span>
                <strong className="text-white">{selectedPhotoModal.coordinatorName}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">HORÁRIO / PRECISÃO GPS:</span>
                <strong className="text-indigo-400">
                  {format(new Date(selectedPhotoModal.timestamp), 'dd/MM/yyyy HH:mm:ss')} (±{selectedPhotoModal.gpsAccuracyMeters}m)
                </strong>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedPhotoModal(null)}
                className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-4 py-2 rounded-xl"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Detalhes da Ação & Mapa */}
      {selectedDetailPoint && (
        <ActionPointDetailModal
          point={selectedDetailPoint}
          checkIns={checkIns}
          team={myTeam}
          regionName={currentUser.regionName}
          onClose={() => setSelectedDetailPoint(null)}
          onCollectEvidence={(pt) => {
            setSelectedCheckInPointId(pt.id);
            setShowCheckInFlow(true);
          }}
        />
      )}

    </div>
  );
};
