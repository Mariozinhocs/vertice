import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Circle, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { Team, ActionPoint, CheckIn, CheckInStatus, Region } from '../../types';
import { ActionPointDetailModal } from '../common/ActionPointDetailModal';
import { getImageUrl } from '../../services/imageService';
import { MapPin, CheckCircle2, AlertTriangle, XCircle, Clock, Users, Camera, X, Shield, Navigation, Phone, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface OperationalMapProps {
  teams: Team[];
  actionPoints: ActionPoint[];
  regions?: Region[];
  checkIns: CheckIn[];
  onAuditCheckIn?: (checkInId: string, newStatus: CheckInStatus, reason: string) => void;
  onDeleteCheckIn?: (checkInId: string) => void;
  currentUserRole?: string;
}

// Criação de Ícones customizados do Leaflet em SVG para cada status das equipes
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

// Criação de Ícones de Ação no Mapa na Cor da sua Base
const createActionPinIcon = (colorHex: string = '#8b5cf6', hasCheckIn: boolean = false) => {
  const badgeHtml = hasCheckIn ? `
    <div style="
      position: absolute;
      top: -3px;
      right: -3px;
      width: 12px;
      height: 12px;
      background-color: #10b981;
      border: 2px solid white;
      border-radius: 50%;
      box-shadow: 0 0 6px rgba(16, 185, 129, 0.9);
      z-index: 10;
    "></div>
  ` : '';

  const svgHtml = `
    <div style="position: relative; display: inline-block;">
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
        transition: transform 0.15s ease-in-out;
      ">
        <div style="
          width: 10px;
          height: 10px;
          background-color: white;
          border-radius: 50%;
          transform: rotate(45deg);
          box-shadow: inset 0 1px 2px rgba(0,0,0,0.3);
        "></div>
      </div>
      ${badgeHtml}
    </div>
  `;

  return L.divIcon({
    html: svgHtml,
    className: 'custom-action-pin-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

export const OperationalMap: React.FC<OperationalMapProps> = ({
  teams,
  actionPoints,
  regions,
  checkIns,
  onAuditCheckIn,
  onDeleteCheckIn,
  currentUserRole
}) => {
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<ActionPoint | null>(null);
  const [selectedCheckIn, setSelectedCheckIn] = useState<CheckIn | null>(null);
  const [showPhotoModal, setShowPhotoModal] = useState<boolean>(false);
  const [modalActionPoint, setModalActionPoint] = useState<ActionPoint | null>(null);

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
            const region = regions?.find((r) => r.id === point.regionId);
            const baseColor = region?.color || '#8b5cf6';
            const assignedTeam = teams.find(
              (t) => t.id === point.assignedTeamId || (t.assignedPointIds && t.assignedPointIds.includes(point.id))
            );
            const regionName = region?.name || 'Base';
            const teamName = point.assignedTeamName || assignedTeam?.name || 'Sem equipe';

            return (
              <React.Fragment key={`point-${point.id}`}>
                <Circle
                  center={[point.latitude, point.longitude]}
                  radius={point.radiusMeters}
                  pathOptions={{
                    color: baseColor,
                    fillColor: baseColor,
                    fillOpacity: 0.18,
                    weight: 2,
                    dashArray: '4, 8'
                  }}
                />
                {/* Marcador Fixo do Ponto de Atuação na Cor da sua Base */}
                <Marker
                  position={[point.latitude, point.longitude]}
                  icon={createActionPinIcon(baseColor, hasCheckIn)}
                  eventHandlers={{
                    click: () => {
                      setModalActionPoint(point);
                    },
                  }}
                >
                  {/* Rollover Tooltip Simples (Base / Equipe) com Interatividade Desativada (Evita Tremor no Mouse) */}
                  <Tooltip
                    direction="top"
                    offset={[0, -36]}
                    opacity={1}
                    interactive={false}
                    className="custom-tooltip bg-slate-900/95 text-white border border-slate-700/80 shadow-2xl rounded-lg px-3 py-1.5 backdrop-blur-md pointer-events-none"
                  >
                    <div className="text-xs font-semibold tracking-wide flex items-center gap-1.5 whitespace-nowrap">
                      <span className="w-2.5 h-2.5 rounded-full inline-block shrink-0 shadow-sm" style={{ backgroundColor: baseColor }}></span>
                      <span className="font-bold text-white">{regionName}</span>
                      <span className="text-slate-400">/</span>
                      <span className="text-indigo-300 font-medium">{teamName}</span>
                    </div>
                  </Tooltip>
                </Marker>
              </React.Fragment>
            );
          })}

          {/* Marcadores de Check-in em Tempo Real das Equipes (Apenas quando houver check-in registrado com GPS próprio) */}
          {teams.map((team) => {
            const checkIn = checkIns.find((c) => c.teamId === team.id);
            // Evita sobrepor dois marcadores exatamente na mesma coordenada para não causar trepidação no mouse
            if (!checkIn) return null;

            const lat = checkIn.latitude;
            const lng = checkIn.longitude;
            const status = checkIn.status;

            return (
              <Marker
                key={`team-marker-${team.id}`}
                position={[lat, lng]}
                icon={createStatusMarkerIcon(status)}
                eventHandlers={{
                  click: () => {
                    const point = actionPoints.find((p) => p.id === checkIn.actionPointId);
                    if (point) setModalActionPoint(point);
                  },
                }}
              >
                <Tooltip
                  direction="top"
                  offset={[0, -36]}
                  opacity={1}
                  interactive={false}
                  className="custom-tooltip bg-slate-900 text-white border border-slate-700 shadow-xl rounded-lg p-2 pointer-events-none"
                >
                  <div className="text-xs space-y-0.5">
                    <strong className="block font-bold text-sm text-indigo-400">{team.name}</strong>
                    <p className="text-slate-300">Coord: {team.coordinatorName}</p>
                    <p className="font-semibold mt-1 text-[10px] uppercase text-slate-400">
                      Status: <span className="text-indigo-300">{checkIn.status.replace('_', ' ')}</span>
                    </p>
                  </div>
                </Tooltip>
              </Marker>
            );
          })}
        </MapContainer>
      </div>



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

      {/* Modal de Detalhes da Ação ao Clicar no Pin */}
      {modalActionPoint && (
        <ActionPointDetailModal
          point={modalActionPoint}
          checkIns={checkIns}
          teams={teams}
          team={teams.find(t => t.id === modalActionPoint.assignedTeamId || (t.assignedPointIds && t.assignedPointIds.includes(modalActionPoint.id)))}
          regionName={regions?.find(r => r.id === modalActionPoint.regionId)?.name}
          onClose={() => setModalActionPoint(null)}
        />
      )}

    </div>
  );
};
