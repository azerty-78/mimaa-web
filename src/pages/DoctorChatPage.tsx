import React, { useState, useRef, useEffect } from 'react';
import { ArrowBack, Send, LocalHospital, Person } from '@mui/icons-material';
import { useNavigation } from '../contexts/NavigationContext';
import { useAuth } from '../hooks/useAuth';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isRead?: boolean;
}

const DoctorChatPage: React.FC = () => {
  const { navigateTo } = useNavigation();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Bonjour ! Je suis le Dr. Djeff Djadi Leteta, votre médecin traitant. Comment puis-je vous aider ?',
      isUser: false,
      timestamp: new Date(),
      isRead: true
    },
    {
      id: '2',
      text: 'N\'oubliez pas votre rendez-vous de suivi prévu pour demain à 14h.',
      isUser: false,
      timestamp: new Date(),
      isRead: false
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
      isUser: true,
      timestamp: new Date(),
      isRead: true
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    // Simuler une réponse du médecin
    setTimeout(() => {
      const doctorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateDoctorResponse(newMessage),
        isUser: false,
        timestamp: new Date(),
        isRead: true
      };
      setMessages(prev => [...prev, doctorResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const generateDoctorResponse = (userMessage: string): string => {
    const responses = [
      "Je comprends votre préoccupation. Pouvez-vous me donner plus de détails sur vos symptômes ?",
      "C'est normal pendant la grossesse. Je vous recommande de...",
      "Si les symptômes persistent, n'hésitez pas à venir en consultation.",
      "Je vais noter cela dans votre dossier médical. Avez-vous d'autres questions ?",
      "C'est une excellente question. Voici ce que je peux vous dire..."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-white">
      {/* Header */}
      <div className="bg-green-600 text-white px-4 py-3 flex items-center space-x-3">
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
          <h1 className="font-semibold">Dr. Djeff Djadi Leteta</h1>
          <p className="text-xs text-green-100">Médecin Traitant</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                message.isUser
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs opacity-70">
                  {message.timestamp.toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
                {!message.isUser && !message.isRead && (
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-2xl">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
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
    </div>
  );
};

export default DoctorChatPage;
