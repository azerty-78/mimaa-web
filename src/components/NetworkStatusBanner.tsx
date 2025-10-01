import React from 'react';
import { 
  WifiOff, 
  Wifi, 
  Warning, 
  CheckCircle, 
  Close,
  Refresh 
} from '@mui/icons-material';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

const NetworkStatusBanner: React.FC = () => {
  const { isOnline, isSlowConnection, lastError, clearError } = useNetworkStatus();

  if (isOnline && !lastError) {
    return null; // Pas de bannière si tout va bien
  }

  const handleRetry = () => {
    clearError();
    window.location.reload();
  };

  const getStatusInfo = () => {
    if (!isOnline) {
      return {
        icon: <WifiOff className="text-red-500" />,
        message: 'Connexion internet perdue',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        textColor: 'text-red-800',
      };
    }

    if (isSlowConnection) {
      return {
        icon: <Warning className="text-yellow-500" />,
        message: 'Connexion lente détectée',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        textColor: 'text-yellow-800',
      };
    }

    if (lastError) {
      return {
        icon: <Warning className="text-orange-500" />,
        message: lastError,
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
        textColor: 'text-orange-800',
      };
    }

    return {
      icon: <CheckCircle className="text-green-500" />,
      message: 'Connexion rétablie',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-800',
    };
  };

  const statusInfo = getStatusInfo();

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 ${statusInfo.bgColor} ${statusInfo.borderColor} border-b-2`}>
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {statusInfo.icon}
            <span className={`font-medium ${statusInfo.textColor}`}>
              {statusInfo.message}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            {lastError && (
              <button
                onClick={handleRetry}
                className="flex items-center space-x-1 px-3 py-1 bg-white rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                <Refresh className="w-4 h-4" />
                <span className="text-sm">Réessayer</span>
              </button>
            )}
            
            <button
              onClick={clearError}
              className="p-1 hover:bg-gray-200 rounded-full transition-colors"
            >
              <Close className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkStatusBanner;
