import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from '@testing-library/react'
import { setupServer } from 'msw/node'
import { MemoryRouter, Route, Routes } from 'react-router'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { tokenStorage } from '../../shared/apiClient'
import { AuthProvider } from './AuthProvider'
import { authHandlers } from './authHandlers'
import { LoginPage } from './LoginPage'

const server = setupServer(...authHandlers)

beforeAll(() => server.listen({ onUnhandledFrame: 'error' }))
afterEach(() => {
  cleanup()
  server.resetHandlers()
  localStorage.clear()
})
afterAll(() => server.close())

const renderLogin = () =>
  render(
    <AuthProvider>
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/tickets" element={<p>Startsidan</p>} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>,
  )

function fillIn(email: string, password: string) {
  fireEvent.change(screen.getByLabelText('E-post'), {
    target: { value: email },
  })
  fireEvent.change(screen.getByLabelText('Lösenord'), {
    target: { value: password },
  })
  fireEvent.click(screen.getByRole('button', { name: 'Logga in' }))
}

describe('LoginPage', () => {
  it('har ett formulär med e-post och lösenord', () => {
    renderLogin()

    expect(screen.getByLabelText('E-post')).toBeDefined()
    expect(screen.getByLabelText('Lösenord').getAttribute('type')).toBe(
      'password',
    )
  })

  it('tomma fält ger felmeddelanden utan anrop till backend', async () => {
    renderLogin()

    fireEvent.click(screen.getByRole('button', { name: 'Logga in' }))

    expect(await screen.findByText('Skriv din e-post')).toBeDefined()
    expect(screen.getByText('Skriv ditt lösenord')).toBeDefined()
  })

  it('fel lösenord visar meddelandet från backend', async () => {
    renderLogin()

    fillIn('hyresgast@felanmalan.se', 'fel')

    const alert = await screen.findByRole('alert')
    expect(within(alert).getByText('Fel e-post eller lösenord')).toBeDefined()
    expect(tokenStorage.get()).toBeNull()
  })

  it('rätt uppgifter loggar in och går till startsidan', async () => {
    renderLogin()

    fillIn('forvaltare@felanmalan.se', 'test1234')

    expect(await screen.findByText('Startsidan')).toBeDefined()
    expect(tokenStorage.get()).not.toBeNull()
  })
})
