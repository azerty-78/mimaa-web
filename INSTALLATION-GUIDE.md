# 📋 Guide d'Installation Complet - MIMAA Web

## 🎯 Vue d'ensemble
Ce guide vous permettra d'installer et de faire fonctionner l'application MIMAA Web sur n'importe quelle machine, étape par étape.

## 📋 Prérequis Système

### 1. **Système d'exploitation supporté**
- ✅ **Windows** 10/11 (64-bit)
- ✅ **macOS** 10.15+ (Intel/Apple Silicon)
- ✅ **Linux** Ubuntu 18.04+ / CentOS 7+ / Debian 10+

### 2. **Logiciels requis**

#### **Node.js** (OBLIGATOIRE)
```bash
# Vérifier la version actuelle
node --version

# Version requise : 18.0.0 ou supérieure
# Télécharger depuis : https://nodejs.org/
```

#### **npm** (inclus avec Node.js)
```bash
# Vérifier la version
npm --version

# Version requise : 8.0.0 ou supérieure
```

#### **Git** (OBLIGATOIRE)
```bash
# Vérifier l'installation
git --version

# Télécharger depuis : https://git-scm.com/
```

### 3. **Outils optionnels recommandés**
- **Visual Studio Code** (éditeur de code)
- **Postman** (test d'API)
- **ngrok** (partage local)

## 🚀 Installation Étape par Étape

### **Étape 1 : Cloner le projet**

```bash
# 1. Ouvrir un terminal/command prompt
# 2. Naviguer vers le dossier souhaité
cd C:\Users\VotreNom\Desktop

# 3. Cloner le repository
git clone https://github.com/votre-username/mimaa-web.git

# 4. Entrer dans le dossier du projet
cd mimaa-web
```

### **Étape 2 : Vérifier la structure du projet**

```bash
# Lister les fichiers du projet
ls -la  # Linux/macOS
dir     # Windows

# Structure attendue :
# ├── src/
# ├── db/
# ├── package.json
# ├── vite.config.ts
# ├── tailwind.config.js
# └── simple-server.cjs
```

### **Étape 3 : Installer les dépendances**

```bash
# Installer toutes les dépendances
npm install

# Vérifier l'installation
npm list --depth=0
```

**⚠️ En cas d'erreur :**
```bash
# Nettoyer le cache npm
npm cache clean --force

# Supprimer node_modules et package-lock.json
rm -rf node_modules package-lock.json  # Linux/macOS
rmdir /s node_modules & del package-lock.json  # Windows

# Réinstaller
npm install
```

### **Étape 4 : Configuration de l'environnement**

#### **4.1. Variables d'environnement (optionnel)**
```bash
# Créer un fichier .env à la racine du projet
touch .env  # Linux/macOS
type nul > .env  # Windows

# Ajouter les variables (optionnel)
echo "VITE_API_URL=http://localhost:3001" >> .env
echo "VITE_APP_NAME=MIMAA Web" >> .env
```

#### **4.2. Configuration de la base de données**
```bash
# Vérifier que le fichier db.json existe
ls db/db.json  # Linux/macOS
dir db\db.json  # Windows

# Si absent, créer la structure
mkdir -p db  # Linux/macOS
mkdir db    # Windows
```

### **Étape 5 : Démarrer l'application**

#### **Option A : Démarrage complet (recommandé)**
```bash
# Démarrer l'application ET la base de données
npm run dev:full
```

#### **Option B : Démarrage séparé**
```bash
# Terminal 1 : Démarrer la base de données
npm run db

# Terminal 2 : Démarrer l'application
npm run dev
```

### **Étape 6 : Vérifier le fonctionnement**

#### **6.1. Vérifier les serveurs**
- **Application** : http://localhost:5173
- **API** : http://localhost:3001
- **Base de données** : http://localhost:3001/db.json

#### **6.2. Test de l'interface**
1. Ouvrir http://localhost:5173
2. Vérifier que la page de connexion s'affiche
3. Tester l'inscription d'un utilisateur
4. Tester la connexion

## 🔧 Configuration Avancée

### **1. Configuration pour ngrok (partage local)**

#### **Installation de ngrok**
```bash
# Via npm (global)
npm install -g ngrok

# Ou télécharger depuis : https://ngrok.com/
```

#### **Utilisation avec ngrok**
```bash
# 1. Démarrer l'application
npm run dev:full

# 2. Dans un autre terminal, exposer le port 5173
ngrok http 5173

# 3. Utiliser l'URL fournie par ngrok
# Exemple : https://abc123.ngrok-free.app
```

### **2. Configuration pour la production**

#### **Build de production**
```bash
# Créer la build de production
npm run build

# Prévisualiser la build
npm run preview
```

#### **Déploiement**
```bash
# Les fichiers de production sont dans le dossier 'dist'
# Déployer le contenu de 'dist' sur votre serveur web
```

## 🐛 Résolution des Problèmes

### **Problème 1 : Port déjà utilisé**
```bash
# Erreur : Port 5173 already in use
# Solution : Changer le port dans vite.config.ts
# Ou tuer le processus utilisant le port
lsof -ti:5173 | xargs kill -9  # Linux/macOS
netstat -ano | findstr :5173   # Windows
```

### **Problème 2 : Erreur de dépendances**
```bash
# Erreur : Cannot find module
# Solution : Réinstaller les dépendances
rm -rf node_modules package-lock.json
npm install
```

### **Problème 3 : Erreur de compilation TypeScript**
```bash
# Erreur : TypeScript compilation failed
# Solution : Vérifier la version de TypeScript
npm install typescript@latest
npm run build
```

### **Problème 4 : Erreur de base de données**
```bash
# Erreur : Cannot start JSON Server
# Solution : Vérifier le fichier db.json
ls -la db/db.json
# Si absent, créer un fichier db.json vide
echo '{}' > db/db.json
```

## 📊 Vérification de l'Installation

### **Script de vérification automatique**
```bash
# Créer un script de test
cat > test-installation.js << 'EOF'
const { exec } = require('child_process');

console.log('🧪 Test d\'installation MIMAA Web...\n');

// Test 1: Vérifier Node.js
exec('node --version', (error, stdout) => {
  if (error) {
    console.error('❌ Node.js non installé');
    return;
  }
  console.log('✅ Node.js:', stdout.trim());
});

// Test 2: Vérifier npm
exec('npm --version', (error, stdout) => {
  if (error) {
    console.error('❌ npm non installé');
    return;
  }
  console.log('✅ npm:', stdout.trim());
});

// Test 3: Vérifier les dépendances
exec('npm list --depth=0', (error, stdout) => {
  if (error) {
    console.error('❌ Dépendances manquantes');
    return;
  }
  console.log('✅ Dépendances installées');
});

console.log('\n🎉 Installation vérifiée !');
EOF

# Exécuter le test
node test-installation.js
```

## 🚀 Commandes Rapides

### **Développement**
```bash
npm run dev          # Démarrer l'application
npm run db           # Démarrer la base de données
npm run dev:full     # Démarrer les deux
npm run build        # Build de production
npm run preview      # Prévisualiser la build
```

### **Maintenance**
```bash
npm run lint         # Vérifier le code
npm test             # Exécuter les tests
npm run test:ui      # Interface de test
npm run test:coverage # Couverture de test
```

### **Nettoyage**
```bash
rm -rf node_modules  # Supprimer les dépendances
rm package-lock.json # Supprimer le lock file
npm cache clean --force # Nettoyer le cache
```

## 📱 Test sur Mobile

### **1. Via ngrok (recommandé)**
```bash
# 1. Démarrer l'application
npm run dev:full

# 2. Exposer avec ngrok
ngrok http 5173

# 3. Utiliser l'URL ngrok sur votre mobile
# Exemple : https://abc123.ngrok-free.app
```

### **2. Via réseau local**
```bash
# 1. Trouver votre adresse IP
ipconfig  # Windows
ifconfig  # Linux/macOS

# 2. Modifier vite.config.ts
# Ajouter : host: '0.0.0.0'

# 3. Accéder via : http://VOTRE_IP:5173
```

## ✅ Checklist d'Installation

- [ ] Node.js 18+ installé
- [ ] npm installé
- [ ] Git installé
- [ ] Projet cloné
- [ ] Dépendances installées (`npm install`)
- [ ] Base de données démarrée (`npm run db`)
- [ ] Application démarrée (`npm run dev`)
- [ ] Interface accessible sur http://localhost:5173
- [ ] API accessible sur http://localhost:3001
- [ ] Test de connexion/inscription réussi

## 🆘 Support

### **En cas de problème :**
1. Vérifier la console pour les erreurs
2. Consulter les logs du serveur
3. Vérifier la version de Node.js
4. Réinstaller les dépendances
5. Ouvrir une issue sur GitHub

### **Logs utiles :**
```bash
# Logs de l'application
npm run dev 2>&1 | tee app.log

# Logs de la base de données
npm run db 2>&1 | tee db.log
```

---

**🎉 Félicitations ! Votre application MIMAA Web est maintenant prête à fonctionner !**
