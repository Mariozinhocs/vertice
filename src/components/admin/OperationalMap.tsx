import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { Team, ActionPoint, CheckIn, CheckInStatus } from '../../types';
import { MapPin, CheckCircle2, AlertTriangle, XCircle, Clock, Users, Camera, X, Shield, Navigation } from 'lucide-react';
import { format } from 'date-fns';

interface OperationalMapProps {
  teams: Team[];
  actionPoints: ActionPoint[];
  checkIns: CheckIn[];
  onAuditCheckIn?: (checkInId: string, newStatus: CheckInStatus, reason: string) => void;
}

// Criação de Ícones customizados do Leaflet em SVG para cada status
const createStatusMarkerIcon = (status: CheckInStatus | 'no_checkin') => {
  let colorHex = '#64748b'; // Slate 500
  if (status === 'validado') colorHex = '#10b981'; // Emerald 500
  else if (status === 'pendente_analise') colorHex = '#f59e0b'; // Amber 500
  else if (status === 'rejeitado') colorHex = '#f43f5e'; // Rose 500
  else if (status === 'pendente_sync') colorHex = '#6366f1'; // Indigo 500

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
      box-shadow: 0 4px 12px rgba(0,0,0,0.4);
      border: 2px solid white;
    ">
      <div style="
        width: 12px;
        height: 12px;
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
  onAuditCheckIn
}) => {
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [selectedCheckIn, setSelectedCheckIn] = useState<CheckIn | null>(null);
  const [showPhotoModal, setShowPhotoModal] = useState<boolean>(false);

  // Centro padrão do mapa (São Paulo por padrão ou média das coordenadas)
  const defaultCenter: [number, number] = actionPoints[0]
    ? [actionPoints[0].latitude, actionPoints[0].longitude]
    : [-23.550520, -46.633308];

  const handleSelectMarker = (team: Team, checkIn: CheckIn | null) => {
    setSelectedTeam(team);
    setSelectedCheckIn(checkIn);
  };

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] bg-slate-950 flex">
      
      {/* Mapa Leaflet */}
      <div className="flex-1 h-full z-10">
        <MapContainer
          center={defaultCenter}
          zoom={13}
          scrollWheelZoom={true}
          style={{ width: '100%', height: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />

          {/* Círculos de Raio dos Pontos de Atuação */}
          {actionPoints.map((point) => (
            <React.Fragment key={`point-${point.id}`}>
              <Circle
                center={[point.latitude, point.longitude]}
                radius={point.radiusMeters}
                pathOptions={{
                  color: '#6366f1',
                  fillColor: '#6366f1',
                  fillOpacity: 0.15,
                  weight: 2,
                  dashArray: '4, 8'
                }}
              />
              {/* Marcador Fixo do Ponto de Atuação */}
              <Marker
                position={[point.latitude, point.longitude]}
                icon={createStatusMarkerIcon('no_checkin')}
              >
                <Popup className="custom-popup">
                  <div className="p-1 text-slate-900 text-xs">
                    <strong className="block font-bold">{point.name}</strong>
                    <p className="text-slate-600">{point.address}</p>
                    <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-1.5 py-0.5 rounded mt-1 inline-block">
                      Raio: {point.radiusMeters}m
                    </span>
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>
          ))}

          {/* Marcadores das Equipes e seus Check-ins */}
          {teams.map((team) => {
            const checkIn = checkIns.find((c) => c.teamId === team.id);
            const assignedPoint = actionPoints.find((p) => team.assignedPointIds.includes(p.id));

            // Usa coordenada do check-in ou do ponto atribuído
            const lat = checkIn ? checkIn.latitude : assignedPoint?.latitude || defaultCenter[0];
            const lng = checkIn ? checkIn.longitude : assignedPoint?.longitude || defaultCenter[1];
            const status = checkIn ? checkIn.status : 'no_checkin';

            return (
              <Marker
                key={`team-marker-${team.id}`}
                position={[lat, lng]}
                icon={createStatusMarkerIcon(status)}
                eventHandlers={{
                  click: () => handleSelectMarker(team, checkIn || null),
                }}
              >
                <Popup>
                  <div className="p-1 text-slate-900 text-xs">
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

      {/* Painel Lateral (Drawer) de Detalhes da Equipe Selecionada */}
      {selectedTeam && (
        <div className="w-80 sm:w-96 bg-slate-900 border-l border-slate-800 h-full p-5 overflow-y-auto z-20 shadow-2xl space-y-5 animate-in slide-in-from-right duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">Raio-X da Equipe</span>
              <h3 className="text-base font-extrabold text-white">{selectedTeam.name}</h3>
            </div>
            <button
              onClick={() => {
                setSelectedTeam(null);
                setSelectedCheckIn(null);
              }}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Dados do Coordenador */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center space-x-2 text-slate-300">
              <Users className="w-4 h-4 text-indigo-400" />
              <span className="font-semibold">Coordenador: {selectedTeam.coordinatorName}</span>
            </div>
            <p className="text-slate-400 text-[11px]">Integrantes da equipe: {selectedTeam.members.length} pessoas</p>
          </div>

          {/* Status do Check-in */}
          {selectedCheckIn ? (
            <div className="space-y-4">
              <div
                className={`p-4 rounded-xl border space-y-2 text-xs ${
                  selectedCheckIn.status === 'validado'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : selectedCheckIn.status === 'pendente_analise'
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                }`}
              >
                <div className="flex items-center justify-between font-bold text-sm">
                  <span className="uppercase">STATUS: {selectedCheckIn.status.replace('_', ' ')}</span>
                  {selectedCheckIn.status === 'validado' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                  {selectedCheckIn.status === 'pendente_analise' && <AlertTriangle className="w-5 h-5 text-amber-400" />}
                  {selectedCheckIn.status === 'rejeitado' && <XCircle className="w-5 h-5 text-rose-400" />}
                </div>
                <p>{selectedCheckIn.statusReason}</p>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs text-slate-300">
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Ponto Atribuído:</span>
                  <span className="font-bold text-white">{selectedCheckIn.pointName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Horário Check-in:</span>
                  <span className="font-bold text-white">{format(new Date(selectedCheckIn.timestamp), 'HH:mm:ss')}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Distância Calculada:</span>
                  <span className="font-bold text-indigo-400">{selectedCheckIn.distanceCalculatedMeters} metros</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Precisão GPS:</span>
                  <span className="font-bold text-slate-200">±{selectedCheckIn.gpsAccuracyMeters} m</span>
                </div>
              </div>

              {/* Evidência Fotográfica com Marca d'água */}
              {selectedCheckIn.imageWatermarkUrl && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Evidência Fotográfica com Carimbo</span>
                  <div
                    onClick={() => setShowPhotoModal(true)}
                    className="relative rounded-xl overflow-hidden border border-slate-700 cursor-pointer group shadow-lg"
                  >
                    <img
                      src={selectedCheckIn.imageWatermarkUrl}
                      alt="Evidência Fotográfica"
                      className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-bold space-x-1">
                      <Camera className="w-4 h-4" />
                      <span>Clique para Ampliar</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Ação de Auditoria Rápida */}
              {onAuditCheckIn && selectedCheckIn.status === 'pendente_analise' && (
                <div className="pt-2 border-t border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-amber-400 block">Ação de Auditoria:</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onAuditCheckIn(selectedCheckIn.id, 'validado', 'Aprovado manualmente pelo auditor.')}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 rounded-lg"
                    >
                      Aprovar
                    </button>
                    <button
                      onClick={() => onAuditCheckIn(selectedCheckIn.id, 'rejeitado', 'Rejeitado por divergência pelo auditor.')}
                      className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs py-2 rounded-lg"
                    >
                      Rejeitar
                    </button>
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 text-center text-xs text-slate-400 space-y-2">
              <Clock className="w-6 h-6 text-slate-600 mx-auto" />
              <p>Esta equipe ainda não realizou check-in no dia de hoje.</p>
            </div>
          )}

        </div>
      )}

      {/* Modal de Foto Ampliada */}
      {showPhotoModal && selectedCheckIn?.imageWatermarkUrl && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full bg-slate-900 rounded-2xl border border-slate-800 p-2 shadow-2xl">
            <button
              onClick={() => setShowPhotoModal(false)}
              className="absolute top-4 right-4 bg-slate-950 text-white p-2 rounded-full border border-slate-700 hover:bg-slate-800 z-10"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={selectedCheckIn.imageWatermarkUrl}
              alt="Evidência em alta resolução"
              className="w-full max-h-[80vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}

    </div>
  );
};
