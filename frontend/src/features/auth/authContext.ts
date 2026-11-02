import { createContext } from 'react'
import type { User } from '../../shared/types'

export type Auth = {
  /** null när ingen är inloggad */
  user: User | null
  /** true medan appen kontrollerar en sparad token vid start */
  loading: boolean
  login: (email: string, password: string) => Promise<User>
  logout: () => void
}

export const AuthContext = createContext<Auth | null>(null)
