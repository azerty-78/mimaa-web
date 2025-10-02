import React, { useState, useEffect } from 'react';
import { TrendingUp, Scale, Target, AlertCircle, CheckCircle } from 'lucide-react';

interface WeightEntry {
  id: string;
  date: string;
  weight: number;
  week: number;
  notes?: string;
}

interface WeightTrackerProps {
  userId: number;
  onClose: () => void;
}

const WeightTracker: React.FC<WeightTrackerProps> = ({ userId, onClose }) => {
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([]);
  const [currentWeight, setCurrentWeight] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showChart, setShowChart] = useState(false);

  // Charger les entrées de poids
  useEffect(() => {
    loadWeightEntries();
  }, [userId]);

  const loadWeightEntries = async () => {
    try {
      setIsLoading(true);
      const savedEntries = localStorage.getItem(`weight_entries_${userId}`);
      if (savedEntries) {
        setWeightEntries(JSON.parse(savedEntries));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des entrées:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveWeightEntries = (entries: WeightEntry[]) => {
    try {
      localStorage.setItem(`weight_entries_${userId}`, JSON.stringify(entries));
      setWeightEntries(entries);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const addWeightEntry = () => {
    const weight = parseFloat(currentWeight);
    if (isNaN(weight) || weight <= 0) return;

    // Calculer la semaine de grossesse (simulation basée sur la date)
    const today = new Date();
    const pregnancyStart = new Date(today.getTime() - (30 * 7 * 24 * 60 * 60 * 1000)); // 30 semaines avant
    const weeksDiff = Math.floor((today.getTime() - pregnancyStart.getTime()) / (7 * 24 * 60 * 60 * 1000));
    const currentWeek = Math.min(40, Math.max(1, weeksDiff));

    const newEntry: WeightEntry = {
      id: Date.now().toString(),
      date: today.toISOString().split('T')[0],
      weight,
      week: currentWeek,
      notes: notes.trim() || undefined
    };

    const updatedEntries = [newEntry, ...weightEntries].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    saveWeightEntries(updatedEntries);
    setCurrentWeight('');
    setNotes('');
  };

  const removeWeightEntry = (id: string) => {
    const updatedEntries = weightEntries.filter(entry => entry.id !== id);
    saveWeightEntries(updatedEntries);
  };

  const getWeightGain = () => {
    if (weightEntries.length < 2) return 0;
    const latest = weightEntries[0];
    const previous = weightEntries[1];
    return latest.weight - previous.weight;
  };

  const getTotalWeightGain = () => {
    if (weightEntries.length === 0) return 0;
    const firstEntry = weightEntries[weightEntries.length - 1];
    const latestEntry = weightEntries[0];
    return latestEntry.weight - firstEntry.weight;
  };

  const getRecommendedWeightGain = (week: number) => {
    // Recommandations basées sur l'IMC pré-grossesse (simulation)
    const bmi = 22; // IMC normal simulé
    if (bmi < 18.5) {
      return { min: 12.5, max: 18, color: 'text-blue-600' };
    } else if (bmi < 25) {
      return { min: 11.5, max: 16, color: 'text-green-600' };
    } else if (bmi < 30) {
      return { min: 7, max: 11.5, color: 'text-yellow-600' };
    } else {
      return { min: 5, max: 9, color: 'text-orange-600' };
    }
  };

  const getWeightStatus = () => {
    const totalGain = getTotalWeightGain();
    const currentWeek = weightEntries.length > 0 ? weightEntries[0].week : 1;
    const recommended = getRecommendedWeightGain(currentWeek);
    
    if (totalGain < recommended.min) {
      return { status: 'Insuffisant', color: 'text-red-600', icon: AlertCircle };
    } else if (totalGain > recommended.max) {
      return { status: 'Excessif', color: 'text-orange-600', icon: AlertCircle };
    } else {
      return { status: 'Normal', color: 'text-green-600', icon: CheckCircle };
    }
  };

  const getRecentEntries = () => {
    return weightEntries.slice(0, 5);
  };

  const getWeightChartData = () => {
    return weightEntries.slice(-10).reverse().map(entry => ({
      week: entry.week,
      weight: entry.weight,
      date: entry.date
    }));
  };

  const weightStatus = getWeightStatus();
  const StatusIcon = weightStatus.icon;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Scale className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">Suivi du Poids</h2>
                <p className="text-green-100">Surveillez votre prise de poids</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-green-200 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Statistiques principales */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-green-50 p-4 rounded-xl text-center">
              <div className="text-2xl font-bold text-green-600">
                {weightEntries.length > 0 ? weightEntries[0].weight.toFixed(1) : '--'} kg
              </div>
              <div className="text-sm text-green-800">Poids actuel</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-xl text-center">
              <div className="text-2xl font-bold text-blue-600">
                {getWeightGain() > 0 ? '+' : ''}{getWeightGain().toFixed(1)} kg
              </div>
              <div className="text-sm text-blue-800">Gain récent</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-xl text-center">
              <div className="text-2xl font-bold text-purple-600">
                {getTotalWeightGain() > 0 ? '+' : ''}{getTotalWeightGain().toFixed(1)} kg
              </div>
              <div className="text-sm text-purple-800">Gain total</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-xl text-center">
              <div className={`text-2xl font-bold ${weightStatus.color}`}>
                {weightStatus.status}
              </div>
              <div className="text-sm text-orange-800">Statut</div>
            </div>
          </div>

          {/* Statut avec icône */}
          <div className={`flex items-center justify-center space-x-2 p-4 rounded-xl mb-6 ${weightStatus.color.replace('text-', 'bg-').replace('-600', '-50')}`}>
            <StatusIcon className="w-6 h-6" />
            <span className="text-lg font-semibold">
              Prise de poids: {weightStatus.status}
            </span>
          </div>

          {/* Formulaire d'ajout */}
          <div className="bg-gray-50 p-6 rounded-xl mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ajouter une mesure</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Poids (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={currentWeight}
                  onChange={(e) => setCurrentWeight(e.target.value)}
                  placeholder="Ex: 65.5"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={new Date().toISOString().split('T')[0]}
                  disabled
                  className="w-full p-3 border border-gray-300 rounded-xl bg-gray-100"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (optionnel)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Comment vous sentez-vous ?"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                rows={3}
              />
            </div>

            <button
              onClick={addWeightEntry}
              disabled={!currentWeight || isLoading}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Ajout...' : 'Ajouter la mesure'}
            </button>
          </div>

          {/* Recommandations */}
          <div className="bg-blue-50 p-4 rounded-xl mb-6">
            <h4 className="font-semibold text-blue-900 mb-2 flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <span>Recommandations</span>
            </h4>
            <div className="text-sm text-blue-800">
              <p>• Pesez-vous une fois par semaine, toujours le même jour</p>
              <p>• Utilisez la même balance à chaque fois</p>
              <p>• Notez vos observations pour partager avec votre médecin</p>
            </div>
          </div>

          {/* Historique récent */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Historique récent</h3>
              <button
                onClick={() => setShowChart(!showChart)}
                className="text-green-600 hover:text-green-700 text-sm font-medium"
              >
                {showChart ? 'Masquer le graphique' : 'Voir le graphique'}
              </button>
            </div>

            {showChart && weightEntries.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
                <h4 className="font-semibold text-gray-900 mb-4">Évolution du poids</h4>
                <div className="h-64 flex items-end space-x-2">
                  {getWeightChartData().map((point, index) => {
                    const maxWeight = Math.max(...getWeightChartData().map(p => p.weight));
                    const minWeight = Math.min(...getWeightChartData().map(p => p.weight));
                    const height = ((point.weight - minWeight) / (maxWeight - minWeight)) * 200;
                    
                    return (
                      <div key={index} className="flex flex-col items-center flex-1">
                        <div
                          className="bg-green-500 rounded-t w-full min-h-[20px]"
                          style={{ height: `${Math.max(20, height)}px` }}
                        />
                        <div className="text-xs text-gray-500 mt-2 text-center">
                          <div className="font-medium">{point.weight}kg</div>
                          <div>S{point.week}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {weightEntries.length > 0 ? (
              <div className="space-y-3">
                {getRecentEntries().map(entry => (
                  <div key={entry.id} className="bg-gray-50 p-4 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl">⚖️</div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {entry.weight} kg - Semaine {entry.week}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(entry.date).toLocaleDateString('fr-FR')}
                          </div>
                          {entry.notes && (
                            <div className="text-sm text-gray-600 mt-1">{entry.notes}</div>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => removeWeightEntry(entry.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Scale className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Aucune mesure enregistrée</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeightTracker;
