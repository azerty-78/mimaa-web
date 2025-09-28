import React from 'react';

const SettingsPage: React.FC = () => {
  return (
    <div className="w-full p-3 sm:p-4 min-h-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Paramètres</h1>
        
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800">Notifications</h3>
              <p className="text-sm text-gray-500">Gérez vos préférences de notification</p>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Notifications push</span>
                <div className="w-12 h-6 bg-blue-500 rounded-full relative">
                  <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Email</span>
                <div className="w-12 h-6 bg-gray-300 rounded-full relative">
                  <div className="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800">Compte</h3>
              <p className="text-sm text-gray-500">Informations de votre compte</p>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Modifier le profil</span>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Changer le mot de passe</span>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800">Application</h3>
              <p className="text-sm text-gray-500">Préférences de l'application</p>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Thème</span>
                <span className="text-sm text-gray-500">Clair</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Langue</span>
                <span className="text-sm text-gray-500">Français</span>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default SettingsPage;

