import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from '@testing-library/react'
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
import type { Ticket } from './ticketApi'
import { resetTickets, ticketHandlers } from './ticketHandlers'

const server = setupServer(...authHandlers, ...pingHandlers, ...ticketHandlers)

beforeAll(() => server.listen({ onUnhandledFrame: 'error' }))
beforeEach(() => resetTickets())
afterEach(() => {
  cleanup()
  server.resetHandlers()
  localStorage.clear()
})
afterAll(() => server.close())

const tenant = testUsers.find((u) => u.role === 'TENANT')!

// Nyaste först, som backend skickar dem
const tickets: Ticket[] = [
  {
    id: 2,
    apartmentId: 1,
    createdBy: tenant.id,
    assignedTo: null,
    category: 'PLUMBING',
    priority: 'NORMAL',
    status: 'NEW',
    room: null,
    description: 'Kranen i köket droppar hela tiden.',
    masterKeyAllowed: true,
    createdAt: '2026-11-18T08:14:00Z',
    closedAt: null,
  },
  {
    id: 1,
    apartmentId: 1,
    createdBy: tenant.id,
    assignedTo: 3,
    category: 'APPLIANCES',
    priority: 'HIGH',
    status: 'RESOLVED',
    room: 'Kök',
    description: 'Spisen: två av plattorna blir inte varma.',
    masterKeyAllowed: false,
    createdAt: '2026-10-20T09:02:00Z',
    closedAt: null,
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

describe('MyTickets', () => {
  it('visar kategori, datum och status, nyaste först', async () => {
    resetTickets(tickets)
    renderAs('TENANT')

    const items = await screen.findAllByRole('listitem')
    expect(items).toHaveLength(2)
    expect(within(items[0]).getByText('VVS')).toBeTruthy()
    expect(within(items[0]).getByText('Ny')).toBeTruthy()
    expect(within(items[0]).getByText('Skapad 18 nov. 2026')).toBeTruthy()
    expect(within(items[1]).getByText('Vitvaror')).toBeTruthy()
    expect(within(items[1]).getByText('Åtgärdad')).toBeTruthy()
  })

  it('visar ett meddelande när hyresgästen inte har några ärenden', async () => {
    renderAs('TENANT')

    expect(await screen.findByText('Du har inga ärenden än.')).toBeTruthy()
    expect(screen.queryByRole('list')).toBeNull()
  })

  it('öppnar detaljvyn när man klickar på ett ärende', async () => {
    resetTickets(tickets)
    renderAs('TENANT')

    fireEvent.click(
      await screen.findByRole('button', { name: /Spisen: två av plattorna/ }),
    )
    const dialog = screen.getByRole('dialog', { name: 'Vitvaror' })
    expect(within(dialog).getByText('Ärende #1')).toBeTruthy()
    expect(within(dialog).getByText('Hög')).toBeTruthy()
    expect(within(dialog).getByText('Nej')).toBeTruthy()
    expect(within(dialog).getByText('Rum')).toBeTruthy()
    expect(within(dialog).getByText('Kök')).toBeTruthy()

    fireEvent.click(within(dialog).getByRole('button', { name: 'Stäng' }))
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('stänger detaljvyn med Escape', async () => {
    resetTickets(tickets)
    renderAs('TENANT')

    fireEvent.click(await screen.findByRole('button', { name: /Kranen/ }))
    const dialog = screen.getByRole('dialog', { name: 'VVS' })
    // Äldre ärenden utan rum visar inte raden Rum
    expect(within(dialog).queryByText('Rum')).toBeNull()

    fireEvent.keyDown(window, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('visar ett fel om ärendena inte kan hämtas', async () => {
    server.use(
      http.get(
        '/api/tickets/mine',
        () => new HttpResponse(null, { status: 500 }),
      ),
    )
    renderAs('TENANT')

    expect(
      await screen.findByText('Kunde inte hämta dina ärenden.'),
    ).toBeTruthy()
  })

  it('förvaltaren hämtar inte hyresgästens lista', async () => {
    renderAs('MANAGER')

    expect(await screen.findByText('Öppna ärenden')).toBeTruthy()
    expect(screen.queryByText('Laddar ärenden…')).toBeNull()
  })
})
