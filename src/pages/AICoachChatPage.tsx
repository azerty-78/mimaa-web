import React, { useState, useRef, useEffect } from 'react';
import { ArrowBack, Send, SmartToy, MoreVert } from '@mui/icons-material';
import { useNavigation } from '../contexts/NavigationContext';
import { geminiService } from '../services/geminiService';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const AICoachChatPage: React.FC = () => {
  const { navigateTo } = useNavigation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    "Comment créer un plan alimentaire équilibré?",
    "Quels sont les aliments riches en protéines?",
    "Comment gérer les fringales?",
    "Conseils pour une alimentation végétarienne",
    "Comment calculer mes besoins caloriques?"
  ];

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
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    try {
      // Utiliser l'API Gemini pour générer une réponse
      const aiResponse = await geminiService.generateContent(
        `Tu es un coach IA médical spécialisé pour les femmes enceintes. Réponds de manière professionnelle et bienveillante à cette question: "${newMessage}". 
        Donne des conseils médicaux adaptés à la grossesse, en restant dans le domaine de la nutrition et du bien-être. 
        Si la question n'est pas médicale, redirige poliment vers des sujets liés à la grossesse et la nutrition.`
      );

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Erreur lors de la génération de la réponse:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Désolé, je rencontre un problème technique. Veuillez réessayer dans quelques instants.',
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestedQuestion = async (question: string) => {
    setNewMessage(question);
    // Simuler l'envoi automatique de la question suggérée
    setTimeout(() => {
      handleSendMessage();
    }, 100);
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
      <div className="bg-blue-600 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigateTo('community')}
            className="p-2 hover:bg-blue-700 rounded-full transition-colors"
          >
            <ArrowBack className="w-5 h-5" />
          </button>
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center relative">
            <SmartToy className="w-6 h-6 text-white" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-xs font-bold">+</span>
            </div>
          </div>
          <div>
            <h1 className="font-semibold text-lg">Coach AI Médical</h1>
            <p className="text-xs text-blue-100">En ligne</p>
          </div>
        </div>
        <button className="p-2 hover:bg-blue-700 rounded-full transition-colors">
          <MoreVert className="w-5 h-5" />
        </button>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          /* Écran de bienvenue */
          <div className="flex flex-col items-center justify-center h-full px-6 py-8 text-center">
            {/* Icône principale */}
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mb-6 relative">
              <SmartToy className="w-10 h-10 text-white" />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm font-bold">+</span>
              </div>
            </div>

            {/* Message de bienvenue */}
            <h2 className="text-2xl font-bold text-gray-800 mb-4" style={{ fontFamily: 'cursive' }}>
              Bienvenue chez votre Coach AI !
            </h2>
            <p className="text-gray-600 mb-8 text-sm" style={{ fontFamily: 'cursive' }}>
              Je suis là pour vous aider avec vos questions sur la nutrition, l'alimentation saine et le bien-être.
            </p>

            {/* Questions suggérées */}
            <div className="w-full max-w-md space-y-3">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedQuestion(question)}
                  className="w-full bg-gray-100 hover:bg-gray-200 rounded-xl p-4 text-left transition-colors"
                  style={{ fontFamily: 'cursive' }}
                >
                  <span className="text-sm text-gray-700">{question}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Messages de chat */
          <div className="p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                    message.isUser
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
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
        )}
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
            className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || isTyping}
            className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AICoachChatPage;
