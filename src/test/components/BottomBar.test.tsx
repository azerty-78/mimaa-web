import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import BottomBar from '../../components/BottomBar'

describe('BottomBar Component', () => {
  const mockOnTabChange = vi.fn()

  const defaultProps = {
    activeTab: 'home',
    onTabChange: mockOnTabChange
  }

  it('renders all navigation tabs', () => {
    render(<BottomBar {...defaultProps} />)
    
    expect(screen.getByText('Accueil')).toBeInTheDocument()
    expect(screen.getByText('Tableau')).toBeInTheDocument()
    expect(screen.getByText('Communauté')).toBeInTheDocument()
    expect(screen.getByText('Paramètres')).toBeInTheDocument()
    expect(screen.getByText('Profil')).toBeInTheDocument()
  })

  it('highlights active tab correctly', () => {
    render(<BottomBar {...defaultProps} />)
    
    const homeTab = screen.getByText('Accueil')
    expect(homeTab).toHaveClass('text-blue-600')
  })

  it('calls onTabChange when tab is clicked', () => {
    render(<BottomBar {...defaultProps} />)
    
    const dashboardTab = screen.getByText('Tableau')
    fireEvent.click(dashboardTab)
    
    expect(mockOnTabChange).toHaveBeenCalledWith('dashboard')
  })

  it('applies correct styling to active tab', () => {
    render(<BottomBar {...defaultProps} />)
    
    const activeTab = screen.getByText('Accueil')
    const activeTabContainer = activeTab.closest('button')
    
    expect(activeTabContainer).toHaveClass('text-blue-600')
  })

  it('has proper accessibility attributes', () => {
    render(<BottomBar {...defaultProps} />)
    
    const tabs = screen.getAllByRole('button')
    tabs.forEach(tab => {
      expect(tab).toHaveAttribute('role', 'button')
    })
  })

  it('shows indicator for active tab', () => {
    render(<BottomBar {...defaultProps} />)
    
    // L'indicateur actif devrait être présent
    const activeIndicator = document.querySelector('.absolute.-top-1')
    expect(activeIndicator).toBeInTheDocument()
  })
})
