import React, { useState, useEffect } from 'react';
import { Journey, JourneyStep } from '../types';
import { generateJourneySteps } from '../services/geminiService';
import { MapIcon, CheckCircleIcon, SkipForwardIcon } from './Icons';
import { JourneySkeleton } from './JourneySkeleton';

interface PathfinderProps {
  sport: string;
  existingJourney: Journey | null;
  saveJourney: (journey: Journey) => void;
  goToAction: () => void;
}

const STEP_TYPE_TRANSLATIONS: Record<string, string> = {
    equipment: 'Equipamento',
    location: 'Local',
    trigger: 'Gatilho',
    'micro-goal': 'Micro-Meta'
};

export const Pathfinder: React.FC<PathfinderProps> = ({ sport, existingJourney, saveJourney, goToAction }) => {
  const [loading, setLoading] = useState(false);
  const [journey, setJourney] = useState<Journey | null>(existingJourney);
  
  useEffect(() => {
    const initJourney = async () => {
      if (!existingJourney && sport) {
        setLoading(true);
        try {
          const steps = await generateJourneySteps(sport);
          const newJourney = { sport, steps };
          setJourney(newJourney);
          saveJourney(newJourney);
        } catch (e: any) {
            console.error(e);
            const errorMsg = e.message || JSON.stringify(e);
            alert(`Erro ao criar jornada.\n\nVerifique se sua chave de API está configurada corretamente nas Configurações (ícone de engrenagem).\n\nErro: ${errorMsg}`);
        } finally {
          setLoading(false);
        }
      }
    };
    initJourney();
  }, [sport, existingJourney, saveJourney]);

  const updateStepStatus = (stepId: number, status: JourneyStep['status']) => {
    if (!journey) return;
    
    const newSteps = journey.steps.map(step => {
      if (step.id === stepId) return { ...step, status };
      // Unlock next step if this one is completed/skipped
      if ((status === 'completed' || status === 'skipped') && step.id === stepId + 1) {
          return { ...step, status: 'current' as const };
      }
      return step;
    });

    const newJourney = { ...journey, steps: newSteps };
    setJourney(newJourney);
    saveJourney(newJourney);
  };

  const isJourneyComplete = journey?.steps.every(s => s.status === 'completed' || s.status === 'skipped');

  if (loading) {
    return <JourneySkeleton />;
  }

  if (!journey) return <div className="p-6 text-center text-slate-400">Selecione um esporte na aba Explorar.</div>;

  return (
    <div className="relative min-h-screen bg-slate-900 pb-32">
      {/* Header Compacto e Fixo */}
      <div className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 shadow-xl">
        <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex-1 min-w-0 pr-4">
                <h2 className="text-lg font-bold text-white truncate leading-tight">
                    {journey.sport.split(':')[0]}
                </h2>
                <p className="text-slate-400 text-xs truncate">
                    Jornada de 4 passos
                </p>
            </div>
            <div className="flex-shrink-0 bg-slate-800 p-2 rounded-lg border border-slate-700">
                <MapIcon className="w-5 h-5 text-purple-500" />
            </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-8 relative">
        {/* Vertical Line - Fixed z-index to be behind cards */}
        <div className="absolute left-[1.85rem] sm:left-[2.35rem] top-6 bottom-10 w-0.5 bg-slate-800 z-0" aria-hidden="true" />

        {journey.steps.map((step, index) => {
          const isLocked = step.status === 'locked';
          const isDone = step.status === 'completed' || step.status === 'skipped';
          const isCurrent = step.status === 'current';

          return (
            <div 
                key={step.id} 
                className={`relative pl-12 sm:pl-14 transition-all duration-300 ${isLocked ? 'opacity-50 grayscale' : 'opacity-100'}`}
                role="listitem"
                aria-current={isCurrent ? 'step' : undefined}
            >
              {/* Dot Indicator - Fixed z-index to be above line but below modal */}
              <div className={`absolute left-0 top-6 w-8 h-8 rounded-full border-4 transition-colors z-10 flex items-center justify-center shadow-md
                ${isDone ? 'bg-green-500 border-green-600' : isCurrent ? 'bg-purple-500 border-purple-600 animate-pulse' : 'bg-slate-800 border-slate-700'}
              `} aria-hidden="true">
                {isDone && <CheckCircleIcon className="w-4 h-4 text-white" />}
                {!isDone && !isCurrent && <div className="w-2 h-2 bg-slate-600 rounded-full" />}
              </div>

              {/* Card - Ensure z-index is above line */}
              <div className={`
                  relative z-10 rounded-2xl p-5 border transition-all duration-300
                  ${isCurrent 
                    ? 'bg-slate-800 border-purple-500/50 shadow-lg shadow-purple-500/10 ring-1 ring-purple-500/20' 
                    : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                  }
              `}>
                <div className="flex justify-between items-start mb-3 gap-4">
                    <span className={`
                        text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-md
                        ${isCurrent ? 'bg-purple-500/20 text-purple-300' : 'bg-slate-700 text-slate-400'}
                    `}>
                        {STEP_TYPE_TRANSLATIONS[step.type] || step.type}
                    </span>
                </div>
                
                <h3 className="text-lg font-bold text-white mb-2 leading-tight break-words">{step.title}</h3>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed break-words">{step.description}</p>

                {!isLocked && !isDone && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => updateStepStatus(step.id, 'completed')}
                      aria-label={`Marcar ${step.title} como feito`}
                      className="flex-1 bg-green-600 hover:bg-green-500 text-white py-3 rounded-xl text-sm font-bold flex items-center justify-center transition-all active:scale-95 shadow-lg shadow-green-900/20 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-slate-800"
                    >
                      <CheckCircleIcon className="w-4 h-4 mr-2" />
                      Feito
                    </button>
                    <button
                      onClick={() => updateStepStatus(step.id, 'skipped')}
                      aria-label={`Pular ${step.title}`}
                      className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white py-3 rounded-xl text-sm font-bold flex items-center justify-center transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-800"
                    >
                      <SkipForwardIcon className="w-4 h-4 mr-2" />
                      Pular
                    </button>
                  </div>
                )}
                 {isDone && (
                     <div className="flex items-center justify-between text-sm font-medium mt-2 pt-2 border-t border-slate-700/50">
                         <span className={`flex items-center ${step.status === 'skipped' ? 'text-slate-400' : 'text-green-400'}`}>
                            {step.status === 'skipped' ? <SkipForwardIcon className="w-4 h-4 mr-2" /> : <CheckCircleIcon className="w-4 h-4 mr-2" />}
                            {step.status === 'skipped' ? 'Pulado' : 'Completado'}
                         </span>
                         <button 
                            onClick={() => updateStepStatus(step.id, 'current')} 
                            className="text-slate-500 hover:text-slate-300 text-xs underline focus:outline-none focus:text-white"
                         >
                            Editar
                         </button>
                     </div>
                 )}
              </div>
            </div>
          );
        })}
        
        {/* Spacer for bottom action button visibility */}
        <div className="h-24" aria-hidden="true"></div>
      </div>

      {/* Start Action Button - Fixed at bottom */}
      {isJourneyComplete && (
        <div className="fixed bottom-16 left-0 right-0 p-6 bg-gradient-to-t from-slate-900 via-slate-900/95 to-transparent z-20 pb-safe-area animate-slide-up">
            <button
                onClick={goToAction}
                className="w-full max-w-md mx-auto bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 text-white font-bold py-4 rounded-2xl shadow-xl shadow-rose-500/20 transform active:scale-95 transition-all flex items-center justify-center group focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
                <span>Ir para Ação</span>
                <span className="ml-2 group-hover:translate-x-1 transition-transform">&rarr;</span>
            </button>
        </div>
      )}
    </div>
  );
};