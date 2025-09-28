import React from 'react';

const CommunityPage: React.FC = () => {
  return (
    <div className="w-full p-3 sm:p-4 min-h-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Communauté</h1>
        
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 flex items-center justify-center">
                <span className="text-gray-800 font-semibold">CM</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Centre Médical</h3>
                <p className="text-sm text-gray-500">2,456 membres</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm">
              Rejoignez la communauté des professionnels de santé pour échanger et partager des informations.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 flex items-center justify-center">
                <span className="text-gray-800 font-semibold">PS</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Patients & Familles</h3>
                <p className="text-sm text-gray-500">5,678 membres</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm">
              Communauté dédiée aux patients et leurs familles pour le soutien et l'information.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 flex items-center justify-center">
                <span className="text-gray-800 font-semibold">EV</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Événements</h3>
                <p className="text-sm text-gray-500">123 événements</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm">
              Découvrez et participez aux événements de santé dans votre région.
            </p>
          </div>
        </div>
    </div>
  );
};

export default CommunityPage;

