import React, { useState, useRef, useEffect } from 'react';
import { ArrowBack, Send, LocalHospital, Phone, VideoCall, AttachFile, MoreVert } from '@mui/icons-material';
import { useNavigation } from '../contexts/NavigationContext';
import { useAuth } from '../hooks/useAuth';

interface Message {
  id: string;
  text: string;
  author: string;
  authorImage?: string;
  timestamp: Date;
  isUser: boolean;
  type?: 'text' | 'image' | 'file';
}

const DoctorChatPage: React.FC = () => {
  const { navigateTo } = useNavigation();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Bonjour ! Je suis le Dr. Jeff, votre médecin traitant. Comment puis-je vous aider aujourd\'hui ?',
      author: 'Dr. Jeff',
      authorImage: null,
      timestamp: new Date(),
      isUser: false
    },
    {
      id: '2',
      text: 'J\'ai des questions concernant mes derniers résultats d\'analyses',
      author: user?.username || 'Vous',
      authorImage: user?.profileImage || null,
      timestamp: new Date(),
      isUser: true
    },
    {
      id: '3',
      text: 'Bien sûr ! Je peux vous aider avec vos résultats. Pouvez-vous me dire quels examens vous avez effectués récemment ?',
      author: 'Dr. Jeff',
      authorImage: null,
      timestamp: new Date(),
      isUser: false
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: newMessage,
      author: user?.username || 'Vous',
      authorImage: user?.profileImage || null,
      timestamp: new Date(),
      isUser: true
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    // Simuler une réponse du médecin
    setTimeout(() => {
      const doctorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateDoctorResponse(newMessage),
        author: 'Dr. Jeff',
        authorImage: null,
        timestamp: new Date(),
        isUser: false
      };
      setMessages(prev => [...prev, doctorResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const generateDoctorResponse = (userMessage: string): string => {
    const responses = [
      "Je comprends votre préoccupation. Pouvez-vous me donner plus de détails ?",
      "C'est une question importante. Laissez-moi vous expliquer...",
      "Je recommande de prendre rendez-vous pour une consultation en personne.",
      "D'après vos symptômes, voici ce que je suggère...",
      "N'hésitez pas à me poser d'autres questions si nécessaire.",
      "Je vais examiner votre dossier et vous recontacter rapidement."
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

  const handleCall = () => {
    // Simuler un appel
    alert('Appel en cours...');
  };

  const handleVideoCall = () => {
    // Simuler un appel vidéo
    alert('Appel vidéo en cours...');
  };

  return (
    <div className="w-full h-full flex flex-col bg-white">
      {/* Header */}
      <div className="bg-green-600 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigateTo('community')}
            className="p-2 hover:bg-green-700 rounded-full transition-colors"
          >
            <ArrowBack className="w-5 h-5" />
          </button>
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
            <LocalHospital className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-semibold">Dr. Jeff</h1>
            <p className="text-xs text-green-100">En ligne</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={handleCall}
            className="p-2 hover:bg-green-700 rounded-full transition-colors"
          >
            <Phone className="w-5 h-5" />
          </button>
          <button 
            onClick={handleVideoCall}
            className="p-2 hover:bg-green-700 rounded-full transition-colors"
          >
            <VideoCall className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-green-700 rounded-full transition-colors">
            <MoreVert className="w-5 h-5" />
          </button>
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
              {/* Avatar */}
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 flex-shrink-0">
                {message.authorImage ? (
                  <img 
                    src={message.authorImage} 
                    alt={message.author}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-xs font-semibold text-gray-600">
                    {getInitials(message.author)}
                  </span>
                )}
              </div>
              
              {/* Message */}
              <div className="flex flex-col">
                {!message.isUser && (
                  <p className="text-xs text-gray-500 mb-1">{message.author}</p>
                )}
                <div
                  className={`px-4 py-2 rounded-2xl ${
                    message.isUser
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {message.timestamp.toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex space-x-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-xs font-semibold text-gray-600">DJ</span>
              </div>
              <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-2xl">
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
          <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
            <AttachFile className="w-5 h-5" />
          </button>
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
    </div>
  );
};

export default DoctorChatPage;