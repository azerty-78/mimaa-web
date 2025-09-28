import React, { memo, useState, useEffect } from 'react';
import { Notifications, AccountCircle, Security, Palette, ChevronRight } from '@mui/icons-material';

const SettingsPage: React.FC = memo(() => {
  const [isVisible, setIsVisible] = useState(false);
  const [settings, setSettings] = useState({
    pushNotifications: true,
    emailNotifications: false,
    darkMode: false,
    language: 'fr'
  });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const settingSections = [
    {
      title: 'Notifications',
      description: 'Gérez vos préférences de notification',
      icon: Notifications,
      color: 'from-blue-500 to-blue-600',
      settings: [
        {
          key: 'pushNotifications',
          label: 'Notifications push',
          description: 'Recevez des notifications sur votre appareil',
          type: 'toggle',
          value: settings.pushNotifications
        },
        {
          key: 'emailNotifications',
          label: 'Notifications email',
          description: 'Recevez des notifications par email',
          type: 'toggle',
          value: settings.emailNotifications
        }
      ]
    },
    {
      title: 'Compte',
      description: 'Informations de votre compte',
      icon: AccountCircle,
      color: 'from-green-500 to-green-600',
      settings: [
        {
          key: 'profile',
          label: 'Modifier le profil',
          description: 'Mettez à jour vos informations personnelles',
          type: 'action'
        },
        {
          key: 'password',
          label: 'Changer le mot de passe',
          description: 'Sécurisez votre compte',
          type: 'action'
        }
      ]
    },
    {
      title: 'Application',
      description: 'Préférences de l\'application',
      icon: Palette,
      color: 'from-purple-500 to-purple-600',
      settings: [
        {
          key: 'darkMode',
          label: 'Mode sombre',
          description: 'Basculez entre le mode clair et sombre',
          type: 'toggle',
          value: settings.darkMode
        },
        {
          key: 'language',
          label: 'Langue',
          description: 'Français',
          type: 'select',
          value: settings.language
        }
      ]
    }
  ];

  return (
    <div className="w-full p-3 sm:p-4 min-h-full">
      {/* Header avec animation */}
      <div className={`mb-8 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      } transition-all duration-700`}>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Paramètres</h1>
        <p className="text-gray-600">Personnalisez votre expérience</p>
      </div>
      
      <div className="space-y-6">
        {settingSections.map((section, sectionIndex) => {
          const Icon = section.icon;
          return (
            <div
              key={section.title}
              className={`bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              } transition-all duration-700`}
              style={{ animationDelay: `${sectionIndex * 200}ms` }}
            >
              {/* Header de la section */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${section.color}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{section.title}</h3>
                    <p className="text-sm text-gray-600">{section.description}</p>
                  </div>
                </div>
              </div>

              {/* Contenu de la section */}
              <div className="p-6 space-y-4">
                {section.settings.map((setting, settingIndex) => (
                  <div
                    key={setting.key}
                    className={`flex justify-between items-center p-4 rounded-lg hover:bg-gray-50 transition-all duration-200 ${
                      isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                    }`}
                    style={{ animationDelay: `${(sectionIndex * 200) + (settingIndex * 100)}ms` }}
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-800">{setting.label}</span>
                        {setting.type === 'toggle' && 'value' in setting && (
                          <button
                            onClick={() => toggleSetting(setting.key as keyof typeof settings)}
                            className="relative"
                          >
                            {setting.value ? (
                              <div className="w-12 h-6 bg-blue-500 rounded-full relative transition-colors">
                                <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 transition-transform"></div>
                              </div>
                            ) : (
                              <div className="w-12 h-6 bg-gray-300 rounded-full relative transition-colors">
                                <div className="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5 transition-transform"></div>
                              </div>
                            )}
                          </button>
                        )}
                        {setting.type === 'action' && (
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        )}
                        {setting.type === 'select' && 'value' in setting && (
                          <span className="text-sm text-gray-500">{setting.value}</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{setting.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Section de sécurité */}
        <div className={`bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-6 border border-red-200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        } transition-all duration-700`} style={{ animationDelay: '800ms' }}>
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-red-500 to-orange-500">
              <Security className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Sécurité</h3>
              <p className="text-sm text-gray-600">Protégez votre compte</p>
            </div>
          </div>
          <div className="space-y-3">
            <button className="w-full text-left p-4 bg-white rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-800">Déconnexion de tous les appareils</p>
                  <p className="text-sm text-gray-600">Déconnectez-vous de tous les appareils connectés</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </button>
            <button className="w-full text-left p-4 bg-white rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-800">Supprimer le compte</p>
                  <p className="text-sm text-red-600">Cette action est irréversible</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

SettingsPage.displayName = 'SettingsPage';

export default SettingsPage;