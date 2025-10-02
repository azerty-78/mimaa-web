import React, { memo, useState, useEffect } from 'react';
import { CalendarToday, Phone, Search, LocalHospital, Favorite, SmartToy, TrendingUp, People, Message } from '@mui/icons-material';

import { useNavigation } from '../contexts/NavigationContext';
import { useAuth } from '../hooks/useAuth';

const CommunityPage: React.FC = memo(() => {
  const { navigateTo } = useNavigation();
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleChatClick = (chatType: string) => {
    if (chatType === 'ai-coach') {
      navigateTo('ai-coach-chat');
    } else if (chatType === 'doctor') {
      navigateTo('doctor-chat');
    } else if (chatType === 'community') {
      navigateTo('community-chat');
    }
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'Rendez-vous':
        navigateTo('appointments');
        break;
      case 'Urgence':
        // Simuler un appel d'urgence
        alert('Appel d\'urgence en cours...');
        break;
      case 'Rechercher':
        // Focus sur la barre de recherche
        document.getElementById('search-input')?.focus();
        break;
      default:
        break;
    }
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
      notifications: 0,
      status: 'En ligne',
      lastMessage: 'Comment puis-je vous aider aujourd\'hui ?'
    },
    {
      id: 'doctor',
      title: 'Dr. Marie Diallo',
      description: 'Votre médecin traitant - Gynécologue',
      icon: LocalHospital,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      notifications: 2,
      status: 'En ligne',
      lastMessage: 'Vos résultats d\'analyses sont prêts'
    },
    {
      id: 'community',
      title: 'Communauté MIMAA',
      description: 'Échangez avec d\'autres membres de communauté',
      icon: Favorite,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      notifications: 0,
      status: '5678 membres actifs',
      lastMessage: 'Sarah M. a partagé un conseil'
    }
  ];

  const recentMessages = [
    {
      id: 1,
      sender: 'Dr. Marie Diallo',
      message: 'Vos résultats d\'analyses sont prêts',
      time: '14:30',
      unread: true
    },
    {
      id: 2,
      sender: 'Sarah M.',
      message: 'Conseil pour les nausées matinales',
      time: '13:45',
      unread: false
    },
    {
      id: 3,
      sender: 'Coach IA',
      message: 'Rappel: Prenez vos vitamines',
      time: '12:20',
      unread: false
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
        {/* Barre de recherche */}
        <div className={`${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        } transition-all duration-700`}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              id="search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher dans la communauté..."
              className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            />
          </div>
        </div>

        {/* Bannière de bienvenue avec animation */}
        <div className={`bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white text-center shadow-xl ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        } transition-all duration-700`} style={{ animationDelay: '100ms' }}>
          <h2 className="text-xl font-bold mb-2">Votre espace de communication</h2>
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

        {/* Messages récents */}
        <div className={`${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        } transition-all duration-700`} style={{ animationDelay: '200ms' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Messages récents</h2>
            <button className="text-blue-600 text-sm font-medium hover:text-blue-800 transition-colors">
              Voir tout
            </button>
          </div>
          <div className="space-y-2">
            {recentMessages.map((msg) => (
              <div
                key={msg.id}
                className={`bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer ${
                  msg.unread ? 'border-l-4 border-blue-500' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900">{msg.sender}</h3>
                      {msg.unread && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{msg.message}</p>
                  </div>
                  <span className="text-xs text-gray-500">{msg.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions rapides */}
        <div className={`${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        } transition-all duration-700`} style={{ animationDelay: '300ms' }}>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Actions rapides</h2>
          <div className="grid grid-cols-3 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  onClick={() => handleQuickAction(action.label)}
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
        } transition-all duration-700`} style={{ animationDelay: '400ms' }}>
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
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-gray-900 text-base">{option.title}</h3>
                      <span className="text-xs text-gray-500">{option.status}</span>
                    </div>
                    <p className="text-sm text-gray-600">{option.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{option.lastMessage}</p>
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

