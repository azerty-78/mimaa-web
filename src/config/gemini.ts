// Configuration pour l'API Gemini
export const GEMINI_CONFIG = {
  apiKey: 'aizasybysyc7t7a6syunih-upwuw_44s79lfe4k',
  modelName: 'gemini-1.5-flash',
  generationConfig: {
    temperature: 0.7,
    maxOutputTokens: 1500,
    topP: 0.8,
    topK: 40
  }
};

// URL de base pour l'API Gemini
export const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
