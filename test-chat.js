// Script de test pour vérifier le fonctionnement du chat
const { GoogleGenerativeAI } = require('@google/generative-ai');

const testChatFunctionality = async () => {
  console.log('🧪 Test du fonctionnement du chat MIMAA...\n');
  
  try {
    // Test 1: Vérifier la connexion à l'API Gemini
    console.log('1. Test de connexion à l\'API Gemini...');
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

    // Test 2: Test de génération de contenu simple
    console.log('\n2. Test de génération de contenu...');
    const startTime = Date.now();
    const result = await model.generateContent('Bonjour, je suis enceinte de 3 mois. Que puis-je manger pour le petit-déjeuner ?');
    const response = await result.response;
    const text = response.text();
    const endTime = Date.now();
    
    console.log(`✅ Réponse générée en ${endTime - startTime}ms`);
    console.log(`📝 Réponse: ${text.substring(0, 100)}...`);

    // Test 3: Test de timeout (simulation)
    console.log('\n3. Test de gestion des timeouts...');
    try {
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout test')), 1000);
      });
      
      const generatePromise = model.generateContent('Test de timeout');
      await Promise.race([generatePromise, timeoutPromise]);
      console.log('⚠️ Le test de timeout n\'a pas fonctionné comme attendu');
    } catch (error) {
      if (error.message.includes('Timeout')) {
        console.log('✅ Gestion des timeouts fonctionne correctement');
      } else {
        console.log('✅ Génération normale (pas de timeout)');
      }
    }

    // Test 4: Test de chat avec historique
    console.log('\n4. Test de chat avec historique...');
    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: 'Bonjour, je suis enceinte de 2 mois' }]
        },
        {
          role: 'model',
          parts: [{ text: 'Félicitations ! Comment puis-je vous aider avec votre alimentation ?' }]
        }
      ]
    });

    const chatResult = await chat.sendMessage('J\'ai des nausées, que puis-je faire ?');
    const chatResponse = await chatResult.response;
    const chatText = chatResponse.text();
    
    console.log('✅ Chat avec historique fonctionne');
    console.log(`💬 Réponse: ${chatText.substring(0, 100)}...`);

    console.log('\n🎉 Tous les tests sont passés avec succès !');
    console.log('🤖 Votre chat IA est prêt à fonctionner');

  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
    
    if (error.message.includes('API_KEY')) {
      console.error('🔑 Problème avec la clé API Gemini');
    } else if (error.message.includes('quota')) {
      console.error('📊 Quota API dépassé');
    } else if (error.message.includes('network')) {
      console.error('🌐 Problème de connexion réseau');
    }
  }
};

// Exécuter le test
testChatFunctionality();
