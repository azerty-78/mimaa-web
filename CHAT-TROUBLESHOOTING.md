# 🔧 Guide de Dépannage - Chat IA

## 🚨 Problèmes Courants et Solutions

### **Problème 1 : Chat charge longtemps et redirige vers la page de connexion**

#### **Symptômes :**
- Le chat affiche "Chargement..." pendant plus de 30 secondes
- Redirection automatique vers la page de connexion
- Message d'erreur "Utilisateur non authentifié"

#### **Causes possibles :**
1. **Timeout de l'API Gemini** (plus de 30 secondes)
2. **Problème de clé API** invalide ou expirée
3. **Connexion internet** lente ou instable
4. **Quota API** dépassé

#### **Solutions :**

**Solution 1 : Vérifier la clé API**
```bash
# Vérifier dans src/config/gemini.ts
export const GEMINI_CONFIG = {
  apiKey: 'AIzaSyAGyYDydVRJ5tkAkEoIHLVp6HpES3Of4cw', // Vérifier cette clé
  modelName: 'gemini-2.5-flash',
  // ...
};
```

**Solution 2 : Tester la connexion API**
```bash
# Exécuter le script de test
node test-chat.js
```

**Solution 3 : Vérifier la console du navigateur**
1. Ouvrir les outils de développement (F12)
2. Aller dans l'onglet "Console"
3. Chercher les erreurs liées à Gemini ou l'authentification

**Solution 4 : Redémarrer l'application**
```bash
# Arrêter l'application (Ctrl+C)
# Redémarrer
npm run dev:full
```

### **Problème 2 : "Désolé, je rencontre des difficultés techniques"**

#### **Symptômes :**
- Message d'erreur générique du chat
- Pas de réponse de l'IA

#### **Solutions :**

**Solution 1 : Vérifier la connexion internet**
```bash
# Tester la connectivité
ping google.com
```

**Solution 2 : Vérifier les quotas API**
1. Aller sur [Google AI Studio](https://aistudio.google.com/)
2. Vérifier l'utilisation de votre clé API
3. Renouveler si nécessaire

**Solution 3 : Réduire la complexité de la question**
- Poser des questions plus simples
- Éviter les questions très longues
- Séparer les questions complexes en plusieurs parties

### **Problème 3 : Chat ne répond pas aux images**

#### **Symptômes :**
- Upload d'image fonctionne
- Mais l'IA ne répond pas ou donne une erreur

#### **Solutions :**

**Solution 1 : Vérifier le format de l'image**
- Formats supportés : JPEG, PNG, WebP
- Taille maximale : 4MB
- Résolution recommandée : 1024x1024 ou moins

**Solution 2 : Vérifier la conversion base64**
```javascript
// Dans la console du navigateur
console.log('Image data length:', selectedImage.length);
// Doit être > 1000 caractères pour une image valide
```

### **Problème 4 : Redirection vers la page de connexion**

#### **Symptômes :**
- Chat se ferme soudainement
- Redirection vers la page de connexion
- Perte de la session utilisateur

#### **Solutions :**

**Solution 1 : Vérifier l'authentification**
```javascript
// Dans la console du navigateur
console.log('User:', localStorage.getItem('user'));
console.log('Is authenticated:', !!localStorage.getItem('user'));
```

**Solution 2 : Reconnecter l'utilisateur**
1. Se déconnecter
2. Se reconnecter
3. Retester le chat

**Solution 3 : Vérifier les logs d'erreur**
- Ouvrir la console (F12)
- Chercher les erreurs d'authentification
- Vérifier les requêtes API

## 🔍 Diagnostic Avancé

### **Vérification de l'état de l'application**

```bash
# 1. Vérifier que les serveurs sont démarrés
curl http://localhost:3001/health
curl http://localhost:5173

# 2. Vérifier les logs de l'application
# Dans le terminal où npm run dev:full est lancé
# Chercher les erreurs liées à Gemini ou l'authentification

# 3. Vérifier la configuration
cat src/config/gemini.ts
```

### **Test de l'API Gemini**

```bash
# Exécuter le script de test complet
node test-chat.js

# Ou tester manuellement avec curl
curl -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [{
      "parts": [{
        "text": "Bonjour, test de connexion"
      }]
    }]
  }'
```

### **Vérification des dépendances**

```bash
# Vérifier que @google/generative-ai est installé
npm list @google/generative-ai

# Réinstaller si nécessaire
npm install @google/generative-ai@latest
```

## 🚀 Optimisations

### **Améliorer les performances du chat**

1. **Réduire la taille des prompts**
   - Éviter les prompts très longs
   - Utiliser des questions directes

2. **Optimiser les paramètres Gemini**
   ```typescript
   generationConfig: {
     temperature: 0.7,      // Réduire pour des réponses plus cohérentes
     maxOutputTokens: 1000, // Réduire pour des réponses plus rapides
     topP: 0.8,
     topK: 40
   }
   ```

3. **Implémenter un cache local**
   - Stocker les réponses fréquentes
   - Éviter les requêtes répétitives

### **Améliorer l'expérience utilisateur**

1. **Indicateurs de chargement plus clairs**
   - Barre de progression
   - Messages d'état détaillés

2. **Gestion d'erreurs plus informative**
   - Messages d'erreur spécifiques
   - Suggestions de solutions

3. **Retry automatique**
   - Nouvelle tentative en cas d'échec
   - Délai progressif entre les tentatives

## 📞 Support

### **En cas de problème persistant :**

1. **Collecter les informations de diagnostic**
   ```bash
   # Créer un rapport de diagnostic
   echo "=== Diagnostic MIMAA Chat ===" > diagnostic.txt
   echo "Date: $(date)" >> diagnostic.txt
   echo "Node version: $(node --version)" >> diagnostic.txt
   echo "NPM version: $(npm --version)" >> diagnostic.txt
   echo "OS: $(uname -a)" >> diagnostic.txt
   ```

2. **Vérifier les logs de l'application**
   - Console du navigateur
   - Logs du serveur
   - Logs de l'API

3. **Tester avec une nouvelle clé API**
   - Générer une nouvelle clé sur Google AI Studio
   - Mettre à jour `src/config/gemini.ts`
   - Redémarrer l'application

### **Logs utiles à vérifier :**

```javascript
// Dans la console du navigateur
console.log('🚀 Début de la génération de réponse IA...');
console.log('✅ Réponse IA générée avec succès');
console.log('❌ Erreur lors de la génération de la réponse:', error);
console.log('🏁 Fin du processus de génération');
```

---

**💡 Conseil :** En cas de problème, commencez toujours par redémarrer l'application et vérifier la connexion internet. La plupart des problèmes sont résolus par ces étapes simples.
