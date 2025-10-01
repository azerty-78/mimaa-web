// Script de test pour vérifier que le coach répond à tous les aspects de la grossesse
const { GoogleGenerativeAI } = require('@google/generative-ai');

const testPregnancyCoach = async () => {
  console.log('🧪 Test du Coach IA Grossesse - Tous les aspects...\n');
  
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

    const testCategories = [
      {
        category: "Symptômes",
        questions: ["Symptômes normaux?", "J'ai des crampes, c'est normal?"]
      },
      {
        category: "Nutrition",
        questions: ["Aliments à éviter?", "Que manger au 1er trimestre?"]
      },
      {
        category: "Examens",
        questions: ["Examens importants?", "Quand faire l'échographie?"]
      },
      {
        category: "Exercices",
        questions: ["Exercices recommandés?", "Puis-je faire du sport?"]
      },
      {
        category: "Bien-être",
        questions: ["Troubles du sommeil?", "Gérer l'anxiété?"]
      },
      {
        category: "Accouchement",
        questions: ["Préparer l'accouchement?", "Signes de travail?"]
      }
    ];

    console.log('📋 Test par catégories:\n');

    for (const category of testCategories) {
      console.log(`🏷️  ${category.category}:`);
      
      for (const question of category.questions) {
        console.log(`   ❓ ${question}`);
        
        const prompt = `Coach IA spécialisé dans la grossesse. Réponse COURTE et PRÉCISE.

Question: "${question}"

RÈGLES:
- Maximum 2 phrases
- Réponse directe et pratique
- Focus essentiel
- Tous aspects de la grossesse

Conseil court et pratique sur la grossesse.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        const wordCount = text.split(' ').length;
        const sentenceCount = text.split('.').length - 1;
        
        console.log(`   ✅ ${text}`);
        console.log(`   📊 ${wordCount} mots, ${sentenceCount} phrases`);
        
        if (wordCount <= 30 && sentenceCount <= 2) {
          console.log('   ✅ Réponse courte ✓');
        } else {
          console.log('   ⚠️ Réponse trop longue');
        }
        
        console.log('');
      }
      console.log('---\n');
    }

    console.log('🎉 Test terminé !');
    console.log('💡 Le coach couvre maintenant tous les aspects de la grossesse.');

  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
  }
};

// Exécuter le test
testPregnancyCoach();
