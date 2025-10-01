// Configuration pour l'API Gemini
export const GEMINI_CONFIG = {
  apiKey: 'AIzaSyAGyYDydVRJ5tkAkEoIHLVp6HpES3Of4cw',
  modelName: 'gemini-2.5-flash',
  generationConfig: {
    temperature: 0.7,
    maxOutputTokens: 1500,
    topP: 0.8,
    topK: 40
  }
};

// URL de base pour l'API Gemini (pour compatibilité avec l'ancien code)
export const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
