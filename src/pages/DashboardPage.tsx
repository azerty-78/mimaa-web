import React from 'react';

const DashboardPage: React.FC = () => {
  return (
    <div className="w-full p-3 sm:p-4 min-h-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Tableau de bord</h1>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-500 text-white p-4 rounded-lg">
            <h3 className="font-semibold">Statistiques</h3>
            <p className="text-2xl font-bold">1,234</p>
          </div>
          <div className="bg-green-500 text-white p-4 rounded-lg">
            <h3 className="font-semibold">Activités</h3>
            <p className="text-2xl font-bold">567</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-800 mb-4">Résumé des activités</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Campagnes actives</span>
              <span className="font-semibold">12</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Utilisateurs inscrits</span>
              <span className="font-semibold">8,456</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Messages envoyés</span>
              <span className="font-semibold">2,345</span>
            </div>
          </div>
        </div>
    </div>
  );
};

export default DashboardPage;

