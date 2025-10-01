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
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    this.genAI = new GoogleGenerativeAI(GEMINI_CONFIG.apiKey);
    this.model = this.genAI.getGenerativeModel({ 
      model: GEMINI_CONFIG.modelName,
      generationConfig: GEMINI_CONFIG.generationConfig
    });
  }

  async generateContent(prompt: string): Promise<string> {
    try {
      console.log('🤖 Génération de contenu avec Gemini 2.5 Flash...');
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      console.log('✅ Réponse générée avec succès');
      return text;
    } catch (error) {
      console.error('❌ Erreur lors de la génération de contenu:', error);
      throw error;
    }
  }

  async chatWithAI(messages: GeminiMessage[]): Promise<string> {
    try {
      console.log('💬 Chat avec Gemini 2.5 Flash...');
      
      // Convertir les messages au format attendu par la nouvelle API
      const chat = this.model.startChat({
        history: messages.slice(0, -1).map(msg => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: msg.parts
        }))
      });
      
      const lastMessage = messages[messages.length - 1];
      const result = await chat.sendMessage(lastMessage.parts[0].text);
      const response = await result.response;
      const text = response.text();
      
      console.log('✅ Réponse de chat générée avec succès');
      return text;
    } catch (error) {
      console.error('❌ Erreur lors du chat avec l\'IA:', error);
      throw error;
    }
  }

  async generateContentWithImage(prompt: string, imageData: string): Promise<string> {
    try {
      console.log('🖼️ Génération de contenu avec image...');
      
      const result = await this.model.generateContent([
        prompt,
        {
          inlineData: {
            data: imageData,
            mimeType: 'image/jpeg'
          }
        }
      ]);
      
      const response = await result.response;
      const text = response.text();
      
      console.log('✅ Réponse avec image générée avec succès');
      return text;
    } catch (error) {
      console.error('❌ Erreur lors de la génération avec image:', error);
      throw error;
    }
  }
}

export const geminiService = new GeminiService();
