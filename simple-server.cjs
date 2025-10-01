const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3001;

// Timestamp de démarrage du serveur pour la déconnexion automatique
const serverStartTime = Date.now();

// Lire les données depuis db.json
const dbPath = path.join(__dirname, 'db', 'db.json');
let db = {};

try {
  const data = fs.readFileSync(dbPath, 'utf8');
  db = JSON.parse(data);
  console.log('✅ Base de données chargée avec', db.users?.length || 0, 'utilisateurs');
  console.log('🕐 Serveur démarré à:', new Date(serverStartTime).toISOString());
} catch (error) {
  console.error('❌ Erreur lors de la lecture de db.json:', error.message);
  process.exit(1);
}

const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  let pathname = parsedUrl.pathname;
  // Normaliser le chemin (supprimer le slash final)
  if (pathname.length > 1 && pathname.endsWith('/')) pathname = pathname.slice(0, -1);
  const query = parsedUrl.query;

  console.log(`${req.method} ${pathname}`, query);

  // Endpoint pour obtenir le timestamp de démarrage du serveur
  if (pathname === '/server-info') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      startTime: serverStartTime,
      uptime: Date.now() - serverStartTime,
      timestamp: Date.now()
    }));
    return;
  }

  // Routes pour les utilisateurs (CRUD)
  if (pathname.startsWith('/users')) {
    const segments = pathname.split('/').filter(Boolean); // ['users', 'id?']
    const id = segments[1] ? Number(segments[1]) : null;

    if (req.method === 'GET') {
      const { email, password } = query;
      if (id) {
        const user = (db.users || []).find(u => u.id === id) || null;
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(user));
      }
      if (email && password) {
        const user = (db.users || []).find(u => u.email === email && u.password === password);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(user ? [user] : []));
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(db.users || []));
    }

    if (req.method === 'POST' && segments.length === 1) {
      let body = '';
      req.on('data', chunk => { body += chunk.toString(); });
      req.on('end', () => {
        try {
          const payload = JSON.parse(body || '{}');
          if (!db.users) db.users = [];
          const nextId = db.users.length ? Math.max(...db.users.map(u => u.id || 0)) + 1 : 1;
          const now = new Date().toISOString();
          const newUser = { id: nextId, createdAt: now, updatedAt: now, ...payload };
          db.users.push(newUser);
          try { fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8'); } catch {}
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(newUser));
        } catch (error) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid JSON' }));
        }
      });
      return;
    }

    if ((req.method === 'PATCH' || req.method === 'PUT') && id) {
      let body = '';
      req.on('data', chunk => { body += chunk.toString(); });
      req.on('end', () => {
        try {
          const payload = JSON.parse(body || '{}');
          const users = db.users || [];
          const index = users.findIndex(u => Number(u.id) === Number(id));
          if (index === -1) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Not Found' }));
          }
          const now = new Date().toISOString();
          const updated = { ...users[index], ...payload, id, updatedAt: now };
          users[index] = updated;
          db.users = users;
          try { fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8'); } catch {}
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(updated));
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid JSON' }));
        }
      });
      return;
    }

    if (req.method === 'DELETE' && id) {
      const users = db.users || [];
      const index = users.findIndex(u => Number(u.id) === Number(id));
      if (index === -1) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Not Found' }));
      }
      const removed = users.splice(index, 1)[0];
      db.users = users;
      try { fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8'); } catch {}
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(removed));
    }
  }
  // Route pour les campagnes (CRUD)
  else if (pathname.startsWith('/campaigns')) {
    const segments = pathname.split('/').filter(Boolean); // ['campaigns', 'id?']
    const id = segments[1] ? Number(segments[1]) : null;

    // GET /campaigns ou GET /campaigns/:id
    if (req.method === 'GET') {
      const campaigns = db.campaigns || [];
      const result = id ? campaigns.find(c => Number(c.id) === Number(id)) || null : campaigns;
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
    else if ((req.method === 'PUT' || req.method === 'PATCH') && id) {
      let body = '';
      req.on('data', chunk => { body += chunk.toString(); });
      req.on('end', () => {
        try {
          const payload = JSON.parse(body || '{}');
          const campaigns = db.campaigns || [];
          const index = campaigns.findIndex(c => Number(c.id) === Number(id));
          const now = new Date().toISOString();
          if (index === -1) {
            // Upsert: créer si non trouvé (utile pour démos)
            const created = { id: Number(id), createdAt: now, updatedAt: now, ...payload };
            campaigns.push(created);
            db.campaigns = campaigns;
            try { fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8'); } catch {}
            res.writeHead(201, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify(created));
          }
          const updated = { ...campaigns[index], ...payload, id: Number(id), updatedAt: now };
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
  // Routes pour les relations médecin-patient
  else if (pathname.startsWith('/doctorPatients')) {
    const segments = pathname.split('/').filter(Boolean);
    const id = segments[1] ? Number(segments[1]) : null;
    
    if (req.method === 'GET') {
      const { doctorId, patientId } = query;
      let relations = db.doctorPatients || [];
      
      if (doctorId) {
        relations = relations.filter(rel => Number(rel.doctorId) === Number(doctorId));
      }
      if (patientId) {
        relations = relations.filter(rel => Number(rel.patientId) === Number(patientId));
      }
      
      const result = id ? (relations.find(rel => Number(rel.id) === Number(id)) || null) : relations;
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(result));
    }
    
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk.toString(); });
      req.on('end', () => {
        try {
          const payload = JSON.parse(body || '{}');
          if (!db.doctorPatients) db.doctorPatients = [];
          const nextId = db.doctorPatients.length ? Math.max(...db.doctorPatients.map(r => r.id || 0)) + 1 : 1;
          const newRel = { id: nextId, ...payload };
          db.doctorPatients.push(newRel);
          try { fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8'); } catch {}
          res.writeHead(201, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify(newRel));
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'Invalid JSON' }));
        }
      });
      return;
    }
    
    if ((req.method === 'PUT' || req.method === 'PATCH') && id) {
      let body = '';
      req.on('data', chunk => { body += chunk.toString(); });
      req.on('end', () => {
        try {
          const payload = JSON.parse(body || '{}');
          const list = db.doctorPatients || [];
          const idx = list.findIndex(rel => Number(rel.id) === Number(id));
          if (idx === -1) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Not Found' }));
          }
          const updated = { ...list[idx], ...payload, id: Number(id) };
          list[idx] = updated;
          db.doctorPatients = list;
          try { fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8'); } catch {}
          res.writeHead(200, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify(updated));
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'Invalid JSON' }));
        }
      });
      return;
    }
    
    if (req.method === 'DELETE' && id) {
      const list = db.doctorPatients || [];
      const idx = list.findIndex(rel => Number(rel.id) === Number(id));
      if (idx === -1) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Not Found' }));
      }
      const removed = list.splice(idx, 1)[0];
      db.doctorPatients = list;
      try { fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8'); } catch {}
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(removed));
    }
  }
  // Routes pour les dossiers médicaux
  else if (pathname.startsWith('/medicalRecords')) {
    const segments = pathname.split('/').filter(Boolean);
    const id = segments[1] ? Number(segments[1]) : null;
    
    if (req.method === 'GET') {
      const { doctorId, patientId } = query;
      let records = db.medicalRecords || [];
      
      if (doctorId) {
        records = records.filter(record => Number(record.doctorId) === Number(doctorId));
      }
      if (patientId) {
        records = records.filter(record => Number(record.patientId) === Number(patientId));
      }
      
      const result = id ? (records.find(record => Number(record.id) === Number(id)) || null) : records;
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(result));
    }
    
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk.toString(); });
      req.on('end', () => {
        try {
          const payload = JSON.parse(body || '{}');
          if (!db.medicalRecords) db.medicalRecords = [];
          const nextId = db.medicalRecords.length ? Math.max(...db.medicalRecords.map(r => r.id || 0)) + 1 : 1;
          const newRecord = { id: nextId, ...payload };
          db.medicalRecords.push(newRecord);
          try { fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8'); } catch {}
          res.writeHead(201, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify(newRecord));
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'Invalid JSON' }));
        }
      });
      return;
    }
    
    if ((req.method === 'PUT' || req.method === 'PATCH') && id) {
      let body = '';
      req.on('data', chunk => { body += chunk.toString(); });
      req.on('end', () => {
        try {
          const payload = JSON.parse(body || '{}');
          const list = db.medicalRecords || [];
          const idx = list.findIndex(record => Number(record.id) === Number(id));
          if (idx === -1) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Not Found' }));
          }
          const updated = { ...list[idx], ...payload, id: Number(id) };
          list[idx] = updated;
          db.medicalRecords = list;
          try { fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8'); } catch {}
          res.writeHead(200, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify(updated));
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'Invalid JSON' }));
        }
      });
      return;
    }
    
    if (req.method === 'DELETE' && id) {
      const list = db.medicalRecords || [];
      const idx = list.findIndex(record => Number(record.id) === Number(id));
      if (idx === -1) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Not Found' }));
      }
      const removed = list.splice(idx, 1)[0];
      db.medicalRecords = list;
      try { fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8'); } catch {}
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(removed));
    }
  }
  // Routes pour les prescriptions médicales
  else if (pathname.startsWith('/medicalPrescriptions')) {
    const segments = pathname.split('/').filter(Boolean);
    const id = segments[1] ? Number(segments[1]) : null;
    
    if (req.method === 'GET') {
      const { doctorId, patientId } = query;
      let prescriptions = db.medicalPrescriptions || [];
      
      if (doctorId) {
        prescriptions = prescriptions.filter(prescription => Number(prescription.doctorId) === Number(doctorId));
      }
      if (patientId) {
        prescriptions = prescriptions.filter(prescription => Number(prescription.patientId) === Number(patientId));
      }
      
      const result = id ? (prescriptions.find(prescription => Number(prescription.id) === Number(id)) || null) : prescriptions;
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(result));
    }
    
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk.toString(); });
      req.on('end', () => {
        try {
          const payload = JSON.parse(body || '{}');
          if (!db.medicalPrescriptions) db.medicalPrescriptions = [];
          const nextId = db.medicalPrescriptions.length ? Math.max(...db.medicalPrescriptions.map(p => p.id || 0)) + 1 : 1;
          const newPrescription = { id: nextId, ...payload };
          db.medicalPrescriptions.push(newPrescription);
          try { fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8'); } catch {}
          res.writeHead(201, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify(newPrescription));
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'Invalid JSON' }));
        }
      });
      return;
    }
    
    if ((req.method === 'PUT' || req.method === 'PATCH') && id) {
      let body = '';
      req.on('data', chunk => { body += chunk.toString(); });
      req.on('end', () => {
        try {
          const payload = JSON.parse(body || '{}');
          const list = db.medicalPrescriptions || [];
          const idx = list.findIndex(prescription => Number(prescription.id) === Number(id));
          if (idx === -1) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Not Found' }));
          }
          const updated = { ...list[idx], ...payload, id: Number(id) };
          list[idx] = updated;
          db.medicalPrescriptions = list;
          try { fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8'); } catch {}
          res.writeHead(200, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify(updated));
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'Invalid JSON' }));
        }
      });
      return;
    }
    
    if (req.method === 'DELETE' && id) {
      const list = db.medicalPrescriptions || [];
      const idx = list.findIndex(prescription => Number(prescription.id) === Number(id));
      if (idx === -1) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Not Found' }));
      }
      const removed = list.splice(idx, 1)[0];
      db.medicalPrescriptions = list;
      try { fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8'); } catch {}
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(removed));
    }
  }
  // Routes pour les contacts d'urgence
  else if (pathname.startsWith('/emergencyContacts')) {
    const segments = pathname.split('/').filter(Boolean);
    const id = segments[1] ? Number(segments[1]) : null;
    
    if (req.method === 'GET') {
      const { patientId } = query;
      let contacts = db.emergencyContacts || [];
      
      if (patientId) {
        contacts = contacts.filter(contact => Number(contact.patientId) === Number(patientId));
      }
      
      const result = id ? (contacts.find(contact => Number(contact.id) === Number(id)) || null) : contacts;
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(result));
    }
    
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk.toString(); });
      req.on('end', () => {
        try {
          const payload = JSON.parse(body || '{}');
          if (!db.emergencyContacts) db.emergencyContacts = [];
          const nextId = db.emergencyContacts.length ? Math.max(...db.emergencyContacts.map(c => c.id || 0)) + 1 : 1;
          const newContact = { id: nextId, ...payload };
          db.emergencyContacts.push(newContact);
          try { fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8'); } catch {}
          res.writeHead(201, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify(newContact));
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'Invalid JSON' }));
        }
      });
      return;
    }
    
    if ((req.method === 'PUT' || req.method === 'PATCH') && id) {
      let body = '';
      req.on('data', chunk => { body += chunk.toString(); });
      req.on('end', () => {
        try {
          const payload = JSON.parse(body || '{}');
          const list = db.emergencyContacts || [];
          const idx = list.findIndex(contact => Number(contact.id) === Number(id));
          if (idx === -1) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Not Found' }));
          }
          const updated = { ...list[idx], ...payload, id: Number(id) };
          list[idx] = updated;
          db.emergencyContacts = list;
          try { fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8'); } catch {}
          res.writeHead(200, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify(updated));
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'Invalid JSON' }));
        }
      });
      return;
    }
    
    if (req.method === 'DELETE' && id) {
      const list = db.emergencyContacts || [];
      const idx = list.findIndex(contact => Number(contact.id) === Number(id));
      if (idx === -1) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Not Found' }));
      }
      const removed = list.splice(idx, 1)[0];
      db.emergencyContacts = list;
      try { fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8'); } catch {}
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(removed));
    }
  }
  // Pregnancy records CRUD
  else if (pathname.startsWith('/pregnancy-records')) {
    const segments = pathname.split('/').filter(Boolean);
    const id = segments[1] ? Number(segments[1]) : null;
    if (req.method === 'GET') {
      const { userId } = query;
      let records = db.pregnancyRecords || [];
      if (userId) records = records.filter(r => Number(r.userId) === Number(userId));
      const result = id ? (records.find(r => Number(r.id) === Number(id)) || null) : records;
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(result));
    }
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk.toString(); });
      req.on('end', () => {
        try {
          const payload = JSON.parse(body || '{}');
          if (!db.pregnancyRecords) db.pregnancyRecords = [];
          const nextId = db.pregnancyRecords.length ? Math.max(...db.pregnancyRecords.map(r => r.id || 0)) + 1 : 1;
          const newRec = { id: nextId, ...payload };
          db.pregnancyRecords.push(newRec);
          try { fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8'); } catch {}
          res.writeHead(201, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify(newRec));
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'Invalid JSON' }));
        }
      });
      return;
    }
    if ((req.method === 'PUT' || req.method === 'PATCH') && id) {
      let body = '';
      req.on('data', chunk => { body += chunk.toString(); });
      req.on('end', () => {
        try {
          const payload = JSON.parse(body || '{}');
          const list = db.pregnancyRecords || [];
          const idx = list.findIndex(r => Number(r.id) === Number(id));
          if (idx === -1) {
            const created = { id: Number(id), ...payload };
            list.push(created);
            db.pregnancyRecords = list;
            try { fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8'); } catch {}
            res.writeHead(201, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify(created));
          }
          const updated = { ...list[idx], ...payload, id: Number(id) };
          list[idx] = updated;
          db.pregnancyRecords = list;
          try { fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8'); } catch {}
          res.writeHead(200, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify(updated));
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'Invalid JSON' }));
        }
      });
      return;
    }
    if (req.method === 'DELETE' && id) {
      const list = db.pregnancyRecords || [];
      const idx = list.findIndex(r => Number(r.id) === Number(id));
      if (idx === -1) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Not Found' }));
      }
      const removed = list.splice(idx, 1)[0];
      db.pregnancyRecords = list;
      try { fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8'); } catch {}
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(removed));
    }
  }
  // Appointments CRUD
  else if (pathname.startsWith('/appointments')) {
    const segments = pathname.split('/').filter(Boolean);
    const id = segments[1] ? Number(segments[1]) : null;
    if (req.method === 'GET') {
      const { userId } = query;
      let list = db.appointments || [];
      if (userId) list = list.filter(a => Number(a.userId) === Number(userId));
      const result = id ? (list.find(a => Number(a.id) === Number(id)) || null) : list;
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(result));
    }
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk.toString(); });
      req.on('end', () => {
        try {
          const payload = JSON.parse(body || '{}');
          if (!db.appointments) db.appointments = [];
          const nextId = db.appointments.length ? Math.max(...db.appointments.map(a => a.id || 0)) + 1 : 1;
          const created = { id: nextId, ...payload };
          db.appointments.push(created);
          try { fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8'); } catch {}
          res.writeHead(201, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify(created));
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'Invalid JSON' }));
        }
      });
      return;
    }
    if ((req.method === 'PUT' || req.method === 'PATCH') && id) {
      let body = '';
      req.on('data', chunk => { body += chunk.toString(); });
      req.on('end', () => {
        try {
          const payload = JSON.parse(body || '{}');
          const list = db.appointments || [];
          const idx = list.findIndex(a => Number(a.id) === Number(id));
          if (idx === -1) {
            const created = { id: Number(id), ...payload };
            list.push(created);
            db.appointments = list;
            try { fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8'); } catch {}
            res.writeHead(201, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify(created));
          }
          const updated = { ...list[idx], ...payload, id: Number(id) };
          list[idx] = updated;
          db.appointments = list;
          try { fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8'); } catch {}
          res.writeHead(200, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify(updated));
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'Invalid JSON' }));
        }
      });
      return;
    }
    if (req.method === 'DELETE' && id) {
      const list = db.appointments || [];
      const idx = list.findIndex(a => Number(a.id) === Number(id));
      if (idx === -1) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Not Found' }));
      }
      const removed = list.splice(idx, 1)[0];
      db.appointments = list;
      try { fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8'); } catch {}
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(removed));
    }
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
  // Route pour les centres de santé
  else if (pathname.startsWith('/healthCenters')) {
    if (req.method === 'GET') {
      let centers = db.healthCenters || [];
      
      // Filtrage par région
      if (query.region) {
        centers = centers.filter(c => c.region === query.region);
      }
      
      // Filtrage par type
      if (query.type) {
        centers = centers.filter(c => c.type === query.type);
      }
      
      // Filtrage par statut actif
      if (query.isActive === 'true') {
        centers = centers.filter(c => c.isActive === true);
      }
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(centers));
    }
    else if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        try {
          const newCenter = JSON.parse(body);
          if (!db.healthCenters) db.healthCenters = [];
          const nextId = db.healthCenters.length ? Math.max(...db.healthCenters.map(c => c.id || 0)) + 1 : 1;
          newCenter.id = nextId;
          db.healthCenters.push(newCenter);
          try { fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8'); } catch {}
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(newCenter));
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid JSON' }));
        }
      });
    }
    else if (req.method === 'PUT') {
      const id = parseInt(pathname.split('/')[2]);
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        try {
          const updatedData = JSON.parse(body);
          const list = db.healthCenters || [];
          const idx = list.findIndex(c => c.id === id);
          if (idx === -1) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Centre de santé non trouvé' }));
            return;
          }
          list[idx] = { ...list[idx], ...updatedData };
          db.healthCenters = list;
          try { fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8'); } catch {}
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(list[idx]));
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid JSON' }));
        }
      });
    }
    else if (req.method === 'DELETE') {
      const id = parseInt(pathname.split('/')[2]);
      const list = db.healthCenters || [];
      const idx = list.findIndex(c => c.id === id);
      if (idx === -1) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Centre de santé non trouvé' }));
        return;
      }
      const removed = list.splice(idx, 1)[0];
      db.healthCenters = list;
      try { fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8'); } catch {}
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(removed));
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
