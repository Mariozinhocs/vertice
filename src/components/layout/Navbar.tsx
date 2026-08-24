import React from 'react';
import { UserRole } from '../../types';
import { Shield, MapPin, Users, FileText, Wifi, WifiOff, RefreshCw, Smartphone, Monitor } from 'lucide-react';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOnline: boolean;
  pendingSyncCount: number;
  onManualSync: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  activeTab,
  onTabChange,
  isOnline,
  pendingSyncCount,
  onManualSync
}) => {
  return (
    <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 p-0.5 shadow-lg shadow-indigo-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <MapPin className="w-5 h-5 text-emerald-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                  VÉRTICE<span className="text-emerald-400 font-light ml-1">CAMPO</span>
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wider">
                  PWA 2026
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Gestão & Auditoria Eleitoral Georreferenciada</p>
            </div>
          </div>

          {/* Navigation Tabs (Admin/Auditor vs Coordinator) */}
          <nav className="hidden md:flex items-center space-x-1">
            {currentRole === 'coordenador' ? (
              <button
                onClick={() => onTabChange('coordinator-dashboard')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
                  activeTab === 'coordinator-dashboard'
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>Painel do Coordenador</span>
              </button>
            ) : (
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
                  <span>Mapa Operacional</span>
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
                  <span>Cadastros</span>
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
                  <span>Relatórios</span>
                </button>
              </>
            )}
          </nav>

          {/* Right Status Controls & Role Switcher */}
          <div className="flex items-center space-x-3">
            
            {/* Sync / Online Status */}
            <div className="flex items-center space-x-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
              {isOnline ? (
                <div className="flex items-center text-emerald-400 space-x-1.5">
                  <Wifi className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline font-medium">Online</span>
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
                  <span>{pendingSyncCount} pendentes</span>
                </button>
              )}
            </div>

            {/* Role Switcher Select */}
            <div className="relative">
              <select
                value={currentRole}
                onChange={(e) => onRoleChange(e.target.value as UserRole)}
                className="bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="admin">👤 Administrador</option>
                <option value="coordenador">📱 Coordenador (PWA)</option>
                <option value="auditor">🔍 Gestor / Auditor</option>
              </select>
            </div>

          </div>

        </div>

        {/* Mobile Navigation Bar */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-800/80 text-xs font-medium text-slate-400">
          {currentRole === 'coordenador' ? (
            <button
              onClick={() => onTabChange('coordinator-dashboard')}
              className={`flex flex-col items-center py-1 ${
                activeTab === 'coordinator-dashboard' ? 'text-indigo-400 font-bold' : ''
              }`}
            >
              <Smartphone className="w-5 h-5" />
              <span className="mt-1">Check-in PWA</span>
            </button>
          ) : (
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
                <span className="mt-1">Cadastros</span>
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
        </div>

      </div>
    </header>
  );
};
