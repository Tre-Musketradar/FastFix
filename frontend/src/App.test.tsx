import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { setupServer } from 'msw/node'
import { MemoryRouter } from 'react-router'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import App from './App'
import { AuthProvider } from './features/auth/AuthProvider'
import { authHandlers, testUsers, tokenFor } from './features/auth/authHandlers'
import { pingHandlers } from './features/ping/pingHandlers'
import { tokenStorage } from './shared/apiClient'

const server = setupServer(...authHandlers, ...pingHandlers)

beforeAll(() => server.listen({ onUnhandledFrame: 'error' }))
afterEach(() => {
  cleanup()
  server.resetHandlers()
  localStorage.clear()
})
afterAll(() => server.close())

const renderApp = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </MemoryRouter>,
  )

function logIn(email: string) {
  fireEvent.change(screen.getByLabelText('E-post'), {
    target: { value: email },
  })
  fireEvent.change(screen.getByLabelText('Lösenord'), {
    target: { value: 'test1234' },
  })
  fireEvent.click(screen.getByRole('button', { name: 'Logga in' }))
}

describe('App', () => {
  it('skickar till inloggningen när ingen är inloggad', async () => {
    renderApp('/tickets')

    expect(await screen.findByLabelText('E-post')).toBeDefined()
  })

  it.each([
    ['hyresgast@felanmalan.se', 'Anna Karlsson', 'Mina ärenden'],
    ['tekniker@felanmalan.se', 'Ali Hassan', 'Mina uppdrag'],
    ['forvaltare@felanmalan.se', 'Maria Lindqvist', 'Öppna ärenden'],
  ])(
    '%s kommer till sin startsida efter inloggning',
    async (email, name, title) => {
      renderApp('/login')

      logIn(email)

      expect(await screen.findByRole('heading', { name: title })).toBeDefined()
      expect(screen.getByText(name)).toBeDefined()
    },
  )

  it('är kvar inloggad när sidan laddas om', async () => {
    tokenStorage.set(tokenFor(testUsers[2]))

    renderApp('/tickets')

    expect(
      await screen.findByRole('heading', { name: 'Mina ärenden' }),
    ).toBeDefined()
  })

  it('efter utloggning går det inte att nå startsidan', async () => {
    tokenStorage.set(tokenFor(testUsers[0]))
    renderApp('/tickets')
    await screen.findByRole('heading', { name: 'Öppna ärenden' })

    fireEvent.click(screen.getByRole('button', { name: 'Logga ut' }))

    expect(await screen.findByLabelText('E-post')).toBeDefined()
    expect(tokenStorage.get()).toBeNull()
  })

  it('en inloggad som går till /login skickas till startsidan', async () => {
    tokenStorage.set(tokenFor(testUsers[1]))

    renderApp('/login')

    expect(
      await screen.findByRole('heading', { name: 'Mina uppdrag' }),
    ).toBeDefined()
  })

  it('okända adresser går till startsidan', async () => {
    tokenStorage.set(tokenFor(testUsers[2]))

    renderApp('/finns-inte')

    expect(
      await screen.findByRole('heading', { name: 'Mina ärenden' }),
    ).toBeDefined()
  })
})
