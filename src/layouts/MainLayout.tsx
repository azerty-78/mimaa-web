import React, { useEffect } from 'react';
import TopBar from '../components/TopBar';
import BottomBar from '../components/BottomBar';
import HomePage from '../pages/HomePage';
import DashboardPage from '../pages/DashboardPage';
import CommunityPage from '../pages/CommunityPage';
import SettingsPage from '../pages/SettingsPage';
import ProfilePage from '../pages/ProfilePage';
import SignInPage from '../pages/SignInPage';
import SignUpPage from '../pages/SignUpPage';
import { useNavigation } from '../contexts/NavigationContext';
import { useAuth } from '../hooks/useAuth';

const MainLayout: React.FC = () => {
  const { activeTab, navigateTo, navigateToSignIn } = useNavigation();
  const { isAuthenticated, isLoading } = useAuth();

  // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié
  useEffect(() => {
    if (!isLoading && !isAuthenticated && activeTab !== 'signin' && activeTab !== 'signup') {
      console.log('Utilisateur non authentifié, redirection vers la page de connexion');
      navigateToSignIn();
    }
  }, [isAuthenticated, isLoading, activeTab, navigateToSignIn]);

  const handleLogout = () => {
    // Ici vous pouvez ajouter la logique de déconnexion
    // Par exemple : supprimer le token, rediriger vers la page de connexion, etc.
    console.log('Déconnexion...');
    navigateToSignIn();
  };

  const renderPage = () => {
    console.log('Rendu de la page:', activeTab);
    switch (activeTab) {
      case 'home':
        return <HomePage />;
      case 'dashboard':
        return <DashboardPage />;
      case 'community':
        return <CommunityPage />;
      case 'settings':
        return <SettingsPage />;
      case 'profile':
        return <ProfilePage />;
      case 'signin':
        return <SignInPage />;
      case 'signup':
        return <SignUpPage />;
      default:
        return <HomePage />;
    }
  };

  // Afficher un indicateur de chargement pendant la vérification de l'authentification
  if (isLoading) {
    return (
      <div className="h-screen w-full bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  // Pages sans barres (connexion/inscription)
  const isAuthPage = activeTab === 'signin' || activeTab === 'signup';

  if (isAuthPage) {
    return (
      <div className="h-screen w-full bg-gray-100">
        {renderPage()}
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col bg-gray-100 overflow-hidden m-0 p-0">
      {/* TopBar - Fixe en haut */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <TopBar onLogout={handleLogout} />
      </div>
      
      {/* Contenu principal - Scroll uniquement ici */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden pt-16 pb-16 m-0 p-0">
        {renderPage()}
      </main>
      
      {/* BottomBar - Fixe en bas */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <BottomBar activeTab={activeTab} onTabChange={navigateTo} />
      </div>
    </div>
  );
};

export default MainLayout;

