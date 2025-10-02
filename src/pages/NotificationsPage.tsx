import React, { memo, useState, useEffect } from 'react';
import { ArrowBack, Notifications, CheckCircle, Warning, Info, Error } from '@mui/icons-material';
import { useNavigation } from '../contexts/NavigationContext';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'info' | 'error';
  timestamp: Date;
  read: boolean;
  action?: string;
}

const NotificationsPage: React.FC = memo(() => {
  const { navigateTo } = useNavigation();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Rendez-vous confirmé',
      message: 'Votre consultation du 15 janvier à 14h30 a été confirmée',
      type: 'success',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 heures ago
      read: false,
      action: 'Voir détails'
    },
    {
      id: '2',
      title: 'Rappel de médicament',
      message: 'N\'oubliez pas de prendre vos vitamines prénatales',
      type: 'info',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 heures ago
      read: false,
      action: 'Marquer comme lu'
    },
    {
      id: '3',
      title: 'Résultats d\'analyses',
      message: 'Vos résultats de laboratoire sont disponibles',
      type: 'info',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 jour ago
      read: true,
      action: 'Consulter'
    },
    {
      id: '4',
      title: 'Message du Dr. Diallo',
      message: 'J\'ai examiné vos résultats, tout va bien !',
      type: 'success',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 jours ago
      read: true,
      action: 'Répondre'
    },
    {
      id: '5',
      title: 'Rappel d\'échographie',
      message: 'Votre échographie morphologique est prévue demain',
      type: 'warning',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 jours ago
      read: true,
      action: 'Confirmer'
    }
  ]);

  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <Warning className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <Error className="w-5 h-5 text-red-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-l-green-500 bg-green-50';
      case 'warning':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'error':
        return 'border-l-red-500 bg-red-50';
      default:
        return 'border-l-blue-500 bg-blue-50';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.read;
    if (filter === 'read') return notif.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `Il y a ${minutes} min`;
    } else if (hours < 24) {
      return `Il y a ${hours}h`;
    } else {
      return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
    }
  };

  return (
    <div className="w-full h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigateTo('community')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowBack className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center space-x-2">
              <Notifications className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={markAllAsRead}
            className="text-blue-600 text-sm font-medium hover:text-blue-800 transition-colors"
          >
            Tout marquer comme lu
          </button>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex space-x-4">
          {[
            { key: 'all', label: 'Toutes', count: notifications.length },
            { key: 'unread', label: 'Non lues', count: unreadCount },
            { key: 'read', label: 'Lues', count: notifications.length - unreadCount }
          ].map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setFilter(key as any)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {label} ({count})
            </button>
          ))}
        </div>
      </div>

      {/* Liste des notifications */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <Notifications className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Aucune notification</p>
            <p className="text-gray-400 text-sm">Vous êtes à jour !</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white rounded-xl p-4 border-l-4 ${getTypeColor(notification.type)} ${
                !notification.read ? 'shadow-md' : 'shadow-sm'
              } transition-all duration-200 hover:shadow-lg`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className={`text-sm font-semibold ${
                      !notification.read ? 'text-gray-900' : 'text-gray-700'
                    }`}>
                      {notification.title}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">
                        {formatTime(notification.timestamp)}
                      </span>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {notification.message}
                  </p>
                  {notification.action && (
                    <div className="flex items-center space-x-3 mt-3">
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="text-blue-600 text-sm font-medium hover:text-blue-800 transition-colors"
                      >
                        {notification.action}
                      </button>
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="text-gray-400 text-sm hover:text-gray-600 transition-colors"
                      >
                        Supprimer
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
});

NotificationsPage.displayName = 'NotificationsPage';

export default NotificationsPage;
