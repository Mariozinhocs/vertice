import React, { useState } from 'react';
import { CheckIn, ActionPoint } from '../../types';
import { getImageUrl } from '../../services/imageService';
import { Camera, Clock, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { format } from 'date-fns';

export type CameraTimeStatus = 'BEFORE_SCHEDULE' | 'IN_SCHEDULE_NO_CHECKIN' | 'CHECKIN_DONE';

interface CameraStatusBadgeProps {
  point?: ActionPoint | null;
  checkIn?: CheckIn | null;
  checkIns?: CheckIn[];
  startTime?: string;
  endTime?: string;
  scheduledDate?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  onOpenImage?: (checkIn: CheckIn) => void;
}

export const CameraStatusBadge: React.FC<CameraStatusBadgeProps> = ({
  point,
  checkIn: explicitCheckIn,
  checkIns = [],
  startTime = '08:00',
  endTime = '18:00',
  scheduledDate,
  size = 'md',
  showLabel = false,
  onOpenImage
}) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Determina o check-in correspondente
  const activeCheckIn = explicitCheckIn || (point ? checkIns.find(c =>
    c.actionPointId === point.id ||
    (c.pointName && point.name && c.pointName.toLowerCase().trim() === point.name.toLowerCase().trim())
  ) : null);

  // Determina horários
  const effectiveStartTime = point?.startTime || startTime || '08:00';
  const effectiveEndTime = point?.endTime || endTime || '18:00';
  const effectiveDate = point?.scheduledDate || scheduledDate || new Date().toISOString().split('T')[0];

  const now = new Date();
  const currentDateStr = now.toISOString().split('T')[0];
  const currentHHMM = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  let status: CameraTimeStatus = 'BEFORE_SCHEDULE';
  let colorClass = 'text-slate-400 border-slate-700 bg-slate-800/80 hover:bg-slate-700 hover:text-slate-200';
  let badgeLabel = `Antes do Horário (${effectiveStartTime})`;

  if (activeCheckIn) {
    status = 'CHECKIN_DONE';
    colorClass = 'text-emerald-400 border-emerald-500/50 bg-emerald-500/15 hover:bg-emerald-500/25 shadow-emerald-500/10';
    badgeLabel = 'Check-in Realizado (Foto Disponível)';
  } else if (effectiveDate > currentDateStr) {
    status = 'BEFORE_SCHEDULE';
    colorClass = 'text-slate-400 border-slate-700 bg-slate-800/80 hover:bg-slate-700 hover:text-slate-200';
    badgeLabel = `Agendado para ${effectiveDate}`;
  } else if (currentHHMM < effectiveStartTime) {
    status = 'BEFORE_SCHEDULE';
    colorClass = 'text-slate-400 border-slate-700 bg-slate-800/80 hover:bg-slate-700 hover:text-slate-200';
    badgeLabel = `Antes do Horário (Inicia ${effectiveStartTime})`;
  } else {
    // Está no horário (ou após o início) e sem check-in realizado
    status = 'IN_SCHEDULE_NO_CHECKIN';
    colorClass = 'text-rose-400 border-rose-500/50 bg-rose-500/15 hover:bg-rose-500/25 animate-pulse shadow-rose-500/20';
    badgeLabel = `No Horário - Sem Check-in (${effectiveStartTime} - ${effectiveEndTime})`;
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeCheckIn && onOpenImage) {
      onOpenImage(activeCheckIn);
    } else {
      setIsPreviewOpen(true);
    }
  };

  const iconSizeClasses = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const buttonSizeClasses = {
    sm: 'p-1 rounded-md text-[10px]',
    md: 'p-1.5 rounded-lg text-xs',
    lg: 'p-2 rounded-xl text-sm'
  };

  const hasPhoto = activeCheckIn && (activeCheckIn.imageWatermarkUrl || activeCheckIn.imageUrl);

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={`inline-flex items-center gap-1.5 border font-semibold transition-all cursor-pointer ${buttonSizeClasses[size]} ${colorClass}`}
        title={`${badgeLabel} - Clique para abrir imagem/detalhes`}
      >
        {/* Se tiver foto de evidência, exibe a miniatura real da foto, senão o ícone de câmera colorido */}
        {hasPhoto ? (
          <div className="relative w-5 h-5 rounded overflow-hidden border border-emerald-400/50 shrink-0 bg-slate-900">
            <img
              src={getImageUrl(activeCheckIn.imageWatermarkUrl || activeCheckIn.imageUrl)}
              alt="Evidência"
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <Camera className={`${iconSizeClasses[size]} shrink-0`} />
        )}

        {showLabel && <span className="truncate">{badgeLabel}</span>}
      </button>

      {/* Modal de Pré-visualização / Informação quando clicado */}
      {isPreviewOpen && (
        <div
          className="fixed inset-0 z-[100] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn font-['Inter',sans-serif]"
          onClick={() => setIsPreviewOpen(false)}
        >
          <div
            className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-slate-100 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Camera className={`w-5 h-5 ${status === 'CHECKIN_DONE' ? 'text-emerald-400' : status === 'IN_SCHEDULE_NO_CHECKIN' ? 'text-rose-400' : 'text-slate-400'}`} />
                <h3 className="font-extrabold text-sm text-white">Status da Evidência Fotográfica</h3>
              </div>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Caso 1: Check-in realizado com Foto */}
            {activeCheckIn && hasPhoto ? (
              <div className="space-y-3">
                <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-slate-950">
                  <img
                    src={getImageUrl(activeCheckIn.imageWatermarkUrl || activeCheckIn.imageUrl)}
                    alt="Evidência Fotográfica Georreferenciada"
                    className="w-full max-h-64 object-contain mx-auto"
                  />
                  <div className="absolute bottom-2 right-2 bg-slate-950/90 text-[10px] text-emerald-400 font-bold px-2 py-0.5 rounded border border-slate-800">
                    ✓ Foto Georreferenciada
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400">Registrado por:</span>
                    <span className="font-bold text-white">{activeCheckIn.coordinatorName}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400">Horário:</span>
                    <span className="font-mono text-emerald-400">
                      {format(new Date(activeCheckIn.timestamp), 'dd/MM/yyyy HH:mm')}
                    </span>
                  </div>
                  {activeCheckIn.notes && (
                    <p className="text-[11px] text-slate-400 italic pt-1 border-t border-slate-800">
                      "{activeCheckIn.notes}"
                    </p>
                  )}
                </div>
              </div>
            ) : status === 'IN_SCHEDULE_NO_CHECKIN' ? (
              /* Caso 2: No horário da ação e AINDA SEM CHECK-IN (Vermelho) */
              <div className="bg-rose-950/30 border border-rose-500/40 p-4 rounded-xl space-y-2 text-xs text-center">
                <AlertCircle className="w-8 h-8 text-rose-400 mx-auto animate-bounce" />
                <h4 className="font-bold text-rose-300 text-sm">Ação no Horário — Check-in Pendente!</h4>
                <p className="text-slate-300">
                  A ação agendada para <strong>{effectiveStartTime} às {effectiveEndTime}</strong> já está em andamento, mas o agente de campo ainda não realizou o check-in fotográfico.
                </p>
              </div>
            ) : (
              /* Caso 3: Antes do horário da ação (Cinza) */
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs text-center">
                <Clock className="w-8 h-8 text-slate-500 mx-auto" />
                <h4 className="font-bold text-slate-200 text-sm">Antes do Horário da Ação</h4>
                <p className="text-slate-400">
                  Esta ação está programada para iniciar às <strong>{effectiveStartTime}</strong>. O registro da evidência fotográfica estará liberado no horário previsto.
                </p>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-4 py-2 rounded-xl"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
