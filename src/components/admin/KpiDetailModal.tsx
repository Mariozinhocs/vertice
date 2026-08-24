import React from 'react';
import { Team, ActionPoint, CheckIn, OperationalMetrics } from '../../types';
import { X, Users, CheckCircle2, AlertTriangle, MapPin, ExternalLink, Clock, Shield } from 'lucide-react';
import { format } from 'date-fns';

export type KpiModalType = 'teams' | 'validated' | 'pending' | 'points' | null;

interface KpiDetailModalProps {
  type: KpiModalType;
  metrics: OperationalMetrics;
  teams: Team[];
  actionPoints: ActionPoint[];
  checkIns: CheckIn[];
  onClose: () => void;
  onNavigateToAudit?: () => void;
}

export const KpiDetailModal: React.FC<KpiDetailModalProps> = ({
  type,
  metrics,
  teams,
  actionPoints,
  checkIns,
  onClose,
  onNavigateToAudit
}) => {
  if (!type) return null;

  const validatedCheckIns = checkIns.filter((c) => c.status === 'validado');
  const pendingCheckIns = checkIns.filter((c) => c.status === 'pendente_analise');
  const activeTeams = teams.filter((t) => t.status === 'ativa');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn font-['Inter',sans-serif]">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[85vh] flex flex-col">
        
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 shrink-0">
          <div className="flex items-center gap-2.5">
            {type === 'teams' && (
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Users className="w-4 h-4" />
              </div>
            )}
            {type === 'validated' && (
              <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            )}
            {type === 'pending' && (
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <AlertTriangle className="w-4 h-4" />
              </div>
            )}
            {type === 'points' && (
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <MapPin className="w-4 h-4" />
              </div>
            )}

            <div>
              <h2 className="text-base font-bold text-white">
                {type === 'teams' && `Equipes Ativas em Campo (${activeTeams.length})`}
                {type === 'validated' && `Check-ins Validados & Auditados (${validatedCheckIns.length})`}
                {type === 'pending' && `Check-ins em Análise de Auditoria (${pendingCheckIns.length})`}
                {type === 'points' && `Cobertura dos Pontos de Ação (${metrics.pointsAttended}/${actionPoints.length})`}
              </h2>
              <p className="text-[11px] text-slate-400">
                {type === 'teams' && 'Detalhamento das equipes mobilizadas em Manaus hoje'}
                {type === 'validated' && 'Registros com fotos e raio GPS aprovados pela auditoria'}
                {type === 'pending' && 'Registros que necessitam de aprovação manual ou revisão'}
                {type === 'points' && 'Status de atendimento dos pontos de mobilização previstos'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-all text-xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Conteúdo Dinâmico */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
          
          {/* TIPO: EQUIPES */}
          {type === 'teams' && (
            <div className="space-y-2.5">
              {activeTeams.map((team) => {
                const teamCheckIn = checkIns.find((c) => c.teamId === team.id);
                return (
                  <div
                    key={team.id}
                    className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-white text-sm">{team.name}</h3>
                        <p className="text-slate-400 text-[11px]">Coordenador: {team.coordinatorName}</p>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase">
                        {teamCheckIn ? 'Em Ação (Check-in OK)' : 'Aguardando Chegada'}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex flex-wrap gap-2 text-[11px] text-slate-300">
                      <span className="text-slate-400">Integrantes ({team.members.length}):</span>
                      {team.members.map((m) => (
                        <span key={m.id} className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                          {m.name} ({m.role})
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TIPO: CHECK-INS VALIDADOS */}
          {type === 'validated' && (
            <div className="space-y-2.5">
              {validatedCheckIns.map((chk) => (
                <div
                  key={chk.id}
                  className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 flex flex-col sm:flex-row gap-3 items-start"
                >
                  {chk.imageWatermarkUrl && (
                    <img
                      src={chk.imageWatermarkUrl}
                      alt="Evidência"
                      className="w-full sm:w-28 h-20 object-cover rounded-lg border border-slate-800 shrink-0"
                    />
                  )}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-white text-sm">{chk.pointName}</h3>
                      <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                        {chk.distanceCalculatedMeters}m do ponto (OK)
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300">{chk.teamName} • {chk.coordinatorName}</p>
                    <p className="text-[11px] text-slate-400 italic">"{chk.notes}"</p>
                    <div className="text-[10px] text-slate-500 flex items-center gap-1 pt-1">
                      <Clock className="w-3 h-3" />
                      <span>{format(new Date(chk.timestamp), 'dd/MM/yyyy HH:mm')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TIPO: PENDENTES DE AUDITORIA */}
          {type === 'pending' && (
            <div className="space-y-3">
              {pendingCheckIns.length === 0 ? (
                <div className="text-center py-8 text-slate-500 space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                  <p>Todos os check-ins do dia foram auditados com sucesso!</p>
                </div>
              ) : (
                pendingCheckIns.map((chk) => (
                  <div
                    key={chk.id}
                    className="bg-slate-950/70 border border-amber-500/30 rounded-xl p-3.5 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-white text-sm">{chk.pointName}</h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                        Aguardando Auditoria
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300">{chk.teamName} • Distância: {chk.distanceCalculatedMeters}m</p>
                    <p className="text-[11px] text-slate-400 italic">"{chk.notes}"</p>
                  </div>
                ))
              )}

              {onNavigateToAudit && pendingCheckIns.length > 0 && (
                <button
                  onClick={() => {
                    onClose();
                    onNavigateToAudit();
                  }}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center justify-center gap-2 transition-all shadow"
                >
                  <Shield className="w-4 h-4" />
                  <span>Ir para Central de Auditoria</span>
                </button>
              )}
            </div>
          )}

          {/* TIPO: PONTOS DE ATUAÇÃO ATENDIDOS */}
          {type === 'points' && (
            <div className="space-y-2.5">
              {actionPoints.map((point) => {
                const attendedCheckIn = checkIns.find((c) => c.actionPointId === point.id);
                return (
                  <div
                    key={point.id}
                    className={`bg-slate-950/70 border rounded-xl p-3 flex items-center justify-between ${
                      attendedCheckIn ? 'border-indigo-500/40' : 'border-slate-800'
                    }`}
                  >
                    <div>
                      <h3 className="font-bold text-white text-xs">{point.name}</h3>
                      <p className="text-[11px] text-slate-400">{point.address}</p>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase border ${
                        attendedCheckIn
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {attendedCheckIn ? '🟢 Atendido Hoje' : '⚪ Pendente'}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
