import React, { useState } from 'react';
import { Mail, Lock, Person, Visibility, VisibilityOff, ArrowBack, CameraAlt, LocalHospital, PregnantWoman, Security } from '@mui/icons-material';
import { useNavigation } from '../contexts/NavigationContext';
import { useAuth } from '../hooks/useAuth';
import { assignRandomDoctor } from '../services/api';
import SlideTransition from '../components/SlideTransition';
import MimaaLogo from '../components/MimaaLogo';

const SignUpPage: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    profileType: '',
    profileImage: null as File | null
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [assignedDoctor, setAssignedDoctor] = useState<string | null>(null);
  const { navigateToSignIn, navigateToHome } = useNavigation();
  const { register } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Vérifier la taille du fichier (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('La taille de l\'image ne doit pas dépasser 5MB');
        return;
      }
      
      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        setError('Veuillez sélectionner un fichier image valide');
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        profileImage: file
      }));
      setError(''); // Effacer les erreurs précédentes
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Validation des mots de passe
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setIsLoading(false);
      return;
    }
    
    // Validation du type de profil
    if (!formData.profileType) {
      setError('Veuillez sélectionner un type de profil');
      setIsLoading(false);
      return;
    }
    
    try {
      // Convertir l'image en base64 si elle existe
      let profileImageBase64 = null;
      if (formData.profileImage) {
        profileImageBase64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(formData.profileImage!);
        });
      }
      
      const userData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        profileType: formData.profileType as 'pregnant_woman' | 'doctor',
        profileImage: profileImageBase64,
        firstName: formData.username.split(' ')[0] || '',
        lastName: formData.username.split(' ').slice(1).join(' ') || '',
        phone: '',
        region: '',
        isActive: true,
      };
      
      const success = await register(userData);
      if (success) {
        // Si c'est une femme enceinte, assigner automatiquement un médecin
        if (formData.profileType === 'pregnant_woman') {
          try {
            // Attendre un peu pour que l'utilisateur soit créé et stocké
            setTimeout(async () => {
              try {
                const doctorRelation = await assignRandomDoctor(); // L'ID sera récupéré automatiquement
                if (doctorRelation) {
                  setAssignedDoctor('Un médecin vous a été assigné automatiquement !');
                }
              } catch (error) {
                console.warn('Erreur lors de l\'assignation du médecin:', error);
              }
            }, 1000);
          } catch (error) {
            console.warn('Erreur lors de l\'assignation du médecin:', error);
            // Ne pas bloquer l'inscription si l'assignation échoue
          }
        }
        navigateToHome();
      } else {
        setError('Erreur lors de la création du compte. Veuillez réessayer.');
      }
    } catch (error) {
      setError('Erreur lors de l\'inscription. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    // Ici vous pouvez ajouter la logique d'inscription Google
    console.log('Inscription avec Google');
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
              Rejoignez la communauté MIMA'A
            </h2>
            
            <p className="text-xl text-gray-600 leading-relaxed">
              Créez votre compte et commencez votre parcours de suivi de grossesse 
              avec l'accompagnement de professionnels de santé qualifiés.
            </p>
            
            {/* Fonctionnalités principales */}
            <div className="grid grid-cols-1 gap-4 mt-8">
              <div className="flex items-center space-x-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl">
                <div className="p-3 bg-pink-100 rounded-full">
                  <PregnantWoman className="w-6 h-6 text-pink-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Suivi personnalisé</h3>
                  <p className="text-sm text-gray-600">Adapté à votre profil et vos besoins</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl">
                <div className="p-3 bg-purple-100 rounded-full">
                  <LocalHospital className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Équipe médicale</h3>
                  <p className="text-sm text-gray-600">Médecins et professionnels à votre service</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Security className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Confidentialité</h3>
                  <p className="text-sm text-gray-600">Vos données sont protégées et sécurisées</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section droite - Formulaire d'inscription */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <SlideTransition direction="right" isVisible={true}>
          <div className="w-full max-w-md">
            {/* Header mobile */}
            <div className="lg:hidden text-center mb-8">
              <MimaaLogo size="lg" showText={true} />
              <p className="text-gray-600 text-sm mt-4">
                Votre compagnon de grossesse
              </p>
            </div>

            {/* Card d'inscription */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
              {/* Header avec bouton retour */}
              <div className="flex items-center mb-8">
                <button
                  onClick={navigateToSignIn}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ArrowBack className="h-5 w-5 text-gray-600" />
                </button>
                <div className="flex-1 text-center">
                  <h1 className="text-3xl font-bold text-gray-800">Créer un compte</h1>
                  <p className="text-gray-600">Rejoignez-nous dès aujourd'hui</p>
                </div>
                <div className="w-9"></div> {/* Spacer pour centrer le titre */}
              </div>

              {/* Message d'erreur */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-6">
                  {error}
                </div>
              )}

              {/* Formulaire d'inscription */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Photo de profil */}
                <div className="text-center">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Photo de profil (optionnel)
                  </label>
                  <div className="relative inline-block">
                    <div className="w-20 h-20 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                      {formData.profileImage ? (
                        <img
                          src={URL.createObjectURL(formData.profileImage)}
                          alt="Photo de profil"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <CameraAlt className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Nom d'utilisateur */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom d'utilisateur
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Person className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-gray-50/50 backdrop-blur-sm"
                      placeholder="Votre nom d'utilisateur"
                      required
                    />
                  </div>
                </div>

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
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
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
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Votre mot de passe"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <VisibilityOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Visibility className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirmation mot de passe */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Confirmer le mot de passe"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <VisibilityOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Visibility className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Profil de l'utilisateur */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profil de l'utilisateur
              </label>
              <select
                name="profileType"
                value={formData.profileType}
                onChange={handleInputChange}
                className="w-full py-3 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Sélectionnez votre profil</option>
                <option value="pregnant_woman">Femme enceinte</option>
                <option value="doctor">Médecin</option>
              </select>
              
              {/* Message d'information pour les femmes enceintes */}
              {formData.profileType === 'pregnant_woman' && (
                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <LocalHospital className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium">Assignation automatique d'un médecin</p>
                      <p className="text-blue-600">
                        Un médecin sera automatiquement assigné à votre compte pour vous accompagner pendant votre grossesse.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bouton d'inscription */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-pink-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
            >
              {isLoading ? 'Création du compte...' : 'Créer le compte'}
            </button>
          </form>

          {/* Diviseur */}
          <div className="my-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Ou</span>
              </div>
            </div>
          </div>

          {/* Bouton Google */}
          <button
            onClick={handleGoogleSignUp}
            className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center space-x-2"
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
            <span>S'inscrire avec Google</span>
          </button>

          {/* Lien vers connexion */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Vous avez déjà un compte ?{' '}
              <button 
                onClick={navigateToSignIn}
                className="text-pink-600 hover:text-pink-800 font-semibold transition-colors"
              >
                Se connecter
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

export default SignUpPage;
