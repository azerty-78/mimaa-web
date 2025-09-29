import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import TopBar from '../../components/TopBar'

// Mock du hook useAuth
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

vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({
    user: mockUser,
    logout: vi.fn()
  })
}))

describe('TopBar Component', () => {
  it('renders user information correctly', () => {
    render(<TopBar />)
    
    expect(screen.getByText('Salut!')).toBeInTheDocument()
    expect(screen.getByText('testuser')).toBeInTheDocument()
  })

  it('displays search and notification icons', () => {
    render(<TopBar />)
    
    // Vérifier que les icônes sont présentes
    const searchButton = screen.getByRole('button', { name: /search/i })
    const notificationButton = screen.getByRole('button', { name: /notifications/i })
    
    expect(searchButton).toBeInTheDocument()
    expect(notificationButton).toBeInTheDocument()
  })

  it('opens profile modal when user profile is clicked', () => {
    render(<TopBar />)
    
    const profileButton = screen.getByText('Salut!')
    fireEvent.click(profileButton)
    
    expect(screen.getByText('testuser')).toBeInTheDocument()
    expect(screen.getByText('test@example.com')).toBeInTheDocument()
  })

  it('closes profile modal when close button is clicked', () => {
    render(<TopBar />)
    
    // Ouvrir le modal
    const profileButton = screen.getByText('Salut!')
    fireEvent.click(profileButton)
    
    // Fermer le modal
    const closeButton = screen.getByRole('button', { name: /close/i })
    fireEvent.click(closeButton)
    
    // Le modal devrait être fermé
    expect(screen.queryByText('Se déconnecter')).not.toBeInTheDocument()
  })

  it('has proper accessibility attributes', () => {
    render(<TopBar />)
    
    const profileButton = screen.getByText('Salut!')
    expect(profileButton).toHaveAttribute('role', 'button')
  })
})
