import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router'
import { useAuth } from './useAuth'

/** Skickar till inloggningen om ingen är inloggad (kriterium 5). */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <p className="p-6 text-slate-600">Laddar…</p>
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />
  return children
}
