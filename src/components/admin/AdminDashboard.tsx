import React, { useState } from 'react';
import { OperationalMetrics, CheckIn, Team, ActionPoint, Region } from '../../types';
import { Users, CheckCircle2, AlertTriangle, MapPin, Filter, Sparkles, ChevronRight } from 'lucide-react';
import { KpiDetailModal, KpiModalType } from './KpiDetailModal';

interface AdminDashboardProps {
  metrics: OperationalMetrics;
  teams: Team[];
  actionPoints: ActionPoint[];
  regions: Region[];
  checkIns: CheckIn[];
  selectedRegionId: string;
  onRegionChange: (regionId: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  onNavigateToAudit?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  metrics,
  teams,
  actionPoints,
  regions,
  checkIns,
  selectedRegionId,
  onRegionChange,
  selectedStatus,
  onStatusChange,
  onNavigateToAudit
}) => {
  const [modalType, setModalType] = useState<KpiModalType>(null);

  return (
    <div className="space-y-6 font-['Inter',sans-serif]">
      
      {/* Cards de KPIs Principais - Agora Totalmente Clicáveis */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Equipes Ativas */}
        <button
          type="button"
          onClick={() => setModalType('teams')}
          className="bg-slate-900/90 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/50 p-5 rounded-2xl shadow-xl space-y-2.5 text-left transition-all group cursor-pointer active:scale-[0.99]"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider group-hover:text-emerald-400 transition-colors">
              Equipes Ativas
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all">
              <Users className="w-5 h-5 text-emerald-400 group-hover:text-slate-950" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white">{metrics.teamsActive}</span>
            <span className="text-xs text-slate-400">/ {metrics.totalTeams} cadastradas</span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all"
              style={{ width: `${(metrics.teamsActive / (metrics.totalTeams || 1)) * 100}%` }}
            ></div>
          </div>
          <div className="flex items-center justify-between text-[11px] text-emerald-400 font-medium pt-0.5">
            <span>Ver equipes detalhadas</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </button>

        {/* KPI 2: Check-ins Validados */}
        <button
          type="button"
          onClick={() => setModalType('validated')}
          className="bg-slate-900/90 hover:bg-slate-800/80 border border-slate-800 hover:border-indigo-500/50 p-5 rounded-2xl shadow-xl space-y-2.5 text-left transition-all group cursor-pointer active:scale-[0.99]"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider group-hover:text-indigo-400 transition-colors">
              Check-ins Validados
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-all">
              <CheckCircle2 className="w-5 h-5 text-indigo-400 group-hover:text-white" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white">{metrics.checkInsValidated}</span>
            <span className="text-xs text-emerald-400 font-semibold">100% no raio</span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-indigo-500 h-full rounded-full transition-all"
              style={{ width: `${(metrics.checkInsValidated / (checkIns.length || 1)) * 100}%` }}
            ></div>
          </div>
          <div className="flex items-center justify-between text-[11px] text-indigo-400 font-medium pt-0.5">
            <span>Ver evidências validadas</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </button>

        {/* KPI 3: Em Análise / Divergentes */}
        <button
          type="button"
          onClick={() => {
            if (onNavigateToAudit) {
              onNavigateToAudit();
            } else {
              setModalType('pending');
            }
          }}
          className="bg-slate-900/90 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/50 p-5 rounded-2xl shadow-xl space-y-2.5 text-left transition-all group cursor-pointer active:scale-[0.99]"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider group-hover:text-amber-400 transition-colors">
              Em Análise / Auditoria
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-slate-950 transition-all">
              <AlertTriangle className="w-5 h-5 text-amber-400 group-hover:text-slate-950" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-amber-400">{metrics.checkInsInAnalysis}</span>
            <span className="text-xs text-slate-400">aguardando revisão</span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all"
              style={{ width: `${(metrics.checkInsInAnalysis / (checkIns.length || 1)) * 100}%` }}
            ></div>
          </div>
          <div className="flex items-center justify-between text-[11px] text-amber-400 font-medium pt-0.5">
            <span>Auditar pendências</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </button>

        {/* KPI 4: Pontos Atendidos */}
        <button
          type="button"
          onClick={() => setModalType('points')}
          className="bg-slate-900/90 hover:bg-slate-800/80 border border-slate-800 hover:border-purple-500/50 p-5 rounded-2xl shadow-xl space-y-2.5 text-left transition-all group cursor-pointer active:scale-[0.99]"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider group-hover:text-purple-400 transition-colors">
              Pontos Atendidos
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center group-hover:bg-purple-500 group-hover:text-white transition-all">
              <MapPin className="w-5 h-5 text-purple-400 group-hover:text-white" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white">{metrics.pointsAttended}</span>
            <span className="text-xs text-slate-400">/ {actionPoints.length} programados</span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-purple-500 h-full rounded-full transition-all"
              style={{ width: `${(metrics.pointsAttended / (actionPoints.length || 1)) * 100}%` }}
            ></div>
          </div>
          <div className="flex items-center justify-between text-[11px] text-purple-400 font-medium pt-0.5">
            <span>Ver cobertura de pontos</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </button>

      </div>

      {/* Modal de Detalhes dos KPIs */}
      <KpiDetailModal
        type={modalType}
        metrics={metrics}
        teams={teams}
        actionPoints={actionPoints}
        checkIns={checkIns}
        onClose={() => setModalType(null)}
        onNavigateToAudit={onNavigateToAudit}
      />

      {/* Barra de Filtros Operacionais */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">Filtros de Operação</span>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div>
            <label className="text-slate-400 mr-2">Região / Zona:</label>
            <select
              value={selectedRegionId}
              onChange={(e) => onRegionChange(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-slate-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
            >
              <option value="ALL">Todas as Zonas</option>
              {regions.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-slate-400 mr-2">Status:</label>
            <select
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-slate-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
            >
              <option value="ALL">Todos os Status</option>
              <option value="validado">Validado</option>
              <option value="pendente_analise">Pendente de Análise</option>
              <option value="rejeitado">Rejeitado</option>
            </select>
          </div>
        </div>
      </div>

    </div>
  );
};
