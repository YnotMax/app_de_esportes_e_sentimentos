import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Quiz } from './components/Quiz';
import { Pathfinder } from './components/Pathfinder';
import { ActionCenter } from './components/ActionCenter';
import { WelcomeScreen } from './components/WelcomeScreen';
import { SettingsModal } from './components/SettingsModal';
import { SettingsIcon, HomeIcon } from './components/Icons';
import { Tab, Archetype, Journey } from './types';
import { APP_LOGO_URL } from './constants';
import { ToastProvider } from './components/Toast';

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}

function AppContent() {
  const [showWelcome, setShowWelcome] = useState<boolean>(true);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  
  const [currentTab, setCurrentTab] = useState<Tab>('explore');
  const [userArchetype, setUserArchetype] = useState<Archetype | null>(null);
  const [selectedSport, setSelectedSport] = useState<string>('');
  const [currentJourney, setCurrentJourney] = useState<Journey | null>(null);

  // Load from local storage on mount
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('neuroflow_welcome_seen');
    const savedArchetype = localStorage.getItem('neuroflow_archetype');
    const savedJourney = localStorage.getItem('neuroflow_journey');
    
    // If they have data, they've likely seen welcome, but let's check the explicit flag
    if (hasSeenWelcome === 'true') {
        setShowWelcome(false);
    }
    
    if (savedArchetype) setUserArchetype(JSON.parse(savedArchetype));
    if (savedJourney) {
        const parsed = JSON.parse(savedJourney);
        setCurrentJourney(parsed);
        setSelectedSport(parsed.sport);
    }
  }, []);

  const handleStartApp = () => {
      localStorage.setItem('neuroflow_welcome_seen', 'true');
      setShowWelcome(false);
  };

  const handleArchetypeComplete = (archetype: Archetype) => {
    setUserArchetype(archetype);
    localStorage.setItem('neuroflow_archetype', JSON.stringify(archetype));
  };

  const handleResetApp = () => {
    setUserArchetype(null);
    setCurrentJourney(null);
    setSelectedSport('');
    localStorage.removeItem('neuroflow_archetype');
    localStorage.removeItem('neuroflow_journey');
    // We don't reset 'neuroflow_welcome_seen' so they don't get the splash screen loop,
    // but they go back to the Quiz start.
    setCurrentTab('explore');
  };

  // FIX: Função inteligente para gerenciar a seleção de esportes
  const handleSportSelect = (sport: string) => {
    // Se o usuário escolheu um esporte diferente do que estava salvo na jornada atual
    if (currentJourney && currentJourney.sport !== sport) {
        // Limpamos a jornada antiga para que o Pathfinder gere uma nova
        setCurrentJourney(null);
        localStorage.removeItem('neuroflow_journey');
    }
    setSelectedSport(sport);
  };

  const handleSaveJourney = (journey: Journey) => {
    setCurrentJourney(journey);
    localStorage.setItem('neuroflow_journey', JSON.stringify(journey));
  };

  const renderContent = () => {
    switch (currentTab) {
      case 'explore':
        return (
          <Quiz 
            onComplete={handleArchetypeComplete} 
            setSport={handleSportSelect} // Usamos a nova função aqui
            goToJourney={() => setCurrentTab('journey')}
            existingArchetype={userArchetype}
            onReset={handleResetApp}
          />
        );
      case 'journey':
        return (
          <Pathfinder 
            key={selectedSport} // FIX: Força o componente a reiniciar se o esporte mudar
            sport={selectedSport} 
            existingJourney={currentJourney}
            saveJourney={handleSaveJourney}
            goToAction={() => setCurrentTab('action')}
          />
        );
      case 'action':
        return <ActionCenter journey={currentJourney} />;
      default:
        return null;
    }
  };

  if (showWelcome) {
      return <WelcomeScreen onStart={handleStartApp} />;
  }

  return (
    // FIX CRÍTICO: min-h-[100dvh] permite rolagem se necessário (zoom), mas tenta ocupar tela cheia.
    // overflow-hidden no container principal previne scroll duplo indesejado, mas permite scroll interno.
    <div className="bg-slate-900 min-h-[100dvh] w-full flex justify-center text-slate-50 font-sans">
      <main className="w-full max-w-md h-[100dvh] bg-slate-900 shadow-2xl relative flex flex-col overflow-hidden">
        
        {/* Global Header - Absolute para ficar sobre o conteúdo sem empurrar layout */}
        <header className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center p-4 pt-safe-area bg-gradient-to-b from-slate-900/95 to-slate-900/0 pointer-events-none">
             {/* Logo text or simple title */}
             <div 
                onClick={() => setCurrentTab('explore')}
                className="flex items-center gap-2 font-bold text-lg text-slate-200 opacity-90 pointer-events-auto cursor-pointer hover:opacity-100 transition-opacity" 
                role="button" 
                aria-label="Ir para o Início"
             >
                 <img src={APP_LOGO_URL} alt="Logo ViV" className="w-8 h-8 rounded-lg object-contain bg-slate-800 p-1" />
                 <span>ViV <span className="text-[10px] text-slate-400 font-normal ml-1 uppercase tracking-wider">NeuroFlow</span></span>
             </div>
             
             {/* Actions */}
             <div className="flex items-center gap-3 pointer-events-auto">
                <button 
                    onClick={() => setCurrentTab('explore')}
                    aria-label="Ir para o Início"
                    className="p-2 bg-slate-800/90 backdrop-blur rounded-full hover:bg-slate-700 text-slate-300 hover:text-white transition-colors shadow-lg border border-slate-700/50"
                >
                    <HomeIcon className="w-5 h-5" />
                </button>

                <button 
                    onClick={() => setShowSettings(true)}
                    aria-label="Abrir Configurações"
                    className="p-2 bg-slate-800/90 backdrop-blur rounded-full hover:bg-slate-700 text-slate-300 hover:text-white transition-colors shadow-lg border border-slate-700/50"
                >
                    <SettingsIcon className="w-5 h-5" />
                </button>
             </div>
        </header>

        {/* 
            Área de Conteúdo Rolável 
            flex-1: Ocupa todo o espaço restante entre o topo e o navbar.
            overflow-y-auto: Permite rolar apenas este conteúdo.
            pt-20: Espaço para o Header + Safe Area.
            pb-32: Espaço extra para o Navbar não cobrir o último item (aumentado para segurança).
        */}
        <div className="flex-1 overflow-y-auto scrollbar-hide pt-20 pb-32 w-full px-safe-area">
            {renderContent()}
        </div>

        {/* Navbar fixada visualmente na base */}
        <Navbar currentTab={currentTab} onTabChange={setCurrentTab} />
      </main>

      {/* Settings Modal Layer */}
      <SettingsModal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
        onResetApp={handleResetApp}
      />
    </div>
  );
}