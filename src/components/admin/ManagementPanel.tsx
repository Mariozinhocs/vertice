import React, { useState } from 'react';
import { ActionPoint, Team, Region, User } from '../../types';
import { Plus, MapPin, Users, Globe, Edit2, Trash2, CheckCircle2, Shield } from 'lucide-react';

interface ManagementPanelProps {
  actionPoints: ActionPoint[];
  teams: Team[];
  regions: Region[];
  users: User[];
  onAddActionPoint: (point: ActionPoint) => void;
  onAddTeam: (team: Team) => void;
}

export const ManagementPanel: React.FC<ManagementPanelProps> = ({
  actionPoints,
  teams,
  regions,
  users,
  onAddActionPoint,
  onAddTeam
}) => {
  const [activeTab, setActiveTab] = useState<'points' | 'teams' | 'regions'>('points');

  // Form Ponto State
  const [showPointModal, setShowPointModal] = useState<boolean>(false);
  const [pointName, setPointName] = useState<string>('');
  const [pointAddress, setPointAddress] = useState<string>('');
  const [pointLat, setPointLat] = useState<number>(-23.550520);
  const [pointLng, setPointLng] = useState<number>(-46.633308);
  const [pointRadius, setPointRadius] = useState<number>(60);
  const [selectedRegionId, setSelectedRegionId] = useState<string>(regions[0]?.id || 'reg-1');

  const handleCreatePoint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pointName || !pointAddress) return;

    const newPoint: ActionPoint = {
      id: `pt-${Date.now()}`,
      campaignId: 'cmp-2026-1',
      regionId: selectedRegionId,
      name: pointName,
      description: 'Ponto de atuação cadastrado pelo painel administrativo',
      address: pointAddress,
      latitude: pointLat,
      longitude: pointLng,
      radiusMeters: pointRadius,
      status: 'ativo'
    };

    onAddActionPoint(newPoint);
    setShowPointModal(false);
    setPointName('');
    setPointAddress('');
  };

  return (
    <div className="space-y-6">
      
      {/* Cabeçalho */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">
            <Users className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-white">Cadastros Operacionais & Equipes</h2>
            <p className="text-xs text-slate-400">
              Gerenciamento de Pontos de Atuação, Regiões Geográficas e Escalas das Equipes
            </p>
          </div>
        </div>

        {/* Abas */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('points')}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === 'points'
                ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Pontos de Atuação ({actionPoints.length})
          </button>
          <button
            onClick={() => setActiveTab('teams')}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === 'teams'
                ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Equipes ({teams.length})
          </button>
        </div>
      </div>

      {activeTab === 'points' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Pontos Cadastrados</h3>
            <button
              onClick={() => setShowPointModal(true)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-lg shadow-indigo-600/30 flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Ponto de Atuação</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {actionPoints.map((point) => (
              <div key={point.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-3 shadow-md">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-white">{point.name}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    Raio: {point.radiusMeters}m
                  </span>
                </div>
                <p className="text-xs text-slate-400">{point.address}</p>
                <div className="pt-2 border-t border-slate-800 flex justify-between text-[11px] text-slate-500 font-mono">
                  <span>LAT: {point.latitude.toFixed(5)}</span>
                  <span>LNG: {point.longitude.toFixed(5)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal de Cadastro de Ponto */}
      {showPointModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreatePoint} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">Cadastrar Ponto de Atuação</h3>
            
            <div>
              <label className="block text-xs text-slate-300 mb-1">Nome do Ponto</label>
              <input
                type="text"
                required
                value={pointName}
                onChange={(e) => setPointName(e.target.value)}
                placeholder="Ex: Praça Central - Entrada Metrô"
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">Endereço Completo</label>
              <input
                type="text"
                required
                value={pointAddress}
                onChange={(e) => setPointAddress(e.target.value)}
                placeholder="Ex: Av. Paulista, 1000 - Bela Vista"
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Latitude</label>
                <input
                  type="number"
                  step="any"
                  value={pointLat}
                  onChange={(e) => setPointLat(parseFloat(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Longitude</label>
                <input
                  type="number"
                  step="any"
                  value={pointLng}
                  onChange={(e) => setPointLng(parseFloat(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">Raio de Tolerância para Check-in (Metros)</label>
              <input
                type="number"
                value={pointRadius}
                onChange={(e) => setPointRadius(parseInt(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center space-x-3 pt-3">
              <button
                type="button"
                onClick={() => setShowPointModal(false)}
                className="w-1/3 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="w-2/3 bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30"
              >
                Salvar Ponto
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
