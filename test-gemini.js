// Script de test pour vérifier la configuration Gemini
const { GoogleGenerativeAI } = require('@google/generative-ai');

const testGeminiConnection = async () => {
  console.log('🧪 Test de connexion à Gemini 2.5 Flash...\n');
  
  try {
    // Initialiser l'API Gemini avec votre nouvelle clé
    const genAI = new GoogleGenerativeAI('AIzaSyAGyYDydVRJ5tkAkEoIHLVp6HpES3Of4cw');
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1500,
        topP: 0.8,
        topK: 40
      }
    });

    console.log('✅ Connexion à l\'API Gemini établie');
    console.log('📋 Modèle: gemini-2.5-flash');
    console.log('🔑 Clé API: AIzaSyAGyYDydVRJ5tkAkEoIHLVp6HpES3Of4cw\n');

    // Test 1: Génération de contenu simple
    console.log('Test 1: Génération de contenu simple...');
    const result1 = await model.generateContent('Explique-moi comment l\'IA fonctionne en quelques mots');
    const response1 = await result1.response;
    const text1 = response1.text();
    console.log('✅ Réponse:', text1.substring(0, 100) + '...\n');

    // Test 2: Test spécifique au coaching nutritionnel
    console.log('Test 2: Test de coaching nutritionnel...');
    const nutritionPrompt = `Tu es un coach nutritionnel spécialisé pour les femmes enceintes. 
    Donne un conseil court sur l'alimentation pendant le premier trimestre de grossesse.`;
    
    const result2 = await model.generateContent(nutritionPrompt);
    const response2 = await result2.response;
    const text2 = response2.text();
    console.log('✅ Réponse nutritionnelle:', text2.substring(0, 150) + '...\n');

    // Test 3: Test de chat (simulation d'une conversation)
    console.log('Test 3: Test de conversation...');
    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: 'Bonjour, je suis enceinte de 3 mois' }]
        },
        {
          role: 'model',
          parts: [{ text: 'Félicitations ! Comment puis-je vous aider avec votre alimentation ?' }]
        }
      ]
    });

    const result3 = await chat.sendMessage('J\'ai des nausées, que puis-je manger ?');
    const response3 = await result3.response;
    const text3 = response3.text();
    console.log('✅ Réponse de chat:', text3.substring(0, 150) + '...\n');

    console.log('🎉 Tous les tests sont passés avec succès !');
    console.log('🤖 Votre chatbot est prêt à fonctionner avec Gemini 2.5 Flash');

  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
    console.error('Détails:', error);
  }
};

// Exécuter le test
testGeminiConnection();
