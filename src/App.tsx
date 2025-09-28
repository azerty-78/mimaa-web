import MainLayout from './layouts/MainLayout';
import { NavigationProvider } from './contexts/NavigationContext';
import { AuthProvider } from './hooks/useAuth';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <NavigationProvider>
        <MainLayout />
      </NavigationProvider>
    </AuthProvider>
  );
}

export default App;
