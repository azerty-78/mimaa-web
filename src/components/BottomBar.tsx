import React from 'react';
import { Home, Dashboard, People, Settings, Person } from '@mui/icons-material';

interface BottomBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomBar: React.FC<BottomBarProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'home', label: 'Accueil', icon: Home },
    { id: 'dashboard', label: 'Tableau', icon: Dashboard },
    { id: 'community', label: 'Communauté', icon: People },
    { id: 'settings', label: 'Paramètres', icon: Settings },
    { id: 'profile', label: 'Profil', icon: Person },
  ];

  return (
    <div className="bg-white border-t border-gray-200 px-2 sm:px-4 py-1 sm:py-2 h-16 flex items-center">
      <div className="flex justify-around items-center w-full">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center py-1 sm:py-2 px-1 sm:px-3 transition-opacity ${
                isActive 
                  ? 'text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700 hover:opacity-80'
              }`}
            >
              <Icon 
                className={`w-5 h-5 sm:w-6 sm:h-6 mb-0.5 sm:mb-1 ${
                  isActive ? 'text-blue-600' : 'text-gray-500'
                }`} 
              />
              <span className={`text-xs font-medium ${
                isActive ? 'text-blue-600' : 'text-gray-500'
              }`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomBar;

