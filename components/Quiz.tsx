import React, { useState, useEffect } from 'react';
import { QuizAnswer, Archetype } from '../types';
import { analyzeNeuroArchetype } from '../services/geminiService';
import { BrainIcon, RefreshIcon, ChevronLeftIcon } from './Icons';
import { QuizResult } from './QuizResult';

interface QuizProps {
  onComplete: (archetype: Archetype) => void;
  setSport: (sport: string) => void;
  goToJourney: () => void;
  existingArchetype: Archetype | null;
  onReset: () => void;
}

// Perguntas expandidas para criar um perfil psicológico profundo
const QUESTIONS = [
  {
    id: 1,
    category: 'social',
    scenario: "Após uma semana estressante, sua bateria social está...",
    options: [
      { text: "Zerada. Preciso de isolamento total para recarregar.", value: "solo" },
      { text: "Baixa, mas topo ver um amigo próximo de confiança.", value: "duo" },
      { text: "Alta! Quero ver gente, rir e interagir em grupo.", value: "group" },
    ]
  },
  {
    id: 2,
    category: 'environment',
    scenario: "Onde você se sente mais 'vivo'?",
    options: [
      { text: "Ambiente controlado, ar condicionado, sem surpresas (Academia/Estúdio).", value: "indoor_controlled" },
      { text: "Ar livre, sol, vento e contato com a natureza.", value: "outdoor_nature" },
      { text: "Um ambiente urbano, concreto, quadras ou pistas.", value: "outdoor_urban" },
    ]
  },
  {
    id: 3,
    category: 'focus',
    scenario: "Como você prefere usar seu cérebro durante o esforço?",
    options: [
      { text: "Desligar tudo. Quero entrar em transe repetitivo.", value: "flow_repetitive" },
      { text: "Resolver problemas. Quero estratégia e xadrez mental.", value: "strategy_game" },
      { text: "Conexão interna. Quero sentir cada músculo e respiração.", value: "mind_body" },
    ]
  },
  {
    id: 4,
    category: 'aggression',
    scenario: "Seu nível de frustração acumulada precisa de...",
    options: [
      { text: "Impacto. Quero bater, chutar ou fazer força bruta.", value: "high_impact" },
      { text: "Explosão. Quero correr rápido ou pular alto.", value: "explosive" },
      { text: "Harmonia. Quero dissipar a tensão com fluidez.", value: "fluidity" },
    ]
  },
  {
    id: 5,
    category: 'structure',
    scenario: "Como você lida com regras complexas?",
    options: [
      { text: "Odeio. Só me diga pra onde correr ou o que levantar.", value: "simple_rules" },
      { text: "Gosto. Aprender a técnica e a regra é parte da diversão.", value: "technical" },
      { text: "Indiferente, desde que eu sue a camisa.", value: "moderate_rules" },
    ]
  },
  {
    id: 6,
    category: 'motivation',
    scenario: "O que te faria voltar no dia seguinte?",
    options: [
      { text: "Ver que meus números/tempos melhoraram (Maestria).", value: "metrics" },
      { text: "Ganhar de alguém ou subir no ranking (Competição).", value: "competition" },
      { text: "A sensação pura de endorfina e dever cumprido (Sensação).", value: "biochemical" },
    ]
  },
  {
    id: 7,
    category: 'pain_tolerance',
    scenario: "Sobre o desconforto físico (fôlego queimando, músculo ardendo):",
    options: [
      { text: "Adoro. 'No pain, no gain'. Me sinto vivo.", value: "high_pain" },
      { text: "Tolero se o jogo for divertido e eu não perceber.", value: "distraction" },
      { text: "Evito. Prefiro algo suave e constante.", value: "low_pain" },
    ]
  },
  {
    id: 8,
    category: 'gear',
    scenario: "Sobre preparar equipamentos (malas, acessórios, raquetes):",
    options: [
      { text: "Amo o ritual. Ter o 'gear' certo me motiva.", value: "gear_head" },
      { text: "Tanto faz, se for necessário eu levo.", value: "neutral" },
      { text: "Preguiça mortal. Quero sair de casa só com a roupa do corpo.", value: "minimalist" },
    ]
  }
];

export const Quiz: React.FC<QuizProps> = ({ onComplete, setSport, goToJourney, existingArchetype, onReset }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Archetype | null>(null);
  
  // Visual state to handle selection highlight and delay
  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(null);

  // Initialize with existing data if present
  useEffect(() => {
    if (existingArchetype) {
      setResult(existingArchetype);
    } else {
      setResult(null);
      setCurrentStep(0);
      setAnswers([]);
    }
  }, [existingArchetype]);

  const handleOptionClick = (option: any, idx: number) => {
    // 1. Visually select immediately
    setSelectedOptionIdx(idx);

    // 2. Wait for visual feedback before moving
    setTimeout(() => {
        handleAnswerLogic(option);
    }, 400); // 400ms delay for better UX
  };

  const handleAnswerLogic = async (option: any) => {
    const newAnswer: QuizAnswer = {
      questionId: QUESTIONS[currentStep].id,
      scenario: QUESTIONS[currentStep].scenario,
      selectedOption: option.text,
      category: QUESTIONS[currentStep].category as any,
    };

    const newAnswers = [...answers, newAnswer];
    setAnswers(newAnswers);
    setSelectedOptionIdx(null); // Reset visual selection for next slide

    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Finish Quiz
      setLoading(true);
      try {
        const archetype = await analyzeNeuroArchetype(newAnswers);
        setResult(archetype);
        onComplete(archetype);
      } catch (error: any) {
        console.error("Error analyzing quiz:", error);
        
        const errorMsg = error.message || JSON.stringify(error);
        
        // Mensagem amigável baseada no erro
        let friendlyMsg = "Ocorreu um erro na conexão com a IA.";
        if (errorMsg.includes("403") || errorMsg.includes("leaked") || errorMsg.includes("permission") || errorMsg.includes("API key")) {
            friendlyMsg = "A chave de API não foi configurada ou expirou.";
        }
        
        alert(`Ops! ${friendlyMsg}\n\nSOLUÇÃO: Toque no ícone de engrenagem (Configurações) no canto superior direito e insira sua API Key válida.\n\nDetalhe técnico: ${errorMsg}`);
        
        // Rollback simple error handling
        setCurrentStep(prev => prev - 1);
        setAnswers(prev => prev.slice(0, -1));
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setAnswers(prev => prev.slice(0, -1)); // Remove last answer
    }
  };

  const handleRetake = () => {
    onReset();
    setResult(null);
    setCurrentStep(0);
    setAnswers([]);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[50vh] text-center px-6 animate-fade-in">
        <div className="animate-spin mb-6">
          <BrainIcon className="w-16 h-16 text-teal-400" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Processando Neuroquímica...</h3>
        <p className="text-slate-400 text-sm">Cruzando seus dados de dopamina, tolerância social e foco.</p>
      </div>
    );
  }

  if (result) {
    return (
      <QuizResult 
        result={result} 
        onRetake={handleRetake} 
        onSelectSport={(sport) => {
            setSport(sport);
            goToJourney();
        }} 
      />
    );
  }

  const question = QUESTIONS[currentStep];

  return (
    <div className="p-4 sm:p-6 max-w-lg mx-auto pb-32">
      {/* Header with Progress and Back Button */}
      <div className="mb-6 sm:mb-8">
        <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
                {currentStep > 0 ? (
                    <button 
                        onClick={handleBack} 
                        aria-label="Voltar para a pergunta anterior"
                        className="mr-3 p-2 -ml-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                    >
                        <ChevronLeftIcon className="w-6 h-6" />
                    </button>
                ) : (
                    <div className="w-8 mr-3"></div> // Spacer to keep title aligned
                )}
                <span className="text-xs font-bold text-slate-400 tracking-widest uppercase" aria-live="polite">
                    Passo {currentStep + 1} de {QUESTIONS.length}
                </span>
            </div>
            <BrainIcon className="w-5 h-5 text-teal-500 opacity-50" aria-hidden="true" />
        </div>
        
        {/* Animated Progress Bar */}
        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden" role="progressbar" aria-valuenow={currentStep + 1} aria-valuemin={1} aria-valuemax={QUESTIONS.length}>
            <div 
                className="h-full bg-gradient-to-r from-teal-600 to-teal-400 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${((currentStep + 1) / QUESTIONS.length) * 100}%` }}
            ></div>
        </div>
      </div>

      {/* Question Container - Key forces re-render animation on step change */}
      <div key={currentStep} className="animate-fade-in">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 leading-tight">
            {question.scenario}
        </h2>
        <p className="text-slate-400 text-sm mb-6 sm:mb-8 italic opacity-90">
            Seja honesto, ninguém está vendo.
        </p>

        <div className="space-y-3 sm:space-y-4" role="radiogroup" aria-label={question.scenario}>
            {question.options.map((option, idx) => {
                const isSelected = selectedOptionIdx === idx;
                return (
                    <button
                        key={idx}
                        onClick={() => handleOptionClick(option, idx)}
                        disabled={selectedOptionIdx !== null} // Prevent double clicking during transition
                        role="radio"
                        aria-checked={isSelected}
                        className={`w-full text-left p-4 sm:p-5 rounded-2xl border-2 transition-all duration-200 shadow-md group relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-teal-500
                            ${isSelected 
                                ? 'bg-teal-500/10 border-teal-500 transform scale-[1.02]' 
                                : 'bg-slate-800 border-transparent hover:border-slate-600 hover:bg-slate-750'
                            }
                        `}
                    >
                        <div className="flex items-center relative z-10">
                            <div className={`
                                w-8 h-8 rounded-full flex items-center justify-center mr-4 font-bold text-sm transition-colors flex-shrink-0
                                ${isSelected 
                                    ? 'bg-teal-500 text-white' 
                                    : 'bg-slate-700 text-slate-400 group-hover:bg-slate-600 group-hover:text-white'
                                }
                            `} aria-hidden="true">
                                {String.fromCharCode(65 + idx)}
                            </div>
                            <span className={`font-medium text-sm sm:text-base transition-colors ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                                {option.text}
                            </span>
                        </div>
                    </button>
                );
            })}
        </div>
      </div>
    </div>
  );
};