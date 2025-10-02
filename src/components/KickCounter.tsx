import React, { useState, useEffect } from 'react';
import { Heart, Play, Pause, RotateCcw, Clock, Activity } from 'lucide-react';

interface KickSession {
  id: string;
  date: string;
  startTime: string;
  endTime?: string;
  kickCount: number;
  duration: number; // en minutes
  notes?: string;
}

interface KickCounterProps {
  userId: number;
  onClose: () => void;
}

const KickCounter: React.FC<KickCounterProps> = ({ userId, onClose }) => {
  const [isActive, setIsActive] = useState(false);
  const [kickCount, setKickCount] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sessions, setSessions] = useState<KickSession[]>([]);
  const [notes, setNotes] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  // Mettre à jour l'heure actuelle
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Charger l'historique des sessions
  useEffect(() => {
    loadSessions();
  }, [userId]);

  const loadSessions = () => {
    try {
      const savedSessions = localStorage.getItem(`kick_sessions_${userId}`);
      if (savedSessions) {
        setSessions(JSON.parse(savedSessions));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des sessions:', error);
    }
  };

  const saveSessions = (newSessions: KickSession[]) => {
    try {
      localStorage.setItem(`kick_sessions_${userId}`, JSON.stringify(newSessions));
      setSessions(newSessions);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des sessions:', error);
    }
  };

  const startSession = () => {
    setIsActive(true);
    setKickCount(0);
    setStartTime(new Date());
  };

  const stopSession = () => {
    if (!startTime) return;

    const endTime = new Date();
    const duration = Math.round((endTime.getTime() - startTime.getTime()) / 1000 / 60); // en minutes

    const newSession: KickSession = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      kickCount,
      duration,
      notes: notes.trim() || undefined
    };

    const updatedSessions = [newSession, ...sessions];
    saveSessions(updatedSessions);

    setIsActive(false);
    setStartTime(null);
    setNotes('');
  };

  const resetSession = () => {
    setIsActive(false);
    setKickCount(0);
    setStartTime(null);
    setNotes('');
  };

  const addKick = () => {
    setKickCount(prev => prev + 1);
  };

  const getElapsedTime = () => {
    if (!startTime) return '00:00';
    const elapsed = Math.floor((currentTime.getTime() - startTime.getTime()) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getKickRate = () => {
    if (!startTime || kickCount === 0) return 0;
    const elapsedMinutes = (currentTime.getTime() - startTime.getTime()) / 1000 / 60;
    return elapsedMinutes > 0 ? (kickCount / elapsedMinutes).toFixed(1) : 0;
  };

  const getStatusColor = () => {
    if (!isActive) return 'text-gray-500';
    if (kickCount < 10) return 'text-yellow-600';
    if (kickCount < 20) return 'text-green-600';
    return 'text-blue-600';
  };

  const getStatusMessage = () => {
    if (!isActive) return 'Prêt à commencer';
    if (kickCount < 10) return 'Continuez à compter...';
    if (kickCount < 20) return 'Bon rythme !';
    return 'Excellent !';
  };

  const getRecentSessions = () => {
    return sessions.slice(0, 5);
  };

  const getAverageKicks = () => {
    if (sessions.length === 0) return 0;
    const totalKicks = sessions.reduce((sum, session) => sum + session.kickCount, 0);
    return (totalKicks / sessions.length).toFixed(1);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Heart className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">Compteur de Mouvements</h2>
                <p className="text-pink-100">Suivez les mouvements de votre bébé</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-pink-200 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Statistiques principales */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-pink-50 p-4 rounded-xl text-center">
              <div className="text-3xl font-bold text-pink-600">{kickCount}</div>
              <div className="text-sm text-pink-800">Mouvements</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-xl text-center">
              <div className="text-3xl font-bold text-blue-600">
                {isActive ? getElapsedTime() : '00:00'}
              </div>
              <div className="text-sm text-blue-800">Temps écoulé</div>
            </div>
            <div className="bg-green-50 p-4 rounded-xl text-center">
              <div className="text-3xl font-bold text-green-600">
                {isActive ? getKickRate() : '0.0'}
              </div>
              <div className="text-sm text-green-800">Mouvements/min</div>
            </div>
          </div>

          {/* Statut et message */}
          <div className={`text-center p-4 rounded-xl mb-6 ${getStatusColor().replace('text-', 'bg-').replace('-600', '-50')}`}>
            <div className="text-lg font-semibold mb-2">{getStatusMessage()}</div>
            <div className="text-sm opacity-75">
              {isActive ? 'Appuyez sur le bouton pour compter chaque mouvement' : 'Commencez une nouvelle session'}
            </div>
          </div>

          {/* Bouton principal de comptage */}
          <div className="text-center mb-6">
            <button
              onClick={addKick}
              disabled={!isActive}
              className={`w-32 h-32 rounded-full text-4xl font-bold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                isActive 
                  ? 'bg-pink-600 text-white hover:bg-pink-700 shadow-lg' 
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              +1
            </button>
          </div>

          {/* Contrôles */}
          <div className="flex justify-center space-x-4 mb-6">
            {!isActive ? (
              <button
                onClick={startSession}
                className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors"
              >
                <Play className="w-5 h-5" />
                <span>Commencer</span>
              </button>
            ) : (
              <>
                <button
                  onClick={stopSession}
                  className="flex items-center space-x-2 bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition-colors"
                >
                  <Pause className="w-5 h-5" />
                  <span>Arrêter</span>
                </button>
                <button
                  onClick={resetSession}
                  className="flex items-center space-x-2 bg-gray-600 text-white px-6 py-3 rounded-xl hover:bg-gray-700 transition-colors"
                >
                  <RotateCcw className="w-5 h-5" />
                  <span>Reset</span>
                </button>
              </>
            )}
          </div>

          {/* Notes */}
          {isActive && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (optionnel)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ajoutez des notes sur cette session..."
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                rows={3}
              />
            </div>
          )}

          {/* Historique récent */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Historique récent</h3>
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="text-pink-600 hover:text-pink-700 text-sm font-medium"
              >
                {showHistory ? 'Masquer' : 'Voir tout'}
              </button>
            </div>

            {sessions.length > 0 ? (
              <div className="space-y-3">
                {(showHistory ? sessions : getRecentSessions()).map(session => (
                  <div key={session.id} className="bg-gray-50 p-4 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl">👶</div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {session.kickCount} mouvements
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(session.startTime).toLocaleDateString('fr-FR')} - {session.duration} min
                          </div>
                          {session.notes && (
                            <div className="text-sm text-gray-600 mt-1">{session.notes}</div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {session.kickCount > 0 ? (session.kickCount / session.duration).toFixed(1) : '0.0'}/min
                        </div>
                        <div className="text-xs text-gray-500">Taux</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Aucune session enregistrée</p>
              </div>
            )}

            {/* Statistiques générales */}
            {sessions.length > 0 && (
              <div className="mt-6 bg-blue-50 p-4 rounded-xl">
                <h4 className="font-semibold text-blue-900 mb-2">Statistiques</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-blue-700">Sessions totales:</span>
                    <span className="font-medium ml-2">{sessions.length}</span>
                  </div>
                  <div>
                    <span className="text-blue-700">Moyenne:</span>
                    <span className="font-medium ml-2">{getAverageKicks()} mouvements/session</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KickCounter;
