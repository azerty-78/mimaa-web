import React, { memo, useState, useEffect } from 'react';
import { Notifications, AccountCircle, Security, Palette, ChevronRight } from '@mui/icons-material';

interface Settings {
  pushNotifications: boolean;
  emailNotifications: boolean;
  darkMode: boolean;
  language: string;
}

interface SettingItem {
  key: string;
  label: string;
  description: string;
  type: 'toggle' | 'action' | 'select';
  value?: boolean | string;
  action?: string;
  options?: Array<{ code: string; name: string; flag: string }>;
}

const SettingsPage: React.FC = memo(() => {
  const [isVisible, setIsVisible] = useState(false);
  const [settings, setSettings] = useState<Settings>({
    pushNotifications: true,
    emailNotifications: false,
    darkMode: false,
    language: 'fr'
  });

  // Charger les paramètres depuis localStorage au montage
  useEffect(() => {
    const savedSettings = localStorage.getItem('mimaa-settings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsedSettings }));
      } catch (error) {
        console.error('Erreur lors du chargement des paramètres:', error);
      }
    }
    setIsVisible(true);
  }, []);

  // Sauvegarder les paramètres dans localStorage
  useEffect(() => {
    localStorage.setItem('mimaa-settings', JSON.stringify(settings));
  }, [settings]);

  const toggleSetting = (key: keyof Settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const updateSetting = (key: keyof Settings, value: boolean | string) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleAction = (action: string) => {
    switch (action) {
      case 'profile':
        alert('Fonctionnalité de modification du profil à implémenter');
        break;
      case 'password':
        alert('Fonctionnalité de changement de mot de passe à implémenter');
        break;
      case 'logout':
        alert('Déconnexion de tous les appareils - Fonctionnalité à implémenter');
        break;
      case 'delete':
        if (window.confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
          alert('Suppression du compte - Fonctionnalité à implémenter');
        }
        break;
      default:
        console.log('Action non reconnue:', action);
    }
  };

  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
  ];

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
          type: 'action',
          action: 'profile'
        },
        {
          key: 'password',
          label: 'Changer le mot de passe',
          description: 'Sécurisez votre compte',
          type: 'action',
          action: 'password'
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
          description: languages.find(lang => lang.code === settings.language)?.name || 'Français',
          type: 'select',
          value: settings.language,
          options: languages
        }
      ]
    }
  ];

  return (
    <div className={`w-full p-3 sm:p-4 min-h-full transition-colors duration-300 ${
      settings.darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Header avec animation */}
      <div className={`mb-8 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      } transition-all duration-700`}>
        <h1 className={`text-3xl font-bold mb-2 transition-colors duration-300 ${
          settings.darkMode ? 'text-white' : 'text-gray-800'
        }`}>Paramètres</h1>
        <p className={`transition-colors duration-300 ${
          settings.darkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>Personnalisez votre expérience</p>
      </div>
      
      <div className="space-y-6">
        {settingSections.map((section, sectionIndex) => {
          const Icon = section.icon;
          return (
            <div
              key={section.title}
              className={`rounded-xl shadow-lg border overflow-hidden transition-all duration-700 ${
                settings.darkMode 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-100'
              } ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ animationDelay: `${sectionIndex * 200}ms` }}
            >
              {/* Header de la section */}
              <div className={`p-6 border-b transition-colors duration-300 ${
                settings.darkMode 
                  ? 'bg-gradient-to-r from-gray-700 to-gray-800 border-gray-600' 
                  : 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200'
              }`}>
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${section.color}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className={`text-lg font-semibold transition-colors duration-300 ${
                      settings.darkMode ? 'text-white' : 'text-gray-800'
                    }`}>{section.title}</h3>
                    <p className={`text-sm transition-colors duration-300 ${
                      settings.darkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>{section.description}</p>
                  </div>
                </div>
              </div>

              {/* Contenu de la section */}
              <div className="p-6 space-y-4">
                {section.settings.map((setting, settingIndex) => (
                  <div
                    key={setting.key}
                    className={`flex justify-between items-center p-4 rounded-lg transition-all duration-200 ${
                      settings.darkMode 
                        ? 'hover:bg-gray-700' 
                        : 'hover:bg-gray-50'
                    } ${
                      isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                    }`}
                    style={{ animationDelay: `${(sectionIndex * 200) + (settingIndex * 100)}ms` }}
                    onClick={setting.type === 'action' ? () => handleAction((setting as SettingItem).action || '') : undefined}
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className={`font-medium transition-colors duration-300 ${
                          settings.darkMode ? 'text-white' : 'text-gray-800'
                        }`}>{setting.label}</span>
                        {setting.type === 'toggle' && 'value' in setting && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSetting(setting.key as keyof Settings);
                            }}
                            className="relative focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-full"
                          >
                            {setting.value ? (
                              <div className="w-12 h-6 bg-blue-500 rounded-full relative transition-all duration-300 shadow-inner">
                                <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 transition-transform duration-300 shadow-md"></div>
                              </div>
                            ) : (
                              <div className="w-12 h-6 bg-gray-300 rounded-full relative transition-all duration-300 shadow-inner">
                                <div className="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5 transition-transform duration-300 shadow-md"></div>
                              </div>
                            )}
                          </button>
                        )}
                        {setting.type === 'action' && (
                          <ChevronRight className={`w-5 h-5 transition-colors duration-300 ${
                            settings.darkMode ? 'text-gray-400' : 'text-gray-400'
                          }`} />
                        )}
                        {setting.type === 'select' && 'value' in setting && (
                          <div className="flex items-center space-x-2">
                            <span className={`text-sm transition-colors duration-300 ${
                              settings.darkMode ? 'text-gray-300' : 'text-gray-500'
                            }`}>
                              {setting.options?.find(opt => opt.code === setting.value)?.flag} {setting.options?.find(opt => opt.code === setting.value)?.name}
                            </span>
                            <select
                              value={setting.value as string}
                              onChange={(e) => updateSetting(setting.key as keyof Settings, e.target.value)}
                              className={`text-sm rounded-md border-0 focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${
                                settings.darkMode 
                                  ? 'bg-gray-700 text-white' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                              onClick={(e) => e.stopPropagation()}
                            >
                              {setting.options?.map(option => (
                                <option key={option.code} value={option.code}>
                                  {option.flag} {option.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                      <p className={`text-sm mt-1 transition-colors duration-300 ${
                        settings.darkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>{setting.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Section de sécurité */}
        <div className={`rounded-xl p-6 border transition-all duration-700 ${
          settings.darkMode 
            ? 'bg-gradient-to-r from-red-900 to-orange-900 border-red-700' 
            : 'bg-gradient-to-r from-red-50 to-orange-50 border-red-200'
        } ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`} style={{ animationDelay: '800ms' }}>
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-red-500 to-orange-500">
              <Security className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className={`text-lg font-semibold transition-colors duration-300 ${
                settings.darkMode ? 'text-white' : 'text-gray-800'
              }`}>Sécurité</h3>
              <p className={`text-sm transition-colors duration-300 ${
                settings.darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>Protégez votre compte</p>
            </div>
          </div>
          <div className="space-y-3">
            <button 
              onClick={() => handleAction('logout')}
              className={`w-full text-left p-4 rounded-lg transition-colors duration-300 ${
                settings.darkMode 
                  ? 'bg-gray-800 hover:bg-gray-700' 
                  : 'bg-white hover:bg-gray-50'
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className={`font-medium transition-colors duration-300 ${
                    settings.darkMode ? 'text-white' : 'text-gray-800'
                  }`}>Déconnexion de tous les appareils</p>
                  <p className={`text-sm transition-colors duration-300 ${
                    settings.darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>Déconnectez-vous de tous les appareils connectés</p>
                </div>
                <ChevronRight className={`w-5 h-5 transition-colors duration-300 ${
                  settings.darkMode ? 'text-gray-400' : 'text-gray-400'
                }`} />
              </div>
            </button>
            <button 
              onClick={() => handleAction('delete')}
              className={`w-full text-left p-4 rounded-lg transition-colors duration-300 ${
                settings.darkMode 
                  ? 'bg-gray-800 hover:bg-gray-700' 
                  : 'bg-white hover:bg-gray-50'
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className={`font-medium transition-colors duration-300 ${
                    settings.darkMode ? 'text-white' : 'text-gray-800'
                  }`}>Supprimer le compte</p>
                  <p className="text-sm text-red-500">Cette action est irréversible</p>
                </div>
                <ChevronRight className={`w-5 h-5 transition-colors duration-300 ${
                  settings.darkMode ? 'text-gray-400' : 'text-gray-400'
                }`} />
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