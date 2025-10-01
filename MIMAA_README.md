# 🌸 MIMA'A - Application de Suivi de Grossesse

## 🎯 Présentation

MIMA'A est une application moderne et intuitive dédiée au suivi des femmes enceintes durant leur grossesse. L'application offre un accompagnement personnalisé avec une interface élégante et des fonctionnalités complètes.

## ✨ Fonctionnalités Principales

### 👩‍⚕️ Pour les Femmes Enceintes
- **Suivi médical complet** : Consultations, échographies et paramètres vitaux
- **Interface intuitive** : Design moderne et responsive
- **Données sécurisées** : Protection totale de vos informations médicales
- **Communication directe** : Échange avec votre équipe médicale

### 👨‍⚕️ Pour les Médecins
- **Dashboard complet** : Vue d'ensemble de tous vos patients
- **Gestion des dossiers** : Dossiers médicaux, prescriptions et contacts d'urgence
- **Profil professionnel** : Informations détaillées (spécialité, expérience, certifications)
- **CRUD complet** : Gestion des informations professionnelles

### 🔐 Sécurité
- **Authentification sécurisée** : Connexion et inscription protégées
- **Données chiffrées** : Protection des informations sensibles
- **Déconnexion automatique** : En cas de redémarrage du serveur

## 🚀 Démarrage Rapide

### Prérequis
- Node.js (version 18 ou supérieure)
- npm ou yarn

### Installation
```bash
# Cloner le projet
git clone [url-du-repo]
cd mimaa-web

# Installer les dépendances
npm install

# Démarrer l'application
npm run start-app
```

### Scripts Disponibles
- `npm run dev` : Démarre l'application React
- `npm run db` : Démarre le serveur JSON
- `npm run start-app` : Démarre tout l'écosystème

## 🎨 Design et Interface

### Page de Connexion
- **Logo personnalisé** : Design unique avec mère et enfant
- **Présentation complète** : Description des fonctionnalités
- **Design responsive** : Adapté mobile et desktop
- **Animations fluides** : Transitions et effets visuels

### Page d'Inscription
- **Formulaire complet** : Tous les champs nécessaires
- **Validation en temps réel** : Vérification des données
- **Assignation automatique** : Médecin assigné automatiquement
- **Interface cohérente** : Même design que la page de connexion

## 🏗️ Architecture Technique

### Frontend
- **React 18** avec TypeScript
- **Tailwind CSS** pour le styling
- **Material-UI Icons** pour les icônes
- **Context API** pour la gestion d'état

### Backend
- **JSON Server** personnalisé
- **API REST** complète
- **Endpoints sécurisés**
- **Détection de redémarrage**

### Base de Données
- **db.json** : Données mockées
- **Relations** : Médecins, patients, dossiers médicaux
- **Données réalistes** : Exemples complets

## 📱 Pages et Fonctionnalités

### Pages Principales
1. **Connexion** (`/signin`) - Interface d'authentification
2. **Inscription** (`/signup`) - Création de compte
3. **Dashboard** (`/dashboard`) - Tableau de bord principal
4. **Profil** (`/profile`) - Gestion du profil utilisateur
5. **Paramètres** (`/settings`) - Configuration de l'application

### Fonctionnalités Avancées
- **CRUD complet** pour les informations professionnelles
- **Upload d'images** de profil
- **Gestion des relations** médecin-patient
- **Dossiers médicaux** complets
- **Prescriptions** et contacts d'urgence

## 🔧 Configuration

### Variables d'Environnement
```env
VITE_API_URL=http://localhost:3001
VITE_APP_NAME=MIMA'A
```

### Ports par Défaut
- **Frontend** : http://localhost:5173
- **Backend** : http://localhost:3001

## 🎯 Utilisateurs de Test

### Médecins
- **Dr Djeff Djadi Leteta** (Pédiatrie)
- **Dr Sarah Manga** (Gynécologie-Obstétrique)

### Patients
- **Marie Hélène** (Femme enceinte)

### Administrateur
- **Admin System** (Gestion globale)

## 🚀 Déploiement

### Production
```bash
# Build de production
npm run build

# Serveur de production
npm run preview
```

### Développement
```bash
# Mode développement
npm run dev

# Serveur JSON
npm run db
```

## 📞 Support

Pour toute question ou problème :
- **Email** : support@mimaa.com
- **Documentation** : Voir les commentaires dans le code
- **Issues** : Utiliser le système de tickets

## 🎉 Conclusion

MIMA'A est une application complète et moderne pour le suivi de grossesse, offrant une expérience utilisateur exceptionnelle et des fonctionnalités avancées pour tous les acteurs du processus médical.

---

**MIMA'A** - Votre compagnon de confiance pour une grossesse sereine 🌸
