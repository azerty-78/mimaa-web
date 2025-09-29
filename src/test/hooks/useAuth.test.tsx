import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAuth } from '../../hooks/useAuth'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

describe('useAuth Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
  })

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useAuth())
    
    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.isLoading).toBe(true)
  })

  it('should load user from localStorage on mount', () => {
    const mockUser = {
      id: '1',
      username: 'testuser',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      phone: '+237123456789',
      region: 'Centre',
      profileType: 'pregnant_woman',
      profileImage: null
    }

    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockUser))

    const { result } = renderHook(() => useAuth())
    
    // Attendre que le chargement soit terminé
    act(() => {
      // Simuler la fin du chargement
    })

    expect(result.current.user).toEqual(mockUser)
    expect(result.current.isAuthenticated).toBe(true)
  })

  it('should login user successfully', () => {
    const { result } = renderHook(() => useAuth())
    
    const loginData = {
      username: 'testuser',
      password: 'password123'
    }

    act(() => {
      result.current.login(loginData)
    })

    expect(localStorageMock.setItem).toHaveBeenCalled()
    expect(result.current.isAuthenticated).toBe(true)
  })

  it('should logout user successfully', () => {
    const { result } = renderHook(() => useAuth())
    
    act(() => {
      result.current.logout()
    })

    expect(localStorageMock.removeItem).toHaveBeenCalled()
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.user).toBeNull()
  })

  it('should update user profile', () => {
    const { result } = renderHook(() => useAuth())
    
    const updatedData = {
      firstName: 'Updated',
      lastName: 'Name',
      phone: '+237987654321'
    }

    act(() => {
      result.current.updateProfile(updatedData)
    })

    expect(localStorageMock.setItem).toHaveBeenCalled()
  })

  it('should handle login errors', () => {
    const { result } = renderHook(() => useAuth())
    
    const invalidLoginData = {
      username: 'invalid',
      password: 'wrong'
    }

    act(() => {
      result.current.login(invalidLoginData)
    })

    // L'utilisateur ne devrait pas être connecté
    expect(result.current.isAuthenticated).toBe(false)
  })
})
