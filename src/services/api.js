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
  // Always use demo mode in production unless a real backend URL is provided
  const isProduction = import.meta.env.PROD
  const hasRealBackend = import.meta.env.VITE_API_URL && !import.meta.env.VITE_API_URL.includes('your-backend-url')
  const isDemoMode = isProduction && !hasRealBackend
  
  console.log('Environment check:', { 
    isProduction, 
    hasRealBackend, 
    isDemoMode, 
    API_BASE_URL,
    VITE_API_URL: import.meta.env.VITE_API_URL 
  })
  
  // For now, always use demo mode to ensure it works
  const forceDemo = true
  
  if (isDemoMode || forceDemo) {
    console.log('Using mock API for demo')
    try {
      // Use mock API for demo
      const { mockAnalyzeText, mockAnalyzeImage } = await import('./mockApi')
      
      if (data.type === 'text') {
        return await mockAnalyzeText(data.content)
      } else {
        return await mockAnalyzeImage()
      }
    } catch (importError) {
      console.error('Failed to import mock API:', importError)
      // Fallback response
      return {
        isTrue: false,
        confidence: 75,
        explanation: `This ${data.type} is **60% likely to be accurate**, **25% likely to contain misinformation**, and **15% likely to be misleading**.

**Demo Mode Active**: This is a demonstration of TruthLens AI fact-checking capabilities. In production, this would connect to our Gemini AI backend for real analysis.

**Key Features Demonstrated**:
- AI-powered content analysis
- Probability-based authenticity scoring  
- Visual charts and detailed breakdowns
- Professional UI with smooth animations

**For Full Functionality**: Deploy the Python Flask backend with your Google AI API key.`,
        sources: [
          {
            title: "TruthLens Demo",
            url: "https://github.com/Divyanshkhilari/TruthLens",
            domain: "github.com"
          }
        ]
      }
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