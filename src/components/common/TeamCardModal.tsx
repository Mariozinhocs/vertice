import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Team, CheckIn } from '../../types';
import { getImageUrl, getBaseNameFromTeam } from '../../services/imageService';
import { SegmentedDonutChart } from './SegmentedDonutChart';
import { AgentProfileModal } from './AgentProfileModal';
import { X, Camera, Users, CheckCircle2, Shield, User, ShieldCheck } from 'lucide-react';

interface TeamCardModalProps {
  team: Team;
  checkIn?: CheckIn | null;
  checkIns?: CheckIn[];
  onClose: () => void;
  onViewPhoto?: (imageUrl: string) => void;
}

export const TeamCardModal: React.FC<TeamCardModalProps> = ({
  team,
  checkIn,
  checkIns = [],
  onClose,
  onViewPhoto
}) => {
  const [previewPhotoUrl, setPreviewPhotoUrl] = useState<string | null>(null);
  const [selectedAgentName, setSelectedAgentName] = useState<string | null>(null);
  const [activeAgentProfile, setActiveAgentProfile] = useState<{ name: string; role?: string } | null>(null);

  // Efeito para tratar a tecla ESC no modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (previewPhotoUrl) {
          setPreviewPhotoUrl(null);
        } else if (!activeAgentProfile) {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [previewPhotoUrl, activeAgentProfile, onClose]);

  if (!team) return null;

  // Busca os check-ins referentes a esta equipe
  const activeCheckIn = checkIn || checkIns.find(c => c.teamId === team.id || c.teamName?.toLowerCase().trim() === team.name?.toLowerCase().trim());
  const photoUrl = activeCheckIn?.imageWatermarkUrl || activeCheckIn?.imageUrl;
  const isCheckedIn = !!activeCheckIn;

  const teamCheckIns = checkIns.filter(c => c.teamId === team.id || c.teamName?.toLowerCase().trim() === team.name?.toLowerCase().trim());
  const hasCheckIns = isCheckedIn || teamCheckIns.length > 0;

  // Lógica de fotos por agente
  const totalAgents = team.members?.length || 5;

  const checkMemberHasPhoto = (index: number, memberName: string) => {
    if (!hasCheckIns) return false;
    const directMatch = teamCheckIns.some(c => 
      (c.agentName && c.agentName.toLowerCase().includes(memberName.toLowerCase())) ||
      (c.notes && c.notes.toLowerCase().includes(memberName.toLowerCase()))
    );
    if (directMatch) return true;
    const simulatedCount = activeCheckIn?.memberCount || 3;
    return index < simulatedCount;
  };

  const photosCount = (team.members || []).filter((m, idx) => checkMemberHasPhoto(idx, m.name)).length;

  // Foto de evidência (real ou mock georreferenciada de demonstração)
  const defaultEvidencePhoto = 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80';

  const handleCameraClick = (e: React.MouseEvent, agentName?: string) => {
    e.stopPropagation();
    const resolvedAgent = agentName || activeCheckIn?.agentName || team.members?.[0]?.name || 'Agente de Campo';
    setSelectedAgentName(resolvedAgent);

    const targetUrl = photoUrl ? getImageUrl(photoUrl) : defaultEvidencePhoto;
    if (onViewPhoto) {
      onViewPhoto(targetUrl);
    } else {
      setPreviewPhotoUrl(targetUrl);
    }
  };

  const baseName = activeCheckIn?.baseName || getBaseNameFromTeam(team.name, team.regionName);

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn font-['Inter',sans-serif]">
      <div className="relative max-w-md w-full bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-2xl space-y-5 text-slate-100">
        
        {/* Cabeçalho com Gráfico de Rosca Segmentada */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 block mb-0.5">
                FICHA DA EQUIPE • {baseName}
              </span>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl font-extrabold text-white">{team.name}</h2>
                <button
                  type="button"
                  onClick={(e) => handleCameraClick(e, team.members?.[0]?.name || 'Equipe Completa')}
                  className={`p-1.5 rounded-lg border transition-all cursor-pointer shadow-sm active:scale-95 ${
                    photosCount > 0
                      ? 'bg-emerald-500/15 hover:bg-emerald-500/25 border-emerald-500/40 text-emerald-400'
                      : 'bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/30 text-rose-400'
                  }`}
                  title="Ver evidência fotográfica georreferenciada da equipe"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Gráfico de Rosca Segmentada ao lado do Nome da Equipe */}
            <div className="pl-1">
              <SegmentedDonutChart total={totalAgents} completed={photosCount} size={46} strokeWidth={6} />
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-all text-xs"
            title="Fechar (ESC)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Ficha da Equipe - Dados Operacionais */}
        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3 text-xs">
          
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
            <span className="text-slate-400 font-medium">Coordenador Responsável:</span>
            <strong className="text-white font-bold text-sm">{team.coordinatorName || 'Não atribuído'}</strong>
          </div>

          <div className="flex items-center justify-between pb-1">
            <span className="text-slate-400 font-medium">Status Operacional:</span>
            <span className={`font-extrabold text-xs uppercase tracking-wider ${isCheckedIn ? 'text-emerald-400' : 'text-amber-400'}`}>
              {isCheckedIn ? 'ATIVA' : 'AGUARDANDO CHECK-IN'}
            </span>
          </div>

          {/* Integrantes da Equipe Clicáveis */}
          <div className="pt-2 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 tracking-wider block">
                Integrantes da Equipe ({team.members?.length || 0}):
              </span>
              <span className="text-[10px] font-semibold text-emerald-400">
                Clique no nome para abrir a Ficha do Agente
              </span>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {(team.members || []).map((member, idx) => {
                const hasPhoto = checkMemberHasPhoto(idx, member.name);

                return (
                  <div
                    key={member.id}
                    onClick={() => setActiveAgentProfile({ name: member.name, role: member.role })}
                    className="bg-slate-900/90 border border-slate-800/90 hover:border-emerald-500/60 hover:bg-slate-800/80 p-3 rounded-xl flex items-center justify-between transition-all cursor-pointer group shadow-sm"
                    title={`Clique para abrir a Ficha Detalhada e Histórico do Agente ${member.name}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 group-hover:bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 transition-all">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-white text-xs group-hover:text-emerald-300 transition-colors">
                            {member.name}
                          </span>
                          <span className="inline-flex items-center gap-0.5 text-[9px] bg-emerald-500/10 text-emerald-400 font-semibold px-1.5 py-0.5 rounded border border-emerald-500/20">
                            <ShieldCheck className="w-2.5 h-2.5" />
                            Disclaimer OK
                          </span>
                        </div>
                        <span className="text-slate-400 text-[11px] block mt-0.5">• {member.role || 'Agente de Campo'}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleCameraClick(e, member.name)}
                      className={`p-1.5 rounded-lg border transition-all cursor-pointer shrink-0 active:scale-95 ${
                        hasPhoto
                          ? 'bg-emerald-500/15 hover:bg-emerald-500/25 border-emerald-500/40 text-emerald-400'
                          : 'bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/30 text-rose-400'
                      }`}
                      title={hasPhoto ? `Evidência capturada de ${member.name} (Ver foto)` : `Foto pendente de ${member.name}`}
                    >
                      <Camera className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Rodapé */}
        <div className="flex justify-between items-center pt-1">
          <span className="text-[10px] text-slate-500 font-mono">ESC fecha</span>
          <button
            type="button"
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer"
          >
            Fechar (ESC)
          </button>
        </div>

      </div>

      {/* Modal Secundário de Perfil do Agente Clicado */}
      {activeAgentProfile && (
        <AgentProfileModal
          agentName={activeAgentProfile.name}
          agentRole={activeAgentProfile.role}
          team={team}
          checkIns={checkIns}
          onClose={() => setActiveAgentProfile(null)}
        />
      )}

      {/* Modal Secundário de Zoom da Foto de Evidência com Marcação Georreferenciada */}
      {previewPhotoUrl && (
        <div className="fixed inset-0 z-[10000] bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn">
          <div className="relative max-w-xl w-full bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-4 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-rose-400" />
                <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider">
                  Evidência Fotográfica Georreferenciada
                </span>
              </div>
              <button
                onClick={() => setPreviewPhotoUrl(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-all"
                title="Fechar (ESC)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex justify-center">
              <img src={previewPhotoUrl} alt="Foto Georreferenciada da Equipe" className="max-h-[60vh] w-full object-contain" />
              
              {/* Badge Overlay de Geolocalização GPS */}
              <div className="absolute bottom-3 left-3 right-3 bg-slate-950/90 backdrop-blur-md p-3 rounded-lg border border-slate-800 text-[11px] text-slate-300 font-mono flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>📍 LAT: -3.093500, LNG: -60.057000</span>
                </div>
                <span className="text-emerald-400 font-sans font-bold text-[10px] uppercase">Raio GPS: ±15m</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-300 pt-1 border-t border-slate-800/80">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Base</span>
                <strong className="text-emerald-400 font-bold">{baseName}</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Agente</span>
                <strong className="text-white font-bold">{selectedAgentName || 'Agente de Campo'}</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Equipe</span>
                <strong className="text-white font-bold">{team.name}</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Coordenador</span>
                <strong className="text-slate-300">{team.coordinatorName || 'Marcelo Campbell'}</strong>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>,
    document.body
  );
};

