import React from 'react';
import { Archetype } from '../types';
import { RefreshIcon, BrainIcon, ChevronRightIcon, DumbbellIcon } from './Icons';

interface QuizResultProps {
  result: Archetype;
  onRetake: () => void;
  onSelectSport: (sport: string) => void;
}

export const QuizResult: React.FC<QuizResultProps> = ({ result, onRetake, onSelectSport }) => {
  return (
    <div className="p-4 sm:p-6 animate-fade-in pb-32 w-full max-w-lg mx-auto">
      <div className="bg-slate-800 rounded-3xl overflow-hidden shadow-2xl border border-slate-700 relative flex flex-col">
        
        {/* Header Section with Gradient Background */}
        <div className="relative bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 p-6 sm:p-8 pb-12">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl -ml-20 -mb-10 pointer-events-none"></div>

            {/* Top Bar */}
            <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center space-x-2 bg-slate-800/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700/50">
                    <BrainIcon className="w-4 h-4 text-teal-400" />
                    <span className="text-[10px] uppercase tracking-widest text-slate-300 font-bold">Diagnóstico</span>
                </div>
                <button 
                    onClick={onRetake} 
                    aria-label="Refazer Quiz"
                    className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors text-xs font-medium p-2 -mr-2 hover:bg-slate-700/50 rounded-lg"
                >
                    <RefreshIcon className="w-4 h-4" />
                    <span>Refazer</span>
                </button>
            </div>

            {/* Archetype Title & Neurochemistry */}
            <div className="relative z-10 text-center sm:text-left">
                <h2 className="text-3xl sm:text-4xl font-black text-white mb-3 tracking-tight leading-tight drop-shadow-lg">
                    {result.name}
                </h2>
                
                <div className="inline-flex items-center bg-purple-500/20 text-purple-200 px-4 py-1.5 rounded-full text-xs font-bold border border-purple-500/30 mb-6 shadow-sm backdrop-blur-sm">
                    <span className="w-2 h-2 bg-purple-400 rounded-full mr-2 animate-pulse"></span>
                    {result.neurochemistry}
                </div>

                <div className="bg-slate-800/40 backdrop-blur-sm rounded-xl p-4 border-l-4 border-teal-500">
                    <p className="text-slate-300 leading-relaxed text-sm sm:text-base italic">
                        "{result.description}"
                    </p>
                </div>
            </div>
        </div>

        {/* Suggested Sports Section */}
        <div className="bg-slate-900/50 p-6 sm:p-8 border-t border-slate-700/50 flex-1">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center">
                <DumbbellIcon className="w-4 h-4 mr-2 text-slate-500" />
                Esportes Compatíveis
            </h3>
            
            <div className="space-y-4" role="list">
                {result.suggestedSports.map((sport, idx) => (
                    <button
                        key={idx}
                        onClick={() => onSelectSport(sport)}
                        aria-label={`Selecionar esporte: ${sport}`}
                        className="w-full text-left p-4 sm:p-5 rounded-2xl bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-teal-500/50 transition-all group focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-md hover:shadow-xl hover:-translate-y-1 relative overflow-hidden"
                    >
                        {/* Hover Gradient Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/0 via-teal-500/0 to-teal-500/5 group-hover:via-teal-500/10 transition-all duration-500"></div>

                        <div className="flex justify-between items-center relative z-10">
                            <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center mr-4 text-slate-300 group-hover:bg-teal-500 group-hover:text-white transition-colors font-bold text-sm border border-slate-600 group-hover:border-teal-400">
                                    {idx + 1}
                                </div>
                                <span className="font-bold text-white text-lg group-hover:text-teal-50 transition-colors">{sport}</span>
                            </div>
                            
                            <div className="flex items-center text-teal-400 text-sm font-medium opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                                <span>Plano</span>
                                <ChevronRightIcon className="w-5 h-5 ml-1" />
                            </div>
                        </div>
                    </button>
                ))}
            </div>
            
            <p className="text-center text-slate-500 text-xs mt-8 opacity-60">
                Toque em um esporte para gerar sua jornada personalizada.
            </p>
        </div>
      </div>
    </div>
  );
};
