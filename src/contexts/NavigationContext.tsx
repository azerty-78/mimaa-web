import React, { createContext, useContext, useState, type ReactNode } from 'react';

interface NavigationContextType {
  activeTab: string;
  navigateTo: (tab: string) => void;
  navigateToSignIn: () => void;
  navigateToSignUp: () => void;
  navigateToHome: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

interface NavigationProviderProps {
  children: ReactNode;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState('home');

  const navigateTo = (tab: string) => {
    console.log('Navigation vers:', tab);
    setActiveTab(tab);
  };

  const navigateToSignIn = () => {
    console.log('Navigation vers SignIn');
    setActiveTab('signin');
  };

  const navigateToSignUp = () => {
    console.log('Navigation vers SignUp');
    setActiveTab('signup');
  };

  const navigateToHome = () => {
    console.log('Navigation vers Home');
    setActiveTab('home');
  };

  return (
    <NavigationContext.Provider
      value={{
        activeTab,
        navigateTo,
        navigateToSignIn,
        navigateToSignUp,
        navigateToHome,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};
