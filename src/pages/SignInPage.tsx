import React, { useState } from 'react';
import { Mail, Lock, Visibility, VisibilityOff, LocalHospital, PregnantWoman, Security } from '@mui/icons-material';
import { useNavigation } from '../contexts/NavigationContext';
import { useAuth } from '../hooks/useAuth';
import SlideTransition from '../components/SlideTransition';
import MimaaLogo from '../components/MimaaLogo';

const SignInPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { navigateToSignUp, navigateTo } = useNavigation();
  const { login } = useAuth();

  const handleNavigateToSignUp = () => {
    console.log('Navigation vers SignUp...');
    navigateToSignUp();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const success = await login(email, password);
      if (success) {
        // Après login, router vers dashboard qui choisit la page suivant le profileType
        navigateTo('dashboard');
      } else {
        setError('Email ou mot de passe incorrect');
      }
    } catch (error) {
      setError('Erreur lors de la connexion. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    // Ici vous pouvez ajouter la logique de connexion Google
    console.log('Connexion avec Google');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex">
      {/* Section gauche - Présentation de l'application */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 p-12 flex-col justify-center relative overflow-hidden">
        {/* Éléments décoratifs de fond */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-pink-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-32 right-20 w-24 h-24 bg-purple-200 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-blue-200 rounded-full opacity-25 animate-pulse"></div>
        <div className="absolute bottom-32 right-10 w-20 h-20 bg-pink-300 rounded-full opacity-30 animate-bounce"></div>
        
        <div className="relative z-10">
          {/* Logo et nom de l'application */}
          <div className="mb-8">
            <MimaaLogo size="xl" showText={true} />
          </div>
          
          {/* Présentation de l'application */}
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-gray-800 leading-tight">
              Accompagnement personnalisé pour votre grossesse
            </h2>
            
            <p className="text-xl text-gray-600 leading-relaxed">
              MIMA'A est votre compagnon de confiance pour suivre chaque étape de votre grossesse 
              avec sérénité et professionnalisme.
            </p>
            
            {/* Fonctionnalités principales */}
            <div className="grid grid-cols-1 gap-4 mt-8">
              <div className="flex items-center space-x-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl">
                <div className="p-3 bg-pink-100 rounded-full">
                  <PregnantWoman className="w-6 h-6 text-pink-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Suivi médical complet</h3>
                  <p className="text-sm text-gray-600">Consultations, échographies et paramètres vitaux</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl">
                <div className="p-3 bg-purple-100 rounded-full">
                  <LocalHospital className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Connexion avec les médecins</h3>
                  <p className="text-sm text-gray-600">Communication directe avec votre équipe médicale</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Security className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Données sécurisées</h3>
                  <p className="text-sm text-gray-600">Vos informations médicales sont protégées</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section droite - Formulaire de connexion */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <SlideTransition direction="left" isVisible={true}>
          <div className="w-full max-w-md">
            {/* Header mobile */}
            <div className="lg:hidden text-center mb-8">
              <MimaaLogo size="lg" showText={true} />
              <p className="text-gray-600 text-sm mt-4">
                Votre compagnon de grossesse
              </p>
            </div>

            {/* Card de connexion */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Connexion</h1>
                <p className="text-gray-600">Accédez à votre espace personnel</p>
              </div>

              {/* Message d'erreur */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-6">
                  {error}
                </div>
              )}

              {/* Formulaire de connexion */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-gray-50/50 backdrop-blur-sm"
                      placeholder="votre@email.com"
                      required
                    />
                  </div>
                </div>

                {/* Mot de passe */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-gray-50/50 backdrop-blur-sm"
                      placeholder="Votre mot de passe"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    >
                      {showPassword ? (
                        <VisibilityOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Visibility className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Mot de passe oublié */}
                <div className="text-right">
                  <button
                    type="button"
                    className="text-sm text-pink-600 hover:text-pink-800 font-medium"
                  >
                    Mot de passe oublié ?
                  </button>
                </div>

                {/* Bouton de connexion */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-pink-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Connexion...</span>
                    </div>
                  ) : (
                    'Se connecter'
                  )}
                </button>
              </form>

              {/* Diviseur */}
              <div className="my-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">Ou</span>
                  </div>
                </div>
              </div>

              {/* Bouton Google */}
              <button
                onClick={handleGoogleSignIn}
                className="w-full bg-white border border-gray-200 text-gray-700 py-4 rounded-xl font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 flex items-center justify-center space-x-3 transition-all duration-200"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>Continuer avec Google</span>
              </button>

              {/* Lien vers inscription */}
              <div className="mt-8 text-center">
                <p className="text-sm text-gray-600">
                  Vous n'avez pas de compte ?{' '}
                  <button 
                    onClick={handleNavigateToSignUp}
                    className="text-pink-600 hover:text-pink-800 font-semibold transition-colors"
                  >
                    Créer un compte
                  </button>
                </p>
              </div>
            </div>
          </div>
        </SlideTransition>
      </div>
    </div>
  );
};

export default SignInPage;
