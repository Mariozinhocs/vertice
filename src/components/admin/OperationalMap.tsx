import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { Team, ActionPoint, CheckIn, CheckInStatus } from '../../types';
import { getImageUrl } from '../../services/imageService';
import { MapPin, CheckCircle2, AlertTriangle, XCircle, Clock, Users, Camera, X, Shield, Navigation, Phone, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface OperationalMapProps {
  teams: Team[];
  actionPoints: ActionPoint[];
  checkIns: CheckIn[];
  onAuditCheckIn?: (checkInId: string, newStatus: CheckInStatus, reason: string) => void;
  onDeleteCheckIn?: (checkInId: string) => void;
  currentUserRole?: string;
}

// Criação de Ícones customizados do Leaflet em SVG para cada status
const createStatusMarkerIcon = (status: CheckInStatus | 'no_checkin' | 'point_fixed') => {
  let colorHex = '#64748b'; // Slate 500
  if (status === 'validado') colorHex = '#10b981'; // Emerald 500
  else if (status === 'pendente_analise') colorHex = '#f59e0b'; // Amber 500
  else if (status === 'rejeitado') colorHex = '#f43f5e'; // Rose 500
  else if (status === 'pendente_sync') colorHex = '#6366f1'; // Indigo 500
  else if (status === 'point_fixed') colorHex = '#8b5cf6'; // Violet 500

  const svgHtml = `
    <div style="
      background-color: ${colorHex};
      width: 32px;
      height: 32px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 14px rgba(0,0,0,0.5);
      border: 2.5px solid white;
      cursor: pointer;
    ">
      <div style="
        width: 10px;
        height: 10px;
        background-color: white;
        border-radius: 50%;
      "></div>
    </div>
  `;

  return L.divIcon({
    html: svgHtml,
    className: 'custom-leaflet-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

export const OperationalMap: React.FC<OperationalMapProps> = ({
  teams,
  actionPoints,
  checkIns,
  onAuditCheckIn,
  onDeleteCheckIn,
  currentUserRole
}) => {
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<ActionPoint | null>(null);
  const [selectedCheckIn, setSelectedCheckIn] = useState<CheckIn | null>(null);
  const [showPhotoModal, setShowPhotoModal] = useState<boolean>(false);

  // Centro padrão do mapa (Manaus - AM por padrão)
  const defaultCenter: [number, number] = actionPoints[0]
    ? [actionPoints[0].latitude, actionPoints[0].longitude]
    : [-3.1190, -60.0217];

  const handleSelectTeamMarker = (team: Team, checkIn: CheckIn | null) => {
    setSelectedTeam(team);
    setSelectedCheckIn(checkIn);
    const point = actionPoints.find((p) => p.id === checkIn?.actionPointId || team.assignedPointIds.includes(p.id));
    setSelectedPoint(point || null);
  };

  const handleSelectPointMarker = (point: ActionPoint) => {
    setSelectedPoint(point);
    const team = teams.find((t) => t.assignedPointIds.includes(point.id));
    setSelectedTeam(team || null);
    const checkIn = checkIns.find((c) => c.actionPointId === point.id);
    setSelectedCheckIn(checkIn || null);
  };

  const isDrawerOpen = selectedTeam !== null || selectedPoint !== null;

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] bg-slate-950 flex font-['Inter',sans-serif]">
      
      {/* Mapa Leaflet */}
      <div className="flex-1 h-full z-10">
        <MapContainer
          center={defaultCenter}
          zoom={12}
          scrollWheelZoom={true}
          style={{ width: '100%', height: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Círculos de Raio dos Pontos de Atuação */}
          {actionPoints.map((point) => {
            const hasCheckIn = checkIns.some((c) => c.actionPointId === point.id && c.status === 'validado');
            return (
              <React.Fragment key={`point-${point.id}`}>
                <Circle
                  center={[point.latitude, point.longitude]}
                  radius={point.radiusMeters}
                  pathOptions={{
                    color: hasCheckIn ? '#10b981' : '#6366f1',
                    fillColor: hasCheckIn ? '#10b981' : '#6366f1',
                    fillOpacity: 0.15,
                    weight: 2,
                    dashArray: '4, 8'
                  }}
                />
                {/* Marcador Fixo do Ponto de Atuação */}
                <Marker
                  position={[point.latitude, point.longitude]}
                  icon={createStatusMarkerIcon(hasCheckIn ? 'validado' : 'point_fixed')}
                  eventHandlers={{
                    click: () => handleSelectPointMarker(point),
                  }}
                >
                  <Popup className="custom-popup">
                    <div 
                      className="p-1.5 text-slate-900 text-xs space-y-1 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectPointMarker(point);
                      }}
                    >
                      <strong className="block font-bold text-sm">{point.name}</strong>
                      <p className="text-slate-600 text-[11px]">{point.address}</p>
                      <div className="flex items-center gap-1 text-[10px] text-indigo-700 font-bold">
                        <span>Raio: {point.radiusMeters}m</span>
                        {hasCheckIn && <span className="text-emerald-700 bg-emerald-100 px-1 rounded">✓ Atendido</span>}
                      </div>
                      <p className="text-[10px] text-indigo-600 font-semibold pt-0.5">Clique para ver detalhes completos →</p>
                    </div>
                  </Popup>
                </Marker>
              </React.Fragment>
            );
          })}

          {/* Marcadores das Equipes e seus Check-ins */}
          {teams.map((team) => {
            const checkIn = checkIns.find((c) => c.teamId === team.id);
            const assignedPoint = actionPoints.find((p) => team.assignedPointIds.includes(p.id));

            if (!checkIn && !assignedPoint) return null;

            const lat = checkIn ? checkIn.latitude : assignedPoint!.latitude;
            const lng = checkIn ? checkIn.longitude : assignedPoint!.longitude;
            const status = checkIn ? checkIn.status : 'no_checkin';

            return (
              <Marker
                key={`team-marker-${team.id}`}
                position={[lat, lng]}
                icon={createStatusMarkerIcon(status)}
                eventHandlers={{
                  click: () => handleSelectTeamMarker(team, checkIn || null),
                }}
              >
                <Popup>
                  <div 
                    className="p-1 text-slate-900 text-xs cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectTeamMarker(team, checkIn || null);
                    }}
                  >
                    <strong className="block font-bold text-sm">{team.name}</strong>
                    <p>Coordenador: {team.coordinatorName}</p>
                    <p className="font-semibold mt-1">
                      Status: {checkIn ? checkIn.status.toUpperCase() : 'SEM CHECK-IN'}
                    </p>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* Painel Lateral (Drawer) de Detalhes da Ação / Equipe Selecionada */}
      {isDrawerOpen && (
        <div className="w-80 sm:w-96 bg-slate-900 border-l border-slate-800 h-full p-5 overflow-y-auto z-20 shadow-2xl space-y-5 animate-in slide-in-from-right duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                {selectedCheckIn ? 'Evidência & Ação' : 'Ponto de Ação Previsto'}
              </span>
              <h3 className="text-base font-extrabold text-white">
                {selectedPoint?.name || selectedTeam?.name || 'Detalhes da Ação'}
              </h3>
            </div>
            <button
              onClick={() => {
                setSelectedTeam(null);
                setSelectedPoint(null);
                setSelectedCheckIn(null);
              }}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-all text-xs"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Dados do Ponto de Atuação */}
          {selectedPoint && (
            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white text-xs">{selectedPoint.name}</h4>
                  <p className="text-[11px] text-slate-400">{selectedPoint.address}</p>
                </div>
              </div>
              
              {selectedPoint.scheduledDate && (
                <div className="bg-indigo-950/40 border border-indigo-500/20 p-2 rounded-lg text-[11px] text-indigo-300 flex items-center justify-between">
                  <span className="flex items-center gap-1 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Agenda: {selectedPoint.scheduledDate}</span>
                  </span>
                  <span className="font-mono bg-indigo-500/20 px-1.5 py-0.5 rounded border border-indigo-500/30 font-bold">
                    {selectedPoint.startTime || '08:00'} - {selectedPoint.endTime || '18:00'}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                <span>GPS: {selectedPoint.latitude.toFixed(4)}, {selectedPoint.longitude.toFixed(4)}</span>
                <span className="text-indigo-400 font-bold">Raio: {selectedPoint.radiusMeters}m</span>
              </div>
            </div>
          )}

          {/* Dados da Equipe e Coordenador */}
          {selectedTeam && (
            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-slate-300">
                  <Users className="w-4 h-4 text-indigo-400" />
                  <span className="font-bold text-white">{selectedTeam.name}</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                  {selectedTeam.status.toUpperCase()}
                </span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Coordenador: <strong className="text-slate-200">{selectedTeam.coordinatorName}</strong>
              </p>
              <div className="pt-1.5 border-t border-slate-800 flex flex-wrap gap-1 text-[10px]">
                <span className="text-slate-500">Membros:</span>
                {selectedTeam.members.map((m) => (
                  <span key={m.id} className="bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 text-slate-300">
                    {m.name} ({m.role})
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Status dos Check-ins e Evidências Individuais */}
          {(() => {
            const pointCheckIns = checkIns.filter(
              (c) => c.actionPointId === selectedPoint?.id || c.teamId === selectedTeam?.id
            );

            if (pointCheckIns.length === 0) {
              return (
                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 text-center text-xs text-slate-400 space-y-2">
                  <Clock className="w-6 h-6 text-slate-600 mx-auto" />
                  <p>Ainda não há check-in registrado neste ponto de ação hoje.</p>
                </div>
              );
            }

            const currentChk = selectedCheckIn || pointCheckIns[0];

            return (
              <div className="space-y-4">
                {/* Se houver múltiplas evidências no mesmo ponto */}
                {pointCheckIns.length > 1 && (
                  <div className="bg-indigo-950/50 border border-indigo-500/30 p-2.5 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-indigo-300">
                      <span>📸 Evidências Registradas ({pointCheckIns.length})</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {pointCheckIns.findIndex((c) => c.id === currentChk.id) + 1} / {pointCheckIns.length}
                      </span>
                    </div>

                    <div className="flex gap-1.5 overflow-x-auto pb-1">
                      {pointCheckIns.map((chk, idx) => (
                        <button
                          key={chk.id}
                          onClick={() => setSelectedCheckIn(chk)}
                          className={`text-[10px] px-2.5 py-1.5 rounded-lg border font-semibold flex items-center gap-1 shrink-0 ${
                            chk.id === currentChk.id
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
                )}

                <div
                  className={`p-4 rounded-xl border space-y-2 text-xs ${
                    currentChk.status === 'validado'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : currentChk.status === 'pendente_analise'
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-sm">
                    <span className="uppercase">STATUS: {currentChk.status.replace('_', ' ')}</span>
                    {currentChk.status === 'validado' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                    {currentChk.status === 'pendente_analise' && <AlertTriangle className="w-5 h-5 text-amber-400" />}
                    {currentChk.status === 'rejeitado' && <XCircle className="w-5 h-5 text-rose-400" />}
                  </div>
                  <p>{currentChk.statusReason}</p>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs text-slate-300">
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Enviado por:</span>
                    <span className="font-bold text-white">{currentChk.coordinatorName} ({currentChk.teamName})</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Horário Check-in:</span>
                    <span className="font-bold text-white">{format(new Date(currentChk.timestamp), 'HH:mm:ss')}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Distância Calculada:</span>
                    <span className="font-bold text-indigo-400">{currentChk.distanceCalculatedMeters} metros</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Precisão GPS:</span>
                    <span className="font-bold text-slate-200">±{currentChk.gpsAccuracyMeters} m</span>
                  </div>
                </div>

                {/* Evidência Fotográfica com Marca d'água */}
                {(currentChk.imageWatermarkUrl || currentChk.imageUrl) && (
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      Evidência Fotográfica Georreferenciada
                    </span>
                    <div
                      onClick={() => {
                        setSelectedCheckIn(currentChk);
                        setShowPhotoModal(true);
                      }}
                      className="relative rounded-xl overflow-hidden border border-slate-700 cursor-pointer group shadow-lg"
                    >
                      <img
                        src={getImageUrl(currentChk.imageWatermarkUrl || currentChk.imageUrl)}
                        alt="Evidência Fotográfica"
                        className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      <div className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-bold space-x-1.5 backdrop-blur-[2px]">
                        <Camera className="w-4 h-4" />
                        <span>Clique para Ampliar Foto</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Ação de Auditoria Rápida */}
                {onAuditCheckIn && currentChk.status === 'pendente_analise' && (
                  <div className="pt-2 border-t border-slate-800 space-y-2">
                    <span className="text-xs font-bold text-amber-400 block">Ação de Auditoria:</span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => onAuditCheckIn(currentChk.id, 'validado', 'Aprovado manualmente pelo auditor.')}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 rounded-lg transition-all shadow"
                      >
                        Aprovar
                      </button>
                      <button
                        onClick={() => onAuditCheckIn(currentChk.id, 'rejeitado', 'Rejeitado por divergência pelo auditor.')}
                        className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs py-2 rounded-lg transition-all shadow"
                      >
                        Rejeitar
                      </button>
                    </div>
                  </div>
                )}

                {/* Ação de Exclusão Física (Apenas Admin) */}
                {currentUserRole === 'admin' && onDeleteCheckIn && (
                  <div className="pt-2">
                    <button
                      onClick={() => onDeleteCheckIn(currentChk.id)}
                      className="w-full flex items-center justify-center gap-1.5 bg-rose-950/40 hover:bg-rose-900 border border-rose-900/50 hover:border-rose-500/50 text-rose-400 hover:text-white font-semibold text-[11px] py-1.5 rounded-lg transition-all shadow"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Excluir Evidência Permanentemente
                    </button>
                  </div>
                )}

              </div>
            );
          })()}

        </div>
      )}

      {/* Modal de Foto Ampliada */}
      {showPhotoModal && selectedCheckIn && (selectedCheckIn.imageWatermarkUrl || selectedCheckIn.imageUrl) && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full bg-slate-900 rounded-2xl border border-slate-800 p-2 shadow-2xl">
            <button
              onClick={() => setShowPhotoModal(false)}
              className="absolute top-4 right-4 bg-slate-950 text-white p-2 rounded-full border border-slate-700 hover:bg-slate-800 z-10"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={getImageUrl(selectedCheckIn.imageWatermarkUrl || selectedCheckIn.imageUrl)}
              alt="Evidência em alta resolução"
              className="w-full max-h-[80vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}

    </div>
  );
};
