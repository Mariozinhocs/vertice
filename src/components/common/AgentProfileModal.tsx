import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AgentProfile, AgentDisclaimerLog, AgentActionEvidencePhoto, Team, CheckIn } from '../../types';
import { getAgentProfileDetail } from '../../services/disclaimerService';
import { X, ShieldCheck, Calendar, Clock, MapPin, Smartphone, Camera, CheckCircle2, ChevronRight, User, Eye, Info, FileText } from 'lucide-react';

interface AgentProfileModalProps {
  agentName: string;
  agentRole?: string;
  team?: Team | null;
  checkIns?: CheckIn[];
  onClose: () => void;
}

export const AgentProfileModal: React.FC<AgentProfileModalProps> = ({
  agentName,
  agentRole = 'Agente de Campo',
  team,
  checkIns = [],
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'disclaimer' | 'actions'>('disclaimer');
  const [previewPhoto, setPreviewPhoto] = useState<AgentActionEvidencePhoto | null>(null);
  const [selectedLogForDetail, setSelectedLogForDetail] = useState<AgentDisclaimerLog | null>(null);

  const profile: AgentProfile = getAgentProfileDetail(agentName, agentRole, team, checkIns);

  // Efeito para fechar o modal com a tecla ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (previewPhoto) {
          setPreviewPhoto(null);
        } else if (selectedLogForDetail) {
          setSelectedLogForDetail(null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [previewPhoto, selectedLogForDetail, onClose]);

  return createPortal(
    <div className="fixed inset-0 z-[10000] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn font-['Inter',sans-serif]">
      <div className="relative max-w-2xl w-full bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-2xl space-y-5 text-slate-100 max-h-[90vh] overflow-y-auto">
        
        {/* Cabeçalho */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 shadow-inner">
              <User className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 block">
                  FICHA DETALHADA DO AGENTE
                </span>
                <span className="text-[10px] bg-slate-800 text-slate-400 font-mono px-2 py-0.5 rounded-md border border-slate-700">
                  Pressione ESC para fechar
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-white">{profile.name}</h2>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                <span>{profile.role}</span>
                <span>•</span>
                <strong className="text-slate-300">{profile.teamName}</strong>
                <span>•</span>
                <span className="text-emerald-400 font-semibold">{profile.regionName}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-all text-xs"
            title="Fechar (ESC)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Card do Aceite do Dia Atual */}
        <div className="bg-emerald-950/40 border border-emerald-500/30 p-4 rounded-xl space-y-2 relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Status do Disclaimer de Hoje (16/09/2026)
              </span>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              ACEITO HOJE
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs font-mono text-slate-300">
            <div className="flex items-center gap-2 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
              <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-sans block">Horário Local do Agente</span>
                <strong className="text-white text-xs">{profile.todayDisclaimerTime}</strong>
                <span className="text-[10px] text-emerald-400 block font-sans"> (Fuso: UTC-4 Manaus)</span>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
              <Smartphone className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-sans block">Dispositivo & App</span>
                <strong className="text-slate-200 text-xs font-sans">Samsung Galaxy A54</strong>
                <span className="text-[10px] text-slate-400 block font-sans"> App v2.4.1 (GPS Ativo)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Abas de Navegação */}
        <div className="flex border-b border-slate-800 gap-4 text-xs font-bold">
          <button
            onClick={() => setActiveTab('disclaimer')}
            className={`pb-2.5 px-1 flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'disclaimer'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Histórico Diário de Disclaimers ({profile.disclaimerLogs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('actions')}
            className={`pb-2.5 px-1 flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'actions'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Participação em Ações e Fotos</span>
          </button>
        </div>

        {/* Conteúdo da Aba 1: Histórico de Disclaimers Diários */}
        {activeTab === 'disclaimer' && (
          <div className="space-y-3">
            <div className="text-[11px] text-slate-400 flex items-center justify-between">
              <span>Registro de aceites confirmados pelo aparelho do agente no início da jornada:</span>
              <span className="text-emerald-400 font-semibold font-mono">Fuso do Agente: Local registrado</span>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {profile.disclaimerLogs.map((log) => (
                <div
                  key={log.id}
                  className="bg-slate-950/70 border border-slate-800 hover:border-slate-700 p-3 rounded-xl flex items-center justify-between transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-white text-xs font-mono">{log.agentLocalTimestamp}</strong>
                        <span className="text-[10px] bg-slate-800 text-emerald-400 font-semibold px-2 py-0.5 rounded border border-slate-700">
                          {log.timezoneOffset}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1 font-mono">
                        <span>📍 GPS: {log.latitude}, {log.longitude}</span>
                        <span>•</span>
                        <span>IP: {log.ipAddress}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedLogForDetail(log)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all text-[11px] flex items-center gap-1 border border-slate-700 font-semibold"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Ver Termo</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Conteúdo da Aba 2: Participação em Ações & Fotos */}
        {activeTab === 'actions' && (
          <div className="space-y-4">
            {profile.actionHistory.map((act) => (
              <div key={act.id} className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-xl space-y-2.5">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <div>
                    <h4 className="text-xs font-bold text-white">{act.actionPointName}</h4>
                    <span className="text-[11px] text-slate-400">Data: {act.date} • Região: {act.regionName}</span>
                  </div>
                  <span className="text-[10px] bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-bold px-2 py-0.5 rounded">
                    {act.photos.length} foto(s) capturada(s)
                  </span>
                </div>

                {/* Grade de Fotos */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                  {act.photos.map((photo) => (
                    <div
                      key={photo.id}
                      onClick={() => setPreviewPhoto(photo)}
                      className="group relative rounded-xl overflow-hidden border border-slate-800 bg-slate-900 cursor-pointer aspect-video hover:border-emerald-500/50 transition-all"
                    >
                      <img
                        src={photo.watermarkUrl || photo.url}
                        alt="Evidência da Ação"
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-all p-2 flex flex-col justify-end">
                        <span className="text-[10px] text-emerald-400 font-bold font-mono">📍 {photo.locationName}</span>
                        <span className="text-[9px] text-slate-300 font-mono">{photo.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Rodapé */}
        <div className="flex justify-between items-center pt-2 border-t border-slate-800">
          <span className="text-[10px] text-slate-400 font-mono">
            ID do Agente: {profile.id}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer border border-slate-700"
          >
            Fechar (ESC)
          </button>
        </div>

      </div>

      {/* Sub-Modal de Zoom da Foto de Evidência */}
      {previewPhoto && (
        <div className="fixed inset-0 z-[10001] bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn">
          <div className="relative max-w-xl w-full bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-4 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider">
                  Evidência do Agente: {profile.name}
                </span>
              </div>
              <button
                onClick={() => setPreviewPhoto(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-all"
                title="Fechar (ESC)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex justify-center">
              <img src={previewPhoto.watermarkUrl || previewPhoto.url} alt="Evidência" className="max-h-[60vh] w-full object-contain" />
              
              <div className="absolute bottom-3 left-3 right-3 bg-slate-950/90 backdrop-blur-md p-3 rounded-lg border border-slate-800 text-[11px] text-slate-300 font-mono flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>📍 LAT: {previewPhoto.latitude}, LNG: {previewPhoto.longitude}</span>
                </div>
                <span className="text-emerald-400 font-sans font-bold text-[10px] uppercase">GPS VÁLIDO</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-[11px] text-slate-300 pt-1">
              <span>Data/Hora: <strong className="text-white">{previewPhoto.timestamp}</strong></span>
              <button
                onClick={() => setPreviewPhoto(null)}
                className="bg-slate-800 hover:bg-slate-700 px-4 py-1.5 rounded-lg text-xs font-bold text-white border border-slate-700"
              >
                Voltar (ESC)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Modal de Visualização do Termo/Disclaimer Aceito */}
      {selectedLogForDetail && (
        <div className="fixed inset-0 z-[10001] bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn">
          <div className="relative max-w-lg w-full bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-4 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-extrabold text-white uppercase tracking-wider">
                  Termo de Responsabilidade e Aceite Diário
                </span>
              </div>
              <button
                onClick={() => setSelectedLogForDetail(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-all"
                title="Fechar (ESC)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 text-xs text-slate-300 max-h-60 overflow-y-auto leading-relaxed">
              <p className="font-bold text-emerald-400">
                ✓ Aceite confirmado por {selectedLogForDetail.agentName} em {selectedLogForDetail.agentLocalTimestamp} ({selectedLogForDetail.timezoneOffset})
              </p>
              <p>
                "Declaro estar ciente e de acordo com as orientações operacionais da campanha, comprometendo-me a realizar o envio de fotos georreferenciadas autênticas dos locais indicados e a zelar pelos materiais de campo."
              </p>
              <div className="pt-2 border-t border-slate-800/80 font-mono text-[10px] text-slate-400 space-y-1">
                <div>Hash de Confirmação: sha256_8a9f4c01b93d...</div>
                <div>Dispositivo: {selectedLogForDetail.deviceModel}</div>
                <div>Versão do App: {selectedLogForDetail.appVersion}</div>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                onClick={() => setSelectedLogForDetail(null)}
                className="bg-emerald-600 hover:bg-emerald-500 font-bold text-xs px-5 py-2 rounded-xl text-white shadow-lg shadow-emerald-600/20"
              >
                Entendido (ESC)
              </button>
            </div>
          </div>
        </div>
      )}

    </div>,
    document.body
  );
};
