import React, { useState } from 'react';
import { CheckIn, CheckInStatus, AuditLog } from '../../types';
import { ShieldCheck, AlertTriangle, CheckCircle2, XCircle, Eye, Camera, Clock, MapPin, Search } from 'lucide-react';
import { format } from 'date-fns';

interface AuditPanelProps {
  checkIns: CheckIn[];
  auditLogs: AuditLog[];
  onAuditDecision: (checkInId: string, newStatus: CheckInStatus, reason: string) => void;
}

export const AuditPanel: React.FC<AuditPanelProps> = ({
  checkIns,
  auditLogs,
  onAuditDecision
}) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'logs'>('pending');
  const [selectedCheckIn, setSelectedCheckIn] = useState<CheckIn | null>(null);
  const [auditNotes, setAuditNotes] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const pendingAuditCheckIns = checkIns.filter(
    (c) => c.status === 'pendente_analise' || c.status === 'rejeitado'
  );

  const filteredCheckIns = pendingAuditCheckIns.filter(
    (c) =>
      c.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.coordinatorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.pointName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDecision = (newStatus: CheckInStatus) => {
    if (!selectedCheckIn) return;
    onAuditDecision(
      selectedCheckIn.id,
      newStatus,
      auditNotes.trim() || `Decisão de auditoria: ${newStatus.toUpperCase()}`
    );
    setSelectedCheckIn(null);
    setAuditNotes('');
  };

  return (
    <div className="space-y-6">
      
      {/* Cabeçalho do Painel de Auditoria */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-white">Central de Auditoria & Conformidade</h2>
            <p className="text-xs text-slate-400">
              Análise de inconsistências de geolocalização e validação de evidências fotográficas
            </p>
          </div>
        </div>

        {/* Abas */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === 'pending'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Pendentes de Auditoria ({pendingAuditCheckIns.length})
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === 'logs'
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Trilha de Auditoria ({auditLogs.length})
          </button>
        </div>
      </div>

      {activeTab === 'pending' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Lista de Registros para Auditoria */}
          <div className="lg:col-span-1 space-y-4">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Buscar equipe, coordenador ou ponto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 text-slate-200 pl-9 pr-4 py-2.5 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none placeholder-slate-500"
              />
            </div>

            {filteredCheckIns.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl text-center text-xs text-slate-400 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <p className="font-bold text-slate-200">Nenhuma inconsistência pendente!</p>
                <p>Todos os check-ins registrados foram validados com sucesso.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {filteredCheckIns.map((chk) => (
                  <div
                    key={chk.id}
                    onClick={() => setSelectedCheckIn(chk)}
                    className={`bg-slate-900 border p-4 rounded-xl cursor-pointer transition-all space-y-2.5 ${
                      selectedCheckIn?.id === chk.id
                        ? 'border-amber-500 bg-amber-500/5 shadow-lg'
                        : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-white">{chk.teamName}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 uppercase">
                        {chk.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="text-xs text-slate-300 space-y-1">
                      <p className="flex items-center space-x-1.5 text-slate-400">
                        <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{chk.pointName}</span>
                      </p>
                      <p className="flex items-center space-x-1.5 text-slate-400">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{format(new Date(chk.timestamp), 'HH:mm:ss')}</span>
                      </p>
                    </div>

                    <div className="text-[11px] text-amber-300/90 bg-slate-950 p-2 rounded-lg border border-slate-800/80">
                      {chk.statusReason}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Painel Detalhado de Inspeção e Decisão */}
          <div className="lg:col-span-2">
            {selectedCheckIn ? (
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-amber-400">Inspeção Detalhada</span>
                    <h3 className="text-lg font-extrabold text-white">{selectedCheckIn.teamName}</h3>
                  </div>
                  <span className="text-xs font-mono text-slate-400">{selectedCheckIn.id}</span>
                </div>

                {/* Foto Evidência com Marca d'água */}
                {selectedCheckIn.imageWatermarkUrl ? (
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                      Evidência Fotográfica com Marca d'água
                    </span>
                    <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-slate-950">
                      <img
                        src={selectedCheckIn.imageWatermarkUrl}
                        alt="Foto com Marca d'água"
                        className="w-full h-80 object-contain"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-center text-xs text-slate-400">
                    Nenhuma foto em anexo para este check-in.
                  </div>
                )}

                {/* Dados da Divergência */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase">Distância do Ponto</span>
                    <span className="text-amber-400 font-extrabold text-base">{selectedCheckIn.distanceCalculatedMeters} m</span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase">Precisão do GPS</span>
                    <span className="text-slate-200 font-bold text-base">±{selectedCheckIn.gpsAccuracyMeters} m</span>
                  </div>
                </div>

                {/* Formulário de Decisão da Auditoria */}
                <div className="space-y-3 pt-2">
                  <label className="block text-xs font-semibold text-slate-300">
                    Parecer do Auditor / Justificativa
                  </label>
                  <textarea
                    rows={2}
                    value={auditNotes}
                    onChange={(e) => setAuditNotes(e.target.value)}
                    placeholder="Informe a justificativa da aprovação ou rejeição..."
                    className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />

                  <div className="flex items-center space-x-3 pt-2">
                    <button
                      onClick={() => handleDecision('validado')}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/20"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Aprovar Registro</span>
                    </button>
                    <button
                      onClick={() => handleDecision('rejeitado')}
                      className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center space-x-2 shadow-lg shadow-rose-600/20"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Rejeitar Registro</span>
                    </button>
                  </div>
                </div>

              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 p-12 rounded-2xl text-center text-xs text-slate-400 space-y-2">
                <Eye className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="font-bold text-slate-300 text-sm">Selecione um registro na lista ao lado</p>
                <p>Para visualizar as evidências fotográficas e emitir seu parecer de auditoria.</p>
              </div>
            )}
          </div>

        </div>
      ) : (
        /* Trilha de Auditoria (Audit Logs) */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 font-bold text-sm text-white flex items-center space-x-2">
            <Clock className="w-4 h-4 text-indigo-400" />
            <span>Histórico de Trilha de Auditoria (Audit Trail)</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px]">
                <tr>
                  <th className="p-3">Data / Hora</th>
                  <th className="p-3">Usuário</th>
                  <th className="p-3">Perfil</th>
                  <th className="p-3">Ação</th>
                  <th className="p-3">Detalhes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-950/40">
                    <td className="p-3 font-mono text-slate-400">{format(new Date(log.timestamp), 'dd/MM/yyyy HH:mm:ss')}</td>
                    <td className="p-3 font-bold text-white">{log.userName}</td>
                    <td className="p-3">
                      <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px] uppercase font-semibold">
                        {log.userRole}
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-indigo-400">{log.action}</td>
                    <td className="p-3 text-slate-300">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
