import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth-storage')
    if (token) {
      try {
        const parsedToken = JSON.parse(token)
        if (parsedToken.state.token) {
          config.headers.Authorization = `Bearer ${parsedToken.state.token}`
        }
      } catch (error) {
        console.error('Error parsing token:', error)
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth-storage')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export { api } 