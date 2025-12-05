import React from 'react';

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-[#FCEE67] flex flex-col items-center text-center p-6 text-slate-900 overflow-y-auto animate-fade-in relative">
      
      {/* Disclaimer Top - Subtle */}
      <div className="w-full text-[10px] text-slate-500 mb-8 font-medium tracking-wide uppercase opacity-60">
        Iniciativa Independente
      </div>

      {/* Custom Logo Implementation (Matching the image provided) */}
      <div className="mb-8 relative transform scale-110">
        {/* If you have the image file, uncomment below and add src */}
        {/* <img src="/logo.png" alt="ViV Instituto São José" className="w-48 mx-auto" /> */}
        
        {/* CSS-only Recreation of the Logo */}
        <div className="flex flex-col items-center font-sans">
            <div className="relative">
                {/* The "i" dot (Head) */}
                <div className="w-8 h-8 bg-[#C78D3F] rounded-full absolute -top-8 left-[38px]"></div>
                
                {/* The Chat/Heart bubble */}
                <div className="absolute -top-12 left-16">
                     <svg width="40" height="40" viewBox="0 0 24 24" fill="#C78D3F" className="transform rotate-12 opacity-90">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                     </svg>
                     <span className="absolute top-2 left-2 text-white font-bold text-xs">♥</span>
                </div>
                
                {/* Running man icon */}
                 <div className="absolute -top-10 -right-4">
                     <svg width="30" height="30" viewBox="0 0 24 24" fill="#758C36" stroke="none">
                         <path d="M19 13l-4-2.5-3.5 1-2 5 2 1 2-4 3 2 2.5-2.5zM12 2a2 2 0 1 1-2 2 2 2 0 0 1 2-2zm-3 5l2.5-1.5L13 9l-2 2-4-2 1.5-2.5z"/>
                     </svg>
                 </div>

                {/* Text ViV */}
                <h1 className="text-[120px] leading-none font-bold flex tracking-tighter" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <span className="text-[#F58F35]">V</span>
                    <span className="text-[#C78D3F] mx-[-10px] z-10 relative">i</span>
                    <span className="text-[#758C36]">V</span>
                </h1>
            </div>
            
            <div className="mt-2 space-y-0 leading-tight">
                <div className="text-[#E38133] font-bold text-2xl tracking-wide">INSTITUTO</div>
                <div className="text-[#C78D3F] font-bold text-2xl tracking-wide">SÃO JOSÉ</div>
            </div>
            
            <div className="mt-4 text-[#666] text-xs font-medium tracking-widest uppercase">
                App de Esportes e Sentimentos
            </div>
             <div className="mt-1 text-[#555] text-[10px] font-medium tracking-wide uppercase">
                Conecte Corpo e Mente
            </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center max-w-xs mx-auto space-y-6">
        <p className="text-slate-700 font-medium leading-relaxed">
            Descubra qual atividade física combina com a neuroquímica do seu cérebro e crie hábitos duradouros.
        </p>

        <button 
            onClick={onStart}
            className="w-full bg-[#E38133] hover:bg-[#d67220] text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-500/20 transform transition-transform active:scale-95 text-lg"
        >
            Iniciar Jornada
        </button>
      </div>

      {/* Disclaimers Area */}
      <div className="mt-10 mb-6 bg-white/50 p-4 rounded-xl border border-white/60 text-left text-xs text-slate-600 space-y-3 shadow-sm backdrop-blur-sm">
        <p>
            <strong>Nota do Desenvolvedor:</strong> Este aplicativo é um projeto pessoal criado por <span className="font-bold text-[#E38133]">Tony Max</span> (paciente) para compartilhar com amigos.
        </p>
        <p>
            <strong>Isenção de Responsabilidade:</strong> O <span className="font-bold text-[#C78D3F]">Instituto São José</span> não possui autoria, vínculo oficial ou responsabilidade sobre o funcionamento, conteúdo ou resultados deste aplicativo.
        </p>
        <p>
            <strong>Privacidade & IA:</strong> Utilizamos Inteligência Artificial para personalizar sua experiência. Nem o desenvolvedor nem a IA têm acesso aos seus dados pessoais; tudo fica salvo apenas no seu celular.
        </p>
        <div className="text-center pt-2 font-medium text-slate-400">
            Feito com carinho ❤️
        </div>
      </div>
    </div>
  );
};