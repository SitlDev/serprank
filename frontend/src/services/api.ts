import axios, { AxiosInstance, AxiosError } from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

class ApiClient {
  private client: AxiosInstance
  private token: string | null = localStorage.getItem('authToken')

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Add token to requests
    this.client.interceptors.request.use((config) => {
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`
      }
      return config
    })

    // Handle response errors
    this.client.interceptors.response.use(
      (response) => {
        console.log('API Response:', response.config.url, response.data);
        return response;
      },
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          this.logout()
        }
        return Promise.reject(error)
      }
    )
  }

  setToken(token: string) {
    this.token = token
    localStorage.setItem('authToken', token)
  }

  getToken(): string | null {
    return this.token
  }

  logout() {
    this.token = null
    localStorage.removeItem('authToken')
  }

  async get<T>(url: string, config?: any) {
    return this.client.get<T>(url, config)
  }

  async post<T>(url: string, data?: any, config?: any) {
    return this.client.post<T>(url, data, config)
  }

  async put<T>(url: string, data?: any, config?: any) {
    return this.client.put<T>(url, data, config)
  }

  async delete<T>(url: string, config?: any) {
    return this.client.delete<T>(url, config)
  }
}

export default new ApiClient()
