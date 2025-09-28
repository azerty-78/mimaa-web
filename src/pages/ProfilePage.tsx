import React from 'react';

const ProfilePage: React.FC = () => {
  return (
    <div className="w-full p-3 sm:p-4 min-h-full">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 flex items-center justify-center mb-4">
              <span className="text-gray-800 text-2xl font-bold">BD</span>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-1">Ben Djibril</h2>
            <p className="text-gray-500 text-sm mb-4">Utilisateur actif</p>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium">
              Modifier le profil
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Informations personnelles</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Nom complet</span>
                <span className="text-gray-800">Ben Djibril</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email</span>
                <span className="text-gray-800">ben.djibril@example.com</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Téléphone</span>
                <span className="text-gray-800">+237 6XX XX XX XX</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Région</span>
                <span className="text-gray-800">Extrême-Nord</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Statistiques</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-500">24</p>
                <p className="text-sm text-gray-500">Campagnes suivies</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-500">156</p>
                <p className="text-sm text-gray-500">Messages reçus</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Préférences</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Notifications de santé</span>
                <div className="w-12 h-6 bg-blue-500 rounded-full relative">
                  <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Alertes d'urgence</span>
                <div className="w-12 h-6 bg-blue-500 rounded-full relative">
                  <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default ProfilePage;

