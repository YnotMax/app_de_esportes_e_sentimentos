import React, { useState, useEffect, useRef } from 'react';
import { Journey } from '../types';
import { PlayIcon, CalendarIcon, DumbbellIcon, CheckCircleIcon } from './Icons';
import { generateGoogleCalendarLink, generateOutlookCalendarLink } from '../utils/calendar';
import { useToast } from './Toast';

interface ActionCenterProps {
  journey: Journey | null;
}

export const ActionCenter: React.FC<ActionCenterProps> = ({ journey }) => {
  const [timerActive, setTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10 * 60); // 10 minutes
  const [sessionComplete, setSessionComplete] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const { showToast } = useToast();
  
  // Ref to hold the interval ID so we can clear it on unmount or stop
  const timerRef = useRef<number | null>(null);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Timer logic controlled by state
  useEffect(() => {
    if (timerActive) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            setTimerActive(false);
            setSessionComplete(true);
            showToast('Sessão concluída! Parabéns!', 'success');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, [timerActive]);

  // Mock calendar days
  const nextDays = Array.from({ length: 5 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      label: d.toLocaleDateString('pt-BR', { weekday: 'short' }).slice(0, 3),
      date: d.getDate(),
      fullDate: d.toISOString().split('T')[0],
      rawDate: d
    };
  });

  const toggleTimer = () => {
    setTimerActive(!timerActive);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleOpenCalendar = (type: 'google' | 'outlook') => {
    if (!selectedDay || !journey) return;

    const dayObj = nextDays.find(d => d.fullDate === selectedDay);
    if (!dayObj) return;

    // Set time to 09:00 AM for the selected day
    const startDate = new Date(dayObj.rawDate);
    startDate.setHours(9, 0, 0, 0);

    const title = `NeuroFlow: ${journey.sport} - Micro-Meta`;
    const details = `Hora de executar seu passo de ${journey.sport}.\n\nLembre-se: foque no gatilho e na micro-meta!\n\nGerado pelo app NeuroFlow.`;

    let url = '';
    if (type === 'google') {
        url = generateGoogleCalendarLink(title, details, startDate);
    } else {
        url = generateOutlookCalendarLink(title, details, startDate);
    }

    window.open(url, '_blank');
    showToast('Abrindo calendário...', 'info');
  };

  if (!journey) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] px-6 text-center animate-fade-in">
        <div className="bg-slate-800 p-6 rounded-full mb-6 shadow-lg border border-slate-700">
            <DumbbellIcon className="w-12 h-12 text-slate-500" aria-hidden="true" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Nenhum plano ativo</h2>
        <p className="text-slate-400 max-w-xs mx-auto">Vá para a aba <span className="text-teal-400 font-bold">Explorar</span> para descobrir seu esporte ideal e criar uma jornada.</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 pb-32 min-h-screen bg-slate-900">
      <div className="mb-8 animate-slide-down">
        <h1 className="text-2xl font-bold text-white mb-1">Centro de Ação</h1>
        <div className="flex items-center text-sm text-slate-400">
            <span>Foco atual:</span>
            <span className="ml-2 px-2 py-0.5 bg-teal-500/10 text-teal-400 rounded-md font-bold border border-teal-500/20 uppercase text-xs tracking-wide">
                {journey.sport.split(':')[0]}
            </span>
        </div>
      </div>

      {/* Scheduler Card */}
      <div className="bg-slate-800 rounded-3xl p-6 mb-8 shadow-xl border border-slate-700/50 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none group-hover:bg-rose-500/10 transition-colors"></div>
        
        <div className="flex items-center mb-6">
            <div className="p-2 bg-rose-500/10 rounded-lg mr-3 text-rose-500">
                <CalendarIcon className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
                <h3 className="font-bold text-white text-lg">Agendar Sessão</h3>
                <p className="text-slate-400 text-xs">Comprometa-se com o dia.</p>
            </div>
        </div>

        <div className="flex justify-between gap-2 overflow-x-auto pb-4 scrollbar-hide snap-x" role="radiogroup" aria-label="Selecione um dia">
            {nextDays.map((day) => (
                <button
                    key={day.fullDate}
                    onClick={() => setSelectedDay(day.fullDate)}
                    role="radio"
                    aria-checked={selectedDay === day.fullDate}
                    aria-label={`${day.label}, dia ${day.date}`}
                    className={`flex flex-col items-center justify-center min-w-[3.5rem] h-16 rounded-2xl transition-all duration-300 snap-center focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                        selectedDay === day.fullDate 
                        ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30 scale-105' 
                        : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700 border border-slate-600/30'
                    }`}
                >
                    <span className="text-[10px] uppercase font-bold tracking-wider mb-1 opacity-80">{day.label}</span>
                    <span className="text-xl font-bold">{day.date}</span>
                </button>
            ))}
        </div>

        {selectedDay && (
            <div className="mt-4 animate-fade-in space-y-3">
                <p className="text-center text-slate-400 text-xs mb-2">Adicionar ao:</p>
                <div className="grid grid-cols-2 gap-3">
                    <button 
                        onClick={() => handleOpenCalendar('google')}
                        className="flex items-center justify-center bg-white text-slate-900 hover:bg-slate-100 font-bold py-3 px-4 rounded-xl transition-all shadow-md active:scale-95 text-sm"
                    >
                        <span className="mr-2">Google</span>
                        <span className="text-xs opacity-50">Agenda</span>
                    </button>
                    <button 
                        onClick={() => handleOpenCalendar('outlook')}
                        className="flex items-center justify-center bg-[#0078D4] text-white hover:bg-[#006cbd] font-bold py-3 px-4 rounded-xl transition-all shadow-md active:scale-95 text-sm"
                    >
                        <span className="mr-2">Outlook</span>
                        <span className="text-xs opacity-70">Live</span>
                    </button>
                </div>
            </div>
        )}
      </div>

      {/* Timer Section */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 text-center border border-slate-700 shadow-2xl relative overflow-hidden">
        {/* Decorative circle */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 via-purple-500 to-rose-500 opacity-50"></div>
        
        <div className="relative z-10">
            <h3 className="text-white font-bold text-lg mb-1">Sessão de Foco</h3>
            <p className="text-slate-400 text-sm mb-8 opacity-80">10 minutos para sua micro-meta.</p>

            {sessionComplete ? (
                <div className="animate-scale-up py-6" role="alert">
                    <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/20">
                        <CheckCircleIcon className="w-10 h-10 text-green-500" aria-hidden="true" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Vitória!</h2>
                    <p className="text-slate-300 text-sm mb-6">Dopamina liberada com sucesso.</p>
                    <button 
                        onClick={() => { setSessionComplete(false); setTimeLeft(600); }}
                        className="text-sm font-bold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 py-2 px-6 rounded-full transition-colors border border-slate-700"
                    >
                        Reiniciar Timer
                    </button>
                </div>
            ) : (
                <>
                    <div className="relative mb-8 inline-block">
                        <div className="text-6xl sm:text-7xl font-mono font-bold text-white tracking-wider tabular-nums drop-shadow-lg" role="timer" aria-live="off">
                            {formatTime(timeLeft)}
                        </div>
                        {timerActive && (
                            <span className="absolute -top-2 -right-4 flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                            </span>
                        )}
                    </div>

                    <div className="flex justify-center">
                        <button
                            onClick={toggleTimer}
                            aria-label={timerActive ? "Pausar Timer" : "Iniciar Timer"}
                            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-xl focus:outline-none focus:ring-4 focus:ring-rose-500/30 ${
                                timerActive 
                                ? 'bg-slate-800 text-rose-500 border-2 border-rose-500 hover:bg-slate-750' 
                                : 'bg-gradient-to-br from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 text-white hover:scale-105 hover:shadow-rose-500/25'
                            }`}
                        >
                            {timerActive ? (
                                <div className="w-6 h-6 bg-current rounded-sm" /> 
                            ) : (
                                <PlayIcon className="w-8 h-8 ml-1" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                    <p className="text-xs text-slate-500 mt-6 uppercase tracking-widest font-bold opacity-60" aria-live="polite">
                        {timerActive ? "Focando..." : "Toque para Iniciar"}
                    </p>
                </>
            )}
        </div>
      </div>
    </div>
  );
};