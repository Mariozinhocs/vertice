import React, { useState } from 'react';
import { User, Region, ActionPoint, Team } from '../../types';
import { MapPin, Plus, CheckCircle2, Shield, Navigation, AlertCircle } from 'lucide-react';

interface CoordinatorActionsPanelProps {
  currentUser: User;
  region?: Region;
  actionPoints: ActionPoint[];
  teams: Team[];
  onAddActionPoint: (point: ActionPoint) => void;
}

export const CoordinatorActionsPanel: React.FC<CoordinatorActionsPanelProps> = ({
  currentUser,
  region,
  actionPoints,
  teams,
  onAddActionPoint
}) => {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState<number>(-23.5028);
  const [longitude, setLongitude] = useState<number>(-46.6247);
  const [radiusMeters, setRadiusMeters] = useState<number>(70);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Filtra apenas os pontos pertencentes à região/zona do coordenador
  const zoneRegionId = currentUser.regionId || region?.id || 'reg-3';
  const zonePoints = actionPoints.filter((p) => p.regionId === zoneRegionId);

  const handleGetCoordinates = () => {
    if (!navigator.geolocation) {
      alert('Geolocalização não suportada no seu navegador.');
      return;
    }
    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude);
        setLongitude(pos.coords.longitude);
        setIsGettingLocation(false);
      },
      (err) => {
        alert('Não foi possível obter a localização GPS atual.');
        setIsGettingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleCreatePoint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newPoint: ActionPoint = {
      id: `pt-${Date.now()}`,
      campaignId: 'cmp-2026-1',
      regionId: zoneRegionId,
      name: name.trim(),
      description: description.trim() || 'Ação de Campo Cadastrada pelo Coordenador',
      address: address.trim() || 'Endereço registrado na zona',
      latitude: Number(latitude),
      longitude: Number(longitude),
      radiusMeters: Number(radiusMeters) || 60,
      status: 'ativo'
    };

    onAddActionPoint(newPoint);
    setName('');
    setDescription('');
    setAddress('');
    setShowModal(false);
    setSuccessMsg(`Ação "${newPoint.name}" cadastrada com sucesso na ${currentUser.regionName || 'sua Zona'}!`);
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
              Ações de Campo — {currentUser.regionName || 'Zona Atribuída'}
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            Cadastre e gerencie os pontos georreferenciados onde as equipes da sua zona realizarão as ações e check-ins.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-amber-600/20 transition-all text-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Nova Ação</span>
        </button>
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
            Pontos de Ação Ativos ({zonePoints.length})
          </h2>
        </div>

        {zonePoints.length === 0 ? (
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-8 text-center text-xs text-slate-500 space-y-2">
            <MapPin className="w-8 h-8 mx-auto text-slate-600" />
            <p>Nenhuma ação cadastrada nesta zona ainda.</p>
            <p className="text-[11px] text-slate-600">Clique em "Cadastrar Nova Ação" acima para adicionar o primeiro ponto.</p>
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

      {/* Modal de Cadastro de Ação */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-400" />
                <span>Nova Ação — {currentUser.regionName || 'Zona'}</span>
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePoint} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Nome do Ponto / Ação</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Terminal Santana - Saída B"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Descrição da Ação</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ex: Distribuição de panfletos e abordagem"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Endereço de Referência</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Ex: Av. Cruzeiro do Sul, 3173"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={latitude}
                    onChange={(e) => setLatitude(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 text-xs"
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
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={handleGetCoordinates}
                  disabled={isGettingLocation}
                  className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1.5 font-medium"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>{isGettingLocation ? 'Buscando GPS...' : 'Usar minha localização atual'}</span>
                </button>

                <div className="flex items-center gap-1.5 text-slate-300">
                  <span>Raio:</span>
                  <input
                    type="number"
                    value={radiusMeters}
                    onChange={(e) => setRadiusMeters(Number(e.target.value))}
                    className="w-16 bg-slate-950 border border-slate-800 rounded px-1.5 py-0.5 text-center text-xs"
                  />
                  <span>m</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3 py-2 rounded-xl text-slate-400 hover:text-white text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow"
                >
                  Salvar Ação
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
