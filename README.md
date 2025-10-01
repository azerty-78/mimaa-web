# MIMAA Web - Application Mobile de Santé Maternelle

Une application web responsive conçue pour les femmes enceintes, les médecins et les administrateurs dans le domaine de la santé maternelle.

## 🚀 Fonctionnalités Opérationnelles

### 🔐 Authentification & Sécurité
- **Page de connexion** avec email et mot de passe
- **Page d'inscription** avec formulaire complet et validation
- **Connexion Google** (interface prête)
- **Gestion des sessions** avec localStorage sécurisé
- **Redirection automatique** vers la page d'accueil après connexion
- **Déconnexion sécurisée** avec nettoyage des données
- **Protection des routes** - accès restreint aux utilisateurs connectés

### 👤 Gestion des Profils & Utilisateurs
- **Types de profils** : Femme enceinte, Médecin, Administrateur
- **Photo de profil** optionnelle (conversion base64, validation taille/type)
- **Informations personnelles** complètes
- **Affichage dynamique** dans le TopBar et modales
- **Assignation automatique** de médecins aux femmes enceintes
- **Gestion des relations** médecin-patient

### 🤖 Intelligence Artificielle & Chatbot
- **Coach IA nutritionnel** spécialisé pour les femmes enceintes
- **Modèle Gemini 2.5 Flash** de Google
- **Analyse d'images** pour conseils nutritionnels
- **Chat intelligent** avec historique de conversation
- **Conseils personnalisés** selon le trimestre de grossesse
- **Support multilingue** (français)
- **Gestion d'erreurs** robuste avec retry automatique

### 🏥 Gestion Médicale
- **Dossiers de grossesse** complets
- **Suivi des rendez-vous** médicaux
- **Paramètres médicaux** (tension, glycémie, etc.)
- **Symptômes et médicaments** tracking
- **Nutrition personnalisée** avec objectifs
- **Échographies** et examens
- **Notes médicales** personnalisées

### 🎨 Interface Utilisateur & Expérience
- **Design responsive** optimisé pour mobile
- **TopBar fixe** avec profil utilisateur et notifications
- **BottomBar fixe** avec navigation principale
- **Animations fluides** entre les pages
- **Thème moderne** avec Tailwind CSS
- **Mode sombre** (en développement)
- **Indicateur de statut réseau** en temps réel
- **Gestion d'erreurs** avec messages utilisateur

### 📱 Pages & Navigation
- **Page d'accueil** avec campagnes de santé
- **Tableaux de bord** spécialisés par profil
- **Chat IA Coach** pour conseils nutritionnels
- **Chat médecin** pour consultations
- **Communauté** pour échanges entre utilisateurs
- **Profil utilisateur** avec édition complète
- **Paramètres** de l'application
- **Connexion/Inscription** sécurisées

### 🗄️ Base de Données & API
- **JSON Server** pour l'API de développement
- **Utilisateurs** avec gestion complète des profils
- **Campagnes** de sensibilisation santé
- **Dossiers de grossesse** détaillés
- **Rendez-vous** médicaux
- **Communautés** d'utilisateurs
- **Notifications** système
- **Cache intelligent** pour les performances

## 🛠️ Installation Rapide

### Prérequis
- **Node.js** 18+ (télécharger depuis [nodejs.org](https://nodejs.org/))
- **npm** 8+ (inclus avec Node.js)
- **Git** (télécharger depuis [git-scm.com](https://git-scm.com/))

### Installation en 3 étapes

```bash
# 1. Cloner le projet
git clone https://github.com/votre-username/mimaa-web.git
cd mimaa-web

# 2. Installer les dépendances
npm install

# 3. Démarrer l'application
npm run dev:full
```

### Accès à l'application
- **Application** : http://localhost:5173
- **API Base de données** : http://localhost:3001
- **Documentation API** : http://localhost:3001

> 📖 **Guide d'installation détaillé** : Voir [INSTALLATION-GUIDE.md](./INSTALLATION-GUIDE.md) pour une installation complète avec résolution des problèmes.

## 🔧 Configuration

### Variables d'environnement
```bash
# Créer un fichier .env (optionnel)
VITE_API_URL=http://localhost:3001
VITE_APP_NAME=MIMAA Web
GEMINI_API_KEY=AIzaSyAGyYDydVRJ5tkAkEoIHLVp6HpES3Of4cw
```

### Configuration Vite
Le fichier `vite.config.ts` est configuré pour :
- **Support ngrok** pour le partage local
- **Hot Module Replacement** (HMR) pour le développement
- **Build optimisé** pour la production
- **Proxy API** pour éviter les problèmes CORS
- **Support multi-plateforme** (Windows, macOS, Linux)

### Configuration Gemini AI
```typescript
// src/config/gemini.ts
export const GEMINI_CONFIG = {
  apiKey: 'AIzaSyAGyYDydVRJ5tkAkEoIHLVp6HpES3Of4cw',
  modelName: 'gemini-2.5-flash',
  generationConfig: {
    temperature: 0.7,
    maxOutputTokens: 1500,
    topP: 0.8,
    topK: 40
  }
};
```

### Configuration Tailwind
Le fichier `tailwind.config.js` inclut :
- **Configuration responsive** mobile-first
- **Classes personnalisées** pour l'application
- **Support des animations** fluides
- **Thème cohérent** avec Material Design

## 📁 Structure du Projet

```
src/
├── components/          # Composants réutilisables
│   ├── TopBar.tsx      # Barre de navigation supérieure
│   ├── BottomBar.tsx   # Barre de navigation inférieure
│   └── SlideTransition.tsx # Animation de transition
├── contexts/           # Contextes React
│   └── NavigationContext.tsx # Gestion de la navigation
├── hooks/              # Hooks personnalisés
│   └── useAuth.tsx     # Gestion de l'authentification
├── layouts/            # Layouts de pages
│   └── MainLayout.tsx  # Layout principal
├── pages/              # Pages de l'application
│   ├── HomePage.tsx    # Page d'accueil
│   ├── DashboardPage.tsx # Tableau de bord
│   ├── CommunityPage.tsx # Communauté
│   ├── ProfilePage.tsx # Profil utilisateur
│   ├── SettingsPage.tsx # Paramètres
│   ├── SignInPage.tsx  # Connexion
│   └── SignUpPage.tsx  # Inscription
├── services/           # Services API
│   └── api.ts          # Configuration API
└── utils/              # Utilitaires
```

## 🚀 Scripts Disponibles

- `npm run dev` - Démarre l'application de développement
- `npm run build` - Compile l'application pour la production
- `npm run preview` - Prévisualise la build de production
- `npm run lint` - Exécute le linter ESLint
- `npm run db` - Démarre le serveur JSON Server
- `npm run dev:full` - Démarre l'application et la base de données

## 🔒 Sécurité

- **Authentification obligatoire** : Accès restreint aux utilisateurs connectés
- **Validation des données** : Vérification des formulaires côté client
- **Gestion des sessions** : Stockage sécurisé des données utilisateur
- **Types de profils limités** : Seuls "Femme enceinte" et "Médecin" peuvent s'inscrire

## 📱 Responsive Design

L'application est entièrement responsive et optimisée pour :
- **Mobile** (priorité)
- **Tablette**
- **Desktop** (compatible)

## 🎯 Technologies Utilisées

- **React 18** avec TypeScript
- **Vite** pour le build et le développement
- **Tailwind CSS** pour le styling
- **Material-UI Icons** pour les icônes
- **JSON Server** pour l'API de développement
- **React Context API** pour la gestion d'état
- **React Hooks** pour la logique des composants

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit les changements (`git commit -m 'Ajouter nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

Pour toute question ou problème, veuillez ouvrir une issue sur le repository GitHub.

---

**Développé avec ❤️ pour la santé maternelle**