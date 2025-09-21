import axios from 'axios'

// Configure your backend API endpoint here
const API_BASE_URL = 'http://127.0.0.1:8001' // Your Python Flask backend URL

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60 seconds timeout for AI processing
  headers: {
    'Content-Type': 'application/json',
  }
})

export const checkFact = async (data) => {
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
        explanation: "Unable to connect to the TruthLens backend server. Please make sure the Python Flask server is running on http://127.0.0.1:8001. Check the backend README for setup instructions.",
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