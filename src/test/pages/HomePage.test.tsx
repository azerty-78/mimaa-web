import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import HomePage from '../../pages/HomePage'

describe('HomePage Component', () => {
  it('renders page title and description', () => {
    render(<HomePage />)
    
    expect(screen.getByText('Actualités Santé')).toBeInTheDocument()
    expect(screen.getByText('Restez informé des dernières campagnes et initiatives')).toBeInTheDocument()
  })

  it('displays health campaign posts', () => {
    render(<HomePage />)
    
    expect(screen.getByText('Campagne de santé centre Pasteur')).toBeInTheDocument()
    expect(screen.getByText('JOURNÉES NATIONALES DE VACCINATION')).toBeInTheDocument()
  })

  it('shows post statistics', () => {
    render(<HomePage />)
    
    expect(screen.getByText('124')).toBeInTheDocument() // Likes
    expect(screen.getByText('23')).toBeInTheDocument()  // Comments
    expect(screen.getByText('8')).toBeInTheDocument()   // Shares
  })

  it('displays call to action section', () => {
    render(<HomePage />)
    
    expect(screen.getByText('Rejoignez notre communauté')).toBeInTheDocument()
    expect(screen.getByText('Participer')).toBeInTheDocument()
  })

  it('has proper post structure', () => {
    render(<HomePage />)
    
    // Vérifier la structure des posts
    const posts = screen.getAllByText(/Campagne|JOURNÉES/)
    expect(posts).toHaveLength(2)
  })

  it('shows verified badges for official posts', () => {
    render(<HomePage />)
    
    // Les badges de vérification devraient être présents
    const verifiedIcons = document.querySelectorAll('[data-testid="verified-icon"]')
    expect(verifiedIcons.length).toBeGreaterThan(0)
  })

  it('applies correct animations on load', async () => {
    render(<HomePage />)
    
    // Attendre que les animations se déclenchent
    await waitFor(() => {
      const header = screen.getByText('Actualités Santé')
      expect(header).toHaveClass('opacity-100')
    })
  })
})
