import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { setupServer } from 'msw/node'
import { useState } from 'react'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { tokenStorage } from '../../shared/apiClient'
import { AuthProvider } from './AuthProvider'
import { authHandlers, testUsers, tokenFor } from './authHandlers'
import { useAuth } from './useAuth'

const server = setupServer(...authHandlers)

beforeAll(() => server.listen({ onUnhandledFrame: 'error' }))
afterEach(() => {
  cleanup()
  server.resetHandlers()
  localStorage.clear()
})
afterAll(() => server.close())

// En liten testkomponent: visar vem som är inloggad, med knappar för login och logout
function WhoAmI({ password = 'test1234' }: { password?: string }) {
  const { user, loading, login, logout } = useAuth()
  const [error, setError] = useState('')

  if (loading) return <p>Laddar</p>
  return (
    <>
      <p>{user ? user.name : 'Inte inloggad'}</p>
      <p>{error}</p>
      <button
        onClick={() =>
          login('hyresgast@felanmalan.se', password).catch((e: Error) =>
            setError(e.message),
          )
        }
      >
        Logga in
      </button>
      <button onClick={logout}>Logga ut</button>
    </>
  )
}

const renderApp = (password?: string) =>
  render(
    <AuthProvider>
      <WhoAmI password={password} />
    </AuthProvider>,
  )

describe('AuthProvider', () => {
  it('ingen är inloggad utan token', () => {
    renderApp()

    expect(screen.getByText('Inte inloggad')).toBeDefined()
  })

  it('login sparar token och användaren', async () => {
    renderApp()

    fireEvent.click(screen.getByText('Logga in'))

    expect(await screen.findByText('Anna Karlsson')).toBeDefined()
    expect(tokenStorage.get()).toBe('test-token-6')
  })

  it('fel lösenord ger felmeddelandet från backend', async () => {
    renderApp('fel')

    fireEvent.click(screen.getByText('Logga in'))

    expect(await screen.findByText('Fel e-post eller lösenord')).toBeDefined()
    expect(tokenStorage.get()).toBeNull()
  })

  it('är kvar inloggad efter omladdning när token finns sparad', async () => {
    tokenStorage.set(tokenFor(testUsers[1]))

    renderApp()

    expect(screen.getByText('Laddar')).toBeDefined()
    expect(await screen.findByText('Ali Hassan')).toBeDefined()
  })

  it('en ogiltig sparad token tas bort', async () => {
    tokenStorage.set('utgangen')

    renderApp()

    expect(await screen.findByText('Inte inloggad')).toBeDefined()
    expect(tokenStorage.get()).toBeNull()
  })

  it('logout tar bort token och användaren', async () => {
    renderApp()
    fireEvent.click(screen.getByText('Logga in'))
    await screen.findByText('Anna Karlsson')

    fireEvent.click(screen.getByText('Logga ut'))

    expect(screen.getByText('Inte inloggad')).toBeDefined()
    expect(tokenStorage.get()).toBeNull()
  })
})
