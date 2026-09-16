import React, { useState } from 'react';
import { User, UserRole, Region, Team } from '../../types';
import { UserModal } from '../admin/UserModal';
import { Shield, UserCheck, Plus, Search, Filter, Key, CheckCircle, XCircle, Power, Edit3, Trash2, MapPin, Users, Mail, Phone, LayoutGrid, List, Layers } from 'lucide-react';

interface AccessManagerPanelProps {
  users: User[];
  regions: Region[];
  teams: Team[];
  currentUser: User;
  onAddUser: (user: User) => void;
  onUpdateUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
}

export const AccessManagerPanel: React.FC<AccessManagerPanelProps> = ({
  users,
  regions,
  teams,
  currentUser,
  onAddUser,
  onUpdateUser,
  onDeleteUser
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [regionFilter, setRegionFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'grouped'>('list');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Filtragem dos Usuários
  const filteredUsers = users.filter((u) => {
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !term ||
      u.name.toLowerCase().includes(term) ||
      (u.username && u.username.toLowerCase().includes(term)) ||
      (u.email && u.email.toLowerCase().includes(term)) ||
      (u.regionName && u.regionName.toLowerCase().includes(term));

    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesRegion = regionFilter === 'ALL' || u.regionId === regionFilter || u.regionName === regionFilter;
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'ACTIVE' && u.active) ||
      (statusFilter === 'INACTIVE' && !u.active);

    return matchesSearch && matchesRole && matchesRegion && matchesStatus;
  });

  // Métricas de Gestão de Contas
  const totalUsers = users.length;
  const activeUsersCount = users.filter((u) => u.active).length;
  const inactiveUsersCount = users.filter((u) => !u.active).length;
  const coordCount = users.filter((u) => u.role === 'coordenador').length;
  const campoCount = users.filter((u) => u.role === 'campo').length;

  const handleToggleUserStatus = (user: User) => {
    const updated = { ...user, active: !user.active };
    onUpdateUser(updated);
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return { label: '👑 Super Admin', bg: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30' };
      case 'gestor_acesso':
        return { label: '🔑 Gestor de Acessos', bg: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30' };
      case 'coordenador':
        return { label: '📍 Coordenador de Zona', bg: 'bg-amber-500/15 text-amber-300 border-amber-500/30' };
      case 'campo':
        return { label: '📱 Agente de Campo', bg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' };
      default:
        return { label: role, bg: 'bg-slate-700 text-slate-300 border-slate-600' };
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6 font-['Inter',sans-serif]">
      {/* Cabeçalho do Painel de Controle de Acessos */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
            <Key className="w-3.5 h-3.5" />
            <span>Módulo de Gestão de Contas e Usuários</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Controle de Cadastro e Ativação de Acessos
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl">
            Gerencie credenciais, cadastre novos integrantes operacionais e controle o status de ativação/desativação no sistema.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingUser(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/25 active:scale-[0.99] transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Novo Usuário</span>
        </button>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl space-y-1">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total de Contas</div>
          <div className="text-2xl font-black text-white">{totalUsers}</div>
          <div className="text-[10px] text-slate-500">{coordCount} Coord. • {campoCount} Campo</div>
        </div>

        <div className="bg-slate-900/60 border border-emerald-500/20 p-4 rounded-xl space-y-1">
          <div className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider flex items-center justify-between">
            <span>Usuários Ativos</span>
            <CheckCircle className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-emerald-300">{activeUsersCount}</div>
          <div className="text-[10px] text-emerald-400/70">Prontos para acesso</div>
        </div>

        <div className="bg-slate-900/60 border border-rose-500/20 p-4 rounded-xl space-y-1">
          <div className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider flex items-center justify-between">
            <span>Usuários Inativos</span>
            <XCircle className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-rose-300">{inactiveUsersCount}</div>
          <div className="text-[10px] text-rose-400/70">Acesso bloqueado</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl space-y-1">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Coordenadores</div>
          <div className="text-2xl font-black text-amber-300">{coordCount}</div>
          <div className="text-[10px] text-slate-500">Gestores de zona</div>
        </div>
      </div>

      {/* Barra de Ferramentas Padronizada: Busca + Modos de Exibição (Grade / Lista / Por Base) + Filtros */}
      <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl space-y-3 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* Busca por Texto */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nome, login, e-mail ou base..."
              className="w-full bg-slate-950/70 border border-slate-800 rounded-lg pl-9 pr-4 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
            />
          </div>

          {/* Modo de Visualização */}
          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
                viewMode === 'grid'
                  ? 'bg-cyan-600/20 text-cyan-400 border border-cyan-500/40 shadow-sm font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Grade</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
                viewMode === 'list'
                  ? 'bg-cyan-600/20 text-cyan-400 border border-cyan-500/40 shadow-sm font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Lista</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('grouped')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
                viewMode === 'grouped'
                  ? 'bg-cyan-600/20 text-cyan-400 border border-cyan-500/40 shadow-sm font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Por Base</span>
            </button>
          </div>
        </div>

        {/* Linha de Filtros */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-800/80 text-xs">
          <div className="flex items-center gap-1 text-slate-400 font-medium">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            <span>Filtros:</span>
          </div>

          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer"
          >
            <option value="ALL">Todas as Bases ({regions.length})</option>
            {regions.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer"
          >
            <option value="ALL">Todos os Cargos</option>
            <option value="coordenador">📍 Coordenadores</option>
            <option value="campo">📱 Agente de Campo</option>
            <option value="gestor_acesso">🔑 Gestores de Acesso</option>
            <option value="admin">👑 Super Admins</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer"
          >
            <option value="ALL">Todos os Status</option>
            <option value="ACTIVE">✅ Ativos</option>
            <option value="INACTIVE">⛔ Inativos</option>
          </select>
        </div>
      </div>

      {/* MODO 1: GRADE (GRID) */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map((usr) => {
            const roleBadge = getRoleLabel(usr.role);
            return (
              <div
                key={usr.id}
                onClick={() => {
                  setEditingUser(usr);
                  setIsModalOpen(true);
                }}
                className="bg-slate-900/90 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/40 p-4 rounded-xl space-y-3 shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-xs shrink-0">
                      {(usr.name || 'US').substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">
                        {usr.name}
                      </h4>
                      <span className="text-[10px] text-slate-400 block font-mono">
                        @{usr.username || generateUsernameFallback(usr.name)}
                      </span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${roleBadge.bg}`}>
                    {roleBadge.label}
                  </span>
                </div>

                <div className="text-xs text-slate-400 space-y-1 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                  <p className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>Base: <strong className="text-slate-200">{usr.regionName || 'Geral'}</strong></span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{usr.email || usr.phone || 'Sem contato'}</span>
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleUserStatus(usr);
                    }}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold text-[10px] border ${
                      usr.active
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                    }`}
                  >
                    <Power className={`w-3 h-3 ${usr.active ? 'text-emerald-400' : 'text-rose-400'}`} />
                    <span>{usr.active ? 'ATIVO' : 'DESATIVADO'}</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Tem certeza que deseja excluir "${usr.name}"?`)) {
                          onDeleteUser(usr.id);
                        }
                      }}
                      className="p-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-all text-xs"
                      title="Excluir Usuário"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-cyan-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                      Editar →
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODO 2: LISTA (TABLE) */}
      {viewMode === 'list' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 uppercase text-[10px] text-slate-400 tracking-wider border-b border-slate-800 font-bold">
                <tr>
                  <th className="py-3.5 px-4">Usuário / Credencial</th>
                  <th className="py-3.5 px-4">Perfil / Cargo</th>
                  <th className="py-3.5 px-4">Base / Zona Geográfica</th>
                  <th className="py-3.5 px-4 text-center">Status de Acesso</th>
                  <th className="py-3.5 px-4 text-right">Ações & Controle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500">
                      Nenhum usuário encontrado com os filtros selecionados.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((usr) => {
                    const roleBadge = getRoleLabel(usr.role);
                    return (
                      <tr key={usr.id} className="hover:bg-slate-800/40 transition-colors group">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-xs shrink-0">
                              {(usr.name || 'US').substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold text-white text-sm group-hover:text-cyan-300 transition-colors">
                                {usr.name}
                              </div>
                              <div className="text-[11px] text-slate-400 font-mono">
                                @{usr.username || generateUsernameFallback(usr.name)}
                                {usr.email && <span className="text-slate-500 ml-1.5">• {usr.email}</span>}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold border ${roleBadge.bg}`}>
                            {roleBadge.label}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5 text-slate-300">
                            <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                            <span>{usr.regionName || 'Geral / Todas'}</span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleUserStatus(usr)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-[11px] transition-all border ${
                              usr.active
                                ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border-rose-500/30'
                            }`}
                            title={usr.active ? 'Clique para Desativar este usuário' : 'Clique para Ativar este usuário'}
                          >
                            <Power className={`w-3.5 h-3.5 ${usr.active ? 'text-emerald-400' : 'text-rose-400'}`} />
                            <span>{usr.active ? 'ATIVO' : 'DESATIVADO'}</span>
                          </button>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingUser(usr);
                                setIsModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-cyan-600/20 text-slate-300 hover:text-cyan-300 border border-slate-700 hover:border-cyan-500/30 transition-all"
                              title="Editar Dados / Resetar Senha"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`Tem certeza que deseja excluir o usuário "${usr.name}"?`)) {
                                  onDeleteUser(usr.id);
                                }
                              }}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 border border-slate-700 hover:border-rose-500/30 transition-all"
                              title="Excluir Usuário"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODO 3: POR BASE (GROUPED) */}
      {viewMode === 'grouped' && (
        <div className="space-y-6">
          {regions.map((reg) => {
            const usersInRegion = filteredUsers.filter((u) => u.regionId === reg.id || u.regionName === reg.name);
            if (usersInRegion.length === 0) return null;
            return (
              <div key={reg.id} className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: reg.color || '#06b6d4' }}></span>
                    <h4 className="font-extrabold text-sm text-white">Base: {reg.name}</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                      {usersInRegion.length} Usuários
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {usersInRegion.map((usr) => (
                    <div
                      key={usr.id}
                      onClick={() => {
                        setEditingUser(usr);
                        setIsModalOpen(true);
                      }}
                      className="bg-slate-900 border border-slate-800 hover:border-cyan-500/40 p-3.5 rounded-xl space-y-2 cursor-pointer transition-all"
                    >
                      <div className="flex justify-between items-center">
                        <h5 className="font-bold text-xs text-white">{usr.name}</h5>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                          usr.active ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        }`}>
                          {usr.active ? 'ATIVO' : 'INATIVO'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">{usr.email || usr.phone || 'Sem e-mail'}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Criação/Edição de Usuário */}
      {isModalOpen && (
        <UserModal
          user={editingUser}
          regions={regions}
          teams={teams}
          onClose={() => {
            setIsModalOpen(false);
            setEditingUser(null);
          }}
          onSave={(u) => {
            if (editingUser) {
              onUpdateUser(u);
            } else {
              onAddUser(u);
            }
          }}
          onDelete={onDeleteUser}
        />
      )}
    </div>
  );
};

const generateUsernameFallback = (fullName: string): string => {
  return fullName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '.');
};
