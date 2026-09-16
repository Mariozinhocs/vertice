import React, { useState, useEffect, useMemo } from 'react';
import { ActionPoint, Region, Team, User } from '../../types';
import { X, MapPin, Navigation, Trash2, Search, Map as MapIcon, Layers, Calendar, Clock, Users, CheckCircle2 } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Circle, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';

interface ActionPointModalProps {
  actionPoint?: ActionPoint | null;
  regions: Region[];
  teams?: Team[];
  users?: User[];
  currentUser?: User | null;
  onClose: () => void;
  onSave: (point: ActionPoint) => void;
  onDelete?: (pointId: string) => void;
}

// Ícone customizado para o marcador do seletor de localização
const createPickerMarkerIcon = () => {
  const svgHtml = `
    <div style="
      background-color: #6366f1;
      width: 32px;
      height: 32px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 14px rgba(99,102,241,0.6);
      border: 2.5px solid white;
      cursor: grab;
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
    className: 'custom-picker-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 32]
  });
};

// Componente para capturar o clique do usuário no mapa e recentralizar
const MapClickHandler: React.FC<{
  onSelectCoords: (lat: number, lng: number) => void;
}> = ({ onSelectCoords }) => {
  useMapEvents({
    click(e) {
      onSelectCoords(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

// Componente para reorientar o centro do mapa quando as coordenadas mudarem programmaticamente
const MapCenterUpdater: React.FC<{ lat: number; lng: number }> = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.setView([lat, lng], map.getZoom());
    }
  }, [lat, lng, map]);
  return null;
};

export const ActionPointModal: React.FC<ActionPointModalProps> = ({
  actionPoint,
  regions,
  teams = [],
  users = [],
  currentUser,
  onClose,
  onSave,
  onDelete
}) => {
  const availableTeams = useMemo(() => {
    if (!currentUser || currentUser.role === 'admin') {
      return teams;
    }
    // Cada coordenador só enxerga a sua própria equipe
    const myTeams = teams.filter(
      (t) =>
        t.coordinatorId === currentUser.id ||
        t.coordinatorName?.toLowerCase() === currentUser.name?.toLowerCase() ||
        t.id === currentUser.teamId
    );
    if (myTeams.length > 0) return myTeams;
    return teams.filter((t) => t.regionId === currentUser.regionId);
  }, [teams, currentUser]);

  const isEditing = !!actionPoint;

  const [name, setName] = useState(actionPoint?.name || '');
  const [description, setDescription] = useState(actionPoint?.description || '');
  const [address, setAddress] = useState(actionPoint?.address || '');
  const [regionId, setRegionId] = useState(actionPoint?.regionId || regions[0]?.id || 'reg-norte-1');
  const [assignedTeamId, setAssignedTeamId] = useState(actionPoint?.assignedTeamId || '');
  const [latitude, setLatitude] = useState<number>(actionPoint?.latitude || -3.1190);
  const [longitude, setLongitude] = useState<number>(actionPoint?.longitude || -60.0217);
  const [radiusMeters, setRadiusMeters] = useState<number>(actionPoint?.radiusMeters || 70);
  const [scheduledDate, setScheduledDate] = useState<string>(actionPoint?.scheduledDate || new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState<string>(actionPoint?.startTime || '08:00');
  const [endTime, setEndTime] = useState<string>(actionPoint?.endTime || '18:00');
  const [status, setStatus] = useState<'ativo' | 'inativo'>(actionPoint?.status || 'ativo');
  
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [showMap, setShowMap] = useState(true);

  const markerIcon = useMemo(() => createPickerMarkerIcon(), []);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocalização não suportada no navegador');
      return;
    }
    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = Number(pos.coords.latitude.toFixed(6));
        const lng = Number(pos.coords.longitude.toFixed(6));
        setLatitude(lat);
        setLongitude(lng);
        setIsGettingLocation(false);
      },
      () => {
        alert('Não foi possível obter a posição GPS atual.');
        setIsGettingLocation(false);
      },
      { enableHighAccuracy: true }
    );
  };

  // Busca o endereço via OpenStreetMap Nominatim e atualiza o mapa
  const handleSearchAddressOnMap = async () => {
    if (!address.trim()) return;
    setIsGeocoding(true);
    try {
      const query = address.includes('Manaus') ? address : `${address}, Manaus - AM`;
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data && data.length > 0) {
        const first = data[0];
        setLatitude(Number(parseFloat(first.lat).toFixed(6)));
        setLongitude(Number(parseFloat(first.lon).toFixed(6)));
      } else {
        alert('Endereço não localizado no mapa. Tente selecionar clicando diretamente no mapa.');
      }
    } catch (err) {
      console.error('Erro de busca no mapa:', err);
    } finally {
      setIsGeocoding(false);
    }
  };

  // Efeito para fechar o modal com a tecla ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Trata a seleção direta por clique no mapa e realiza Reverse Geocoding Automático
  const handleMapSelect = async (clickedLat: number, clickedLng: number) => {
    const latFormatted = Number(clickedLat.toFixed(6));
    const lngFormatted = Number(clickedLng.toFixed(6));
    setLatitude(latFormatted);
    setLongitude(lngFormatted);
    setIsGeocoding(true);

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${clickedLat}&lon=${clickedLng}`
      );
      const data = await res.json();
      if (data && data.display_name) {
        setAddress(data.display_name);
      } else {
        setAddress(`Ponto no Mapa (${latFormatted}, ${lngFormatted})`);
      }
    } catch (err) {
      setAddress(`Ponto no Mapa (${latFormatted}, ${lngFormatted})`);
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const selectedTeam = teams.find((t) => t.id === assignedTeamId);

    const point: ActionPoint = {
      id: actionPoint?.id || `pt-${Date.now()}`,
      campaignId: actionPoint?.campaignId || 'cmp-manaus-2026',
      regionId,
      name: name.trim(),
      description: description.trim() || 'Ação de Campo Manaus',
      address: address.trim() || `Ponto no Mapa (${latitude}, ${longitude})`,
      latitude: Number(latitude),
      longitude: Number(longitude),
      radiusMeters: Number(radiusMeters) || 70,
      scheduledDate,
      startTime,
      endTime,
      assignedTeamId: assignedTeamId || undefined,
      assignedTeamName: selectedTeam?.name || undefined,
      status
    };

    onSave(point);
    onClose();
  };

  const handleDelete = () => {
    if (actionPoint && onDelete) {
      if (confirm(`Tem certeza que deseja excluir o ponto "${actionPoint.name}"?`)) {
        onDelete(actionPoint.id);
        onClose();
      }
    }
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn font-['Inter',sans-serif]">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {isEditing ? 'Editar Ponto de Atuação' : 'Cadastrar Ponto de Atuação'}
              </h2>
              <p className="text-[11px] text-slate-400">Selecione o local no mapa e defina o raio georreferenciado</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-all text-xs"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Seletor do Mapa Interativo Leaflet */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-semibold flex items-center gap-1.5 text-xs">
                <MapIcon className="w-4 h-4 text-indigo-400" />
                <span>Selecione a Posição Exata no Mapa (Clique para marcar)</span>
              </span>
              <button
                type="button"
                onClick={() => setShowMap(!showMap)}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{showMap ? 'Ocultar Mapa' : 'Exibir Mapa'}</span>
              </button>
            </div>

            {showMap && (
              <div className="relative w-full h-56 rounded-xl overflow-hidden border border-slate-800 shadow-inner bg-slate-950">
                <MapContainer
                  center={[latitude, longitude]}
                  zoom={14}
                  scrollWheelZoom={true}
                  style={{ width: '100%', height: '100%' }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <MapClickHandler onSelectCoords={handleMapSelect} />
                  <MapCenterUpdater lat={latitude} lng={longitude} />

                  {/* Círculo do Raio de Tolerância Geofence */}
                  <Circle
                    center={[latitude, longitude]}
                    radius={radiusMeters}
                    pathOptions={{
                      color: '#6366f1',
                      fillColor: '#6366f1',
                      fillOpacity: 0.2,
                      weight: 2,
                      dashArray: '4, 6'
                    }}
                  />

                  {/* Marcador arrastável do Ponto */}
                  <Marker
                    position={[latitude, longitude]}
                    icon={markerIcon}
                    draggable={true}
                    eventHandlers={{
                      dragend: (e) => {
                        const marker = e.target;
                        const pos = marker.getLatLng();
                        handleMapSelect(pos.lat, pos.lng);
                      },
                    }}
                  />
                </MapContainer>

                <div className="absolute bottom-2 right-2 bg-slate-950/85 backdrop-blur-md text-[10px] text-indigo-300 font-semibold px-2.5 py-1 rounded-md border border-slate-800 shadow">
                  Clique ou arraste o pino no mapa
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Nome do Ponto / Ação</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Digite o nome da ação ou ponto de atuação"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Zona / Região</label>
              <select
                value={regionId}
                onChange={(e) => setRegionId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                {regions.map((reg) => (
                  <option key={reg.id} value={reg.id}>
                    {reg.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Atribuição de Equipe / Responsável */}
          <div className="space-y-1">
            <label className="text-slate-300 font-medium flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-indigo-400" />
              <span>Atribuir a uma Equipe ou Agente de Campo</span>
            </label>
            <select
              value={assignedTeamId}
              onChange={(e) => setAssignedTeamId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="">-- Nenhuma equipe atribuída (Geral / Livre) --</option>
              {availableTeams.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} (Coordenador: {t.coordinatorName})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-slate-300 font-medium">Endereço Completo</label>
              <button
                type="button"
                onClick={handleSearchAddressOnMap}
                disabled={isGeocoding}
                className="text-[10px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
              >
                <Search className="w-3 h-3" />
                <span>{isGeocoding ? 'Buscando no mapa...' : 'Localizar Endereço no Mapa'}</span>
              </button>
            </div>
            <div className="relative">
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Preenchido via mapa ou digite um endereço"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500 pr-20"
              />
              <button
                type="button"
                onClick={handleSearchAddressOnMap}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 text-[10px] px-2 py-1 rounded-md font-semibold border border-indigo-500/30"
              >
                Buscar Mapa
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-medium">Descrição / Atividade Prevista</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrição das atividades e orientações operacionais"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Seção de Agendamento Operacional (Data e Hora) */}
          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
              <Calendar className="w-4 h-4 text-indigo-400" />
              <span>Agenda da Ação (Data & Horário de Funcionamento)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="space-y-1">
                <label className="text-[11px] text-slate-400 font-medium">Data Agendada</label>
                <input
                  type="date"
                  required
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-slate-400 font-medium">Hora Início</label>
                <input
                  type="time"
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-slate-400 font-medium">Hora Término</label>
                <input
                  type="time"
                  required
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Latitude</label>
              <input
                type="number"
                step="any"
                required
                value={latitude}
                onChange={(e) => setLatitude(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 font-mono text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Longitude</label>
              <input
                type="number"
                step="any"
                required
                value={longitude}
                onChange={(e) => setLongitude(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 font-mono text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={handleGetLocation}
              disabled={isGettingLocation}
              className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 font-semibold text-[11px]"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>{isGettingLocation ? 'Buscando GPS...' : 'Usar minha localização atual'}</span>
            </button>

            <div className="flex items-center gap-2">
              <label className="text-slate-300">Raio de Tolerância:</label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={radiusMeters}
                  onChange={(e) => setRadiusMeters(Number(e.target.value))}
                  className="w-16 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-center text-white font-bold"
                />
                <span className="text-slate-400">m</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            {isEditing && onDelete ? (
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center gap-1 text-rose-400 hover:text-rose-300 text-xs px-2.5 py-1.5 rounded-lg hover:bg-rose-500/10 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Excluir Ponto</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white transition-all text-xs"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all"
              >
                {isEditing ? 'Salvar Alterações' : 'Criar Ponto'}
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
};

