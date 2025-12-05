import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Quiz } from './components/Quiz';
import { Pathfinder } from './components/Pathfinder';
import { ActionCenter } from './components/ActionCenter';
import { WelcomeScreen } from './components/WelcomeScreen';
import { SettingsModal } from './components/SettingsModal';
import { SettingsIcon } from './components/Icons';
import { Tab, Archetype, Journey } from './types';

export default function App() {
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
    // FIX CRÍTICO: h-[100dvh] força o app a ter exatamente o tamanho da tela do celular.
    // overflow-hidden previne que a "casca" do site role.
    <div className="bg-slate-900 h-[100dvh] w-full flex justify-center overflow-hidden text-slate-50 font-sans">
      <main className="w-full max-w-md h-full bg-slate-900 shadow-2xl relative flex flex-col">
        
        {/* Global Header - Absolute para ficar sobre o conteúdo sem empurrar layout */}
        <header className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center p-4 bg-gradient-to-b from-slate-900/95 to-slate-900/0 pointer-events-none">
             {/* Logo text or simple title */}
             <div className="font-bold text-lg text-slate-200 opacity-80 pointer-events-auto">
                 ViV <span className="text-[10px] text-slate-500 font-normal ml-1">NeuroFlow</span>
             </div>
             
             {/* Settings Trigger */}
             <button 
                onClick={() => setShowSettings(true)}
                className="p-2 bg-slate-800/80 backdrop-blur rounded-full hover:bg-slate-700 text-slate-400 hover:text-white transition-colors pointer-events-auto shadow-lg"
             >
                 <SettingsIcon className="w-5 h-5" />
             </button>
        </header>

        {/* 
            Área de Conteúdo Rolável 
            flex-1: Ocupa todo o espaço restante entre o topo e o navbar.
            overflow-y-auto: Permite rolar apenas este conteúdo.
            pt-16: Espaço para o Header.
            pb-24: Espaço extra para o Navbar não cobrir o último item.
        */}
        <div className="flex-1 overflow-y-auto scrollbar-hide pt-16 pb-24 w-full">
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