import React, { useState, useEffect, useRef } from 'react';
import { Journey, JourneyStep } from '../types';
import { generateJourneySteps, getChatAssistance } from '../services/geminiService';
import { MapIcon, CheckCircleIcon, SkipForwardIcon, ChatBubbleIcon, RefreshIcon } from './Icons';

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
  
  // Chat State
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user'|'model', text: string}[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const activeStepRef = useRef<JourneyStep | null>(null);

  useEffect(() => {
    const initJourney = async () => {
      if (!existingJourney && sport) {
        setLoading(true);
        try {
          const steps = await generateJourneySteps(sport);
          const newJourney = { sport, steps };
          setJourney(newJourney);
          saveJourney(newJourney);
        } catch (e) {
            console.error(e);
            alert("Erro ao criar jornada. Tente novamente.");
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

  const handleChat = async () => {
    if(!chatMessage.trim()) return;

    const userMsg = chatMessage;
    setChatMessage('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatLoading(true);

    let location: GeolocationCoordinates | undefined;
    
    // Only request location if user explicitly asks for 'where' or 'location' context
    // or if the current step is 'location'
    if (activeStepRef.current?.type === 'location' || userMsg.toLowerCase().includes('onde') || userMsg.toLowerCase().includes('local')) {
        try {
            const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            });
            location = pos.coords;
        } catch (e) {
            console.warn("Location permission denied or error");
        }
    }

    try {
        const responseText = await getChatAssistance(
            userMsg, 
            sport, 
            activeStepRef.current?.description || "Contexto Geral",
            location
        );
        setChatHistory(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (e) {
        setChatHistory(prev => [...prev, { role: 'model', text: "Desculpe, tive um problema de conexão. Tente novamente." }]);
    } finally {
        setChatLoading(false);
    }
  };

  const isJourneyComplete = journey?.steps.every(s => s.status === 'completed' || s.status === 'skipped');

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <div className="animate-spin mb-4 text-purple-400">
          <MapIcon className="w-12 h-12" />
        </div>
        <p className="text-slate-300">Engenharia reversa do hábito...</p>
      </div>
    );
  }

  if (!journey) return <div className="p-6 text-center text-slate-400">Selecione um esporte na aba Explorar.</div>;

  return (
    <div className="relative min-h-screen pb-24 bg-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-slate-900/90 backdrop-blur-md p-6 border-b border-slate-800">
        <h2 className="text-2xl font-bold text-white">Desbravador: {journey.sport}</h2>
        <p className="text-slate-400 text-sm">Passo a passo logístico para começar.</p>
      </div>

      <div className="p-6 space-y-8 relative">
        {/* Vertical Line */}
        <div className="absolute left-9 top-10 bottom-10 w-0.5 bg-slate-800 -z-0" />

        {journey.steps.map((step, index) => {
          const isLocked = step.status === 'locked';
          const isDone = step.status === 'completed' || step.status === 'skipped';
          const isCurrent = step.status === 'current';

          return (
            <div key={step.id} className={`relative pl-12 transition-opacity ${isLocked ? 'opacity-40 grayscale' : 'opacity-100'}`}>
              {/* Dot Indicator */}
              <div className={`absolute left-0 top-6 w-6 h-6 rounded-full border-4 transition-colors z-10
                ${isDone ? 'bg-green-500 border-green-500' : isCurrent ? 'bg-purple-500 border-purple-500 animate-pulse' : 'bg-slate-900 border-slate-600'}
              `}>
                {isDone && <CheckCircleIcon className="w-3 h-3 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />}
              </div>

              {/* Card */}
              <div className={`bg-slate-800 rounded-xl p-5 border ${isCurrent ? 'border-purple-500/50 shadow-purple-500/20 shadow-lg' : 'border-slate-700'}`}>
                <div className="flex justify-between items-start mb-2">
                    <span className="text-xs uppercase font-bold text-slate-500 tracking-wider">
                        {STEP_TYPE_TRANSLATIONS[step.type] || step.type}
                    </span>
                    <button 
                        onClick={() => {
                            setChatOpen(true);
                            activeStepRef.current = step;
                            setChatHistory([]); // Reset chat for new context or keep history? Resetting for simplicity per step context
                        }}
                        className="text-purple-400 hover:text-purple-300"
                    >
                        <ChatBubbleIcon className="w-5 h-5" />
                    </button>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">{step.title}</h3>
                <p className="text-slate-400 text-sm mb-4 leading-relaxed">{step.description}</p>

                {!isLocked && !isDone && (
                  <div className="flex space-x-3">
                    <button
                      onClick={() => updateStepStatus(step.id, 'completed')}
                      className="flex-1 bg-green-600 hover:bg-green-500 text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center transition-colors"
                    >
                      <CheckCircleIcon className="w-4 h-4 mr-2" />
                      Feito
                    </button>
                    <button
                      onClick={() => updateStepStatus(step.id, 'skipped')}
                      className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-300 py-2 rounded-lg text-sm font-medium flex items-center justify-center transition-colors"
                    >
                      <SkipForwardIcon className="w-4 h-4 mr-2" />
                      Pular
                    </button>
                  </div>
                )}
                 {isDone && (
                     <div className="flex items-center text-green-400 text-sm font-medium mt-2">
                         <CheckCircleIcon className="w-4 h-4 mr-2" /> {step.status === 'skipped' ? 'Pulado' : 'Completado'}
                         <button onClick={() => updateStepStatus(step.id, 'current')} className="ml-auto text-slate-500 text-xs underline">Editar</button>
                     </div>
                 )}
              </div>
            </div>
          );
        })}
      </div>

        {/* Start Action Button */}
        {isJourneyComplete && (
            <div className="fixed bottom-20 left-0 right-0 p-6 bg-gradient-to-t from-slate-900 to-transparent">
                <button
                    onClick={goToAction}
                    className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-rose-500/30 transform hover:scale-[1.02] transition-all"
                >
                    Ir para Ação &rarr;
                </button>
            </div>
        )}

      {/* Chat Modal */}
      {chatOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-800 w-full max-w-md h-[70vh] rounded-2xl flex flex-col overflow-hidden shadow-2xl border border-slate-700">
            <div className="p-4 bg-slate-900 border-b border-slate-700 flex justify-between items-center">
              <h3 className="text-white font-bold flex items-center">
                  <ChatBubbleIcon className="w-5 h-5 mr-2 text-purple-400" />
                  Assistente IA
              </h3>
              <button onClick={() => setChatOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatHistory.length === 0 && (
                    <div className="text-center text-slate-500 mt-10">
                        <p>Dúvidas sobre {STEP_TYPE_TRANSLATIONS[activeStepRef.current?.type || ''] || activeStepRef.current?.type}?</p>
                        <p className="text-xs mt-2">Ex: "Onde encontrar {activeStepRef.current?.type === 'equipment' ? 'equipamentos' : 'locais'} baratos?"</p>
                    </div>
                )}
                {chatHistory.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-3 rounded-lg text-sm ${
                            msg.role === 'user' ? 'bg-purple-600 text-white rounded-br-none' : 'bg-slate-700 text-slate-200 rounded-bl-none prose prose-invert prose-p:my-1 prose-a:text-teal-400'
                        }`}>
                             {/* Very basic markdown rendering for links */}
                             {msg.role === 'model' ? (
                                <div dangerouslySetInnerHTML={{ 
                                    __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                                    .replace(/\n/g, '<br/>')
                                                    .replace(/- \[(.*?)\]\((.*?)\)/g, '• <a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
                                }} />
                             ) : msg.text}
                        </div>
                    </div>
                ))}
                {chatLoading && <div className="text-slate-500 text-xs animate-pulse">Digitando...</div>}
            </div>

            <div className="p-4 bg-slate-900 border-t border-slate-700">
                <div className="flex space-x-2">
                    <input 
                        type="text" 
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleChat()}
                        placeholder="Pergunte algo..."
                        className="flex-1 bg-slate-800 border border-slate-600 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-purple-500"
                    />
                    <button onClick={handleChat} disabled={chatLoading} className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-500 disabled:opacity-50">
                        ➤
                    </button>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};