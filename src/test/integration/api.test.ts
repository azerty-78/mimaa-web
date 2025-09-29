import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { spawn } from 'child_process'

// Configuration pour les tests d'intégration
const API_BASE_URL = 'http://localhost:3001'
const TEST_TIMEOUT = 10000

describe('API Integration Tests', () => {
  let serverProcess: any

  beforeAll(async () => {
    // Démarrer le serveur de test
    serverProcess = spawn('node', ['simple-server.cjs'], {
      stdio: 'pipe'
    })

    // Attendre que le serveur démarre
    await new Promise(resolve => setTimeout(resolve, 2000))
  }, TEST_TIMEOUT)

  afterAll(() => {
    if (serverProcess) {
      serverProcess.kill()
    }
  })

  describe('Health Check', () => {
    it('should respond to health check', async () => {
      const response = await fetch(`${API_BASE_URL}/health`)
      expect(response.status).toBe(200)
    })
  })

  describe('User Authentication', () => {
    it('should handle user login', async () => {
      const loginData = {
        username: 'testuser',
        password: 'password123'
      }

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
      })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data).toHaveProperty('token')
      expect(data).toHaveProperty('user')
    })

    it('should handle invalid login credentials', async () => {
      const invalidLoginData = {
        username: 'invalid',
        password: 'wrong'
      }

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(invalidLoginData)
      })

      expect(response.status).toBe(401)
    })
  })

  describe('User Profile', () => {
    let authToken: string

    beforeAll(async () => {
      // Obtenir un token d'authentification
      const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: 'testuser',
          password: 'password123'
        })
      })
      
      const loginData = await loginResponse.json()
      authToken = loginData.token
    })

    it('should get user profile', async () => {
      const response = await fetch(`${API_BASE_URL}/profile`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      })

      expect(response.status).toBe(200)
      const profile = await response.json()
      expect(profile).toHaveProperty('id')
      expect(profile).toHaveProperty('username')
      expect(profile).toHaveProperty('email')
    })

    it('should update user profile', async () => {
      const updateData = {
        firstName: 'Updated',
        lastName: 'Name',
        phone: '+237987654321'
      }

      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(updateData)
      })

      expect(response.status).toBe(200)
      const updatedProfile = await response.json()
      expect(updatedProfile.firstName).toBe('Updated')
    })
  })

  describe('Health Campaigns', () => {
    it('should get health campaigns', async () => {
      const response = await fetch(`${API_BASE_URL}/campaigns`)
      expect(response.status).toBe(200)
      
      const campaigns = await response.json()
      expect(Array.isArray(campaigns)).toBe(true)
    })

    it('should create new campaign', async () => {
      const campaignData = {
        title: 'Test Campaign',
        description: 'Test campaign description',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        targetAudience: 'pregnant_women'
      }

      const response = await fetch(`${API_BASE_URL}/campaigns`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(campaignData)
      })

      expect(response.status).toBe(201)
      const newCampaign = await response.json()
      expect(newCampaign.title).toBe('Test Campaign')
    })
  })

  describe('Chat Messages', () => {
    it('should send message to AI coach', async () => {
      const messageData = {
        message: 'Bonjour, j\'ai une question sur la nutrition pendant la grossesse',
        type: 'ai_coach'
      }

      const response = await fetch(`${API_BASE_URL}/chat/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(messageData)
      })

      expect(response.status).toBe(200)
      const responseData = await response.json()
      expect(responseData).toHaveProperty('response')
    })

    it('should get chat history', async () => {
      const response = await fetch(`${API_BASE_URL}/chat/history`)
      expect(response.status).toBe(200)
      
      const history = await response.json()
      expect(Array.isArray(history)).toBe(true)
    })
  })

  describe('Error Handling', () => {
    it('should handle 404 errors', async () => {
      const response = await fetch(`${API_BASE_URL}/nonexistent`)
      expect(response.status).toBe(404)
    })

    it('should handle 500 errors gracefully', async () => {
      const response = await fetch(`${API_BASE_URL}/error-test`)
      // Le serveur devrait gérer les erreurs 500
      expect(response.status).toBeGreaterThanOrEqual(400)
    })
  })
})
