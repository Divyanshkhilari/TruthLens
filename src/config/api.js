// API Configuration for different environments
const config = {
  development: {
    API_BASE_URL: 'http://127.0.0.1:8001'
  },
  production: {
    API_BASE_URL: import.meta.env.VITE_API_URL || 'https://your-backend-url.railway.app'
  }
}

const environment = import.meta.env.MODE || 'development'
export const API_CONFIG = config[environment]