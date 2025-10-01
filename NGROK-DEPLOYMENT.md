# 🚀 Guide de déploiement ngrok pour MIMAA Web

## 📋 Prérequis

- Node.js installé
- ngrok installé et configuré
- Application MIMAA Web fonctionnelle localement

## 🔧 Configuration optimisée

### 1. Démarrer l'application

```bash
# Terminal 1 : Démarrer l'application complète
npm run dev:full

# Vérifier que tout fonctionne
curl http://localhost:3001/health
curl http://localhost:5173
```

### 2. Configuration ngrok

```bash
# Terminal 2 : Un seul tunnel ngrok (recommandé)
ngrok http 5173 --host-header=localhost:5173

# Alternative : Tunnel avec domaine personnalisé (si vous avez un compte ngrok)
ngrok http 5173 --host-header=localhost:5173 --domain=votre-domaine.ngrok.io
```

### 3. Test de compatibilité

```bash
# Tester la configuration
node test-ngrok.js

# Tester avec une URL ngrok spécifique
node test-ngrok.js https://abc123.ngrok-free.app http://localhost:3001
```

## 🌐 URLs générées

Après le démarrage de ngrok, vous obtiendrez :

- **Frontend** : `https://abc123.ngrok-free.app`
- **API via proxy** : `https://abc123.ngrok-free.app/api/*`

## ✅ Fonctionnalités optimisées

### 🔄 Retry automatique
- 3 tentatives automatiques en cas d'échec
- Délai progressif entre les tentatives
- Fallback vers localhost en cas de problème

### ⏱️ Timeout intelligent
- Timeout de 10 secondes par requête
- Gestion des erreurs de timeout
- Messages d'erreur explicites

### 🌐 Détection ngrok
- Détection automatique des domaines ngrok
- Configuration transparente
- Support de tous les domaines ngrok

### 📊 Monitoring réseau
- Bannière de statut réseau
- Détection de connexion lente
- Notifications d'erreur utilisateur

### 💾 Cache optimisé
- Cache des requêtes API (5 minutes)
- Nettoyage automatique
- Amélioration des performances

## 🐛 Dépannage

### Erreur CORS
```bash
# Vérifier que le serveur backend utilise CORS
curl -H "Origin: https://abc123.ngrok-free.app" http://localhost:3001/health
```

### Erreur de proxy
```bash
# Vérifier les logs Vite
# Dans le terminal où npm run dev:full est lancé
```

### Timeout ngrok
```bash
# Redémarrer ngrok avec plus de timeout
ngrok http 5173 --host-header=localhost:5173 --log=stdout
```

### Problème de cache
```bash
# Vider le cache du navigateur
# Ctrl+Shift+R ou Cmd+Shift+R
```

## 📱 Test mobile

1. Obtenez l'URL ngrok
2. Ouvrez sur votre mobile
3. Testez toutes les fonctionnalités
4. Vérifiez la responsivité

## 🔒 Sécurité

- ngrok expose votre application localement
- Ne partagez l'URL qu'avec des personnes de confiance
- L'URL change à chaque redémarrage de ngrok
- Utilisez un compte ngrok pour des URLs fixes

## 📈 Performance

### Optimisations implémentées
- Lazy loading des composants
- Cache des requêtes API
- Compression des assets
- Chunking optimisé

### Monitoring
- Logs détaillés des requêtes
- Statistiques de cache
- Monitoring réseau en temps réel

## 🚀 Déploiement en production

Pour un déploiement en production, considérez :

1. **Hébergement** : Vercel, Netlify, ou AWS
2. **Base de données** : PostgreSQL ou MongoDB
3. **API** : Node.js avec Express ou Fastify
4. **CDN** : CloudFlare pour les assets statiques
5. **Monitoring** : Sentry pour les erreurs

## 📞 Support

En cas de problème :

1. Vérifiez les logs dans la console du navigateur
2. Testez avec `node test-ngrok.js`
3. Vérifiez que les deux serveurs sont démarrés
4. Redémarrez ngrok si nécessaire

---

**Note** : Ce guide est optimisé pour ngrok gratuit. Pour un usage professionnel, considérez un compte ngrok payant avec des URLs fixes et des fonctionnalités avancées.
