import React, { useState } from 'react';
import { ActionPoint, Region } from '../../types';
import { X, MapPin, Navigation, Trash2, CheckCircle2 } from 'lucide-react';

interface ActionPointModalProps {
  actionPoint?: ActionPoint | null;
  regions: Region[];
  onClose: () => void;
  onSave: (point: ActionPoint) => void;
  onDelete?: (pointId: string) => void;
}

export const ActionPointModal: React.FC<ActionPointModalProps> = ({
  actionPoint,
  regions,
  onClose,
  onSave,
  onDelete
}) => {
  const isEditing = !!actionPoint;

  const [name, setName] = useState(actionPoint?.name || '');
  const [description, setDescription] = useState(actionPoint?.description || '');
  const [address, setAddress] = useState(actionPoint?.address || '');
  const [regionId, setRegionId] = useState(actionPoint?.regionId || regions[0]?.id || 'reg-norte-1');
  const [latitude, setLatitude] = useState<number>(actionPoint?.latitude || -3.1190);
  const [longitude, setLongitude] = useState<number>(actionPoint?.longitude || -60.0217);
  const [radiusMeters, setRadiusMeters] = useState<number>(actionPoint?.radiusMeters || 70);
  const [status, setStatus] = useState<'ativo' | 'inativo'>(actionPoint?.status || 'ativo');
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocalização não suportada');
      return;
    }
    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude);
        setLongitude(pos.coords.longitude);
        setIsGettingLocation(false);
      },
      () => {
        alert('Não foi possível obter a posição GPS atual.');
        setIsGettingLocation(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const point: ActionPoint = {
      id: actionPoint?.id || `pt-${Date.now()}`,
      campaignId: actionPoint?.campaignId || 'cmp-manaus-2026',
      regionId,
      name: name.trim(),
      description: description.trim() || 'Ação de Campo Manaus',
      address: address.trim(),
      latitude: Number(latitude),
      longitude: Number(longitude),
      radiusMeters: Number(radiusMeters) || 70,
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
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
        
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {isEditing ? 'Editar Ponto de Atuação' : 'Cadastrar Ponto de Atuação'}
              </h2>
              <p className="text-[11px] text-slate-400">Configure localização, coordenadas e raio georreferenciado</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-all text-xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Nome do Ponto / Ação</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Terminal T3 - Cidade Nova"
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

          <div className="space-y-1">
            <label className="text-slate-300 font-medium">Endereço Completo</label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Ex: Av. Noel Nutels, s/n - Cidade Nova, Manaus - AM"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-medium">Descrição / Atividade Prevista</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Panfletagem, bandeirada e contato com eleitores"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
            />
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
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
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
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={handleGetLocation}
              disabled={isGettingLocation}
              className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 font-medium text-[11px]"
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
                  className="w-16 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-center text-white"
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
                className="flex items-center gap-1 text-red-400 hover:text-red-300 text-xs px-2.5 py-1.5 rounded-lg hover:bg-red-500/10 transition-all"
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
