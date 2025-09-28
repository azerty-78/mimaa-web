import React, { memo } from 'react';
import { Home, Dashboard, People, Settings, Person } from '@mui/icons-material';

interface BottomBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomBar: React.FC<BottomBarProps> = memo(({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'home', label: 'Accueil', icon: Home },
    { id: 'dashboard', label: 'Tableau', icon: Dashboard },
    { id: 'community', label: 'Communauté', icon: People },
    { id: 'settings', label: 'Paramètres', icon: Settings },
    { id: 'profile', label: 'Profil', icon: Person },
  ];

  return (
    <div className="bg-white/95 backdrop-blur-sm border-t border-gray-200 px-2 sm:px-4 py-1 sm:py-2 h-16 flex items-center shadow-lg">
      <div className="flex justify-around items-center w-full">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center py-1 sm:py-2 px-1 sm:px-3 transition-all duration-200 relative group ${
                isActive 
                  ? 'text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {/* Indicateur actif */}
              {isActive && (
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-blue-600 rounded-full animate-in slide-in-from-top duration-200"></div>
              )}
              
              <div className={`p-2 rounded-full transition-all duration-200 ${
                isActive 
                  ? 'bg-blue-50 scale-110' 
                  : 'group-hover:bg-gray-100 group-hover:scale-105'
              }`}>
                <Icon 
                  className={`w-5 h-5 sm:w-6 sm:h-6 transition-all duration-200 ${
                    isActive ? 'text-blue-600 scale-110' : 'text-gray-500 group-hover:scale-110'
                  }`} 
                />
              </div>
              
              <span className={`text-xs font-medium transition-all duration-200 ${
                isActive ? 'text-blue-600 font-semibold' : 'text-gray-500 group-hover:text-gray-700'
              }`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
});

BottomBar.displayName = 'BottomBar';

export default BottomBar;

