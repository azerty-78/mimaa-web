# MIMAA Web - Application Mobile de Santé Maternelle

Une application web responsive conçue pour les femmes enceintes, les médecins et les administrateurs dans le domaine de la santé maternelle.

## 🚀 Fonctionnalités Opérationnelles

### 🔐 Authentification
- **Page de connexion** avec email et mot de passe
- **Page d'inscription** avec formulaire complet
- **Connexion Google** (interface prête)
- **Gestion des sessions** avec localStorage
- **Redirection automatique** vers la page de connexion si non authentifié
- **Déconnexion sécurisée**

### 👤 Gestion des Profils
- **Types de profils** : Femme enceinte, Médecin
- **Photo de profil** optionnelle (conversion base64, validation taille/type)
- **Informations personnelles** : nom, email, type de profil
- **Affichage dynamique** dans le TopBar et modales

### 🎨 Interface Utilisateur
- **Design responsive** optimisé pour mobile
- **TopBar fixe** avec profil utilisateur et notifications
- **BottomBar fixe** avec navigation principale
- **Animations fluides** entre les pages
- **Thème moderne** avec Tailwind CSS

### 📱 Pages Disponibles
- **Page d'accueil** (Home)
- **Tableau de bord** (Dashboard)
- **Communauté** (Community)
- **Profil utilisateur** (Profile)
- **Paramètres** (Settings)
- **Connexion** (SignIn)
- **Inscription** (SignUp)

### 🗄️ Base de Données
- **JSON Server** pour l'API de développement
- **Utilisateurs** avec gestion complète des profils
- **Campagnes** de sensibilisation
- **Communautés** d'utilisateurs
- **Notifications** système

## 🛠️ Installation

### Prérequis
- **Node.js** (version 18 ou supérieure)
- **npm** ou **yarn**
- **Git**

### Étapes d'installation

1. **Cloner le repository**
   ```bash
   git clone <url-du-repository>
   cd mimaa-web
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Démarrer la base de données JSON Server**
   ```bash
   npm run db
   ```
   *Cette commande démarre le serveur de base de données sur le port 3001*

4. **Démarrer l'application de développement**
   ```bash
   npm run dev
   ```
   *Cette commande démarre l'application sur le port 5173*

5. **Démarrer les deux serveurs simultanément** (optionnel)
   ```bash
   npm run dev:full
   ```
   *Cette commande démarre à la fois l'application et la base de données*

### Accès à l'application
- **Application** : http://localhost:5173
- **API Base de données** : http://localhost:3001
- **Documentation API** : http://localhost:3001 (interface JSON Server)

## 🔧 Configuration

### Variables d'environnement
Aucune configuration d'environnement n'est requise pour le développement local.

### Configuration Vite
Le fichier `vite.config.ts` est configuré pour :
- Support des hôtes ngrok pour le partage
- Hot Module Replacement (HMR)
- Build optimisé pour la production

### Configuration Tailwind
Le fichier `tailwind.config.js` inclut :
- Configuration responsive
- Classes personnalisées
- Support des animations

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