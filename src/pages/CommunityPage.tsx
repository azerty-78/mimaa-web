import React from 'react';
import { Search, Notifications, CalendarToday, Phone, Chat, PersonAdd, Psychology, LocalHospital, Favorite } from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';

const CommunityPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="w-full min-h-full bg-gray-50">
      {/* Header avec profil utilisateur */}
      <div className="bg-white px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {/* Profil utilisateur */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 flex items-center justify-center rounded-full overflow-hidden bg-gray-100">
              {user?.profileImage ? (
                <img 
                  src={user.profileImage} 
                  alt={`Photo de profil de ${user.username}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-blue-500 flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {user?.username?.charAt(0) || 'U'}
                  </span>
                </div>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">Salut !</p>
              <p className="text-xs text-gray-500">{user?.username || 'Utilisateur'}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <button className="p-2 text-gray-600 hover:text-gray-800 transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-800 transition-colors relative">
              <Notifications className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="px-4 py-6 space-y-6">
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

