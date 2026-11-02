import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { setUnauthorizedHandler, tokenStorage } from '../../shared/apiClient'
import type { User } from '../../shared/types'
import { authApi } from './authApi'
import { AuthContext } from './authContext'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  // Finns en sparad token måste den kontrolleras innan vi vet vem som är inloggad
  const [loading, setLoading] = useState(() => tokenStorage.get() !== null)

  const logout = useCallback(() => {
    tokenStorage.clear()
    setUser(null)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const res = await authApi.login(email, password)
    tokenStorage.set(res.token)
    setUser(res.user)
    return res.user
  }, [])

  useEffect(() => {
    setUnauthorizedHandler(() => setUser(null))
  }, [])

  // Kvar inloggad efter omladdning (kriterium 4): fråga backend vem token tillhör
  useEffect(() => {
    if (tokenStorage.get() === null) return
    authApi
      .me()
      .then(setUser)
      .catch(() => logout())
      .finally(() => setLoading(false))
  }, [logout])

  const value = useMemo(
    () => ({ user, loading, login, logout }),
    [user, loading, login, logout],
  )
  return <AuthContext value={value}>{children}</AuthContext>
}
