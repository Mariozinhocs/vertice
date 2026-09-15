import React, { useState } from 'react';
import { AlertTriangle, X, ShieldAlert, Check } from 'lucide-react';

interface FieldDisclaimerModalProps {
  onAccept: () => void;
  onCancel: () => void;
}

export const FieldDisclaimerModal: React.FC<FieldDisclaimerModalProps> = ({
  onAccept,
  onCancel
}) => {
  const [acceptedClause1, setAcceptedClause1] = useState(false);
  const [acceptedClause2, setAcceptedClause2] = useState(false);
  const [showWarningDialog, setShowWarningDialog] = useState(false);

  const canContinue = acceptedClause1 && acceptedClause2;

  const handleCloseAttempt = () => {
    setShowWarningDialog(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-red-700 select-none overflow-y-auto font-['Inter',sans-serif]">
      {/* Luzes e Efeitos de Fundo Vermelho com Marcas D'água */}
      <div className="absolute inset-0 bg-gradient-to-b from-red-600 via-red-700 to-red-800 opacity-95" />
      
      {/* Marca D'água com Triângulos de Advertência Sutil no Fundo */}
      <div className="absolute top-10 left-5 text-red-800/40 pointer-events-none transform -rotate-12">
        <AlertTriangle className="w-64 h-64" />
      </div>
      <div className="absolute bottom-5 right-5 text-red-800/40 pointer-events-none transform rotate-12">
        <AlertTriangle className="w-80 h-80" />
      </div>
      <div className="absolute top-1/3 right-10 text-red-800/30 pointer-events-none transform rotate-45">
        <AlertTriangle className="w-44 h-44" />
      </div>

      {/* Botão de Fechar 'X' no Canto Superior Direito */}
      <button
        type="button"
        onClick={handleCloseAttempt}
        className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all shadow-lg"
        title="Fechar"
      >
        <X className="w-5 h-5 font-extrabold" />
      </button>

      {/* Conteúdo Centralizado */}
      <div className="relative z-10 max-w-md w-full my-auto py-6 px-4 flex flex-col items-center text-center space-y-6">
        
        {/* Ícone de Alerta Triangular Amarelo */}
        <div className="relative flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-red-800/50 flex items-center justify-center blur-md absolute" />
          <div className="relative bg-white rounded-2xl p-3 shadow-xl transform -rotate-2">
            <AlertTriangle className="w-12 h-12 text-yellow-500 fill-yellow-400 stroke-red-700 stroke-[2]" />
          </div>
        </div>

        {/* Título Block Text: IMPORTANTE */}
        <div className="space-y-1">
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-widest uppercase drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] font-['Outfit',sans-serif]">
            IMPORTANTE
          </h1>
          <div className="w-32 h-1 bg-white/40 mx-auto rounded-full" />
        </div>

        {/* Cláusula 1: Uso Profissional */}
        <div className="w-full bg-red-800/40 backdrop-blur-sm border border-red-500/30 rounded-2xl p-4 sm:p-5 shadow-lg space-y-3 text-left">
          <p className="text-xs sm:text-sm text-yellow-100 font-semibold leading-relaxed text-center italic">
            "Declaro que utilizarei este sistema exclusivamente para fins profissionais relacionados às minhas atribuições no município de Manaus, estando ciente de que o uso indevido pode acarretar responsabilização administrativa, civil ou penal."
          </p>

          <div className="flex items-center justify-end gap-2.5 pt-1">
            <span className="text-xs font-bold text-white tracking-wide">Aceito</span>
            <button
              type="button"
              onClick={() => setAcceptedClause1(!acceptedClause1)}
              className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-200 ease-in-out focus:outline-none shadow-inner ${
                acceptedClause1 ? 'bg-emerald-400' : 'bg-slate-400/80'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                  acceptedClause1 ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Cláusula 2: Registros de Logs e LGPD */}
        <div className="w-full bg-red-800/40 backdrop-blur-sm border border-red-500/30 rounded-2xl p-4 sm:p-5 shadow-lg space-y-3 text-left">
          <p className="text-xs sm:text-sm text-yellow-100 font-semibold leading-relaxed text-center italic">
            "Estou ciente de que minhas ações neste sistema (acessos, consultas, alterações) são registradas em logs para fins de segurança da informação, auditoria e conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei 13.709/2018)."
          </p>

          <div className="flex items-center justify-end gap-2.5 pt-1">
            <span className="text-xs font-bold text-white tracking-wide">Aceito</span>
            <button
              type="button"
              onClick={() => setAcceptedClause2(!acceptedClause2)}
              className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-200 ease-in-out focus:outline-none shadow-inner ${
                acceptedClause2 ? 'bg-emerald-400' : 'bg-slate-400/80'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                  acceptedClause2 ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Botão CONTINUAR */}
        <div className="w-full pt-2">
          <button
            type="button"
            disabled={!canContinue}
            onClick={onAccept}
            className={`w-48 py-3 px-6 rounded-full font-black text-sm tracking-wider uppercase shadow-xl transition-all duration-300 transform active:scale-95 ${
              canContinue
                ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 text-slate-950 hover:from-amber-400 hover:to-orange-400 shadow-orange-950/50 hover:scale-105 cursor-pointer border-2 border-amber-300'
                : 'bg-slate-400/60 text-slate-700 cursor-not-allowed border border-slate-500/40'
            }`}
          >
            CONTINUAR
          </button>
        </div>

      </div>

      {/* Submodal de Advertência ao Tentar Fechar / Recusar */}
      {showWarningDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
          <div className="relative max-w-sm w-full bg-amber-50 border-4 border-yellow-500 rounded-2xl overflow-hidden shadow-2xl text-slate-900 font-['Inter',sans-serif]">
            
            {/* Faixas de Advertência Amarela e Preta (Hazard Stripes) Topo */}
            <div className="h-6 w-full bg-[repeating-linear-gradient(45deg,#eab308,#eab308_15px,#1e293b_15px,#1e293b_30px)]" />

            <div className="p-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-yellow-100 border border-yellow-400 flex items-center justify-center mx-auto text-yellow-600">
                <AlertTriangle className="w-7 h-7 fill-yellow-400 stroke-yellow-700" />
              </div>

              <p className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                "Para utilizar este sistema, é necessário estar de acordo com os termos abaixo. Caso não concorde, você não poderá acessar as funcionalidades."
              </p>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowWarningDialog(false)}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase shadow-md transition-all active:scale-95"
                >
                  VOLTAR
                </button>
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase shadow-md transition-all active:scale-95"
                >
                  SAIR
                </button>
              </div>
            </div>

            {/* Faixas de Advertência Amarela e Preta Base */}
            <div className="h-6 w-full bg-[repeating-linear-gradient(45deg,#eab308,#eab308_15px,#1e293b_15px,#1e293b_30px)]" />
          </div>
        </div>
      )}

    </div>
  );
};
