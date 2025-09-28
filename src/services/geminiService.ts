import { GEMINI_CONFIG, GEMINI_API_URL } from '../config/gemini';

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
  private apiKey: string;
  private modelName: string;

  constructor() {
    this.apiKey = GEMINI_CONFIG.apiKey;
    this.modelName = GEMINI_CONFIG.modelName;
  }

  async generateContent(prompt: string): Promise<string> {
    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: GEMINI_CONFIG.generationConfig
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Erreur API Gemini:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });
        throw new Error(`Erreur API Gemini: ${response.status} - ${response.statusText}`);
      }

      const data: GeminiResponse = await response.json();
      
      if (data.candidates && data.candidates.length > 0) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error('Aucune réponse générée par Gemini');
      }
    } catch (error) {
      console.error('Erreur lors de la génération de contenu:', error);
      throw error;
    }
  }

  async chatWithAI(messages: GeminiMessage[]): Promise<string> {
    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: messages,
          generationConfig: GEMINI_CONFIG.generationConfig
        })
      });

      if (!response.ok) {
        throw new Error(`Erreur API Gemini: ${response.status}`);
      }

      const data: GeminiResponse = await response.json();
      
      if (data.candidates && data.candidates.length > 0) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error('Aucune réponse générée par Gemini');
      }
    } catch (error) {
      console.error('Erreur lors du chat avec l\'IA:', error);
      throw error;
    }
  }
}

export const geminiService = new GeminiService();
