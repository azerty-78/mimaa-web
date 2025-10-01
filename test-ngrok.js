// Script de test pour vérifier la compatibilité ngrok
const https = require('https');
const http = require('http');

// Configuration
const FRONTEND_URL = process.argv[2] || 'http://localhost:5173';
const BACKEND_URL = process.argv[3] || 'http://localhost:3001';

console.log('🧪 Test de compatibilité ngrok pour MIMAA Web');
console.log('================================================');
console.log(`Frontend: ${FRONTEND_URL}`);
console.log(`Backend: ${BACKEND_URL}`);
console.log('');

// Fonction pour tester une URL
async function testUrl(url, description) {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;
    
    console.log(`🔍 Test: ${description}`);
    console.log(`   URL: ${url}`);
    
    const req = client.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`   ✅ Status: ${res.statusCode}`);
        console.log(`   📊 Headers: ${JSON.stringify(res.headers, null, 2)}`);
        resolve({ success: true, status: res.statusCode, data });
      });
    });
    
    req.on('error', (error) => {
      console.log(`   ❌ Erreur: ${error.message}`);
      resolve({ success: false, error: error.message });
    });
    
    req.setTimeout(10000, () => {
      console.log(`   ⏰ Timeout après 10 secondes`);
      req.destroy();
      resolve({ success: false, error: 'Timeout' });
    });
  });
}

// Tests à effectuer
async function runTests() {
  const tests = [
    {
      url: `${BACKEND_URL}/health`,
      description: 'Backend Health Check'
    },
    {
      url: `${BACKEND_URL}/users`,
      description: 'Backend Users API'
    },
    {
      url: `${BACKEND_URL}/pregnancy-records`,
      description: 'Backend Pregnancy Records API'
    },
    {
      url: `${FRONTEND_URL}`,
      description: 'Frontend Application'
    },
    {
      url: `${FRONTEND_URL}/api/health`,
      description: 'Frontend Proxy Health Check'
    },
    {
      url: `${FRONTEND_URL}/api/users`,
      description: 'Frontend Proxy Users API'
    }
  ];

  console.log('🚀 Démarrage des tests...\n');

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    const result = await testUrl(test.url, test.description);
    
    if (result.success) {
      passed++;
    } else {
      failed++;
    }
    
    console.log(''); // Ligne vide pour la lisibilité
  }

  console.log('📊 Résumé des tests');
  console.log('==================');
  console.log(`✅ Tests réussis: ${passed}`);
  console.log(`❌ Tests échoués: ${failed}`);
  console.log(`📈 Taux de réussite: ${Math.round((passed / (passed + failed)) * 100)}%`);

  if (failed === 0) {
    console.log('\n🎉 Tous les tests sont passés ! L\'application est prête pour ngrok.');
  } else {
    console.log('\n⚠️  Certains tests ont échoué. Vérifiez la configuration.');
  }

  // Test de compatibilité ngrok spécifique
  if (FRONTEND_URL.includes('ngrok') || BACKEND_URL.includes('ngrok')) {
    console.log('\n🌐 Tests de compatibilité ngrok');
    console.log('===============================');
    
    const ngrokTests = [
      {
        url: `${FRONTEND_URL}/api/health`,
        description: 'Proxy ngrok vers backend local'
      }
    ];

    for (const test of ngrokTests) {
      await testUrl(test.url, test.description);
      console.log('');
    }
  }
}

// Exécuter les tests
runTests().catch(console.error);
