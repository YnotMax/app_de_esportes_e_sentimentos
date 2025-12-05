import React from 'react';
import { APP_LOGO_URL } from '../constants';

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center text-center p-6 pb-48 text-slate-50 overflow-y-auto scrollbar-hide animate-fade-in relative">
      
      {/* Disclaimer Top - Subtle */}
      <div className="w-full text-[10px] text-slate-500 mb-8 font-medium tracking-wide uppercase opacity-60 mt-4">
        Iniciativa Independente
      </div>

      <div className="mb-10 relative">
        <img 
            src={APP_LOGO_URL}
            alt="ViV Instituto São José" 
            className="w-48 h-48 mx-auto rounded-3xl shadow-2xl shadow-yellow-500/20 object-cover" 
        />
      </div>

      <div className="flex-1 flex flex-col justify-center max-w-xs mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-white mb-2">Bem-vindo ao ViV</h1>
        <p className="text-slate-400 font-medium leading-relaxed">
            Descubra qual atividade física combina com a neuroquímica do seu cérebro e crie hábitos duradouros.
        </p>

        <button 
            onClick={onStart}
            className="w-full bg-gradient-to-r from-[#E38133] to-[#d67220] hover:from-[#d67220] hover:to-[#c56110] text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-500/20 transform transition-transform active:scale-95 text-lg"
        >
            Iniciar Jornada
        </button>
      </div>

      {/* Disclaimers Area - Dark Theme Style */}
      <div className="mt-10 mb-6 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 text-left text-xs text-slate-400 space-y-3 shadow-sm backdrop-blur-sm">
        <p>
            <strong className="text-slate-300">Nota do Desenvolvedor:</strong> Este aplicativo é um projeto pessoal criado por <span className="font-bold text-[#E38133]">Tony Max</span> (paciente) para compartilhar com amigos.
        </p>
        <p>
            <strong className="text-slate-300">Isenção de Responsabilidade:</strong> O <span className="font-bold text-[#E38133]">Instituto São José</span> não possui autoria, vínculo oficial ou responsabilidade sobre o funcionamento, conteúdo ou resultados deste aplicativo.
        </p>
        <p>
            <strong className="text-slate-300">Privacidade & IA:</strong> Utilizamos Inteligência Artificial para personalizar sua experiência. Nem o desenvolvedor nem a IA têm acesso aos seus dados pessoais; tudo fica salvo apenas no seu celular.
        </p>
        <div className="text-center pt-2 font-medium text-slate-500">
            Feito com carinho ❤️
        </div>
      </div>
    </div>
  );
};