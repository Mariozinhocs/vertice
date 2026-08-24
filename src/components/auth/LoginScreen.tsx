import React, { useState } from 'react';
import { User, UserRole } from '../../types';
import { Shield, Lock, Mail, ArrowRight, UserCheck, MapPin, Sparkles, AlertCircle } from 'lucide-react';

interface LoginScreenProps {
  users: User[];
  onLoginSuccess: (user: User) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ users, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const foundUser = users.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase()
      );

      if (!foundUser) {
        setError('Usuário não encontrado. Verifique o e-mail digitado.');
        setIsLoading(false);
        return;
      }

      if (foundUser.password && foundUser.password !== password) {
        setError('Senha incorreta. Tente novamente.');
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      onLoginSuccess(foundUser);
    }, 400);
  };

  const handleQuickLogin = (demoUser: User) => {
    setEmail(demoUser.email);
    setPassword(demoUser.password || '123456');
    setError(null);
    onLoginSuccess(demoUser);
  };

  const superAdminUser = users.find((u) => u.role === 'admin');
  const coordUser = users.find((u) => u.role === 'coordenador');
  const campoUser = users.find((u) => u.role === 'campo');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 py-8 relative overflow-hidden font-['Inter',sans-serif]">
      {/* Luzes de fundo atmosféricas (Glow Efeito Glassmorphism) */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Container Central */}
      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Cabeçalho da Marca */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-400 shadow-lg shadow-indigo-500/30 mb-2">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-indigo-200">
            VÉRTICE
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-medium">
            Plataforma Integrada de Gestão e Auditoria de Ações
          </p>
        </div>

        {/* Card do Formulário */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/60 space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-white">Acesse sua conta</h2>
            <p className="text-xs text-slate-400">Informe suas credenciais para acessar o painel operacional.</p>
          </div>

          {error && (
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium animate-fadeIn">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">E-mail corporativo</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ex: seu.nome@vertice.com"
                  className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Senha de acesso</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-medium text-sm shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 active:scale-[0.99] transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <span>Autenticando...</span>
              ) : (
                <>
                  <span>Entrar no Sistema</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divisor */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-800 w-full" />
            <span className="bg-slate-900 px-3 text-[11px] font-medium text-slate-500 uppercase tracking-wider absolute">
              Acesso Rápido de Demonstração
            </span>
          </div>

          {/* Botões de Acesso Rápido aos 3 Perfis */}
          <div className="grid grid-cols-1 gap-2.5 pt-1">
            {superAdminUser && (
              <button
                type="button"
                onClick={() => handleQuickLogin(superAdminUser)}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 hover:bg-slate-800/60 border border-slate-800 hover:border-indigo-500/50 transition-all group text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-200">👑 Super Admin</div>
                    <div className="text-[11px] text-slate-400">Mario Henrique • Acesso Total</div>
                  </div>
                </div>
                <span className="text-[11px] font-medium text-indigo-400 group-hover:translate-x-0.5 transition-transform">Entrar →</span>
              </button>
            )}

            {coordUser && (
              <button
                type="button"
                onClick={() => handleQuickLogin(coordUser)}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 hover:bg-slate-800/60 border border-slate-800 hover:border-amber-500/50 transition-all group text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:bg-amber-500 group-hover:text-white transition-all">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-200">📍 Coordenador por Zona</div>
                    <div className="text-[11px] text-slate-400">{coordUser.name} • {coordUser.regionName || 'Manaus'}</div>
                  </div>
                </div>
                <span className="text-[11px] font-medium text-amber-400 group-hover:translate-x-0.5 transition-transform">Entrar →</span>
              </button>
            )}

            {campoUser && (
              <button
                type="button"
                onClick={() => handleQuickLogin(campoUser)}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 hover:bg-slate-800/60 border border-slate-800 hover:border-emerald-500/50 transition-all group text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-200">📱 Responsável de Campo</div>
                    <div className="text-[11px] text-slate-400">{campoUser.name} • {campoUser.regionName || 'Manaus'}</div>
                  </div>
                </div>
                <span className="text-[11px] font-medium text-emerald-400 group-hover:translate-x-0.5 transition-transform">Entrar →</span>
              </button>
            )}
          </div>
        </div>

        {/* Rodapé institucional */}
        <div className="text-center text-[11px] text-slate-500">
          Vértice Plataforma Operacional &copy; 2026 • Todos os direitos reservados.
        </div>
      </div>
    </div>
  );
};
