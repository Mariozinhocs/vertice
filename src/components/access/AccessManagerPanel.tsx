import React, { useState } from 'react';
import { User, UserRole, Region, Team } from '../../types';
import { UserModal } from '../admin/UserModal';
import { Shield, UserCheck, Plus, Search, Filter, Key, CheckCircle, XCircle, Power, Edit3, Trash2, MapPin, Users, Mail, Phone } from 'lucide-react';

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
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
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
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'ACTIVE' && u.active) ||
      (statusFilter === 'INACTIVE' && !u.active);

    return matchesSearch && matchesRole && matchesStatus;
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
        return { label: '📱 Responsável de Campo', bg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' };
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

      {/* Barra de Filtros e Busca */}
      <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
        {/* Busca por Texto */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome, login, e-mail ou base..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all"
          />
        </div>

        {/* Filtros em Dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-transparent text-white focus:outline-none cursor-pointer text-xs"
            >
              <option value="ALL">Todos os Cargos</option>
              <option value="coordenador">📍 Coordenadores</option>
              <option value="campo">📱 Resp. Campo</option>
              <option value="gestor_acesso">🔑 Gestores de Acesso</option>
              <option value="admin">👑 Super Admins</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-white focus:outline-none cursor-pointer text-xs"
            >
              <option value="ALL">Todos os Status</option>
              <option value="ACTIVE">✅ Ativos</option>
              <option value="INACTIVE">⛔ Inativos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista / Tabela de Usuários */}
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
                      {/* Usuário e Login */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={usr.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'}
                            alt={usr.name}
                            className="w-9 h-9 rounded-full object-cover border border-slate-700 group-hover:border-cyan-500 transition-colors"
                          />
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

                      {/* Cargo */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold border ${roleBadge.bg}`}>
                          {roleBadge.label}
                        </span>
                      </td>

                      {/* Base de Zona */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span>{usr.regionName || 'Geral / Todas'}</span>
                        </div>
                      </td>

                      {/* Status de Ativação (Toggle Rápido) */}
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

                      {/* Ações */}
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
