import React, { memo, useState, useEffect } from 'react';
import { CalendarToday, Phone, Search, LocalHospital, Favorite, SmartToy, TrendingUp, People, Message } from '@mui/icons-material';
import { useNavigation } from '../contexts/NavigationContext';

const CommunityPage: React.FC = memo(() => {
  const { navigateTo } = useNavigation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleChatClick = (chatType: string) => {
    navigateTo(`chat-${chatType}`);
  };

  const quickActions = [
    { icon: CalendarToday, label: 'Rendez-vous', color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-50' },
    { icon: Phone, label: 'Urgence', color: 'from-red-500 to-red-600', bgColor: 'bg-red-50' },
    { icon: Search, label: 'Rechercher', color: 'from-green-500 to-green-600', bgColor: 'bg-green-50' }
  ];

  const chatOptions = [
    {
      id: 'ai-coach',
      title: 'Coach IA Médical',
      description: 'Conseils médicaux personnalisés pour femmes enceintes 24/7',
      icon: SmartToy,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      notifications: 0
    },
    {
      id: 'doctor',
      title: 'Médecin Traitant',
      description: 'Consultations et suivi médical personnalisé',
      icon: LocalHospital,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      notifications: 2
    },
    {
      id: 'community',
      title: 'Communauté MIMAA',
      description: 'Échangez avec d\'autres membres de communauté',
      icon: Favorite,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      notifications: 0
    }
  ];

  const stats = [
    { icon: People, label: 'Membres actifs', value: '1,234', color: 'text-blue-600' },
    { icon: Message, label: 'Messages', value: '5,678', color: 'text-green-600' },
    { icon: TrendingUp, label: 'Engagement', value: '+24%', color: 'text-purple-600' }
  ];

  return (
    <div className="w-full min-h-full bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="px-4 py-4 space-y-6">
        {/* Bannière de bienvenue avec animation */}
        <div className={`bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white text-center shadow-xl ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        } transition-all duration-700`}>
          <h1 className="text-2xl font-bold mb-2">Bienvenue dans votre Communauté</h1>
          <p className="text-blue-100 text-sm">
            Connectez-vous avec votre médecin, votre coach IA et d'autres membres
          </p>
        </div>

        {/* Statistiques de la communauté */}
        <div className={`grid grid-cols-3 gap-4 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        } transition-all duration-700`} style={{ animationDelay: '200ms' }}>
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-white rounded-xl p-4 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <Icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-xs text-gray-600">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Actions rapides */}
        <div className={`${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        } transition-all duration-700`} style={{ animationDelay: '400ms' }}>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Actions rapides</h2>
          <div className="grid grid-cols-3 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  className={`${action.bgColor} hover:shadow-lg rounded-xl p-4 flex flex-col items-center space-y-2 transition-all duration-300 hover:-translate-y-1 hover:scale-105`}
                >
                  <div className={`p-3 rounded-full bg-gradient-to-r ${action.color}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{action.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Options de chat */}
        <div className={`${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        } transition-all duration-700`} style={{ animationDelay: '600ms' }}>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Options de chat</h2>
          <div className="space-y-4">
            {chatOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.id}
                  onClick={() => handleChatClick(option.id)}
                  className={`w-full ${option.bgColor} rounded-2xl p-4 flex items-center space-x-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative group`}
                >
                  <div className={`w-12 h-12 bg-gradient-to-r ${option.color} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-bold text-gray-900 text-base">{option.title}</h3>
                    <p className="text-sm text-gray-600">{option.description}</p>
                  </div>
                  {option.notifications > 0 && (
                    <div className="absolute top-3 right-3 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                      <span className="text-white text-xs font-bold">{option.notifications}</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Floating Action Button pour l'IA */}
      <button 
        onClick={() => handleChatClick('ai-coach')}
        className="fixed bottom-20 right-4 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 z-40 animate-bounce"
      >
        <SmartToy className="w-7 h-7 text-white" />
      </button>
    </div>
  );
});

CommunityPage.displayName = 'CommunityPage';

export default CommunityPage;

