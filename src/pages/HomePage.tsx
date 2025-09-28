import React from 'react';

const HomePage: React.FC = () => {
  return (
    <div className="w-full p-3 sm:p-4 space-y-3 sm:space-y-4 min-h-full">
        {/* Post 1 - Campagne de santé */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="relative">
            <img 
              src="/api/placeholder/400/200" 
              alt="Campagne de santé" 
              className="w-full h-48 object-cover"
            />
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 flex items-center justify-center">
                  <span className="text-gray-800 text-xs">👤</span>
                </div>
                <span className="text-sm font-medium text-gray-700">Campagne de santé centre Pasteur</span>
                <span className="text-green-500">✓</span>
              </div>
              <button className="text-gray-400">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Post 2 - Journées de vaccination */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4">
            <h3 className="text-lg font-bold text-green-600 mb-2">
              JOURNÉES NATIONALES DE VACCINATION DE RIPOSTE À L'ÉPIDÉMIE DE POLIOMYÉLITE
            </h3>
            <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium mb-4 inline-block">
              DU 29 MAI AU 1ER JUIN 2025
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-center space-x-4">
                <div className="text-red-500">💧</div>
                <span className="text-sm text-gray-700">
                  Permettons à nos enfants de 1 à 5 ans de recevoir leur dose de vitamine A
                </span>
              </div>
              <div className="flex items-center space-x-4 mt-2">
                <div className="text-blue-500">💉</div>
                <span className="text-sm text-gray-700">
                  Faisons vacciner tous nos enfants de 0 à 5 ans
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 flex items-center justify-center">
                  <span className="text-gray-800 text-xs">👤</span>
                </div>
                <span className="text-sm font-medium text-gray-700">Journées Nationales de Vaccination</span>
              </div>
              <button className="text-gray-400">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
    </div>
  );
};

export default HomePage;
