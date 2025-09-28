# Guide de configuration Ngrok pour MIMAA Web

## 🚀 Solution avec un seul tunnel Ngrok gratuit

### Problème résolu
Avec un seul tunnel ngrok gratuit, le frontend (port 5173) doit accéder au backend local (port 3001). La solution utilise un **proxy Vite** pour rediriger les requêtes API.

### ✅ Solution implémentée

#### 1. **Proxy Vite automatique**
- Vite redirige `/api/*` vers `localhost:3001`
- Fonctionne avec un seul tunnel ngrok
- Configuration automatique, aucune action requise

#### 2. **URLs intelligentes**
- **Local** : `http://localhost:3001/users`
- **Ngrok** : `https://abc123.ngrok-free.app/api/users`
- **Redirection automatique** : `/api/users` → `localhost:3001/users`

#### 3. **Configuration JSON-Server**
- Options CORS pour ngrok
- Configuration `--host 0.0.0.0`
- Fichier de configuration `json-server.json`

## 🔧 Instructions de démarrage

### Méthode simple (recommandée)
```bash
# Terminal 1 : Démarrer l'application
npm run dev:full

# Terminal 2 : Un seul tunnel ngrok
ngrok http 5173
```

**C'est tout !** L'application fonctionne avec une seule URL ngrok.

### Méthode avec scripts
```bash
# Windows
start-ngrok.bat

# PowerShell
.\start-ngrok.ps1
```

## ⚙️ Comment ça fonctionne

### 1. **Démarrage de l'application**
```bash
npm run dev:full
```
- Frontend sur `http://localhost:5173`
- Backend sur `http://localhost:3001`
- Proxy Vite configuré automatiquement

### 2. **Tunnel ngrok unique**
```bash
ngrok http 5173
```
- Expose le port 5173 (frontend + proxy)
- URL générée : `https://abc123.ngrok-free.app`

### 3. **Accès à l'API**
- **Requête** : `https://abc123.ngrok-free.app/api/users`
- **Redirection** : `localhost:3001/users`
- **Transparent** : L'utilisateur ne voit rien

## 🌐 URLs à utiliser

### Frontend (React)
- **Local** : http://localhost:5173
- **Ngrok** : https://xxxxx.ngrok-free.app

### Backend (JSON-Server)
- **Local** : http://localhost:3001
- **Ngrok** : https://yyyyy.ngrok-free.app

## 🔍 Vérification

1. **Ouvrez la console du navigateur** (F12)
2. **Regardez les logs** pour voir les URLs utilisées
3. **Vérifiez les requêtes API** dans l'onglet Network

## 🐛 Dépannage

### Erreur CORS
- Vérifiez que json-server utilise `--cors`
- Redémarrez le serveur avec `npm run db`

### Erreur de connexion API
- Vérifiez que les deux tunnels ngrok sont actifs
- Vérifiez les URLs dans la console du navigateur
- Assurez-vous que le port 3001 est accessible

### Erreur d'authentification
- Vérifiez que la base de données est accessible
- Testez l'API directement : `https://votre-ngrok-backend.ngrok-free.app/users`

## 📝 Notes importantes

- **Deux tunnels ngrok nécessaires** : un pour le frontend, un pour le backend
- **URLs différentes** : chaque tunnel ngrok a une URL unique
- **Configuration automatique** : l'application détecte ngrok et ajuste les URLs
- **Logs détaillés** : consultez la console pour diagnostiquer les problèmes
