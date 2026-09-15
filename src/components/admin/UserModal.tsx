import React, { useState } from 'react';
import { User, UserRole, Region, Team } from '../../types';
import { X, UserCheck, Mail, Phone, Lock, MapPin, Users, CheckCircle2 } from 'lucide-react';

interface UserModalProps {
  user?: User | null;
  regions: Region[];
  teams?: Team[];
  onClose: () => void;
  onSave: (user: User) => void;
  onDelete?: (userId: string) => void;
}

const generateUsername = (fullName: string): string => {
  const clean = fullName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (clean.length === 0) return '';
  if (clean.length === 1) return clean[0];
  return `${clean[0]}.${clean[clean.length - 1]}`;
};

export const UserModal: React.FC<UserModalProps> = ({
  user,
  regions,
  teams = [],
  onClose,
  onSave,
  onDelete
}) => {
  const isEditing = !!user;

  const [name, setName] = useState(user?.name || '');
  const [username, setUsername] = useState(
    user?.username || (user?.name ? generateUsername(user.name) : '')
  );
  const [isUsernameEdited, setIsUsernameEdited] = useState(!!user?.username);
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState(user?.password || '7070');
  const [mustChangePassword, setMustChangePassword] = useState(
    isEditing ? (user?.mustChangePassword ?? false) : true
  );
  const [isResetRequested, setIsResetRequested] = useState(false);
  const [phone, setPhone] = useState(user?.phone || '');
  const [role, setRole] = useState<UserRole>(user?.role || 'coordenador');
  const [regionId, setRegionId] = useState(user?.regionId || regions[0]?.id || '');
  const [teamId, setTeamId] = useState(user?.teamId || '');
  const [active, setActive] = useState(user?.active ?? true);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!isUsernameEdited) {
      setUsername(generateUsername(val));
    }
  };

  const handleResetPassword = () => {
    setPassword('7070');
    setMustChangePassword(true);
    setIsResetRequested(true);
  };

  const handleDelete = () => {
    if (user && onDelete) {
      if (confirm(`Tem certeza que deseja excluir o usuário "${user.name}"?`)) {
        onDelete(user.id);
        onClose();
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const selectedRegion = regions.find((r) => r.id === regionId);
    const selectedTeam = teams.find((t) => t.id === teamId);

    const updatedUser: User = {
      id: user?.id || `usr-${Date.now()}`,
      name: name.trim(),
      username: username.trim().toLowerCase() || generateUsername(name.trim()),
      email: email.trim().toLowerCase(),
      password,
      mustChangePassword,
      role,
      phone: phone.trim() || undefined,
      active,
      regionId: role === 'coordenador' ? regionId : selectedTeam?.regionId || regionId,
      regionName: role === 'coordenador' ? selectedRegion?.name : (regions.find(r => r.id === (selectedTeam?.regionId || regionId))?.name || 'Geral'),
      teamId: teamId || selectedTeam?.id || undefined,
      teamName: selectedTeam?.name || undefined
    };

    onSave(updatedUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn font-['Inter',sans-serif]">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5">
        
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {isEditing ? 'Editar Usuário' : 'Cadastrar Novo Usuário'}
              </h2>
              <p className="text-[11px] text-slate-400">Configure perfil de acesso, login e zona responsável</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-all text-xs"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Nome Completo</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Digite o nome completo"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-slate-300 font-medium">Nome de Usuário (Login)</label>
              </div>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value.toLowerCase().replace(/\s+/g, '.'));
                  setIsUsernameEdited(true);
                }}
                placeholder="nome.sobrenome"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500 font-mono text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-slate-300 font-medium">E-mail de Acesso (Opcional)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@exemplo.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium">
                {isEditing ? 'Senha do Usuário' : 'Senha Inicial'}
              </label>
              {!isEditing ? (
                <div>
                  <input
                    type="text"
                    readOnly
                    value="7070"
                    className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-3 py-2 text-emerald-400 font-mono text-xs font-bold cursor-not-allowed"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Troca obrigatória no 1º acesso</span>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <input
                      type="password"
                      readOnly
                      value={isResetRequested ? '7070' : (password || '••••••••')}
                      className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 font-mono text-xs cursor-not-allowed"
                    />
                    <button
                      type="button"
                      onClick={handleResetPassword}
                      title="Resetar Senha para 7070"
                      className="px-2.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-[11px] font-semibold flex items-center gap-1 whitespace-nowrap transition-all"
                    >
                      <span>🔄 Resetar (7070)</span>
                    </button>
                  </div>
                  {isResetRequested ? (
                    <span className="text-[10px] text-amber-400 block font-medium">⚠️ Senha será resetada para 7070</span>
                  ) : (
                    <span className="text-[10px] text-slate-500 block">Mantém a senha atual do usuário</span>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Perfil / Função</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="coordenador">📍 Coordenador por Zona</option>
                <option value="admin">👑 Super Admin</option>
                <option value="campo">📱 Responsável de Campo</option>
                <option value="gestor_acesso">🔑 Gestor de Acessos</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium">WhatsApp / Telefone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(92) 99999-9999"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {role === 'coordenador' && (
            <div className="space-y-1">
              <label className="text-slate-300 font-medium flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                <span>Base / Zona Geográfica Responsável</span>
              </label>
              <select
                value={regionId}
                onChange={(e) => setRegionId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                {regions.map((reg) => (
                  <option key={reg.id} value={reg.id}>
                    {reg.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {role === 'campo' && (
            <div className="space-y-1">
              <label className="text-slate-300 font-medium flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-purple-400" />
                <span>Equipe de Campo Pertencente</span>
              </label>
              <select
                value={teamId}
                onChange={(e) => setTeamId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="">Nenhuma Equipe Atribuída (Geral)</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name} ({team.coordinatorName})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            {isEditing && onDelete ? (
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center gap-1 text-red-400 hover:text-red-300 text-xs px-2.5 py-1.5 rounded-lg hover:bg-red-500/10 transition-all border border-red-500/20"
              >
                <span>Excluir Usuário</span>
              </button>
            ) : (
              <label className="flex items-center gap-2 cursor-pointer text-slate-300 text-xs font-semibold">
                <input
                  type="checkbox"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-indigo-600 focus:ring-0"
                />
                <span>Usuário Ativo no Sistema</span>
              </label>
            )}

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
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isEditing ? 'Salvar Alterações' : 'Criar Usuário'}</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
