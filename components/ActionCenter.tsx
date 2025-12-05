import React, { useState, useEffect, useRef } from 'react';
import { Journey } from '../types';
import { PlayIcon, CalendarIcon, DumbbellIcon, CheckCircleIcon } from './Icons';

interface ActionCenterProps {
  journey: Journey | null;
}

export const ActionCenter: React.FC<ActionCenterProps> = ({ journey }) => {
  const [timerActive, setTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10 * 60); // 10 minutes
  const [sessionComplete, setSessionComplete] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  
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
      fullDate: d.toISOString().split('T')[0]
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

  const handleAddToCalendar = () => {
    if (!selectedDay || !journey) return;

    // Format date for ICS (YYYYMMDD)
    const dateStr = selectedDay.replace(/-/g, '');
    const startTime = '090000'; // 09:00 AM
    const endTime = '093000'; // 09:30 AM

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//NeuroFlow//Habit App//PT',
      'BEGIN:VEVENT',
      `UID:${Date.now()}@neuroflow.app`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `DTSTART:${dateStr}T${startTime}`,
      `DTEND:${dateStr}T${endTime}`,
      `SUMMARY:NeuroFlow: ${journey.sport} Micro-Meta`,
      `DESCRIPTION:Hora de executar seu passo de ${journey.sport}. Lembre-se: foque no gatilho e na micro-meta!`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `neuroflow-${journey.sport}-${selectedDay}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!journey) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] px-6 text-center">
        <DumbbellIcon className="w-16 h-16 text-slate-700 mb-4" />
        <h2 className="text-xl font-bold text-slate-400">Nenhum plano ativo</h2>
        <p className="text-slate-500 mt-2">Vá para "Explorar" para descobrir seu esporte.</p>
      </div>
    );
  }

  return (
    <div className="p-6 pb-24 min-h-screen bg-slate-900">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Centro de Ação</h1>
        <p className="text-slate-400">Objetivo: <span className="text-teal-400 font-medium">{journey.sport}</span></p>
      </div>

      {/* Scheduler */}
      <div className="bg-slate-800 rounded-2xl p-6 mb-8 shadow-lg border border-slate-750">
        <div className="flex items-center mb-4 text-rose-400">
            <CalendarIcon className="w-5 h-5 mr-2" />
            <h3 className="font-bold uppercase tracking-wide text-sm">Agendar Micro-Meta</h3>
        </div>
        <p className="text-slate-400 text-sm mb-4">Escolha um dia para executar seu gatilho.</p>
        <div className="flex justify-between">
            {nextDays.map((day) => (
                <button
                    key={day.fullDate}
                    onClick={() => setSelectedDay(day.fullDate)}
                    className={`flex flex-col items-center justify-center w-12 h-14 rounded-lg transition-all ${
                        selectedDay === day.fullDate 
                        ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/25 scale-110' 
                        : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                    }`}
                >
                    <span className="text-[10px] uppercase font-bold">{day.label}</span>
                    <span className="text-lg font-bold">{day.date}</span>
                </button>
            ))}
        </div>
        {selectedDay && (
            <div className="mt-4 p-4 bg-rose-500/10 border border-rose-500/20 rounded-lg text-center animate-fade-in">
                <p className="text-rose-200 text-sm font-medium mb-3">
                  Agendado!
                </p>
                <button 
                  onClick={handleAddToCalendar}
                  className="bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold py-2 px-4 rounded-full inline-flex items-center transition-colors shadow-lg shadow-rose-500/20 active:scale-95"
                >
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  Adicionar ao Calendário
                </button>
            </div>
        )}
      </div>

      {/* Timer Section */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 text-center border border-slate-700 shadow-2xl relative overflow-hidden">
        {/* Decorative circle */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 via-purple-500 to-rose-500"></div>
        
        <h3 className="text-white font-bold text-lg mb-2">Sessão Rápida</h3>
        <p className="text-slate-400 text-sm mb-8">10 minutos de foco total ou apenas preparação.</p>

        {sessionComplete ? (
            <div className="animate-fade-in py-10">
                <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white">Vitória!</h2>
                <p className="text-slate-300 mt-2">Dopamina liberada com sucesso.</p>
                <button 
                    onClick={() => { setSessionComplete(false); setTimeLeft(600); }}
                    className="mt-6 text-sm text-slate-500 hover:text-white underline"
                >
                    Reiniciar
                </button>
            </div>
        ) : (
            <>
                <div className="text-6xl font-mono font-bold text-white mb-8 tracking-wider tabular-nums">
                    {formatTime(timeLeft)}
                </div>

                <button
                    onClick={toggleTimer}
                    className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto transition-all shadow-xl ${
                        timerActive 
                        ? 'bg-slate-700 text-rose-500 border-2 border-rose-500 animate-pulse' 
                        : 'bg-rose-500 hover:bg-rose-600 text-white scale-100 hover:scale-105'
                    }`}
                >
                    {timerActive ? (
                        <div className="w-6 h-6 bg-current rounded-sm" /> 
                    ) : (
                        <PlayIcon className="w-8 h-8 ml-1" />
                    )}
                </button>
                <p className="text-xs text-slate-500 mt-6 uppercase tracking-widest">
                    {timerActive ? "Em progresso..." : "Iniciar"}
                </p>
            </>
        )}
      </div>
    </div>
  );
};