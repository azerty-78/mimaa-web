import { describe, it, expect, vi, beforeEach } from 'vitest'
import { geminiService } from '../../services/geminiService'

// Mock fetch global
global.fetch = vi.fn()

describe('GeminiService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('generateContent', () => {
    it('should generate content successfully', async () => {
      const mockResponse = {
        candidates: [{
          content: {
            parts: [{ text: 'Réponse de test du coach IA' }]
          }
        }]
      }

      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })

      const result = await geminiService.generateContent('Test prompt')
      
      expect(result).toBe('Réponse de test du coach IA')
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('generativelanguage.googleapis.com'),
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        })
      )
    })

    it('should handle API errors', async () => {
      ;(global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request'
      })

      await expect(geminiService.generateContent('Test prompt'))
        .rejects.toThrow('Erreur API Gemini: 400 - Bad Request')
    })

    it('should handle empty response', async () => {
      const mockResponse = {
        candidates: []
      }

      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })

      await expect(geminiService.generateContent('Test prompt'))
        .rejects.toThrow('Aucune réponse générée par Gemini')
    })

    it('should handle network errors', async () => {
      ;(global.fetch as any).mockRejectedValueOnce(new Error('Network error'))

      await expect(geminiService.generateContent('Test prompt'))
        .rejects.toThrow('Network error')
    })
  })

  describe('chatWithAI', () => {
    it('should handle chat conversation successfully', async () => {
      const mockMessages = [
        {
          role: 'user' as const,
          parts: [{ text: 'Bonjour' }]
        }
      ]

      const mockResponse = {
        candidates: [{
          content: {
            parts: [{ text: 'Bonjour! Comment puis-je vous aider?' }]
          }
        }]
      }

      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })

      const result = await geminiService.chatWithAI(mockMessages)
      
      expect(result).toBe('Bonjour! Comment puis-je vous aider?')
    })

    it('should handle chat API errors', async () => {
      const mockMessages = [
        {
          role: 'user' as const,
          parts: [{ text: 'Test' }]
        }
      ]

      ;(global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      })

      await expect(geminiService.chatWithAI(mockMessages))
        .rejects.toThrow('Erreur API Gemini: 500 - Internal Server Error')
    })
  })
})
