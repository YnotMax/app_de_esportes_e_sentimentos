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
            setSport={setSelectedSport}
            goToJourney={() => setCurrentTab('journey')}
            existingArchetype={userArchetype}
            onReset={handleResetApp}
          />
        );
      case 'journey':
        return (
          <Pathfinder 
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
    <div className="bg-slate-900 min-h-screen text-slate-50 font-sans">
      <main className="max-w-md mx-auto min-h-screen bg-slate-900 shadow-2xl overflow-hidden relative pb-16">
        
        {/* Global Header */}
        <header className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center p-4 bg-gradient-to-b from-slate-900/90 to-transparent pointer-events-none">
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

        {/* Padding top handled inside components or via spacer if needed, but components mostly scroll internally or have top padding */}
        <div className="pt-14 h-full overflow-y-auto custom-scrollbar">
            {renderContent()}
        </div>

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