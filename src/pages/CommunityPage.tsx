import React from 'react';
import { CalendarToday, Phone, Search, PersonAdd, Psychology, LocalHospital, Favorite } from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';

const CommunityPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="w-full p-3 sm:p-4 min-h-full bg-gray-50">
      <div className="space-y-6">
        {/* Bannière de bienvenue */}
        <div className="bg-blue-50 rounded-2xl p-6 text-center">
          <h1 className="text-2xl font-bold text-blue-900 mb-2" style={{ fontFamily: 'cursive' }}>
            Bienvenue dans votre Communauté
          </h1>
          <p className="text-blue-800 text-sm">
            Connectez-vous avec votre médecin, votre coach IA et d'autres membres de la communauté
          </p>
        </div>

        {/* Actions rapides */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Actions rapides</h2>
          <div className="flex space-x-3">
            <button className="flex-1 bg-gray-100 hover:bg-gray-200 rounded-xl p-4 flex flex-col items-center space-y-2 transition-colors">
              <CalendarToday className="w-6 h-6 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Rendez-vous</span>
            </button>
            <button className="flex-1 bg-gray-100 hover:bg-gray-200 rounded-xl p-4 flex flex-col items-center space-y-2 transition-colors">
              <Phone className="w-6 h-6 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Urgence</span>
            </button>
            <button className="flex-1 bg-gray-100 hover:bg-gray-200 rounded-xl p-4 flex flex-col items-center space-y-2 transition-colors">
              <Search className="w-6 h-6 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Rechercher</span>
            </button>
          </div>
        </div>

        {/* Options de chat */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Options de chat</h2>
          <div className="space-y-4">
            {/* Coach IA Nutritionnel */}
            <div className="bg-blue-50 rounded-2xl p-4 flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <Psychology className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-base">Coach IA Nutritionnel</h3>
                <p className="text-sm text-gray-600">
                  Conseils personnalisés et suivi alimentaire 24/7
                </p>
              </div>
            </div>

            {/* Médecin Traitant */}
            <div className="bg-blue-50 rounded-2xl p-4 flex items-center space-x-4 relative">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <LocalHospital className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-base">Médecin Traitant</h3>
                <p className="text-sm text-gray-600">
                  Consultations et suivi médical personnalisé
                </p>
              </div>
              {/* Badge de notification */}
              <div className="absolute top-3 right-3 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">2</span>
              </div>
            </div>

            {/* Communauté MealMate */}
            <div className="bg-pink-50 rounded-2xl p-4 flex items-center space-x-4 relative">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                <Favorite className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-base">Communauté MealMate</h3>
                <p className="text-sm text-gray-600">
                  Échangez avec d'autres membres de communauté
                </p>
              </div>
              {/* Bouton d'action flottant */}
              <button className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors">
                <PersonAdd className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;

