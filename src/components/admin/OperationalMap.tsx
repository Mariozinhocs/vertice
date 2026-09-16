import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Circle, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Team, ActionPoint, CheckIn, CheckInStatus, Region } from '../../types';
import { ActionPointDetailModal } from '../common/ActionPointDetailModal';
import { getImageUrl } from '../../services/imageService';
import { MapPin, CheckCircle2, AlertTriangle, XCircle, Clock, Users, Camera, X, Shield, Navigation, Phone, Trash2, Search, Crosshair } from 'lucide-react';
import { format } from 'date-fns';

interface OperationalMapProps {
  teams: Team[];
  actionPoints: ActionPoint[];
  regions?: Region[];
  checkIns: CheckIn[];
  selectedRegionId?: string;
  onAuditCheckIn?: (checkInId: string, newStatus: CheckInStatus, reason: string) => void;
  onDeleteCheckIn?: (checkInId: string) => void;
  currentUserRole?: string;
}

interface TargetLoc {
  lat: number;
  lng: number;
  id: number;
}

// Componente para recentralizar o mapa de forma garantida e imediata ao selecionar uma ação
const MapViewportController: React.FC<{ targetLocation: TargetLoc | null }> = ({ targetLocation }) => {
  const map = useMap();
  useEffect(() => {
    if (targetLocation) {
      map.stop();
      map.setView([targetLocation.lat, targetLocation.lng], 16, { animate: true });
      map.flyTo([targetLocation.lat, targetLocation.lng], 16, { duration: 0.8 });
    }
  }, [targetLocation, map]);
  return null;
};

// Componente para enquadramento inicial inteligente sem sobrescrever a navegação do usuário
const MapAutoBoundsFitter: React.FC<{ points: ActionPoint[]; selectedRegionId?: string }> = ({ points, selectedRegionId }) => {
  const map = useMap();
  const prevRegionRef = React.useRef<string | undefined>(selectedRegionId);
  const initialFittedRef = React.useRef<boolean>(false);

  useEffect(() => {
    const regionChanged = prevRegionRef.current !== selectedRegionId;
    if (points && points.length > 0 && (!initialFittedRef.current || regionChanged)) {
      const bounds = L.latLngBounds(points.map((p) => [p.latitude, p.longitude]));
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [60, 60], maxZoom: 15 });
        initialFittedRef.current = true;
        prevRegionRef.current = selectedRegionId;
      }
    }
  }, [selectedRegionId, points.length, map]);

  return null;
};

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
  selectedRegionId = 'ALL',
  onAuditCheckIn,
  onDeleteCheckIn,
  currentUserRole
}) => {
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<ActionPoint | null>(null);
  const [selectedCheckIn, setSelectedCheckIn] = useState<CheckIn | null>(null);
  const [showPhotoModal, setShowPhotoModal] = useState<boolean>(false);
  const [modalActionPoint, setModalActionPoint] = useState<ActionPoint | null>(null);
  
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [targetLocation, setTargetLocation] = useState<TargetLoc | null>(null);

  // Efeito para fechar droplet no ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]);

  // Filtra ações pela região/zona selecionada no dashboard
  const displayPoints = actionPoints.filter((p) => {
    if (!selectedRegionId || selectedRegionId === 'ALL') return true;
    return p.regionId === selectedRegionId;
  });

  // Filtra pontos compatíveis com o texto digitado na busca
  const filteredSearchPoints = displayPoints.filter((p) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase().trim();
    return (
      p.name.toLowerCase().includes(term) ||
      (p.address && p.address.toLowerCase().includes(term)) ||
      (p.assignedTeamName && p.assignedTeamName.toLowerCase().includes(term))
    );
  });

  // Centro padrão do mapa (Manaus - AM por padrão)
  const defaultCenter: [number, number] = displayPoints[0]
    ? [displayPoints[0].latitude, displayPoints[0].longitude]
    : [-3.1020, -60.0160]; // Padrão Fundação Doutor Thomas / Parque do Idoso

  const handleSelectTeamMarker = (team: Team, checkIn: CheckIn | null) => {
    setSelectedTeam(team);
    setSelectedCheckIn(checkIn);
    const point = actionPoints.find((p) => p.id === checkIn?.actionPointId || team.assignedPointIds.includes(p.id));
    setSelectedPoint(point || null);
  };

  const handleFocusPoint = (point: ActionPoint) => {
    setTargetLocation({ lat: point.latitude, lng: point.longitude, id: Date.now() });
  };

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] bg-slate-950 flex font-['Inter',sans-serif]">
      
      {/* Botão de Pesquisa Inicialmente Fechado & Droplet Interativo */}
      {!isSearchOpen ? (
        <button
          type="button"
          onClick={() => setIsSearchOpen(true)}
          className="absolute top-4 left-14 z-[500] bg-slate-900/90 hover:bg-slate-800 text-amber-400 p-2.5 rounded-xl border border-slate-700/80 shadow-2xl flex items-center gap-2 font-semibold text-xs transition-all active:scale-95"
          title="Buscar e centralizar ação no mapa"
        >
          <Search className="w-4 h-4" />
          <span className="hidden sm:inline text-slate-200">Pesquisar Ação</span>
        </button>
      ) : (
        <div className="absolute top-4 left-14 z-[500] bg-slate-900/95 border border-slate-700/90 rounded-2xl shadow-2xl p-3 w-80 space-y-2 font-sans animate-fadeIn backdrop-blur-md">
          {/* Caixa de Digitação com Botão de Fechar */}
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800">
            <Search className="w-4 h-4 text-amber-400 shrink-0" />
            <input
              type="text"
              autoFocus
              placeholder="Digite o nome da ação ou equipe..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent text-white text-xs focus:outline-none placeholder:text-slate-500"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="text-slate-500 hover:text-white text-xs font-bold px-1"
              >
                ✕
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsSearchOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 shrink-0"
              title="Fechar (ESC)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Lista de Opções Compatíveis que Centralizam no Mapa ao Selecionar */}
          {filteredSearchPoints.length === 0 ? (
            <div className="text-[11px] text-slate-500 p-3 text-center font-medium">
              Nenhuma ação encontrada.
            </div>
          ) : (
            <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1">
              {filteredSearchPoints.map((point) => {
                const region = regions?.find((r) => r.id === point.regionId);
                const baseColor = region?.color || '#8b5cf6';
                return (
                  <div
                    key={point.id}
                    onClick={() => {
                      setTargetLocation({ lat: point.latitude, lng: point.longitude, id: Date.now() });
                      setIsSearchOpen(false);
                    }}
                    className="p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-800 border border-slate-800/80 hover:border-amber-500/50 flex items-center justify-between cursor-pointer transition-all group"
                    title={`Clique para centralizar no mapa em ${point.name}`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: baseColor }} />
                      <div>
                        <strong className="text-white text-xs font-bold block group-hover:text-amber-300 transition-colors">
                          {point.name}
                        </strong>
                        <span className="text-[10px] text-slate-400 block line-clamp-1">
                          {point.assignedTeamName ? `Equipe: ${point.assignedTeamName}` : point.address}
                        </span>
                      </div>
                    </div>
                    <Crosshair className="w-3.5 h-3.5 text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

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
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapViewportController targetLocation={targetLocation} />
          <MapAutoBoundsFitter points={displayPoints} selectedRegionId={selectedRegionId} />

          {/* Círculos de Raio dos Pontos de Atuação */}
          {displayPoints.map((point) => {
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
                      <span className="text-indigo-300 font-medium">{point.name}</span>
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
