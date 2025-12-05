import React from 'react';
import { WelcomeScreen } from './WelcomeScreen';
import { XIcon, RefreshIcon, InfoIcon } from './Icons';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetApp: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onResetApp }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-md h-[85vh] overflow-hidden relative shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="bg-slate-100 p-4 flex justify-between items-center border-b border-slate-200">
            <div className="flex items-center text-slate-700 font-bold">
                <InfoIcon className="w-5 h-5 mr-2 text-[#E38133]" />
                Sobre o App
            </div>
            <button 
                onClick={onClose}
                className="p-2 bg-slate-200 rounded-full text-slate-600 hover:bg-slate-300 transition-colors"
            >
                <XIcon className="w-5 h-5" />
            </button>
        </div>

        {/* Content - Reusing visual style of Welcome but compact */}
        <div className="flex-1 overflow-y-auto bg-[#FCEE67]">
             {/* We manually reconstruct the info part to fit better in modal without the big Start Button */}
             <div className="p-6 text-center">
                {/* Mini Logo */}
                <div className="mb-6 transform scale-75 origin-top">
                     <h1 className="text-[60px] leading-none font-bold tracking-tighter inline-block" style={{ fontFamily: 'Inter, sans-serif' }}>
                        <span className="text-[#F58F35]">V</span>
                        <span className="text-[#C78D3F]">i</span>
                        <span className="text-[#758C36]">V</span>
                    </h1>
                    <div className="text-[#E38133] font-bold text-sm">INSTITUTO SÃO JOSÉ</div>
                </div>

                <div className="bg-white/60 p-4 rounded-xl text-left text-xs text-slate-700 space-y-3 mb-8 shadow-sm">
                    <p>
                        <strong>Criado por:</strong> Tony Max (Paciente).
                    </p>
                    <p>
                        <strong>Aviso Legal:</strong> O Instituto São José não tem responsabilidade sobre este app. Feito de fã para fã.
                    </p>
                    <p>
                        <strong>Privacidade:</strong> Dados salvos localmente.
                    </p>
                </div>

                {/* Danger Zone */}
                <div className="border-t border-slate-900/10 pt-6">
                    <h3 className="text-slate-800 font-bold mb-2 text-sm uppercase tracking-wider">Zona de Configuração</h3>
                    <p className="text-slate-600 text-xs mb-4">Quer mudar suas respostas e descobrir um novo esporte?</p>
                    
                    <button
                        onClick={() => {
                            if(window.confirm("Tem certeza? Isso apagará seu progresso atual.")) {
                                onResetApp();
                                onClose();
                            }
                        }}
                        className="flex items-center justify-center w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-3 rounded-lg transition-colors"
                    >
                        <RefreshIcon className="w-4 h-4 mr-2" />
                        Refazer Teste & Resetar
                    </button>
                </div>

                <div className="mt-8 text-xs text-slate-500">
                    Versão 1.0.0 • Feito com carinho ❤️
                </div>
             </div>
        </div>
      </div>
    </div>
  );
};