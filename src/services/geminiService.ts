import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_CONFIG } from '../config/gemini';

export interface GeminiMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export interface GeminiResponse {
  candidates: {
    content: {
      parts: { text: string }[];
    };
  }[];
}

export class GeminiService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: any | null = null;
  private initialized = false;

  constructor() {}

  private initIfNeeded() {
    if (this.initialized) return;
    this.genAI = new GoogleGenerativeAI(GEMINI_CONFIG.apiKey);
    this.model = this.genAI.getGenerativeModel({
      model: GEMINI_CONFIG.modelName,
      generationConfig: GEMINI_CONFIG.generationConfig,
    });
    this.initialized = true;
  }

  async generateContent(prompt: string): Promise<string> {
    try {
      this.initIfNeeded();
      console.log('🤖 Génération de contenu avec Gemini 1.5 Flash...');
      
      // Ajouter un timeout pour éviter les attentes trop longues
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Timeout: La requête a pris trop de temps')), 30000); // 30 secondes
      });
      
      const generatePromise = this.model!.generateContent(prompt);
      const result = await Promise.race([generatePromise, timeoutPromise]);
      
      const response = await result.response;
      const text = response.text();
      
      console.log('✅ Réponse générée avec succès');
      return text;
    } catch (error) {
      console.error('❌ Erreur lors de la génération de contenu:', error);
      
      // Retourner une réponse de fallback en cas d'erreur
      if (error instanceof Error && error.message.includes('Timeout')) {
        return "Désolé, je rencontre des difficultés techniques. Veuillez réessayer dans quelques instants.";
      }
      
      return "Je suis désolé, je ne peux pas répondre à votre question pour le moment. Veuillez réessayer plus tard.";
    }
  }

  async chatWithAI(messages: GeminiMessage[]): Promise<string> {
    try {
      this.initIfNeeded();
      console.log('💬 Chat avec Gemini 1.5 Flash...');
      
      // Ajouter un timeout pour éviter les attentes trop longues
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Timeout: La requête de chat a pris trop de temps')), 30000); // 30 secondes
      });
      
      // Convertir les messages au format attendu par la nouvelle API
      const chat = this.model!.startChat({
        history: messages.slice(0, -1).map(msg => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: msg.parts
        }))
      });
      
      const lastMessage = messages[messages.length - 1];
      const chatPromise = chat.sendMessage(lastMessage.parts[0].text);
      const result = await Promise.race([chatPromise, timeoutPromise]);
      
      const response = await result.response;
      const text = response.text();
      
      console.log('✅ Réponse de chat générée avec succès');
      return text;
    } catch (error) {
      console.error('❌ Erreur lors du chat avec l\'IA:', error);
      
      // Retourner une réponse de fallback en cas d'erreur
      if (error instanceof Error && error.message.includes('Timeout')) {
        return "Désolé, je rencontre des difficultés techniques. Veuillez réessayer dans quelques instants.";
      }
      
      return "Je suis désolé, je ne peux pas répondre à votre question pour le moment. Veuillez réessayer plus tard.";
    }
  }

  async generateContentWithImage(prompt: string, imageData: string): Promise<string> {
    try {
      this.initIfNeeded();
      console.log('🖼️ Génération de contenu avec image...');
      
      // Ajouter un timeout pour éviter les attentes trop longues
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Timeout: La requête avec image a pris trop de temps')), 30000); // 30 secondes
      });
      
      const imagePromise = this.model!.generateContent([
        prompt,
        {
          inlineData: {
            data: imageData,
            mimeType: 'image/jpeg'
          }
        }
      ]);
      
      const result = await Promise.race([imagePromise, timeoutPromise]);
      const response = await result.response;
      const text = response.text();
      
      console.log('✅ Réponse avec image générée avec succès');
      return text;
    } catch (error) {
      console.error('❌ Erreur lors de la génération avec image:', error);
      
      // Retourner une réponse de fallback en cas d'erreur
      if (error instanceof Error && error.message.includes('Timeout')) {
        return "Désolé, je rencontre des difficultés techniques avec l'analyse de l'image. Veuillez réessayer dans quelques instants.";
      }
      
      return "Je suis désolé, je ne peux pas analyser cette image pour le moment. Veuillez réessayer plus tard.";
    }
  }
}

export const geminiService = new GeminiService();
