import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
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
import { ticketHandlers } from '../tickets/ticketHandlers'
import { propertyHandlers, resetProperties } from './propertyHandlers'
import { apartmentHandlers, resetApartments } from './apartmentHandlers'

const manager = testUsers.find((user) => user.role === 'MANAGER')!
const property1 = {
  id: 1,
  name: 'Solrosen',
  address: 'Solrosvägen 12',
  ownerId: manager.id,
}
const property2 = {
  id: 2,
  name: 'Björken',
  address: 'Björkgatan 4',
  ownerId: manager.id,
}

const server = setupServer(
  ...authHandlers,
  ...pingHandlers,
  ...ticketHandlers,
  ...propertyHandlers,
  ...apartmentHandlers,
)

beforeAll(() => server.listen({ onUnhandledFrame: 'error' }))
beforeEach(() => {
  resetProperties([property1, property2])
  resetApartments()
})
afterEach(() => {
  cleanup()
  server.resetHandlers()
  localStorage.clear()
})
afterAll(() => server.close())

function renderAs(role = 'MANAGER', path = '/properties/1') {
  const user = testUsers.find((u) => u.role === role)!
  tokenStorage.set(tokenFor(user))
  render(
    <QueryClientProvider
      client={
        new QueryClient({
          defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
          },
        })
      }
    >
      <MemoryRouter initialEntries={[path]}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

function submit(number: string, floor = '') {
  fireEvent.change(screen.getByLabelText('Lägenhetsnummer'), {
    target: { value: number },
  })
  fireEvent.change(screen.getByLabelText('Våning (valfritt)'), {
    target: { value: floor },
  })
  fireEvent.click(screen.getByRole('button', { name: 'Spara lägenhet' }))
}

describe('ApartmentsPage – issue #12', () => {
  it('går att öppna en fastighets lägenheter via fastighetslistan', async () => {
    renderAs('MANAGER', '/properties')
    fireEvent.click(await screen.findByRole('link', { name: 'Solrosen' }))

    expect(
      await screen.findByRole('heading', { name: 'Lägg till lägenhet' }),
    ).toBeDefined()
    expect(screen.getByText('Solrosvägen 12')).toBeDefined()
  })

  it('visar befintliga lägenheter i just den fastigheten', async () => {
    resetApartments([
      { id: 1, propertyId: 1, number: '1001', floor: 0, tenantId: null },
      { id: 2, propertyId: 2, number: '1002', floor: 1, tenantId: null },
    ])
    renderAs()
    expect(await screen.findByText('Lägenhet 1001')).toBeDefined()
    expect(screen.getByText('Våning 0')).toBeDefined()
    expect(screen.queryByText('Lägenhet 1002')).toBeNull()
  })

  it('visar fel när lägenhetsnummer saknas', async () => {
    renderAs()
    await screen.findByText('Inga lägenheter registrerade ännu.')
    submit('   ', '2')
    expect(await screen.findByText('Lägenhetsnummer måste anges')).toBeDefined()
    expect(screen.getByText('Inga lägenheter registrerade ännu.')).toBeDefined()
  })

  it('sparar en lägenhet och visar den direkt utan omladdning', async () => {
    renderAs()
    await screen.findByText('Inga lägenheter registrerade ännu.')
    submit(' 1001 ', '0')
    expect(await screen.findByText('Lägenhet 1001')).toBeDefined()
    expect(screen.getByText('Våning 0')).toBeDefined()
    expect(
      (screen.getByLabelText('Lägenhetsnummer') as HTMLInputElement).value,
    ).toBe('')
  })

  it('visar fel för ett dubblettnummer i samma fastighet', async () => {
    resetApartments([
      { id: 1, propertyId: 1, number: '1001', floor: 0, tenantId: null },
    ])
    renderAs()
    await screen.findByText('Lägenhet 1001')
    submit('1001', '1')
    expect(
      await screen.findByText('Lägenhetsnumret finns redan i fastigheten.'),
    ).toBeDefined()
    expect(screen.getAllByText('Lägenhet 1001')).toHaveLength(1)
  })

  it('tillåter samma nummer i olika fastigheter', async () => {
    resetApartments([
      { id: 1, propertyId: 1, number: '1001', floor: 0, tenantId: null },
    ])
    renderAs('MANAGER', '/properties/2')
    await screen.findByText('Inga lägenheter registrerade ännu.')
    submit('1001', '2')
    expect(await screen.findByText('Lägenhet 1001')).toBeDefined()
    expect(screen.getByText('Våning 2')).toBeDefined()
  })

  it.each(['TENANT', 'TECHNICIAN'])(
    '%s får inte öppna fastighetens lägenheter',
    async (role) => {
      renderAs(role)
      expect(
        await screen.findByRole('heading', {
          name: role === 'TENANT' ? 'Mina ärenden' : 'Mina uppdrag',
        }),
      ).toBeDefined()
      expect(
        screen.queryByRole('heading', { name: 'Lägg till lägenhet' }),
      ).toBeNull()
    },
  )

  it('visar inte en fastighet som chefen inte äger', async () => {
    resetProperties([
      { id: 1, name: 'Annan fastighet', address: 'Okänd', ownerId: 42 },
    ])
    renderAs()
    expect(
      await screen.findByRole('heading', { name: 'Fastigheten hittades inte' }),
    ).toBeDefined()
  })

  it('hanterar att API:t inte kan hämta lägenheter', async () => {
    server.use(
      http.get('/api/properties/1/apartments', () =>
        HttpResponse.json({ message: 'Tillfälligt fel' }, { status: 500 }),
      ),
    )
    renderAs()
    expect(
      await screen.findByText('Kunde inte hämta lägenheterna.'),
    ).toBeDefined()
  })
})
