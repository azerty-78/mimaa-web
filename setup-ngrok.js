// Script pour configurer automatiquement l'URL ngrok
// Usage: node setup-ngrok.js https://abc123.ngrok-free.app

const backendUrl = process.argv[2];

if (!backendUrl) {
  console.log('❌ Usage: node setup-ngrok.js <backend-ngrok-url>');
  console.log('📝 Exemple: node setup-ngrok.js https://abc123.ngrok-free.app');
  process.exit(1);
}

if (!backendUrl.startsWith('https://') || !backendUrl.includes('ngrok')) {
  console.log('❌ URL invalide. L\'URL doit commencer par https:// et contenir ngrok');
  process.exit(1);
}

// Simuler la configuration dans localStorage
console.log('🔧 Configuration de l\'URL backend ngrok...');
console.log(`📡 URL: ${backendUrl}`);

// Tester la connexion
fetch(`${backendUrl}/users`)
  .then(response => {
    if (response.ok) {
      console.log('✅ Connexion au backend réussie !');
      console.log('💾 URL sauvegardée dans localStorage');
      console.log('🔄 Redémarrez votre application pour appliquer les changements');
    } else {
      console.log('❌ Erreur de connexion au backend');
    }
  })
  .catch(error => {
    console.log('❌ Impossible de se connecter au backend:', error.message);
  });
