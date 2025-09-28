import React, { useState } from 'react';
import { Search, Notifications, Person, Logout, Close } from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';

interface TopBarProps {
  onLogout?: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ 
  onLogout
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleProfileClick = () => {
    setIsProfileOpen(true);
  };

  const handleCloseProfile = () => {
    setIsProfileOpen(false);
  };

  const handleLogout = () => {
    logout();
    if (onLogout) {
      onLogout();
    }
    setIsProfileOpen(false);
  };

  return (
    <>
      <div className="bg-white border-b border-gray-200 px-3 sm:px-4 py-2 sm:py-3 h-16 flex items-center">
        <div className="flex items-center justify-between w-full">
          {/* Profil utilisateur */}
          <button 
            onClick={handleProfileClick}
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full overflow-hidden bg-gray-100">
              {user?.profileImage ? (
                <img 
                  src={user.profileImage} 
                  alt={`Photo de profil de ${user.username}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Person className="w-4 h-4 sm:w-6 sm:h-6 text-gray-600" />
              )}
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-gray-800">Salut!</p>
              <p className="text-xs text-gray-500">{user?.username || 'Utilisateur'}</p>
            </div>
          </button>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <button className="p-1.5 sm:p-2 text-gray-600 hover:text-gray-800 transition-colors">
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button className="p-1.5 sm:p-2 text-gray-600 hover:text-gray-800 transition-colors relative">
              <Notifications className="w-4 h-4 sm:w-5 sm:h-5" />
              {/* Badge de notification */}
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </div>
      </div>

      {/* Boîte de dialogue du profil */}
      {isProfileOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
            {/* Header */}
            <div className="bg-blue-500 p-6 text-white relative">
              <button
                onClick={handleCloseProfile}
                className="absolute top-4 right-4 p-1 hover:opacity-80 transition-opacity"
              >
                <Close className="w-5 h-5" />
              </button>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 flex items-center justify-center mb-4 rounded-full overflow-hidden bg-white/20">
                  {user?.profileImage ? (
                    <img 
                      src={user.profileImage} 
                      alt={`Photo de profil de ${user.username}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Person className="w-10 h-10 text-white" />
                  )}
                </div>
                <h3 className="text-xl font-bold">{user?.username || 'Utilisateur'}</h3>
                <p className="text-blue-100 text-sm">{user?.email || 'email@example.com'}</p>
              </div>
            </div>

            {/* Options */}
            <div className="p-4">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 p-4 hover:bg-red-50 rounded-lg transition-colors group"
              >
                <Logout className="w-5 h-5 text-red-600" />
                <span className="text-red-600 font-medium">Se déconnecter</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TopBar;
