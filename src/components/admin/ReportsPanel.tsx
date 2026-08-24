import React, { useState } from 'react';
import { Campaign, Team, ActionPoint, CheckIn, OperationalMetrics } from '../../types';
import { generateDailyPDFReport, exportDailyCSVReport } from '../../services/reportService';
import { FileText, Download, FileSpreadsheet, Calendar, CheckCircle2, AlertTriangle, Users } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ReportsPanelProps {
  campaign: Campaign;
  teams: Team[];
  actionPoints: ActionPoint[];
  checkIns: CheckIn[];
  metrics: OperationalMetrics;
  generatedBy: string;
}

export const ReportsPanel: React.FC<ReportsPanelProps> = ({
  campaign,
  teams,
  actionPoints,
  checkIns,
  metrics,
  generatedBy
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));

  const reportData = {
    campaign,
    dateStr: format(new Date(selectedDate), 'dd/MM/yyyy', { locale: ptBR }),
    metrics,
    teams,
    actionPoints,
    checkIns,
    generatedBy
  };

  return (
    <div className="space-y-6">
      
      {/* Cabeçalho da Central de Relatórios */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-600/10 border border-indigo-500/30 flex items-center justify-center">
            <FileText className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-white">Relatórios Diários da Operação</h2>
            <p className="text-xs text-slate-400">
              Consolidação de atividades de campo, presença de equipes e auditoria fotográfica
            </p>
          </div>
        </div>

        {/* Seletor de Data e Botões de Ação */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 text-xs">
            <Calendar className="w-4 h-4 text-indigo-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-white focus:outline-none cursor-pointer"
            />
          </div>

          <button
            onClick={() => generateDailyPDFReport(reportData)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-600/30 flex items-center space-x-2 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Baixar PDF Oficial</span>
          </button>

          <button
            onClick={() => exportDailyCSVReport(reportData)}
            className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs px-4 py-2.5 rounded-xl flex items-center space-x-2 transition-all"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* Pré-visualização do Relatório Diário */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase text-indigo-400 tracking-wider">Pré-visualização do Documento</span>
            <h3 className="text-base font-extrabold text-white">Relatório da Operação de Campo</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {format(new Date(selectedDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </span>
        </div>

        {/* Tabela Resumo */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px]">
              <tr>
                <th className="p-3">Equipe</th>
                <th className="p-3">Coordenador</th>
                <th className="p-3">Ponto Atribuído</th>
                <th className="p-3">Horário</th>
                <th className="p-3">Distância</th>
                <th className="p-3">Evidência</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {teams.map((team) => {
                const checkIn = checkIns.find((c) => c.teamId === team.id);
                const point = actionPoints.find((p) => team.assignedPointIds.includes(p.id));

                return (
                  <tr key={`rep-${team.id}`} className="hover:bg-slate-950/40">
                    <td className="p-3 font-bold text-white">{team.name}</td>
                    <td className="p-3">{team.coordinatorName}</td>
                    <td className="p-3 text-slate-400">{point ? point.name : 'Não cadastrado'}</td>
                    <td className="p-3 font-mono">{checkIn ? format(new Date(checkIn.timestamp), 'HH:mm') : '—'}</td>
                    <td className="p-3 font-mono text-indigo-400">{checkIn ? `${checkIn.distanceCalculatedMeters} m` : '—'}</td>
                    <td className="p-3">
                      {checkIn?.imageUrl ? (
                        <span className="text-emerald-400 font-bold">Sim</span>
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

      </div>

    </div>
  );
};
