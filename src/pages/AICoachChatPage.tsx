import React, { useState, useRef, useEffect } from 'react';
import { ArrowBack, Send, SmartToy, MoreVert, Refresh, Delete, AttachFile, EmojiEmotions, Close } from '@mui/icons-material';
import { useNavigation } from '../contexts/NavigationContext';
import { geminiService } from '../services/geminiService';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  imageUrl?: string;
  type?: 'text' | 'image' | 'mixed';
}

const AICoachChatPage: React.FC = () => {
  const { navigateTo } = useNavigation();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      text: 'Bonjour ! Je suis votre coach nutritionnel. Posez-moi vos questions sur l\'alimentation pendant la grossesse. Je répondrai de manière courte et précise.',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const suggestedQuestions = [
    "Aliments à éviter?",
    "Gérer les nausées?",
    "Suppléments essentiels?",
    "Alimentation 1er trimestre?",
    "Besoins en fer?",
    "Prévenir diabète gestationnel?",
    "Aliments pour le cerveau bébé?",
    "Gérer les envies?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialisation du chat
  useEffect(() => {
    const initializeChat = async () => {
      try {
        console.log('🚀 Initialisation du chat IA...');
        // Simuler un délai d'initialisation pour éviter les redirections
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsInitializing(false);
        console.log('✅ Chat IA initialisé');
      } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation:', error);
        setIsInitializing(false);
      }
    };

    initializeChat();
  }, []);

  // Fermer le menu quand on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showMenu && !(event.target as Element).closest('.menu-container')) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  // Fonctions pour le menu
  const handleMenuToggle = () => {
    setShowMenu(!showMenu);
  };

  const handleResetChat = () => {
    setMessages([]);
    setShowMenu(false);
  };

  const handleExportChat = () => {
    const chatData = {
      messages: messages.map(msg => ({
        text: msg.text,
        isUser: msg.isUser,
        timestamp: msg.timestamp.toISOString(),
        type: msg.type || 'text'
      })),
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowMenu(false);
  };

  // Fonctions pour les images
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setSelectedImage(imageUrl);
        setShowImagePreview(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove = () => {
    setSelectedImage(null);
    setShowImagePreview(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };


  // Fonction pour générer un prompt adapté au type de question
  const generatePrompt = (question: string, isImage: boolean = false) => {
    const basePrompt = `Coach nutritionnel pour femmes enceintes. Réponse COURTE et PRÉCISE.

Question: "${question}"

RÈGLES:
- Maximum 2 phrases
- Réponse directe
- Focus essentiel
- Nutrition/grossesse uniquement`;

    if (isImage) {
      return `${basePrompt}

Analyse l'image et donne un conseil nutritionnel court.`;
    }

    // Adapter le prompt selon le type de question
    if (question.toLowerCase().includes('éviter') || question.toLowerCase().includes('interdit')) {
      return `${basePrompt}

Liste les aliments à éviter pendant la grossesse.`;
    } else if (question.toLowerCase().includes('nausée')) {
      return `${basePrompt}

Conseils pratiques pour gérer les nausées.`;
    } else if (question.toLowerCase().includes('supplément')) {
      return `${basePrompt}

Suppléments essentiels pendant la grossesse.`;
    } else if (question.toLowerCase().includes('fer')) {
      return `${basePrompt}

Besoins en fer et sources alimentaires.`;
    } else if (question.toLowerCase().includes('diabète')) {
      return `${basePrompt}

Prévention du diabète gestationnel.`;
    } else {
      return `${basePrompt}

Conseil nutritionnel court et pratique.`;
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() && !selectedImage) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: newMessage,
      isUser: true,
      timestamp: new Date(),
      imageUrl: selectedImage || undefined,
      type: selectedImage ? (newMessage.trim() ? 'mixed' : 'image') : 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setSelectedImage(null);
    setShowImagePreview(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setIsTyping(true);

    try {
      // Utiliser l'API Gemini pour générer une réponse
      let aiResponse: string;
      
      console.log('🚀 Début de la génération de réponse IA...');
      
      if (selectedImage) {
        // Si une image est fournie, utiliser la méthode avec image
        console.log('📸 Génération avec image...');
        const base64Image = selectedImage.split(',')[1]; // Enlever le préfixe data:image/jpeg;base64,
        aiResponse = await geminiService.generateContentWithImage(
          generatePrompt(newMessage, true),
          base64Image
        );
      } else {
        // Utiliser la méthode standard sans image
        console.log('💬 Génération de texte simple...');
        aiResponse = await geminiService.generateContent(
          generatePrompt(newMessage, false)
        );
      }
      
      console.log('✅ Réponse IA générée avec succès');

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('❌ Erreur lors de la génération de la réponse:', error);
      
      let errorText = 'Désolé, je rencontre des difficultés techniques. Veuillez réessayer.';
      
      // Gestion d'erreurs spécifiques
      if (error instanceof Error) {
        if (error.message.includes('Timeout')) {
          errorText = 'La requête a pris trop de temps. Veuillez réessayer avec une question plus simple.';
        } else if (error.message.includes('API')) {
          errorText = 'Problème de connexion avec l\'IA. Vérifiez votre connexion internet.';
        } else if (error.message.includes('quota') || error.message.includes('limit')) {
          errorText = 'Limite d\'utilisation atteinte. Veuillez réessayer plus tard.';
        }
      }
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: errorText,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
      console.log('🏁 Fin du processus de génération');
    }
  };

  const handleSuggestedQuestion = async (question: string) => {
    setNewMessage(question);
    // Simuler l'envoi automatique de la question suggérée
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };


  // Écran de chargement pendant l'initialisation
  if (isInitializing) {
    return (
      <div className="h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <SmartToy className="w-8 h-8 text-white animate-pulse" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Initialisation du Coach IA</h2>
          <p className="text-gray-600 mb-4">Préparation de votre assistant nutritionnel...</p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto"></div>
        </div>
      </div>
    );
  }

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
            <h1 className="font-semibold text-lg">Coach IA Grossesse</h1>
            <p className="text-xs text-blue-100">Votre conseiller complet</p>
          </div>
        </div>
        <div className="relative menu-container">
          <button 
            onClick={handleMenuToggle}
            className="p-2 hover:bg-blue-700 rounded-full transition-colors"
          >
            <MoreVert className="w-5 h-5" />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 top-12 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-48 z-50">
              <button
                onClick={handleResetChat}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center space-x-2 text-gray-700"
              >
                <Refresh className="w-4 h-4" />
                <span>Nouveau chat</span>
              </button>
              <button
                onClick={handleExportChat}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center space-x-2 text-gray-700"
              >
                <Delete className="w-4 h-4" />
                <span>Exporter le chat</span>
              </button>
              <div className="border-t border-gray-200 my-1"></div>
              <button
                onClick={() => setShowMenu(false)}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center space-x-2 text-gray-700"
              >
                <Close className="w-4 h-4" />
                <span>Fermer</span>
              </button>
            </div>
          )}
        </div>
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
              Je suis votre coach nutritionnel spécialisé pour accompagner les femmes enceintes. 
              Je peux vous conseiller sur l'alimentation, les suppléments, la gestion des symptômes et le bien-être pendant votre grossesse.
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
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} mb-4`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                    message.isUser
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                      : 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800 border border-gray-200'
                  }`}
                >
                  {/* Image dans le message */}
                  {message.imageUrl && (
                    <div className="mb-2">
                      <img
                        src={message.imageUrl}
                        alt="Image partagée"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  
                  {/* Texte du message */}
                  {message.text && (
                    <p className="text-sm leading-relaxed">{message.text}</p>
                  )}
                  
                  {/* Timestamp */}
                  <p className={`text-xs mt-2 ${
                    message.isUser ? 'text-blue-100' : 'text-gray-500'
                  }`}>
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
      <div className="border-t border-gray-200 p-4 bg-white">
        {/* Aperçu de l'image sélectionnée */}
        {showImagePreview && selectedImage && (
          <div className="mb-3 relative">
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 font-medium">Image sélectionnée</span>
                <button
                  onClick={handleImageRemove}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Close className="w-4 h-4" />
                </button>
              </div>
              <img
                src={selectedImage}
                alt="Aperçu"
                className="w-full h-32 object-cover rounded-lg"
              />
            </div>
          </div>
        )}

        <div className="flex items-end space-x-2">
          {/* Bouton d'ajout d'image */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
            title="Ajouter une image"
          >
            <AttachFile className="w-5 h-5" />
          </button>
          
          {/* Input caché pour les fichiers */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />

          {/* Zone de texte */}
          <div className="flex-1 relative">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Tapez votre message..."
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none min-h-[48px] max-h-32"
              rows={1}
              style={{
                minHeight: '48px',
                maxHeight: '128px'
              }}
            />
            
            {/* Bouton emoji (placeholder pour future fonctionnalité) */}
            <button
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Emojis (bientôt disponible)"
            >
              <EmojiEmotions className="w-5 h-5" />
            </button>
          </div>

          {/* Bouton d'envoi */}
          <button
            onClick={handleSendMessage}
            disabled={(!newMessage.trim() && !selectedImage) || isTyping}
            className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
          >
            {isTyping ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Indicateur de statut */}
        {isTyping && (
          <div className="mt-2 flex items-center space-x-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span>Le coach IA réfléchit...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AICoachChatPage;
