import { useEffect, useState } from 'react';

interface ServerInfo {
  startTime: number;
  uptime: number;
  timestamp: number;
}

export const useServerRestart = () => {
  const [serverStartTime, setServerStartTime] = useState<number | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkServerRestart = async () => {
      try {
        const response = await fetch('http://localhost:3001/server-info');
        const serverInfo: ServerInfo = await response.json();
        
        const lastKnownStartTime = localStorage.getItem('serverStartTime');
        
        if (lastKnownStartTime) {
          const lastStartTime = parseInt(lastKnownStartTime);
          if (serverInfo.startTime > lastStartTime) {
            // Le serveur a redémarré, déconnecter l'utilisateur
            console.log('🔄 Serveur redémarré détecté, déconnexion automatique...');
            localStorage.removeItem('user');
            localStorage.removeItem('serverStartTime');
            window.location.href = '/signin';
            return;
          }
        }
        
        // Sauvegarder le timestamp de démarrage actuel
        localStorage.setItem('serverStartTime', serverInfo.startTime.toString());
        setServerStartTime(serverInfo.startTime);
      } catch (error) {
        console.error('Erreur lors de la vérification du serveur:', error);
      } finally {
        setIsChecking(false);
      }
    };

    // Vérifier immédiatement
    checkServerRestart();

    // Vérifier toutes les 30 secondes
    const interval = setInterval(checkServerRestart, 30000);

    return () => clearInterval(interval);
  }, []);

  return { serverStartTime, isChecking };
};
