const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3001;

// Lire les données depuis db.json
const dbPath = path.join(__dirname, 'db', 'db.json');
let db = {};

try {
  const data = fs.readFileSync(dbPath, 'utf8');
  db = JSON.parse(data);
  console.log('✅ Base de données chargée avec', db.users?.length || 0, 'utilisateurs');
} catch (error) {
  console.error('❌ Erreur lors de la lecture de db.json:', error.message);
  process.exit(1);
}

const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  console.log(`${req.method} ${pathname}`, query);

  // Route pour les utilisateurs
  if (pathname === '/users') {
    if (req.method === 'GET') {
      const { email, password } = query;
      
      if (email && password) {
        // Recherche par email et mot de passe
        const user = db.users.find(u => u.email === email && u.password === password);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(user ? [user] : []));
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(db.users || []));
      }
    } else if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', () => {
        try {
          const newUser = JSON.parse(body);
          newUser.id = Math.max(...(db.users || []).map(u => u.id)) + 1;
          newUser.createdAt = new Date().toISOString();
          newUser.updatedAt = new Date().toISOString();
          
          if (!db.users) db.users = [];
          db.users.push(newUser);
          
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(newUser));
        } catch (error) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid JSON' }));
        }
      });
    }
  }
  // Route pour les campagnes
  else if (pathname === '/campaigns') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(db.campaigns || []));
  }
  // Route pour les communautés
  else if (pathname === '/communities') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(db.communities || []));
  }
  // Route pour les notifications
  else if (pathname === '/notifications') {
    const { userId } = query;
    if (userId) {
      const notifications = (db.notifications || []).filter(n => n.userId === parseInt(userId));
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(notifications));
    } else {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(db.notifications || []));
    }
  }
  // Route de test
  else if (pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      status: 'OK', 
      message: 'Serveur MIMAA en cours d\'exécution',
      users: db.users?.length || 0
    }));
  }
  // Route 404
  else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Serveur MIMAA démarré sur http://localhost:${PORT}`);
  console.log(`📊 Base de données chargée avec ${db.users?.length || 0} utilisateurs`);
  console.log(`🔗 Test: http://localhost:${PORT}/health`);
});

server.on('error', (err) => {
  console.error('❌ Erreur du serveur:', err.message);
  process.exit(1);
});
