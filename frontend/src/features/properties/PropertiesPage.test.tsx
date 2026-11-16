import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from '@testing-library/react'
import { setupServer } from 'msw/node'
import { MemoryRouter } from 'react-router'
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from 'vitest'
import App from '../../App'
import { tokenStorage } from '../../shared/apiClient'
import { AuthProvider } from '../auth/AuthProvider'
import { authHandlers, testUsers, tokenFor } from '../auth/authHandlers'
import { pingHandlers } from '../ping/pingHandlers'
import { propertyHandlers, resetProperties } from './propertyHandlers'

const server = setupServer(
  ...authHandlers,
  ...pingHandlers,
  ...propertyHandlers,
)

beforeAll(() => server.listen({ onUnhandledFrame: 'error' }))
beforeEach(() => resetProperties())
afterEach(() => {
  cleanup()
  server.resetHandlers()
  localStorage.clear()
})
afterAll(() => server.close())

const manager = testUsers.find((u) => u.role === 'MANAGER')!

/** Startar appen på `path` med användaren redan inloggad. */
function renderAs(role: string, path = '/properties') {
  const user = testUsers.find((u) => u.role === role)!
  tokenStorage.set(tokenFor(user))
  render(
    <QueryClientProvider client={new QueryClient()}>
      <MemoryRouter initialEntries={[path]}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

function fillIn(name: string, address: string) {
  fireEvent.change(screen.getByLabelText('Namn'), { target: { value: name } })
  fireEvent.change(screen.getByLabelText('Adress'), {
    target: { value: address },
  })
  fireEvent.click(screen.getByRole('button', { name: 'Spara fastighet' }))
}

describe('PropertiesPage', () => {
  it('förvaltaren når sidan från menyn', async () => {
    renderAs('MANAGER', '/tickets')

    const menu = await screen.findByRole('navigation', { name: 'Huvudmeny' })
    fireEvent.click(within(menu).getByRole('link', { name: 'Fastigheter' }))

    expect(
      await screen.findByRole('heading', { name: 'Fastigheter' }),
    ).toBeDefined()
    expect(
      await screen.findByText('Inga fastigheter registrerade ännu.'),
    ).toBeDefined()
  })

  it('visar förvaltarens fastigheter', async () => {
    resetProperties([
      {
        id: 1,
        name: 'Solrosen 1001',
        address: 'Solrosvägen 1',
        ownerId: manager.id,
      },
    ])
    renderAs('MANAGER')

    expect(await screen.findByText('Solrosen 1001')).toBeDefined()
    expect(screen.getByText('Solrosvägen 1')).toBeDefined()
  })

  it('tomma fält ger felmeddelanden och sparar inget', async () => {
    renderAs('MANAGER')
    await screen.findByText('Inga fastigheter registrerade ännu.')

    fillIn('  ', '')

    expect(await screen.findByText('Namn måste anges')).toBeDefined()
    expect(screen.getByText('Adress måste anges')).toBeDefined()
    expect(
      screen.getByText('Inga fastigheter registrerade ännu.'),
    ).toBeDefined()
  })

  it('en ny fastighet syns direkt i listan', async () => {
    renderAs('MANAGER')
    await screen.findByText('Inga fastigheter registrerade ännu.')

    fillIn('Tallen 3', 'Tallgatan 3')

    expect(await screen.findByText('Tallen 3')).toBeDefined()
    expect(screen.getByText('Tallgatan 3')).toBeDefined()
    expect((screen.getByLabelText('Namn') as HTMLInputElement).value).toBe('')
  })

  it.each([
    ['TENANT', 'Mina ärenden'],
    ['TECHNICIAN', 'Mina uppdrag'],
  ])(
    '%s skickas till sin startsida och ser ingen meny',
    async (role, title) => {
      renderAs(role)

      expect(await screen.findByRole('heading', { name: title })).toBeDefined()
      expect(screen.queryByRole('heading', { name: 'Fastigheter' })).toBeNull()
      expect(screen.queryByRole('link', { name: 'Fastigheter' })).toBeNull()
    },
  )
})
