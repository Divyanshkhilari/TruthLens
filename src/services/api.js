import axios from 'axios'
import { API_CONFIG } from '../config/api'

// Configure your backend API endpoint here
const API_BASE_URL = import.meta.env.VITE_API_URL || API_CONFIG.API_BASE_URL

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60 seconds timeout for AI processing
  headers: {
    'Content-Type': 'application/json',
  }
})

export const checkFact = async (data) => {
  // Check if we're in demo mode (no backend available)
  const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true' || API_BASE_URL.includes('your-backend-url')
  
  if (isDemoMode) {
    // Use mock API for demo
    const { mockAnalyzeText, mockAnalyzeImage } = await import('./mockApi')
    
    if (data.type === 'text') {
      return await mockAnalyzeText(data.content)
    } else {
      return await mockAnalyzeImage()
    }
  }
  
  try {
    let response
    
    if (data.type === 'text') {
      // Send text for fact-checking
      response = await api.post('/check-text', {
        text: data.content
      })
    } else if (data.type === 'image') {
      // Send image for fact-checking
      const formData = new FormData()
      formData.append('image', data.content)
      
      response = await api.post('/check-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      })
    }

    // Validate response structure
    const result = response.data
    if (typeof result.isTrue !== 'boolean' || typeof result.confidence !== 'number') {
      throw new Error('Invalid response format from server')
    }

    return result
  } catch (error) {
    console.error('API Error:', error)
    
    // Check if it's a network error (backend not running)
    if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
      return {
        isTrue: false,
        confidence: 0,
        explanation: "Unable to connect to the TruthLens backend server. This demo is running in frontend-only mode. For full functionality, deploy the Python Flask backend and update the API configuration.",
        sources: []
      }
    }
    
    // For other errors, return a generic error response
    return {
      isTrue: false,
      confidence: 0,
      explanation: `An error occurred while processing your request: ${error.response?.data?.error || error.message}. Please try again.`,
      sources: []
    }
  }
}

// Health check function to test backend connectivity
export const checkBackendHealth = async () => {
  try {
    const response = await api.get('/health')
    return response.data
  } catch (error) {
    throw new Error('Backend server is not responding')
  }
}