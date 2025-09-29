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
  // Route pour les campagnes (CRUD)
  else if (pathname.startsWith('/campaigns')) {
    const segments = pathname.split('/').filter(Boolean); // ['campaigns', 'id?']
    const id = segments[1] ? parseInt(segments[1], 10) : null;

    // GET /campaigns ou GET /campaigns/:id
    if (req.method === 'GET') {
      const campaigns = db.campaigns || [];
      const result = id ? campaigns.find(c => c.id === id) || null : campaigns;
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    }
    // POST /campaigns
    else if (req.method === 'POST' && segments.length === 1) {
      let body = '';
      req.on('data', chunk => { body += chunk.toString(); });
      req.on('end', () => {
        try {
          const payload = JSON.parse(body || '{}');
          if (!payload || !payload.title || !payload.link) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'title et link sont requis' }));
          }
          if (!db.campaigns) db.campaigns = [];
          const nextId = db.campaigns.length ? Math.max(...db.campaigns.map(c => c.id || 0)) + 1 : 1;
          const now = new Date().toISOString();
          const newCampaign = { id: nextId, createdAt: now, updatedAt: now, ...payload };
          db.campaigns.push(newCampaign);
          try { fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8'); } catch {}
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(newCampaign));
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid JSON' }));
        }
      });
    }
    // PUT /campaigns/:id
    else if (req.method === 'PUT' && id) {
      let body = '';
      req.on('data', chunk => { body += chunk.toString(); });
      req.on('end', () => {
        try {
          const payload = JSON.parse(body || '{}');
          const campaigns = db.campaigns || [];
          const index = campaigns.findIndex(c => c.id === id);
          if (index === -1) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Not Found' }));
          }
          const now = new Date().toISOString();
          const updated = { ...campaigns[index], ...payload, id, updatedAt: now };
          campaigns[index] = updated;
          db.campaigns = campaigns;
          try { fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8'); } catch {}
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(updated));
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid JSON' }));
        }
      });
    }
    // DELETE /campaigns/:id
    else if (req.method === 'DELETE' && id) {
      const campaigns = db.campaigns || [];
      const index = campaigns.findIndex(c => c.id === id);
      if (index === -1) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Not Found' }));
      }
      const removed = campaigns.splice(index, 1)[0];
      db.campaigns = campaigns;
      try { fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8'); } catch {}
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(removed));
    }
    else {
      res.writeHead(405, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Method Not Allowed' }));
    }
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
