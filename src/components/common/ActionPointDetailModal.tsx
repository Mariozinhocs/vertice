import React from 'react';
import { ActionPoint, CheckIn, Team } from '../../types';
import { getImageUrl } from '../../services/imageService';
import { X, MapPin, Calendar, Clock, Navigation, ExternalLink, Camera, Users, Radio } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Circle } from 'react-leaflet';
import L from 'leaflet';
import { format } from 'date-fns';

// Icone customizado do pino
const pointIcon = L.divIcon({
  className: 'custom-leaflet-marker',
  html: `<div style="background-color: #6366f1; width: 28px; height: 28px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.4);">
          <div style="background-color: white; width: 8px; height: 8px; border-radius: 50%;"></div>
        </div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14]
});

interface ActionPointDetailModalProps {
  point: ActionPoint;
  checkIns?: CheckIn[];
  team?: Team | null;
  regionName?: string;
  onClose: () => void;
  onCollectEvidence?: (point: ActionPoint) => void;
}

export const ActionPointDetailModal: React.FC<ActionPointDetailModalProps> = ({
  point,
  checkIns = [],
  team,
  regionName,
  onClose,
  onCollectEvidence
}) => {
  if (!point) return null;

  // Garantir coordenadas numéricas válidas (padrão Manaus se ausente)
  const lat = Number(point.latitude) || -3.119027;
  const lng = Number(point.longitude) || -60.021731;
  const radius = Number(point.radiusMeters) || 80;

  // Check-ins para este ponto
  const pointCheckIns = (checkIns || []).filter((c) => c && c.actionPointId === point.id);
  const isAttended = pointCheckIns.length > 0;
  const latestCheckIn = pointCheckIns[0];

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  const wazeUrl = `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn font-['Inter',sans-serif]">
      <div className="relative max-w-2xl w-full bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto text-slate-100">
        
        {/* Cabeçalho */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                  Ponto de Atuação / Evento
                </span>
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase border ${
                    isAttended
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  }`}
                >
                  {isAttended ? '🟢 Atendido em Campo' : '⚪ Pendente'}
                </span>
              </div>
              <h2 className="text-lg font-extrabold text-white mt-1">{point.name}</h2>
              <p className="text-xs text-slate-400">{regionName || 'Zona de Atuação'}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-all text-xs"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Botão de Destaque Principal: COLETAR EVIDÊNCIA */}
        {onCollectEvidence && (
          <button
            type="button"
            onClick={() => {
              onClose();
              onCollectEvidence(point);
            }}
            className="w-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 font-extrabold text-sm py-3.5 px-4 rounded-xl shadow-xl shadow-emerald-600/25 flex items-center justify-center space-x-2.5 transition-all cursor-pointer active:scale-[0.99]"
          >
            <Camera className="w-5 h-5 p-0.5 bg-slate-950/20 rounded-full text-slate-950 shrink-0" />
            <span>COLETAR EVIDÊNCIA FOTOGRÁFICA (CHECK-IN)</span>
          </button>
        )}

        {/* Mini Mapa Interativo com Raio GPS */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
            <span className="flex items-center gap-1.5 text-indigo-300">
              <Radio className="w-4 h-4 text-indigo-400" />
              Localização Georreferenciada & Raio GPS ({radius}m)
            </span>
          </div>

          <div className="relative w-full h-56 rounded-xl overflow-hidden border border-slate-800 shadow-inner bg-slate-950">
            {typeof window !== 'undefined' && (
              <MapContainer
                center={[lat, lng]}
                zoom={16}
                scrollWheelZoom={false}
                style={{ width: '100%', height: '100%' }}
              >
                <TileLayer
                  attribution='&copy; OpenStreetMap'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[lat, lng]} icon={pointIcon} />
                <Circle
                  center={[lat, lng]}
                  radius={radius}
                  pathOptions={{
                    color: '#6366f1',
                    fillColor: '#6366f1',
                    fillOpacity: 0.25,
                    weight: 2,
                    dashArray: '5, 5'
                  }}
                />
              </MapContainer>
            )}

            <div className="absolute bottom-2 left-2 right-2 bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between font-mono z-[1000]">
              <span>📍 LAT: {lat.toFixed(6)}, LNG: {lng.toFixed(6)}</span>
              <span className="text-indigo-400 font-sans font-semibold">Raio: {radius}m</span>
            </div>
          </div>
        </div>

        {/* Botões Principais de Navegação no Mapa (Google Maps & Waze) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-all cursor-pointer"
          >
            <Navigation className="w-4 h-4" />
            <span>Abrir no Google Maps</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </a>

          <a
            href={wazeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-lg shadow-sky-600/30 flex items-center justify-center space-x-2 transition-all cursor-pointer"
          >
            <Navigation className="w-4 h-4" />
            <span>Navegar via Waze</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </a>
        </div>

        {/* Detalhes do Ponto */}
        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3 text-xs">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Endereço Registrado</span>
            <p className="text-slate-200 font-medium leading-relaxed">{point.address || 'Endereço não cadastrado'}</p>
          </div>

          {point.description && (
            <div className="space-y-1 pt-2 border-t border-slate-800/80">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Descrição / Atividade</span>
              <p className="text-slate-300">{point.description}</p>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800/80">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-semibold">Data Agendada</span>
              <span className="text-indigo-300 font-mono font-semibold flex items-center gap-1 mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-400 inline" />
                {point.scheduledDate || 'Não especificada'}
              </span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-semibold">Horário Previsto</span>
              <span className="text-indigo-300 font-mono font-semibold flex items-center gap-1 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-indigo-400 inline" />
                {point.startTime || '08:00'} - {point.endTime || '18:00'}
              </span>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <span className="text-[10px] text-slate-400 block uppercase font-semibold">Equipe Atribuída</span>
              <span className="text-slate-200 font-semibold flex items-center gap-1 mt-0.5 truncate">
                <Users className="w-3.5 h-3.5 text-purple-400 inline shrink-0" />
                {point.assignedTeamName || team?.name || 'Livre / Nenhuma'}
              </span>
            </div>
          </div>
        </div>

        {/* Evidência/Check-in Registrado (se houver) */}
        {latestCheckIn && (
          <div className="space-y-2.5 bg-slate-950 p-4 rounded-xl border border-emerald-500/30">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Camera className="w-4 h-4" />
                <span>Última Evidência Registrada em Campo</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                {latestCheckIn.timestamp ? format(new Date(latestCheckIn.timestamp), 'dd/MM/yyyy HH:mm') : ''}
              </span>
            </div>

            {(latestCheckIn.imageWatermarkUrl || latestCheckIn.imageUrl) && (
              <div className="relative rounded-lg overflow-hidden border border-slate-800 max-h-48 bg-slate-900">
                <img
                  src={getImageUrl(latestCheckIn.imageWatermarkUrl || latestCheckIn.imageUrl)}
                  alt="Evidência Fotográfica"
                  className="w-full h-full object-cover max-h-48"
                />
              </div>
            )}

            <div className="flex justify-between items-center text-xs text-slate-300 pt-1">
              <span>Registrado por: <strong>{latestCheckIn.coordinatorName}</strong></span>
              <span className="text-indigo-400 font-mono">Precisão GPS: ±{latestCheckIn.gpsAccuracyMeters || 0}m</span>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
