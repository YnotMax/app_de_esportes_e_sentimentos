import React, { useState, useEffect } from 'react';
import { WelcomeScreen } from './WelcomeScreen';
import { XIcon, RefreshIcon, InfoIcon, SettingsIcon } from './Icons';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetApp: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onResetApp }) => {
  const [customKey, setCustomKey] = useState('');
  const [savedKey, setSavedKey] = useState(false);

  useEffect(() => {
    const key = localStorage.getItem('neuroflow_custom_api_key');
    if (key) {
      setCustomKey(key);
      setSavedKey(true);
    }
  }, [isOpen]);

  const handleSaveKey = () => {
    if (customKey.trim()) {
      localStorage.setItem('neuroflow_custom_api_key', customKey.trim());
      setSavedKey(true);
      alert('Chave API salva com sucesso!');
    } else {
      handleRemoveKey();
    }
  };

  const handleRemoveKey = () => {
    localStorage.removeItem('neuroflow_custom_api_key');
    setCustomKey('');
    setSavedKey(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md h-[85vh] overflow-hidden relative shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="bg-slate-800/50 p-4 flex justify-between items-center border-b border-slate-700">
            <div className="flex items-center text-slate-200 font-bold">
                <SettingsIcon className="w-5 h-5 mr-2 text-[#E38133]" />
                Configurações
            </div>
            <button 
                onClick={onClose}
                className="p-2 bg-slate-700 rounded-full text-slate-400 hover:text-white hover:bg-slate-600 transition-colors"
            >
                <XIcon className="w-5 h-5" />
            </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto scrollbar-hide bg-slate-900">
             <div className="p-6 pb-48">
                {/* Logo Image */}
                <div className="mb-6 text-center">
                     <img 
                        src="https://placehold.co/400x400/FCEE67/000000?text=ViV+Logo" 
                        alt="ViV Instituto São José" 
                        className="w-24 h-24 mx-auto rounded-2xl shadow-lg shadow-yellow-500/10 object-cover" 
                    />
                </div>

                <div className="bg-slate-800/60 p-4 rounded-xl text-left text-xs text-slate-400 space-y-3 mb-8 shadow-sm border border-slate-700/50">
                    <p>
                        <strong className="text-slate-300">Sobre:</strong> App criado por Tony Max (Paciente) para compartilhar com amigos.
                    </p>
                    <p>
                        <strong className="text-slate-300">Disclaimer:</strong> O Instituto São José não tem responsabilidade sobre este app.
                    </p>
                </div>

                {/* API Key Section */}
                <div className="mb-8 border-t border-slate-800 pt-6">
                    <h3 className="text-slate-200 font-bold mb-3 text-sm flex items-center">
                        <span className="bg-slate-700 text-slate-300 text-[10px] px-2 py-0.5 rounded mr-2">AVANÇADO</span>
                        Chave API Personalizada
                    </h3>
                    <p className="text-slate-500 text-xs mb-4">
                        Se a IA do app estiver instável, você pode usar sua própria chave (API Key) do Google Gemini.
                    </p>
                    
                    <div className="space-y-3">
                        <input 
                            type="password" 
                            value={customKey}
                            onChange={(e) => setCustomKey(e.target.value)}
                            placeholder="Cole sua API Key aqui (AIza...)"
                            className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-sm rounded-lg p-3 focus:border-[#E38133] focus:outline-none transition-colors"
                        />
                        <div className="flex space-x-2">
                            <button
                                onClick={handleSaveKey}
                                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold py-3 rounded-lg transition-colors"
                            >
                                {savedKey ? 'Atualizar Chave' : 'Salvar Chave'}
                            </button>
                            {savedKey && (
                                <button
                                    onClick={handleRemoveKey}
                                    className="px-4 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold rounded-lg border border-red-500/30 transition-colors"
                                >
                                    Remover
                                </button>
                            )}
                        </div>
                        {savedKey && (
                             <p className="text-green-500 text-[10px] text-center mt-2 flex items-center justify-center">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
                                Usando chave personalizada
                             </p>
                        )}
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="border-t border-slate-800 pt-6 text-center">
                    <h3 className="text-slate-500 font-bold mb-3 text-xs uppercase tracking-wider">Zona de Reset</h3>
                    <p className="text-slate-500 text-xs mb-4">Quer mudar suas respostas e descobrir um novo esporte?</p>
                    
                    <button
                        onClick={() => {
                            if(window.confirm("Tem certeza? Isso apagará seu progresso atual.")) {
                                onResetApp();
                                onClose();
                            }
                        }}
                        className="flex items-center justify-center w-full bg-slate-800 hover:bg-slate-700 text-rose-400 font-medium py-3 rounded-lg transition-colors border border-slate-700"
                    >
                        <RefreshIcon className="w-4 h-4 mr-2" />
                        Refazer Teste & Resetar
                    </button>
                </div>

                <div className="mt-8 text-xs text-slate-600 text-center">
                    Versão 1.1.0 • Feito com carinho ❤️
                </div>
             </div>
        </div>
      </div>
    </div>
  );
};