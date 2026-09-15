import React, { useState, useMemo } from 'react';
import { Campaign, Team, ActionPoint, CheckIn, OperationalMetrics, Region, User } from '../../types';
import { generatePDFReport, exportCSVReport, ReportPeriodType, WeeklyTeamSummary } from '../../services/reportService';
import { FileText, Download, FileSpreadsheet, Calendar, CheckCircle2, AlertTriangle, Users, TrendingUp, Filter, Clock, Edit3 } from 'lucide-react';
import { format, startOfWeek, endOfWeek, subWeeks, parseISO, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CampaignModal } from './CampaignModal';

interface ReportsPanelProps {
  campaign: Campaign;
  teams: Team[];
  regions?: Region[];
  users?: User[];
  actionPoints: ActionPoint[];
  checkIns: CheckIn[];
  metrics: OperationalMetrics;
  generatedBy: string;
  onUpdateCampaign?: (updatedCampaign: Campaign) => void;
}

export const ReportsPanel: React.FC<ReportsPanelProps> = ({
  campaign,
  teams,
  regions = [],
  users = [],
  actionPoints,
  checkIns,
  metrics,
  generatedBy,
  onUpdateCampaign
}) => {
  const [showCampaignModal, setShowCampaignModal] = useState<boolean>(false);
  const [periodMode, setPeriodMode] = useState<ReportPeriodType>('daily');
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));

  // Resolução Inteligente da Base/Zona da Equipe
  const getTeamRegionName = (team: Team) => {
    if (team.regionId) {
      const r = regions.find((reg) => reg.id === team.regionId);
      if (r) return r.name;
    }
    const coord = users.find((u) => u.id === team.coordinatorId || u.name === team.coordinatorName);
    if (coord) {
      if (coord.regionName) return coord.regionName;
      if (coord.regionId) {
        const r = regions.find((reg) => reg.id === coord.regionId);
        if (r) return r.name;
      }
    }
    return '—';
  };

  // Datas da semana (Segunda a Domingo)
  const today = new Date();
  const defaultWeekStart = format(startOfWeek(today, { weekStartsOn: 1 }), 'yyyy-MM-dd');
  const defaultWeekEnd = format(endOfWeek(today, { weekStartsOn: 1 }), 'yyyy-MM-dd');

  const [startDate, setStartDate] = useState<string>(defaultWeekStart);
  const [endDate, setEndDate] = useState<string>(defaultWeekEnd);

  // Presets Rápidos de Data
  const applyPresetThisWeek = () => {
    setStartDate(format(startOfWeek(today, { weekStartsOn: 1 }), 'yyyy-MM-dd'));
    setEndDate(format(endOfWeek(today, { weekStartsOn: 1 }), 'yyyy-MM-dd'));
  };

  const applyPresetLastWeek = () => {
    const lastWeek = subWeeks(today, 1);
    setStartDate(format(startOfWeek(lastWeek, { weekStartsOn: 1 }), 'yyyy-MM-dd'));
    setEndDate(format(endOfWeek(lastWeek, { weekStartsOn: 1 }), 'yyyy-MM-dd'));
  };

  // Check-ins filtrados com base no modo (Diário ou Semanal)
  const periodCheckIns = useMemo(() => {
    return checkIns.filter((c) => {
      if (!c.timestamp) return false;
      const cDate = parseISO(c.timestamp);

      if (periodMode === 'daily') {
        const targetDate = new Date(selectedDate + 'T00:00:00');
        return isSameDay(cDate, targetDate);
      } else {
        const start = new Date(startDate + 'T00:00:00');
        const end = new Date(endDate + 'T23:59:59');
        return cDate >= start && cDate <= end;
      }
    });
  }, [checkIns, periodMode, selectedDate, startDate, endDate]);

  // Métricas Consolidadas do Período Selecionado
  const periodMetrics = useMemo(() => {
    const activeTeamIds = new Set(periodCheckIns.map((c) => c.teamId));
    const attendedPointIds = new Set(periodCheckIns.map((c) => c.actionPointId));
    const validated = periodCheckIns.filter((c) => c.status === 'validado').length;
    const inAnalysis = periodCheckIns.filter((c) => c.status === 'pendente_analise').length;
    const rejected = periodCheckIns.filter((c) => c.status === 'rejeitado').length;
    const evidences = periodCheckIns.filter((c) => c.imageUrl).length;

    return {
      totalTeams: teams.length,
      teamsActive: activeTeamIds.size,
      pointsAttended: attendedPointIds.size,
      totalActionPoints: actionPoints.length,
      checkInsValidated: validated,
      checkInsInAnalysis: inAnalysis,
      checkInsRejected: rejected,
      totalEvidences: evidences
    };
  }, [teams, actionPoints, periodCheckIns]);

  // Resumo Semanal por Equipe (Agregação para modo semanal)
  const weeklySummaries: WeeklyTeamSummary[] = useMemo(() => {
    return teams.map((team) => {
      const teamCheckIns = periodCheckIns.filter((c) => c.teamId === team.id);
      const val = teamCheckIns.filter((c) => c.status === 'validado').length;
      const ana = teamCheckIns.filter((c) => c.status === 'pendente_analise').length;
      const rej = teamCheckIns.filter((c) => c.status === 'rejeitado').length;
      const visitedPoints = new Set(teamCheckIns.map((c) => c.actionPointId)).size;
      const total = teamCheckIns.length;
      const complianceRate = total > 0 ? Math.round((val / total) * 100) : 0;
      const regionName = getTeamRegionName(team);

      const sortedTimes = teamCheckIns
        .map((c) => c.timestamp)
        .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

      return {
        teamId: team.id,
        teamName: team.name,
        regionName,
        coordinatorName: team.coordinatorName,
        totalCheckIns: total,
        validatedCheckIns: val,
        inAnalysisCheckIns: ana,
        rejectedCheckIns: rej,
        pointsVisitedCount: visitedPoints,
        lastCheckInDate: sortedTimes[0],
        complianceRate
      };
    });
  }, [teams, regions, users, periodCheckIns]);

  // Rótulo amigável do período
  const dateLabel = useMemo(() => {
    if (periodMode === 'daily') {
      return format(new Date(selectedDate + 'T00:00:00'), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } else {
      const startFormatted = format(new Date(startDate + 'T00:00:00'), 'dd/MM/yyyy', { locale: ptBR });
      const endFormatted = format(new Date(endDate + 'T00:00:00'), 'dd/MM/yyyy', { locale: ptBR });
      return `${startFormatted} a ${endFormatted}`;
    }
  }, [periodMode, selectedDate, startDate, endDate]);

  const handleExportPDF = () => {
    generatePDFReport({
      campaign,
      periodMode,
      dateStr: dateLabel,
      metrics: periodMetrics,
      teams,
      regions,
      users,
      actionPoints,
      checkIns: periodCheckIns,
      weeklySummaries,
      generatedBy
    });
  };

  const handleExportCSV = () => {
    exportCSVReport({
      campaign,
      periodMode,
      dateStr: dateLabel,
      metrics: periodMetrics,
      teams,
      regions,
      users,
      actionPoints,
      checkIns: periodCheckIns,
      weeklySummaries,
      generatedBy
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Modal de Edição da Campanha */}
      {showCampaignModal && onUpdateCampaign && (
        <CampaignModal
          campaign={campaign}
          onClose={() => setShowCampaignModal(false)}
          onSave={onUpdateCampaign}
        />
      )}

      {/* Cabeçalho da Central de Relatórios */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-600/10 border border-indigo-500/30 flex items-center justify-center">
            <FileText className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-extrabold text-white">Central de Relatórios Operacionais</h2>
              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-bold px-2 py-0.5 rounded-full border border-indigo-500/30 uppercase">
                Exclusivo Super Admin
              </span>
              {onUpdateCampaign && (
                <button
                  onClick={() => setShowCampaignModal(true)}
                  className="bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 text-[11px] px-2.5 py-1 rounded-lg font-bold flex items-center space-x-1 transition-all cursor-pointer"
                  title="Editar Dados da Campanha (Nome, Candidato, etc)"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Editar Dados da Campanha</span>
                </button>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Campanha Ativa: <strong className="text-slate-200">{campaign.name}</strong> ({campaign.candidateName || 'Candidato'}) — Consolidados com raio GPS e evidências
            </p>
          </div>
        </div>

        {/* Botões de Download PDF & CSV */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportPDF}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-600/30 flex items-center space-x-2 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Baixar PDF Oficial</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs px-4 py-2.5 rounded-xl flex items-center space-x-2 transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* Painel de Controles: Seletor de Periodicidade e Filtro de Datas */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          
          {/* Alternador de Periodicidade: Diário vs Semanal */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setPeriodMode('daily')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 ${
                periodMode === 'daily'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Relatório Diário</span>
            </button>

            <button
              onClick={() => setPeriodMode('weekly')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 ${
                periodMode === 'weekly'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Consolidado Semanal</span>
            </button>
          </div>

          {/* Seletores de Data baseados na Periodicidade */}
          {periodMode === 'daily' ? (
            <div className="flex items-center space-x-3">
              <label className="text-xs text-slate-400 font-medium flex items-center space-x-1.5">
                <Calendar className="w-4 h-4 text-indigo-400" />
                <span>Data de Referência:</span>
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
              />
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center space-x-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
                <Calendar className="w-4 h-4 text-indigo-400" />
                <span className="text-slate-400">De:</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-transparent text-white focus:outline-none cursor-pointer"
                />
                <span className="text-slate-400">Até:</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-transparent text-white focus:outline-none cursor-pointer"
                />
              </div>

              {/* Presets Rápidos */}
              <div className="flex items-center space-x-2 text-xs">
                <button
                  onClick={applyPresetThisWeek}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-2.5 py-1.5 rounded-lg border border-slate-700 transition-all"
                >
                  Esta Semana
                </button>
                <button
                  onClick={applyPresetLastWeek}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-2.5 py-1.5 rounded-lg border border-slate-700 transition-all"
                >
                  Semana Passada
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Cards KPI Rápidos do Período Selecionado */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-1">
          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Equipes Ativas</span>
            <div className="text-lg font-black text-white mt-0.5">
              {periodMetrics.teamsActive} <span className="text-xs font-normal text-slate-500">/ {periodMetrics.totalTeams}</span>
            </div>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Pontos Atendidos</span>
            <div className="text-lg font-black text-indigo-400 mt-0.5">
              {periodMetrics.pointsAttended} <span className="text-xs font-normal text-slate-500">/ {periodMetrics.totalActionPoints}</span>
            </div>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Check-ins Validados</span>
            <div className="text-lg font-black text-emerald-400 mt-0.5">
              {periodMetrics.checkInsValidated}
            </div>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Evidências Fotografadas</span>
            <div className="text-lg font-black text-purple-400 mt-0.5">
              {periodMetrics.totalEvidences}
            </div>
          </div>
        </div>
      </div>

      {/* Pré-visualização do Documento */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase text-indigo-400 tracking-wider">
              {periodMode === 'daily' ? 'Pré-visualização do Relatório Diário' : 'Pré-visualização do Consolidado Semanal'}
            </span>
            <h3 className="text-base font-extrabold text-white">
              {periodMode === 'daily' ? 'Operação de Campo - Detalhamento por Ponto' : 'Performance Semanal das Equipes'}
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono font-medium">
            {dateLabel}
          </span>
        </div>

        {/* VISÃO DIÁRIA */}
        {periodMode === 'daily' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px]">
                <tr>
                  <th className="p-3">Equipe</th>
                  <th className="p-3">Base / Zona</th>
                  <th className="p-3">Coordenador</th>
                  <th className="p-3">Ponto Atribuído</th>
                  <th className="p-3">Horário</th>
                  <th className="p-3">Distância GPS</th>
                  <th className="p-3">Evidência</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {teams.map((team) => {
                  const checkIn = periodCheckIns.find((c) => c.teamId === team.id);
                  const point = actionPoints.find((p) => team.assignedPointIds.includes(p.id));
                  const regionName = getTeamRegionName(team);

                  return (
                    <tr key={`rep-${team.id}`} className="hover:bg-slate-950/40">
                      <td className="p-3 font-bold text-white">{team.name}</td>
                      <td className="p-3 text-indigo-300 font-semibold">{regionName}</td>
                      <td className="p-3 text-slate-300">{team.coordinatorName}</td>
                      <td className="p-3 text-slate-400">{point ? point.name : 'Não cadastrado'}</td>
                      <td className="p-3 font-mono">{checkIn ? format(new Date(checkIn.timestamp), 'HH:mm') : '—'}</td>
                      <td className="p-3 font-mono text-indigo-400">{checkIn ? `${checkIn.distanceCalculatedMeters} m` : '—'}</td>
                      <td className="p-3">
                        {checkIn?.imageUrl ? (
                          <span className="text-emerald-400 font-bold">Sim (Anexa)</span>
                        ) : (
                          <span className="text-slate-500">Não</span>
                        )}
                      </td>
                      <td className="p-3">
                        {checkIn ? (
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              checkIn.status === 'validado'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                : checkIn.status === 'pendente_analise'
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                                : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                            }`}
                          >
                            {checkIn.status.replace('_', ' ')}
                          </span>
                        ) : (
                          <span className="text-slate-500">Sem Check-in</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* VISÃO SEMANAL */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px]">
                <tr>
                  <th className="p-3">Equipe</th>
                  <th className="p-3">Base / Zona</th>
                  <th className="p-3">Coordenador</th>
                  <th className="p-3 text-center">Total Check-ins</th>
                  <th className="p-3 text-center">Validados</th>
                  <th className="p-3 text-center">Rejeitados</th>
                  <th className="p-3 text-center">Pontos Visitados</th>
                  <th className="p-3 text-center">Taxa Aprovação</th>
                  <th className="p-3">Última Atividade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {weeklySummaries.map((sum) => (
                  <tr key={`weekly-${sum.teamId}`} className="hover:bg-slate-950/40">
                    <td className="p-3 font-bold text-white">{sum.teamName}</td>
                    <td className="p-3 text-indigo-300 font-semibold">{sum.regionName}</td>
                    <td className="p-3 text-slate-300">{sum.coordinatorName}</td>
                    <td className="p-3 text-center font-mono font-bold text-slate-200">{sum.totalCheckIns}</td>
                    <td className="p-3 text-center font-mono text-emerald-400 font-bold">{sum.validatedCheckIns}</td>
                    <td className="p-3 text-center font-mono text-rose-400 font-bold">{sum.rejectedCheckIns}</td>
                    <td className="p-3 text-center font-mono text-indigo-300">{sum.pointsVisitedCount}</td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        sum.complianceRate >= 80
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : sum.complianceRate >= 50
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      }`}>
                        {sum.complianceRate}%
                      </span>
                    </td>
                    <td className="p-3 font-mono text-slate-400">
                      {sum.lastCheckInDate ? format(parseISO(sum.lastCheckInDate), 'dd/MM/yyyy HH:mm') : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

    </div>
  );
};

