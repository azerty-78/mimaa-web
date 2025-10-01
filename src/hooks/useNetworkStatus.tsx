import { useState, useEffect } from 'react';

interface NetworkStatus {
  isOnline: boolean;
  isSlowConnection: boolean;
  connectionType: string;
  lastError: string | null;
}

export const useNetworkStatus = () => {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isOnline: navigator.onLine,
    isSlowConnection: false,
    connectionType: 'unknown',
    lastError: null,
  });

  useEffect(() => {
    const handleOnline = () => {
      setNetworkStatus(prev => ({
        ...prev,
        isOnline: true,
        lastError: null,
      }));
    };

    const handleOffline = () => {
      setNetworkStatus(prev => ({
        ...prev,
        isOnline: false,
        lastError: 'Connexion internet perdue',
      }));
    };

    // Détecter le type de connexion si disponible
    const detectConnectionType = () => {
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        if (connection) {
          setNetworkStatus(prev => ({
            ...prev,
            connectionType: connection.effectiveType || connection.type || 'unknown',
            isSlowConnection: connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g',
          }));
        }
      }
    };

    // Écouter les changements de statut réseau
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Détecter le type de connexion
    detectConnectionType();

    // Vérifier périodiquement la connexion
    const checkConnection = async () => {
      try {
        const response = await fetch('/api/health', { 
          method: 'HEAD',
          cache: 'no-cache',
        });
        
        if (!response.ok) {
          throw new Error(`Serveur inaccessible: ${response.status}`);
        }
        
        setNetworkStatus(prev => ({
          ...prev,
          isOnline: true,
          lastError: null,
        }));
      } catch (error) {
        setNetworkStatus(prev => ({
          ...prev,
          isOnline: false,
          lastError: error instanceof Error ? error.message : 'Erreur de connexion',
        }));
      }
    };

    // Vérifier la connexion toutes les 30 secondes
    const interval = setInterval(checkConnection, 30000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  const setError = (error: string) => {
    setNetworkStatus(prev => ({
      ...prev,
      lastError: error,
    }));
  };

  const clearError = () => {
    setNetworkStatus(prev => ({
      ...prev,
      lastError: null,
    }));
  };

  return {
    ...networkStatus,
    setError,
    clearError,
  };
};
