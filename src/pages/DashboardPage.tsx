import React, { memo, useState, useEffect } from 'react';
import { TrendingUp, People, Message, Campaign, LocalHospital, MedicalServices } from '@mui/icons-material';

const DashboardPage: React.FC = memo(() => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const stats = [
    {
      title: 'Consultations',
      value: '1,234',
      change: '+12%',
      icon: MedicalServices,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Utilisateurs',
      value: '8,456',
      change: '+8%',
      icon: People,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Messages',
      value: '2,345',
      change: '+15%',
      icon: Message,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Campagnes',
      value: '12',
      change: '+3',
      icon: Campaign,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    }
  ];

  const activities = [
    { name: 'Campagnes actives', value: '12', icon: Campaign },
    { name: 'Utilisateurs inscrits', value: '8,456', icon: People },
    { name: 'Messages envoyés', value: '2,345', icon: Message },
    { name: 'Centres de santé', value: '45', icon: LocalHospital }
  ];

  return (
    <div className={`w-full p-3 sm:p-4 min-h-full transition-all duration-700 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
    }`}>
      {/* Header avec animation */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Tableau de bord</h1>
        <p className="text-gray-600">Bienvenue dans votre espace de suivi médical</p>
      </div>
      
      {/* Statistiques avec animations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className={`bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
                <span className={`text-sm font-medium ${stat.textColor}`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">{stat.title}</h3>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Graphique de tendance */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 mb-8 text-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Tendances</h3>
          <TrendingUp className="w-6 h-6" />
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <p className="text-blue-100 mb-2">Croissance mensuelle</p>
            <p className="text-3xl font-bold">+24%</p>
          </div>
          <div className="w-20 h-12 bg-white/20 rounded-lg flex items-end space-x-1 p-2">
            {[40, 60, 45, 70, 55, 80, 65].map((height, index) => (
              <div
                key={index}
                className="bg-white rounded-sm flex-1 animate-pulse"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Activités récentes */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Résumé des activités</h3>
        <div className="space-y-4">
          {activities.map((activity, index) => {
            const Icon = activity.icon;
            return (
              <div
                key={activity.name}
                className={`flex justify-between items-center p-4 rounded-lg hover:bg-gray-50 transition-all duration-200 ${
                  isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                }`}
                style={{ animationDelay: `${(index + 4) * 100}ms` }}
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Icon className="w-5 h-5 text-gray-600" />
                  </div>
                  <span className="text-gray-700 font-medium">{activity.name}</span>
                </div>
                <span className="text-xl font-bold text-gray-800">{activity.value}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});

export default DashboardPage;