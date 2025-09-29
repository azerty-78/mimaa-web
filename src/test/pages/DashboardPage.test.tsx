import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import DashboardPage from '../../pages/DashboardPage'

describe('DashboardPage Component', () => {
  it('renders dashboard title and description', () => {
    render(<DashboardPage />)
    
    expect(screen.getByText('Tableau de bord')).toBeInTheDocument()
    expect(screen.getByText('Bienvenue dans votre espace de suivi médical')).toBeInTheDocument()
  })

  it('displays statistics cards', () => {
    render(<DashboardPage />)
    
    expect(screen.getByText('Consultations')).toBeInTheDocument()
    expect(screen.getByText('Utilisateurs')).toBeInTheDocument()
    expect(screen.getByText('Messages')).toBeInTheDocument()
    expect(screen.getByText('Campagnes')).toBeInTheDocument()
  })

  it('shows correct statistics values', () => {
    render(<DashboardPage />)
    
    expect(screen.getByText('1,234')).toBeInTheDocument()
    expect(screen.getByText('8,456')).toBeInTheDocument()
    expect(screen.getByText('2,345')).toBeInTheDocument()
    expect(screen.getByText('12')).toBeInTheDocument()
  })

  it('displays trend chart section', () => {
    render(<DashboardPage />)
    
    expect(screen.getByText('Tendances')).toBeInTheDocument()
    expect(screen.getByText('Croissance mensuelle')).toBeInTheDocument()
    expect(screen.getByText('+24%')).toBeInTheDocument()
  })

  it('shows activities summary', () => {
    render(<DashboardPage />)
    
    expect(screen.getByText('Résumé des activités')).toBeInTheDocument()
    expect(screen.getByText('Campagnes actives')).toBeInTheDocument()
    expect(screen.getByText('Utilisateurs inscrits')).toBeInTheDocument()
    expect(screen.getByText('Messages envoyés')).toBeInTheDocument()
    expect(screen.getByText('Centres de santé')).toBeInTheDocument()
  })

  it('applies hover effects to cards', () => {
    render(<DashboardPage />)
    
    const cards = screen.getAllByText(/Consultations|Utilisateurs|Messages|Campagnes/)
    cards.forEach(card => {
      const cardElement = card.closest('div')
      expect(cardElement).toHaveClass('hover:shadow-xl')
    })
  })

  it('animates elements on load', async () => {
    render(<DashboardPage />)
    
    await waitFor(() => {
      const header = screen.getByText('Tableau de bord')
      expect(header).toHaveClass('opacity-100')
    })
  })

  it('displays percentage changes for statistics', () => {
    render(<DashboardPage />)
    
    expect(screen.getByText('+12%')).toBeInTheDocument()
    expect(screen.getByText('+8%')).toBeInTheDocument()
    expect(screen.getByText('+15%')).toBeInTheDocument()
    expect(screen.getByText('+3')).toBeInTheDocument()
  })
})
