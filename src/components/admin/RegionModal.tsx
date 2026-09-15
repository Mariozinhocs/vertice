import React, { useState } from 'react';
import { Region } from '../../types';
import { X, Map, Palette, FileText, CheckCircle2 } from 'lucide-react';

interface RegionModalProps {
  region?: Region | null;
  onClose: () => void;
  onSave: (region: Region) => void;
  onDelete?: (regionId: string) => void;
}

export const RegionModal: React.FC<RegionModalProps> = ({
  region,
  onClose,
  onSave,
  onDelete
}) => {
  const isEditing = !!region;

  const [name, setName] = useState(region?.name || '');
  const [description, setDescription] = useState(region?.description || '');
  const [color, setColor] = useState(region?.color || '#6366f1');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newRegion: Region = {
      id: region?.id || `reg-${Date.now()}`,
      campaignId: region?.campaignId || 'cmp-manaus-2026',
      name: name.trim(),
      description: description.trim(),
      color
    };

    onSave(newRegion);
    onClose();
  };

  const handleDelete = () => {
    if (region && onDelete) {
      if (confirm(`Tem certeza que deseja excluir a base/zona "${region.name}"?`)) {
        onDelete(region.id);
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn font-['Inter',sans-serif]">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5">
        
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Map className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {isEditing ? 'Editar Base / Zona' : 'Cadastrar Nova Base / Zona'}
              </h2>
              <p className="text-[11px] text-slate-400">Configure regiões geográficas e áreas de atuação</p>
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
          
          <div className="space-y-1">
            <label className="text-slate-300 font-medium">Nome da Base / Zona Eleitoral</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Zona Centro-Norte / Base Flores"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-medium">Descrição / Bairros Cobertos</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Flores, Parque 10, Adrianópolis e conjuntos habitacionais"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-purple-500 placeholder-slate-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-medium flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-purple-400" />
              <span>Cor de Destaque no Mapa</span>
            </label>
            <div className="flex items-center gap-3 bg-slate-950 p-2 rounded-xl border border-slate-800">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
              />
              <span className="font-mono text-slate-300 text-xs uppercase font-bold">{color}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            {isEditing && onDelete ? (
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center gap-1 text-red-400 hover:text-red-300 text-xs px-2.5 py-1.5 rounded-lg hover:bg-red-500/10 transition-all border border-red-500/20"
              >
                <span>Excluir Base / Zona</span>
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
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isEditing ? 'Salvar Alterações' : 'Criar Base / Zona'}</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
