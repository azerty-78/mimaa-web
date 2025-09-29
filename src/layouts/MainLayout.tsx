import React, { useEffect, Suspense, lazy, memo } from 'react';
import TopBar from '../components/TopBar';
import BottomBar from '../components/BottomBar';
import { useNavigation } from '../contexts/NavigationContext';
import { useAuth } from '../hooks/useAuth';

// Lazy loading des pages pour optimiser les performances
const HomePage = lazy(() => import('../pages/HomePage'));
const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const AdminDashboardPage = lazy(() => import('../pages/AdminDashboardPage'));
const PregnancyDashboardPage = lazy(() => import('../pages/PregnancyDashboardPage'));
const CommunityPage = lazy(() => import('../pages/CommunityPage'));
const SettingsPage = lazy(() => import('../pages/SettingsPage'));
const ProfilePage = lazy(() => import('../pages/ProfilePage'));
const SignInPage = lazy(() => import('../pages/SignInPage'));
const SignUpPage = lazy(() => import('../pages/SignUpPage'));
const AICoachChatPage = lazy(() => import('../pages/AICoachChatPage'));
const DoctorChatPage = lazy(() => import('../pages/DoctorChatPage'));
const CommunityChatPage = lazy(() => import('../pages/CommunityChatPage'));

const MainLayout: React.FC = memo(() => {
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
    
    const LoadingSpinner = () => (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );

    switch (activeTab) {
      case 'home':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <HomePage />
          </Suspense>
        );
      case 'dashboard': {
        const auth = useAuth();
        return (
          <Suspense fallback={<LoadingSpinner />}>
            {auth.user?.profileType === 'administrator' ? (
              <AdminDashboardPage />
            ) : auth.user?.profileType === 'pregnant_woman' ? (
              <PregnancyDashboardPage />
            ) : (
              <DashboardPage />
            )}
          </Suspense>
        );
      }
      case 'admin-dashboard':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <AdminDashboardPage />
          </Suspense>
        );
      case 'community':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <CommunityPage />
          </Suspense>
        );
      case 'settings':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <SettingsPage />
          </Suspense>
        );
      case 'profile':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <ProfilePage />
          </Suspense>
        );
      case 'signin':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <SignInPage />
          </Suspense>
        );
      case 'signup':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <SignUpPage />
          </Suspense>
        );
      case 'chat-ai-coach':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <AICoachChatPage />
          </Suspense>
        );
      case 'chat-doctor':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <DoctorChatPage />
          </Suspense>
        );
      case 'chat-community':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <CommunityChatPage />
          </Suspense>
        );
      case 'pregnant-dashboard':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <PregnancyDashboardPage />
          </Suspense>
        );
      default:
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <HomePage />
          </Suspense>
        );
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

  // Pages sans barres (connexion/inscription/chat/pregnant-dashboard)
  const isAuthPage = activeTab === 'signin' || activeTab === 'signup';
  const isChatPage = activeTab.startsWith('chat-');
  const isFullScreenPage = isAuthPage || isChatPage || activeTab === 'pregnant-dashboard';

  if (isFullScreenPage) {
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
        <div className="page-enter-active">
          {renderPage()}
        </div>
      </main>
      
      {/* BottomBar - Fixe en bas */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <BottomBar activeTab={activeTab} onTabChange={navigateTo} />
      </div>
    </div>
  );
});

MainLayout.displayName = 'MainLayout';

export default MainLayout;

