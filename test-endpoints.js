const http = require('http');

// Test des endpoints
const testEndpoints = [
  'http://localhost:3001/server-info',
  'http://localhost:3001/medicalRecords?doctorId=3',
  'http://localhost:3001/medicalPrescriptions?doctorId=3',
  'http://localhost:3001/emergencyContacts?patientId=2',
  'http://localhost:3001/doctorPatients?doctorId=3'
];

async function testEndpoint(url) {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`✅ ${url} - Status: ${res.statusCode}`);
        if (res.statusCode === 200) {
          try {
            const json = JSON.parse(data);
            console.log(`   Données: ${Array.isArray(json) ? json.length + ' éléments' : '1 objet'}`);
          } catch (e) {
            console.log(`   Données: ${data.length} caractères`);
          }
        }
        resolve();
      });
    });
    
    req.on('error', (err) => {
      console.log(`❌ ${url} - Erreur: ${err.message}`);
      resolve();
    });
    
    req.setTimeout(5000, () => {
      console.log(`⏰ ${url} - Timeout`);
      req.destroy();
      resolve();
    });
  });
}

async function runTests() {
  console.log('🧪 Test des endpoints du serveur JSON...\n');
  
  for (const endpoint of testEndpoints) {
    await testEndpoint(endpoint);
  }
  
  console.log('\n✅ Tests terminés !');
}

runTests();
