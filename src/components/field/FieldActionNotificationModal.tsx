import React from 'react';
import { ActionPoint, Team, User } from '../../types';
import { Bell, MapPin, Clock, Navigation, CheckCircle2, ChevronRight, Smartphone, Calendar, AlertTriangle } from 'lucide-react';

interface FieldActionNotificationModalProps {
  currentUser: User;
  team: Team;
  actionPoints: ActionPoint[];
  onClose: () => void;
  onSelectPoint?: (point: ActionPoint) => void;
}

export const FieldActionNotificationModal: React.FC<FieldActionNotificationModalProps> = ({
  currentUser,
  team,
  actionPoints,
  onClose,
  onSelectPoint
}) => {
  if (actionPoints.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn font-['Inter',sans-serif]">
      <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-emerald-950/40 border border-emerald-500/40 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 relative overflow-hidden">
        
        {/* Glow de Fundo */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Cabeçalho da Notificação */}
        <div className="flex items-start gap-3.5 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 shadow-lg shadow-emerald-500/20 animate-bounce">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold uppercase tracking-wider mb-1">
              <span>Aviso Importante de Campo</span>
            </div>
            <h2 className="text-lg font-black text-white leading-tight">
              Novas Ações Atribuídas!
            </h2>
            <p className="text-xs text-slate-300">
              Olá <strong className="text-emerald-300">{currentUser.name}</strong>, você e sua equipe (<strong className="text-white">{team.name}</strong>) possuem <span className="text-emerald-400 font-bold">{actionPoints.length} ação(ões)</span> agendada(s).
            </p>
          </div>
        </div>

        {/* Lista de Ações de Campo */}
        <div className="space-y-3 max-h-64 overflow-y-auto pr-1 relative z-10 scrollbar-none">
          {actionPoints.map((pt, idx) => (
            <div
              key={pt.id}
              onClick={() => {
                if (onSelectPoint) onSelectPoint(pt);
                onClose();
              }}
              className="bg-slate-950/80 border border-slate-800 hover:border-emerald-500/60 p-3.5 rounded-2xl space-y-2 transition-all cursor-pointer group shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] flex items-center justify-center font-bold">
                    {idx + 1}
                  </span>
                  <span>{pt.name}</span>
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  Raio: {pt.radiusMeters}m
                </span>
              </div>

              <div className="text-[11px] text-slate-400 flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="line-clamp-2">{pt.address}</span>
              </div>

              {pt.scheduledDate && (
                <div className="text-[10px] text-emerald-300 font-mono bg-slate-900/90 px-2.5 py-1 rounded-lg border border-emerald-500/20 flex items-center justify-between">
                  <span className="flex items-center gap-1 font-bold">
                    <Calendar className="w-3 h-3 text-emerald-400" />
                    <span>{pt.scheduledDate}</span>
                  </span>
                  <span className="flex items-center gap-1 font-bold">
                    <Clock className="w-3 h-3 text-emerald-400" />
                    <span>{pt.startTime || '08:00'} - {pt.endTime || '18:00'}</span>
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Botão de Confirmação */}
        <div className="pt-2 relative z-10 space-y-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 font-extrabold text-sm py-3.5 px-4 rounded-2xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>ESTOU CIENTE • IR PARA MINHAS AÇÕES</span>
          </button>
        </div>

      </div>
    </div>
  );
};
