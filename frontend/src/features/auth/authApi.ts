import { apiFetch } from '../../shared/apiClient'
import type { User } from '../../shared/types'

export type LoginResponse = { token: string; user: User }

export const authApi = {
  login: (email: string, password: string) =>
    apiFetch<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  me: () => apiFetch<User>('/api/auth/me'),
}
