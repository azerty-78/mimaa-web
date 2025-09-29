import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock pour window
Object.defineProperty(window, 'location', {
  value: {
    hostname: 'localhost',
    protocol: 'http:',
    port: '3000'
  },
  writable: true
})

// Mock pour localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Mock pour les APIs
globalThis.fetch = vi.fn()

// Mock pour les modules
vi.mock('../services/geminiService', () => ({
  geminiService: {
    generateContent: vi.fn().mockResolvedValue('Réponse de test du coach IA'),
    chatWithAI: vi.fn().mockResolvedValue('Réponse de chat de test')
  }
}))

// Mock pour le contexte de navigation
vi.mock('../contexts/NavigationContext', () => ({
  useNavigation: () => ({
    activeTab: 'home',
    navigateTo: vi.fn(),
    navigateToSignIn: vi.fn()
  })
}))

// Mock pour le hook d'authentification
vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    user: {
      id: '1',
      username: 'testuser',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      phone: '+237123456789',
      region: 'Centre',
      profileType: 'pregnant_woman',
      profileImage: null
    },
    isAuthenticated: true,
    isLoading: false,
    login: vi.fn(),
    logout: vi.fn(),
    updateProfile: vi.fn()
  })
}))
