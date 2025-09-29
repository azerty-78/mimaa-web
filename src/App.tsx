import MainLayout from './layouts/MainLayout';
import { NavigationProvider } from './contexts/NavigationContext';
import { AuthProvider } from './hooks/useAuth';
import { ToastProvider } from './components/ToastProvider';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <NavigationProvider>
        <ToastProvider>
          <MainLayout />
        </ToastProvider>
      </NavigationProvider>
    </AuthProvider>
  );
}

export default App;
