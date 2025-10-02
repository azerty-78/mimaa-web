import React, { useState, useEffect } from 'react';
import { Calendar, Heart, AlertTriangle, TrendingUp, CheckCircle } from 'lucide-react';

interface Symptom {
  id: string;
  name: string;
  intensity: number; // 1-5
  notes?: string;
  date: string;
  category: 'physical' | 'emotional' | 'digestive' | 'sleep' | 'other';
}

interface SymptomTrackerProps {
  userId: number;
  onClose: () => void;
}

const SYMPTOM_CATEGORIES = {
  physical: {
    name: 'Physique',
    color: 'bg-blue-100 text-blue-800',
    icon: '💪',
    symptoms: ['Fatigue', 'Douleurs dorsales', 'Crampes', 'Maux de tête', 'Douleurs pelviennes']
  },
  emotional: {
    name: 'Émotionnel',
    color: 'bg-purple-100 text-purple-800',
    icon: '😊',
    symptoms: ['Anxiété', 'Sautes d\'humeur', 'Stress', 'Irritabilité', 'Tristesse']
  },
  digestive: {
    name: 'Digestif',
    color: 'bg-green-100 text-green-800',
    icon: '🍽️',
    symptoms: ['Nausées', 'Vomissements', 'Brûlures d\'estomac', 'Constipation', 'Ballonnements']
  },
  sleep: {
    name: 'Sommeil',
    color: 'bg-indigo-100 text-indigo-800',
    icon: '😴',
    symptoms: ['Insomnie', 'Réveils fréquents', 'Somnolence', 'Cauchemars', 'Apnée']
  },
  other: {
    name: 'Autres',
    color: 'bg-gray-100 text-gray-800',
    icon: '📝',
    symptoms: ['Perte d\'appétit', 'Gain d\'appétit', 'Sensibilité aux odeurs', 'Vertiges', 'Autres']
  }
};

const SymptomTracker: React.FC<SymptomTrackerProps> = ({ userId, onClose }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof SYMPTOM_CATEGORIES>('physical');
  const [selectedSymptom, setSelectedSymptom] = useState('');
  const [intensity, setIntensity] = useState(3);
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Charger les symptômes du jour sélectionné
  useEffect(() => {
    loadSymptomsForDate(selectedDate);
  }, [selectedDate, userId]);

  const loadSymptomsForDate = async (date: string) => {
    try {
      setIsLoading(true);
      // Simuler le chargement depuis l'API
      const savedSymptoms = localStorage.getItem(`symptoms_${userId}_${date}`);
      if (savedSymptoms) {
        setSymptoms(JSON.parse(savedSymptoms));
      } else {
        setSymptoms([]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des symptômes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addSymptom = () => {
    if (!selectedSymptom) return;

    const newSymptom: Symptom = {
      id: Date.now().toString(),
      name: selectedSymptom,
      intensity,
      notes: notes.trim() || undefined,
      date: selectedDate,
      category: selectedCategory
    };

    const updatedSymptoms = [...symptoms, newSymptom];
    setSymptoms(updatedSymptoms);
    
    // Sauvegarder localement
    localStorage.setItem(`symptoms_${userId}_${selectedDate}`, JSON.stringify(updatedSymptoms));
    
    // Réinitialiser le formulaire
    setSelectedSymptom('');
    setIntensity(3);
    setNotes('');
  };

  const removeSymptom = (symptomId: string) => {
    const updatedSymptoms = symptoms.filter(s => s.id !== symptomId);
    setSymptoms(updatedSymptoms);
    localStorage.setItem(`symptoms_${userId}_${selectedDate}`, JSON.stringify(updatedSymptoms));
  };

  const getIntensityColor = (intensity: number) => {
    if (intensity <= 2) return 'text-green-600';
    if (intensity <= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getIntensityLabel = (intensity: number) => {
    const labels = ['Très léger', 'Léger', 'Modéré', 'Fort', 'Très fort'];
    return labels[intensity - 1];
  };

  const getSymptomsForCategory = (category: keyof typeof SYMPTOM_CATEGORIES) => {
    return symptoms.filter(s => s.category === category);
  };

  const getAverageIntensity = () => {
    if (symptoms.length === 0) return 0;
    return symptoms.reduce((sum, s) => sum + s.intensity, 0) / symptoms.length;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Heart className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">Tracker de Symptômes</h2>
                <p className="text-pink-100">Suivez votre bien-être quotidien</p>
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
          {/* Sélecteur de date */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          {/* Statistiques du jour */}
          {symptoms.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-xl">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Symptômes</span>
                </div>
                <div className="text-2xl font-bold text-blue-900">{symptoms.length}</div>
              </div>
              <div className="bg-orange-50 p-4 rounded-xl">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  <span className="text-sm font-medium text-orange-800">Intensité moyenne</span>
                </div>
                <div className="text-2xl font-bold text-orange-900">
                  {getAverageIntensity().toFixed(1)}/5
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-xl">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Bien-être</span>
                </div>
                <div className="text-2xl font-bold text-green-900">
                  {getAverageIntensity() <= 2 ? 'Bon' : getAverageIntensity() <= 3 ? 'Moyen' : 'À surveiller'}
                </div>
              </div>
            </div>
          )}

          {/* Formulaire d'ajout */}
          <div className="bg-gray-50 p-6 rounded-xl mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ajouter un symptôme</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Catégorie */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as keyof typeof SYMPTOM_CATEGORIES)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  {Object.entries(SYMPTOM_CATEGORIES).map(([key, category]) => (
                    <option key={key} value={key}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Symptôme */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Symptôme
                </label>
                <select
                  value={selectedSymptom}
                  onChange={(e) => setSelectedSymptom(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="">Sélectionner un symptôme</option>
                  {SYMPTOM_CATEGORIES[selectedCategory].symptoms.map(symptom => (
                    <option key={symptom} value={symptom}>{symptom}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Intensité */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Intensité: {getIntensityLabel(intensity)}
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={intensity}
                  onChange={(e) => setIntensity(Number(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className={`text-lg font-bold ${getIntensityColor(intensity)}`}>
                  {intensity}/5
                </span>
              </div>
            </div>

            {/* Notes */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (optionnel)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Décrivez votre symptôme..."
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                rows={3}
              />
            </div>

            <button
              onClick={addSymptom}
              disabled={!selectedSymptom || isLoading}
              className="w-full bg-pink-600 text-white py-3 px-6 rounded-xl hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Ajout...' : 'Ajouter le symptôme'}
            </button>
          </div>

          {/* Liste des symptômes par catégorie */}
          <div className="space-y-6">
            {Object.entries(SYMPTOM_CATEGORIES).map(([categoryKey, category]) => {
              const categorySymptoms = getSymptomsForCategory(categoryKey as keyof typeof SYMPTOM_CATEGORIES);
              
              if (categorySymptoms.length === 0) return null;

              return (
                <div key={categoryKey} className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-2xl">{category.icon}</span>
                    <h4 className="text-lg font-semibold text-gray-900">{category.name}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${category.color}`}>
                      {categorySymptoms.length}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    {categorySymptoms.map(symptom => (
                      <div key={symptom.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <span className="font-medium text-gray-900">{symptom.name}</span>
                            <span className={`text-sm font-bold ${getIntensityColor(symptom.intensity)}`}>
                              {symptom.intensity}/5
                            </span>
                            <span className="text-xs text-gray-500">
                              {getIntensityLabel(symptom.intensity)}
                            </span>
                          </div>
                          {symptom.notes && (
                            <p className="text-sm text-gray-600 mt-1">{symptom.notes}</p>
                          )}
                        </div>
                        <button
                          onClick={() => removeSymptom(symptom.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {symptoms.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun symptôme enregistré</h3>
              <p className="text-gray-500">Commencez par ajouter un symptôme pour cette date</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SymptomTracker;
