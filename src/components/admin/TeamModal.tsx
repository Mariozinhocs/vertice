import React, { useState } from 'react';
import { Team, TeamMember, Region, ActionPoint, User } from '../../types';
import { X, Users, Plus, Trash2, Shield, Phone, MapPin } from 'lucide-react';

interface TeamModalProps {
  team?: Team | null;
  regions: Region[];
  actionPoints: ActionPoint[];
  users: User[];
  onClose: () => void;
  onSave: (team: Team) => void;
  onDelete?: (teamId: string) => void;
}

export const TeamModal: React.FC<TeamModalProps> = ({
  team,
  regions,
  actionPoints,
  users,
  onClose,
  onSave,
  onDelete
}) => {
  const isEditing = !!team;

  const coordinators = users.filter((u) => u.role === 'coordenador');

  const getCoordForRegion = (regId: string) => coordinators.find((c) => c.regionId === regId);
  const getRegionForCoord = (coordId: string) => {
    const c = coordinators.find((coord) => coord.id === coordId);
    return c?.regionId ? regions.find((r) => r.id === c.regionId) : null;
  };

  const initialRegionId = team?.regionId || regions[0]?.id || '';
  const initialCoordId = team?.coordinatorId || getCoordForRegion(initialRegionId)?.id || coordinators[0]?.id || '';

  const [name, setName] = useState(team?.name || '');
  const [regionId, setRegionId] = useState(initialRegionId);
  const [coordinatorId, setCoordinatorId] = useState(initialCoordId);

  const handleRegionChange = (newRegionId: string) => {
    setRegionId(newRegionId);
    const matchingCoord = getCoordForRegion(newRegionId);
    if (matchingCoord) {
      setCoordinatorId(matchingCoord.id);
    }
  };

  const handleCoordinatorChange = (newCoordId: string) => {
    setCoordinatorId(newCoordId);
    const matchingRegion = getRegionForCoord(newCoordId);
    if (matchingRegion) {
      setRegionId(matchingRegion.id);
    }
  };

  const [assignedPointIds, setAssignedPointIds] = useState<string[]>(
    team?.assignedPointIds || []
  );
  const [status, setStatus] = useState<'ativa' | 'inativa'>(team?.status || 'ativa');
  const [members, setMembers] = useState<TeamMember[]>(
    team?.members || [
      { id: `m-${Date.now()}-1`, name: '', role: 'Líder de Ação', phone: '' }
    ]
  );

  const handleAddMember = () => {
    setMembers((prev) => [
      ...prev,
      { id: `m-${Date.now()}-${Math.random()}`, name: '', role: 'Mobilizador(a)', phone: '' }
    ]);
  };

  const handleRemoveMember = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const handleUpdateMember = (id: string, field: keyof TeamMember, value: string) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  const getRoleLabel = (user: User): string => {
    if (user.role === 'admin') return 'Super Admin';
    if (user.role === 'coordenador') return 'Coordenador';
    if (user.role === 'campo') return 'Responsável de Campo';
    return 'Mobilizador(a)';
  };

  const handleMemberNameChange = (id: string, nameValue: string) => {
    const matchedUser = users.find(
      (u) =>
        u.name.toLowerCase() === nameValue.trim().toLowerCase() ||
        (u.username && u.username.toLowerCase() === nameValue.trim().toLowerCase())
    );

    setMembers((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        return {
          ...m,
          name: nameValue,
          role: matchedUser ? getRoleLabel(matchedUser) : m.role,
          phone: matchedUser?.phone || m.phone
        };
      })
    );
  };

  const handleSelectRegisteredUser = (memberId: string, selectedUser: User) => {
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id !== memberId) return m;
        return {
          ...m,
          name: selectedUser.name,
          role: getRoleLabel(selectedUser),
          phone: selectedUser.phone || ''
        };
      })
    );
  };

  const handleTogglePoint = (pointId: string) => {
    setAssignedPointIds((prev) =>
      prev.includes(pointId) ? prev.filter((id) => id !== pointId) : [...prev, pointId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const selectedCoord = coordinators.find((c) => c.id === coordinatorId);

    const updatedTeam: Team = {
      id: team?.id || `team-${Date.now()}`,
      campaignId: team?.campaignId || 'cmp-manaus-2026',
      name: name.trim(),
      regionId,
      coordinatorId,
      coordinatorName: selectedCoord?.name || 'Coordenador',
      assignedPointIds,
      status,
      members: members.filter((m) => m.name.trim().length > 0)
    };

    onSave(updatedTeam);
    onClose();
  };

  const handleDelete = () => {
    if (team && onDelete) {
      if (confirm(`Tem certeza que deseja excluir a equipe "${team.name}"?`)) {
        onDelete(team.id);
        onClose();
      }
    }
  };

  const regionPoints = actionPoints.filter((p) => p.regionId === regionId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn font-['Inter',sans-serif]">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {isEditing ? 'Editar Equipe de Campo' : 'Cadastrar Nova Equipe'}
              </h2>
              <p className="text-[11px] text-slate-400">Configure membros, líder, coordenador e pontos de ação</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-all text-xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Nome da Equipe</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Equipe Águia - Norte 1"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Zona / Região</label>
              <select
                value={regionId}
                onChange={(e) => handleRegionChange(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                {regions.map((reg) => (
                  <option key={reg.id} value={reg.id}>
                    {reg.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Coordenador Responsável</label>
              <select
                value={coordinatorId}
                onChange={(e) => handleCoordinatorChange(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                {coordinators.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.regionName || 'Geral'})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Status Operacional</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'ativa' | 'inativa')}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="ativa">🟢 Equipe Ativa em Campo</option>
                <option value="inativa">⚪ Equipe Inativa / Pausada</option>
              </select>
            </div>
          </div>

          {/* Membros da Equipe */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-slate-300 font-bold uppercase text-[11px] tracking-wider">
                Integrantes e Responsáveis ({members.length})
              </label>
              <button
                type="button"
                onClick={handleAddMember}
                className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold px-2 py-1 rounded bg-indigo-500/10 border border-indigo-500/20"
              >
                <Plus className="w-3 h-3" />
                <span>Adicionar Membro</span>
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {members.map((m) => (
                <div
                  key={m.id}
                  className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800"
                >
                  <div className="flex-1 flex gap-1.5 items-center">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        required
                        list={`user-suggestions-${m.id}`}
                        value={m.name}
                        onChange={(e) => handleMemberNameChange(m.id, e.target.value)}
                        placeholder="Nome do integrante"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-white text-xs focus:outline-none focus:border-indigo-500"
                      />
                      <datalist id={`user-suggestions-${m.id}`}>
                        {users.map((u) => (
                          <option key={u.id} value={u.name}>
                            {u.username ? `@${u.username} • ` : ''}{u.role} {u.phone ? `(${u.phone})` : ''}
                          </option>
                        ))}
                      </datalist>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={m.role}
                      onChange={(e) => handleUpdateMember(m.id, 'role', e.target.value)}
                      placeholder="Função (Ex: Líder / Mobilizador)"
                      className="w-32 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-white text-xs"
                    />
                    <input
                      type="text"
                      value={m.phone || ''}
                      onChange={(e) => handleUpdateMember(m.id, 'phone', e.target.value)}
                      placeholder="(92) 99999-9999"
                      className="w-28 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-white text-xs font-mono"
                    />
                    {members.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(m.id)}
                        className="text-red-400 hover:text-red-300 p-1 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pontos de Atuação Designados */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <label className="text-slate-300 font-bold uppercase text-[11px] tracking-wider block">
              Pontos de Atuação Atribuídos à Equipe
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
              {actionPoints.map((pt) => {
                const isSelected = assignedPointIds.includes(pt.id);
                return (
                  <button
                    key={pt.id}
                    type="button"
                    onClick={() => handleTogglePoint(pt.id)}
                    className={`flex items-center gap-2 p-2 rounded-xl text-left border text-xs transition-all ${
                      isSelected
                        ? 'bg-indigo-600/20 border-indigo-500/50 text-white font-medium'
                        : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <MapPin className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`} />
                    <span className="truncate">{pt.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            {isEditing && onDelete ? (
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center gap-1 text-red-400 hover:text-red-300 text-xs px-2.5 py-1.5 rounded-lg hover:bg-red-500/10 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Excluir Equipe</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white transition-all text-xs"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all"
              >
                {isEditing ? 'Salvar Alterações' : 'Criar Equipe'}
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
