import { LogOut, Wrench } from 'lucide-react'
import { Outlet } from 'react-router'
import { useAuth } from '../features/auth/useAuth'
import type { Role } from './types'

const roleNames: Record<Role, string> = {
  TENANT: 'Hyresgäst',
  TECHNICIAN: 'Tekniker',
  MANAGER: 'Förvaltare',
}

/** Ramen för alla sidor som kräver inloggning. Menyn får en rad per sida när de finns. */
export function Layout() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="flex items-center gap-3 bg-slate-900 px-4 py-3 text-white">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-700">
          <Wrench size={18} aria-hidden="true" />
        </div>
        <span className="text-lg font-bold">Felanmälan</span>
        {user && (
          <div className="ml-auto flex items-center gap-4">
            <div className="flex flex-col text-right text-sm leading-tight">
              <span className="font-semibold">{user.name}</span>
              <span className="text-slate-300">{roleNames[user.role]}</span>
            </div>
            <button
              type="button"
              onClick={logout}
              className="flex h-11 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-slate-200 hover:bg-slate-800"
            >
              <LogOut size={18} aria-hidden="true" />
              Logga ut
            </button>
          </div>
        )}
      </header>
      <main className="mx-auto max-w-5xl p-6">
        <Outlet />
      </main>
    </div>
  )
}
