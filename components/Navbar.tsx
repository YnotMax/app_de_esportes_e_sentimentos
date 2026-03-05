import React from 'react';
import { Tab } from '../types';
import { BrainIcon, MapIcon, PlayIcon } from './Icons';

interface NavbarProps {
  currentTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onTabChange }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 pb-safe-area z-30" role="navigation" aria-label="Navegação Principal">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        <button
          onClick={() => onTabChange('explore')}
          aria-label="Explorar"
          aria-current={currentTab === 'explore' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
            currentTab === 'explore' ? 'text-teal-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BrainIcon className="w-6 h-6" />
          <span className="text-xs font-medium">Explorar</span>
        </button>
        <button
          onClick={() => onTabChange('journey')}
          aria-label="Jornada"
          aria-current={currentTab === 'journey' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
            currentTab === 'journey' ? 'text-purple-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <MapIcon className="w-6 h-6" />
          <span className="text-xs font-medium">Jornada</span>
        </button>
        <button
          onClick={() => onTabChange('action')}
          aria-label="Ação"
          aria-current={currentTab === 'action' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
            currentTab === 'action' ? 'text-rose-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <PlayIcon className="w-6 h-6" />
          <span className="text-xs font-medium">Ação</span>
        </button>
      </div>
    </div>
  );
};