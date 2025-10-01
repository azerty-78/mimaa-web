// Script de test pour vérifier que les réponses du chat sont courtes et concises
const { GoogleGenerativeAI } = require('@google/generative-ai');

const testConciseResponses = async () => {
  console.log('🧪 Test des réponses courtes et concises...\n');
  
  try {
    const genAI = new GoogleGenerativeAI('AIzaSyAGyYDydVRJ5tkAkEoIHLVp6HpES3Of4cw');
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.5,
        maxOutputTokens: 300,
        topP: 0.7,
        topK: 20
      }
    });

    const testQuestions = [
      "Quels aliments éviter pendant la grossesse?",
      "Comment gérer les nausées?",
      "Quels suppléments prendre?",
      "Besoins en fer?",
      "Comment prévenir le diabète gestationnel?"
    ];

    console.log('📋 Test de réponses courtes pour différentes questions:\n');

    for (let i = 0; i < testQuestions.length; i++) {
      const question = testQuestions[i];
      console.log(`❓ Question ${i + 1}: ${question}`);
      
      const prompt = `Coach nutritionnel pour femmes enceintes. Réponse COURTE et PRÉCISE.

Question: "${question}"

RÈGLES:
- Maximum 2 phrases
- Réponse directe
- Focus essentiel
- Nutrition/grossesse uniquement

Conseil nutritionnel court et pratique.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Analyser la longueur de la réponse
      const wordCount = text.split(' ').length;
      const sentenceCount = text.split('.').length - 1;
      
      console.log(`✅ Réponse: ${text}`);
      console.log(`📊 Statistiques: ${wordCount} mots, ${sentenceCount} phrases`);
      
      // Vérifier si la réponse est courte
      if (wordCount <= 30 && sentenceCount <= 2) {
        console.log('✅ Réponse courte et concise ✓');
      } else {
        console.log('⚠️ Réponse trop longue - à optimiser');
      }
      
      console.log('---\n');
    }

    console.log('🎉 Test terminé !');
    console.log('💡 Les réponses devraient maintenant être courtes et précises.');

  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
  }
};

// Exécuter le test
testConciseResponses();
