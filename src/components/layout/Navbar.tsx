import React from 'react';
import { User, UserRole } from '../../types';
import { Shield, MapPin, Users, FileText, Wifi, WifiOff, RefreshCw, Smartphone, Monitor, LogOut, PlusCircle, UserCheck } from 'lucide-react';

interface NavbarProps {
  currentUser: User;
  onLogout: () => void;
  onOpenEditProfile?: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOnline: boolean;
  pendingSyncCount: number;
  onManualSync: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onLogout,
  onOpenEditProfile,
  activeTab,
  onTabChange,
  isOnline,
  pendingSyncCount,
  onManualSync
}) => {
  const getRoleBadge = () => {
    switch (currentUser.role) {
      case 'admin':
        return { label: '👑 Super Admin', bg: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30' };
      case 'coordenador':
        return { label: `📍 Coord. ${currentUser.regionName || 'Zona'}`, bg: 'bg-amber-500/15 text-amber-300 border-amber-500/30' };
      case 'campo':
        return { label: '📱 Resp. Campo', bg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' };
      default:
        return { label: currentUser.role, bg: 'bg-slate-700 text-slate-300 border-slate-600' };
    }
  };

  const badge = getRoleBadge();

  const handleLogoClick = () => {
    if (currentUser.role === 'admin') {
      onTabChange('map');
    } else if (currentUser.role === 'coordenador') {
      onTabChange('coordinator-dashboard');
    } else {
      onTabChange('field-checkin');
    }
  };

  return (
    <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50 font-['Inter',sans-serif]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand - Agora Clicável para o Início / Mapa Geral */}
          <button
            type="button"
            onClick={handleLogoClick}
            className="flex items-center space-x-3 text-left group focus:outline-none"
            title="Ir para o Mapa Geral (Início)"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-indigo-400 p-0.5 shadow-lg shadow-indigo-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Shield className="w-4 h-4 text-indigo-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent group-hover:text-white transition-colors">
                  VÉRTICE
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wider hidden sm:inline-block">
                  Manaus 2026
                </span>
              </div>
            </div>
          </button>

          {/* Navigation Tabs baseadas no Perfil Logado */}
          <nav className="hidden md:flex items-center space-x-1">
            {currentUser.role === 'admin' && (
              <>
                <button
                  onClick={() => onTabChange('map')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
                    activeTab === 'map'
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Monitor className="w-4 h-4" />
                  <span>Mapa Geral</span>
                </button>
                <button
                  onClick={() => onTabChange('audit')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
                    activeTab === 'audit'
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  <span>Auditoria</span>
                </button>
                <button
                  onClick={() => onTabChange('management')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
                    activeTab === 'management'
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Gestão & Ações</span>
                </button>
                <button
                  onClick={() => onTabChange('reports')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
                    activeTab === 'reports'
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Relatórios PDF</span>
                </button>
              </>
            )}

            {currentUser.role === 'coordenador' && (
              <>
                <button
                  onClick={() => onTabChange('coordinator-dashboard')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
                    activeTab === 'coordinator-dashboard'
                      ? 'bg-amber-600/20 text-amber-300 border border-amber-500/30'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                  <span>Painel da {currentUser.regionName || 'Zona'}</span>
                </button>
                <button
                  onClick={() => onTabChange('coordinator-actions')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
                    activeTab === 'coordinator-actions'
                      ? 'bg-amber-600/20 text-amber-300 border border-amber-500/30'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Cadastrar Ações da Zona</span>
                </button>
              </>
            )}

            {currentUser.role === 'campo' && (
              <button
                onClick={() => onTabChange('field-checkin')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
                  activeTab === 'field-checkin'
                    ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>Check-in & Evidências</span>
              </button>
            )}
          </nav>

          {/* Right Status Controls, Profile Badge & Logout */}
          <div className="flex items-center space-x-3">
            
            {/* Sync / Online Status */}
            <div className="flex items-center space-x-2 bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800 text-xs">
              {isOnline ? (
                <div className="flex items-center text-emerald-400 space-x-1.5">
                  <Wifi className="w-3.5 h-3.5" />
                  <span className="hidden lg:inline font-medium">Online</span>
                </div>
              ) : (
                <div className="flex items-center text-amber-400 space-x-1.5 animate-pulse">
                  <WifiOff className="w-3.5 h-3.5" />
                  <span className="font-medium">Offline</span>
                </div>
              )}

              {pendingSyncCount > 0 && (
                <button
                  onClick={onManualSync}
                  className="ml-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 px-2 py-0.5 rounded text-[11px] font-semibold border border-amber-500/30 flex items-center space-x-1 transition-all"
                  title="Sincronizar check-ins pendentes"
                >
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  <span>{pendingSyncCount}</span>
                </button>
              )}
            </div>

            {/* Profile Info & Badge - Clicável para Editar Perfil */}
            <button
              type="button"
              onClick={onOpenEditProfile}
              className="flex items-center space-x-2 bg-slate-950/80 hover:bg-slate-800/80 px-2.5 py-1 rounded-xl border border-slate-800 hover:border-indigo-500/50 transition-all text-left group"
              title="Clique para editar seu perfil"
            >
              <img
                src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'}
                alt={currentUser.name}
                className="w-6 h-6 rounded-full object-cover border border-slate-700 group-hover:border-indigo-400 transition-colors"
              />
              <div className="hidden sm:block text-left">
                <div className="text-xs font-semibold text-white group-hover:text-indigo-300 leading-tight transition-colors">
                  {currentUser.name}
                </div>
                <div className={`text-[10px] font-medium px-1.5 py-0.2 rounded border inline-block ${badge.bg}`}>
                  {badge.label}
                </div>
              </div>
            </button>

            {/* Logout Button */}
            <button
              onClick={onLogout}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-red-500/20 text-slate-300 hover:text-red-300 border border-slate-700 hover:border-red-500/30 transition-all text-xs flex items-center gap-1.5"
              title="Sair do sistema"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline">Sair</span>
            </button>

          </div>

        </div>

        {/* Mobile Navigation Bar */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-800/80 text-xs font-medium text-slate-400">
          {currentUser.role === 'admin' && (
            <>
              <button
                onClick={() => onTabChange('map')}
                className={`flex flex-col items-center py-1 ${activeTab === 'map' ? 'text-indigo-400 font-bold' : ''}`}
              >
                <Monitor className="w-5 h-5" />
                <span className="mt-1">Mapa</span>
              </button>
              <button
                onClick={() => onTabChange('audit')}
                className={`flex flex-col items-center py-1 ${activeTab === 'audit' ? 'text-indigo-400 font-bold' : ''}`}
              >
                <Shield className="w-5 h-5" />
                <span className="mt-1">Auditoria</span>
              </button>
              <button
                onClick={() => onTabChange('management')}
                className={`flex flex-col items-center py-1 ${activeTab === 'management' ? 'text-indigo-400 font-bold' : ''}`}
              >
                <Users className="w-5 h-5" />
                <span className="mt-1">Gestão</span>
              </button>
              <button
                onClick={() => onTabChange('reports')}
                className={`flex flex-col items-center py-1 ${activeTab === 'reports' ? 'text-indigo-400 font-bold' : ''}`}
              >
                <FileText className="w-5 h-5" />
                <span className="mt-1">Relatórios</span>
              </button>
            </>
          )}

          {currentUser.role === 'coordenador' && (
            <>
              <button
                onClick={() => onTabChange('coordinator-dashboard')}
                className={`flex flex-col items-center py-1 ${
                  activeTab === 'coordinator-dashboard' ? 'text-amber-400 font-bold' : ''
                }`}
              >
                <MapPin className="w-5 h-5" />
                <span className="mt-1">Painel Zona</span>
              </button>
              <button
                onClick={() => onTabChange('coordinator-actions')}
                className={`flex flex-col items-center py-1 ${
                  activeTab === 'coordinator-actions' ? 'text-amber-400 font-bold' : ''
                }`}
              >
                <PlusCircle className="w-5 h-5" />
                <span className="mt-1">Cadastrar Ação</span>
              </button>
            </>
          )}

          {currentUser.role === 'campo' && (
            <button
              onClick={() => onTabChange('field-checkin')}
              className={`flex flex-col items-center py-1 ${
                activeTab === 'field-checkin' ? 'text-emerald-400 font-bold' : ''
              }`}
            >
              <Smartphone className="w-5 h-5" />
              <span className="mt-1">Check-in PWA</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
