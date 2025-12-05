import React from 'react';
import { Tab } from '../types';
import { BrainIcon, MapIcon, PlayIcon } from './Icons';

interface NavbarProps {
  currentTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onTabChange }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 pb-safe-area">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        <button
          onClick={() => onTabChange('explore')}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
            currentTab === 'explore' ? 'text-teal-400' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <BrainIcon className="w-6 h-6" />
          <span className="text-xs font-medium">Explorar</span>
        </button>
        <button
          onClick={() => onTabChange('journey')}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
            currentTab === 'journey' ? 'text-purple-400' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <MapIcon className="w-6 h-6" />
          <span className="text-xs font-medium">Jornada</span>
        </button>
        <button
          onClick={() => onTabChange('action')}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
            currentTab === 'action' ? 'text-rose-400' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <PlayIcon className="w-6 h-6" />
          <span className="text-xs font-medium">Ação</span>
        </button>
      </div>
    </div>
  );
};