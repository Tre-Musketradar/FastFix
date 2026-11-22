import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { cleanup, render, screen, within } from '@testing-library/react'
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
import type { TechnicianTicket } from './ticketApi'
import { resetTechnicianTickets, ticketHandlers } from './ticketHandlers'

const server = setupServer(...authHandlers, ...pingHandlers, ...ticketHandlers)

beforeAll(() => server.listen({ onUnhandledFrame: 'error' }))
beforeEach(() => resetTechnicianTickets())
afterEach(() => {
  cleanup()
  server.resetHandlers()
  localStorage.clear()
})
afterAll(() => server.close())

// Redan filtrerade och sorterade, som backend skickar dem (mest brådskande först)
const tickets: TechnicianTicket[] = [
  {
    id: 6,
    propertyName: 'Solrosen',
    propertyAddress: 'Solrosvägen 12, 123 45 Stockholm',
    apartmentNumber: '1201',
    floor: 2,
    category: 'PLUMBING',
    priority: 'URGENT',
    status: 'IN_PROGRESS',
    description: 'Vatten läcker under diskbänken.',
    masterKeyAllowed: true,
    createdAt: '2026-11-20T08:00:00Z',
  },
  {
    id: 4,
    propertyName: 'Björken',
    propertyAddress: 'Björkgatan 4, 753 20 Uppsala',
    apartmentNumber: '1101',
    floor: null,
    category: 'ELECTRICAL',
    priority: 'NORMAL',
    status: 'ASSIGNED',
    description: 'Taklampan i hallen blinkar.',
    masterKeyAllowed: false,
    createdAt: '2026-11-18T08:00:00Z',
  },
]

function renderAs(role: string) {
  const user = testUsers.find((u) => u.role === role)!
  tokenStorage.set(tokenFor(user))
  render(
    <QueryClientProvider client={new QueryClient()}>
      <MemoryRouter initialEntries={['/tickets']}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('TechnicianTickets', () => {
  it('visar adress, lägenhet, kategori, status och huvudnyckel i serverns ordning', async () => {
    resetTechnicianTickets(tickets)
    renderAs('TECHNICIAN')

    expect(
      await screen.findByRole('heading', { name: 'Mina uppdrag' }),
    ).toBeTruthy()
    const items = await screen.findAllByRole('listitem')
    expect(items).toHaveLength(2)

    const urgent = within(items[0])
    expect(urgent.getByText('Solrosvägen 12, 123 45 Stockholm')).toBeTruthy()
    expect(urgent.getByText(/Solrosen · Lgh 1201, vån 2/)).toBeTruthy()
    expect(urgent.getByText('VVS')).toBeTruthy()
    expect(urgent.getByText('Akut')).toBeTruthy()
    expect(urgent.getByText('Pågår')).toBeTruthy()
    expect(urgent.getByText('Huvudnyckel får användas')).toBeTruthy()

    const normal = within(items[1])
    expect(normal.getByText('Björkgatan 4, 753 20 Uppsala')).toBeTruthy()
    expect(normal.getByText(/Björken · Lgh 1101$/)).toBeTruthy()
    expect(normal.getByText('El')).toBeTruthy()
    expect(normal.getByText('Tilldelad')).toBeTruthy()
    expect(normal.getByText('Huvudnyckel får inte användas')).toBeTruthy()
  })

  it('visar tomt läge när teknikern inte har några ärenden', async () => {
    renderAs('TECHNICIAN')
    expect(
      await screen.findByText('Du har inga tilldelade ärenden just nu.'),
    ).toBeTruthy()
  })

  it('visar serverfel utan att krascha', async () => {
    server.use(
      http.get(
        '/api/tickets/assigned',
        () => new HttpResponse(null, { status: 500 }),
      ),
    )
    renderAs('TECHNICIAN')
    expect(await screen.findByRole('alert')).toHaveProperty(
      'textContent',
      'Kunde inte hämta dina uppdrag.',
    )
  })

  it.each(['TENANT', 'MANAGER'])(
    '%s ser inte teknikerns lista',
    async (role) => {
      resetTechnicianTickets(tickets)
      renderAs(role)
      expect(await screen.findByRole('heading', { level: 1 })).toBeTruthy()
      expect(screen.queryByText('Huvudnyckel får användas')).toBeNull()
      expect(screen.queryByText('Solrosvägen 12, 123 45 Stockholm')).toBeNull()
    },
  )
})
