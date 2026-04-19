import apiClient from './api'

export interface AuthResponse {
  user: {
    id: string
    email: string
    firstName: string
    lastName: string
    plan: string
    credits: number
  }
  token: string
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  plan: string
  credits: number
  createdAt: string
  updatedAt: string
}

export class AuthService {
  static async register(email: string, password: string, firstName: string = '', lastName: string = ''): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', {
      email,
      password,
      firstName,
      lastName,
    })
    return response.data
  }

  static async login(email: string, password: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', {
      email,
      password,
    })
    return response.data
  }

  static async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>('/auth/me')
    return response.data
  }

  static logout() {
    apiClient.logout()
  }

  static setToken(token: string) {
    apiClient.setToken(token)
  }

  static getToken(): string | null {
    return apiClient.getToken()
  }
}
