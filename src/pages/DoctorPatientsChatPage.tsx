import React, { useState, useRef, useEffect } from 'react';
import { ArrowBack, Send, People, Phone, VideoCall, MoreVert, Search } from '@mui/icons-material';
import { useNavigation } from '../contexts/NavigationContext';
import { useAuth } from '../hooks/useAuth';
import { userApi, doctorPatientApi, pregnancyApi } from '../services/api';

interface Patient {
  id: string;
  name: string;
  pregnancyWeek: number;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  status: 'online' | 'offline';
  avatar?: string;
  email?: string;
  phone?: string;
}

interface Message {
  id: string;
  text: string;
  author: string;
  authorImage?: string;
  timestamp: Date;
  isUser: boolean;
  patientId: string;
}

const DoctorPatientsChatPage: React.FC = () => {
  const { navigateTo } = useNavigation();
  const { user } = useAuth();
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Messages simulés
  const [messages, setMessages] = useState<Message[]>([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Charger les patients depuis l'API
  useEffect(() => {
    const loadPatients = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        
        // Récupérer les relations médecin-patient
        const doctorPatients = await doctorPatientApi.getByDoctorId(Number(user.id));
        
        // Récupérer les détails des patients
        const patientDetails = await Promise.all(
          doctorPatients.map(async (dp) => {
            try {
              const patient = await userApi.getById(Number(dp.patientId));
              const pregnancyRecord = await pregnancyApi.getByUserId(Number(dp.patientId));
              
              return {
                id: patient.id.toString(),
                name: `${patient.firstName} ${patient.lastName}`,
                pregnancyWeek: pregnancyRecord?.currentWeek || 0,
                lastMessage: 'Aucun message récent',
                lastMessageTime: new Date(),
                unreadCount: 0,
                status: 'offline' as const,
                email: patient.email,
                phone: patient.phone
              } as Patient;
            } catch (error) {
              console.error('Erreur lors du chargement du patient:', error);
              return null;
            }
          })
        );
        
        // Filtrer les patients valides
        const validPatients = patientDetails.filter((patient): patient is Patient => patient !== null);
        setPatients(validPatients);
        
      } catch (error) {
        console.error('Erreur lors du chargement des patients:', error);
        setPatients([]);
      } finally {
        setLoading(false);
      }
    };

    loadPatients();
  }, [user?.id]);

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
    // Simuler des messages existants
    setMessages([
      {
        id: '1',
        text: `Bonjour ${patient.name}, comment vous sentez-vous aujourd'hui ?`,
        author: 'Dr. Jeff',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isUser: true,
        patientId: patient.id
      },
      {
        id: '2',
        text: patient.lastMessage,
        author: patient.name,
        timestamp: patient.lastMessageTime,
        isUser: false,
        patientId: patient.id
      }
    ]);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedPatient) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: newMessage,
      author: 'Dr. Jeff',
      timestamp: new Date(),
      isUser: true,
      patientId: selectedPatient.id
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    // Simuler une réponse de la patiente
    setTimeout(() => {
      const patientResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generatePatientResponse(),
        author: selectedPatient.name,
        timestamp: new Date(),
        isUser: false,
        patientId: selectedPatient.id
      };
      setMessages(prev => [...prev, patientResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const generatePatientResponse = (): string => {
    const responses = [
      "Merci docteur, je vais suivre vos conseils",
      "D'accord, je comprends. Quand dois-je revenir ?",
      "C'est rassurant de vous entendre, merci",
      "Je vais prendre note de vos recommandations",
      "Parfait, je me sens mieux maintenant"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="w-full h-full flex bg-white">
      {/* Liste des patients */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="bg-green-600 text-white px-4 py-3">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigateTo('community')}
              className="p-2 hover:bg-green-700 rounded-full transition-colors"
            >
              <ArrowBack className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-semibold">Mes Patients</h1>
              <p className="text-xs text-green-100">{patients.length} patientes</p>
            </div>
          </div>
        </div>

        {/* Recherche */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher une patiente..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Liste des patients */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
                <p className="text-sm text-gray-500">Chargement des patients...</p>
              </div>
            </div>
          ) : filteredPatients.length === 0 ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <People className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">
                  {searchQuery ? 'Aucun patient trouvé' : 'Aucun patient assigné'}
                </p>
              </div>
            </div>
          ) : (
            filteredPatients.map((patient) => (
            <button
              key={patient.id}
              onClick={() => handlePatientSelect(patient)}
              className={`w-full p-4 text-left border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                selectedPatient?.id === patient.id ? 'bg-green-50 border-l-4 border-l-green-500' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-sm font-semibold text-gray-600">
                      {getInitials(patient.name)}
                    </span>
                  </div>
                  {patient.status === 'online' && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 truncate">{patient.name}</h3>
                    <span className="text-xs text-gray-500">{formatTime(patient.lastMessageTime)}</span>
                  </div>
                  <p className="text-sm text-gray-600 truncate mt-1">{patient.lastMessage}</p>
                  <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">
                        {patient.pregnancyWeek > 0 ? `Semaine ${patient.pregnancyWeek}` : 'Pas de grossesse enregistrée'}
                      </span>
                      {patient.email && (
                        <span className="text-xs text-blue-500 truncate max-w-20" title={patient.email}>
                          {patient.email}
                        </span>
                      )}
                    </div>
                    {patient.unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {patient.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
            ))
          )}
        </div>
      </div>

      {/* Zone de chat */}
      <div className="flex-1 flex flex-col">
        {selectedPatient ? (
          <>
            {/* Header du chat */}
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-xs font-semibold text-gray-600">
                      {getInitials(selectedPatient.name)}
                    </span>
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">{selectedPatient.name}</h2>
                    <p className="text-xs text-gray-500">
                      {selectedPatient.pregnancyWeek > 0 ? `Semaine ${selectedPatient.pregnancyWeek}` : 'Pas de grossesse enregistrée'} • 
                      {selectedPatient.status === 'online' ? 'En ligne' : 'Hors ligne'}
                      {selectedPatient.email && ` • ${selectedPatient.email}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
                    <Phone className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
                    <VideoCall className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
                    <MoreVert className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex space-x-2 max-w-xs lg:max-w-md ${message.isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className="w-6 h-6 rounded-full flex items-center justify-center bg-gray-200 flex-shrink-0">
                      <span className="text-xs font-semibold text-gray-600">
                        {getInitials(message.author)}
                      </span>
                    </div>
                    
                    <div className="flex flex-col">
                      {!message.isUser && (
                        <p className="text-xs text-gray-500 mb-1">{message.author}</p>
                      )}
                      <div
                        className={`px-3 py-2 rounded-2xl ${
                          message.isUser
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex space-x-2">
                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-xs font-semibold text-gray-600">
                        {getInitials(selectedPatient.name)}
                      </span>
                    </div>
                    <div className="bg-gray-100 text-gray-800 px-3 py-2 rounded-2xl">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Tapez votre message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <People className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Sélectionnez une patiente</h3>
              <p className="text-gray-500">Choisissez une patiente dans la liste pour commencer la conversation</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorPatientsChatPage;
