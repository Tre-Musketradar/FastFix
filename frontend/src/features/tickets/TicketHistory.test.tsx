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
import type {
  ManagerOpenTicket,
  TechnicianTicket,
  Ticket,
  TicketHistoryEntry,
} from './ticketApi'
import {
  resetManagerTickets,
  resetTechnicianTickets,
  resetTicketHistories,
  resetTickets,
  ticketHandlers,
} from './ticketHandlers'
import { tenantHandlers } from '../tenants/tenantHandlers'

const server = setupServer(
  ...authHandlers,
  ...pingHandlers,
  ...ticketHandlers,
  ...tenantHandlers,
)

const tenantTicket: Ticket = {
  id: 42,
  apartmentId: 1,
  createdBy: 6,
  assignedTo: 3,
  category: 'PLUMBING',
  priority: 'NORMAL',
  status: 'IN_PROGRESS',
  room: 'Kök',
  description: 'Vatten läcker i köket',
  masterKeyAllowed: false,
  createdAt: '2026-11-20T07:00:00Z',
  closedAt: null,
}
const managerTicket: ManagerOpenTicket = {
  id: 42,
  propertyId: 1,
  propertyName: 'Solrosen',
  apartmentId: 1,
  apartmentNumber: '1001',
  category: 'PLUMBING',
  priority: 'NORMAL',
  status: 'IN_PROGRESS',
  description: tenantTicket.description,
  assignedTo: 3,
  assignedTechnicianName: 'Ali Hassan',
  createdAt: tenantTicket.createdAt,
}
const technicianTicket: TechnicianTicket = {
  id: 42,
  propertyName: managerTicket.propertyName,
  propertyAddress: 'Solrosvägen 12',
  apartmentNumber: '1001',
  floor: 1,
  category: 'PLUMBING',
  priority: 'NORMAL',
  status: 'IN_PROGRESS',
  description: tenantTicket.description,
  masterKeyAllowed: false,
  createdAt: tenantTicket.createdAt,
}
const entries: TicketHistoryEntry[] = [
  {
    id: 10,
    oldStatus: 'NEW',
    newStatus: 'ASSIGNED',
    changedById: 1,
    changedByName: 'Maria Lindqvist',
    changedAt: '2026-11-21T08:00:00Z',
  },
  {
    id: 11,
    oldStatus: 'ASSIGNED',
    newStatus: 'IN_PROGRESS',
    changedById: 3,
    changedByName: 'Ali Hassan',
    changedAt: '2026-11-21T09:00:00Z',
  },
]

beforeAll(() => server.listen({ onUnhandledFrame: 'error' }))
beforeEach(() => {
  resetTickets([tenantTicket])
  resetManagerTickets([managerTicket])
  resetTechnicianTickets([technicianTicket])
  resetTicketHistories({ 42: entries })
})
afterEach(() => {
  cleanup()
  server.resetHandlers()
  localStorage.clear()
})
afterAll(() => server.close())

function renderAs(role: 'TENANT' | 'TECHNICIAN' | 'MANAGER') {
  const user = testUsers.find((candidate) => candidate.role === role)!
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

async function historyList() {
  const history = await screen.findByRole('region', {
    name: 'Historik för ärende #42',
  })
  expect(await within(history).findByText('Ny → Tilldelad')).toBeTruthy()
  return within(history).getAllByRole('listitem')
}

describe('Ärendets historik (#21)', () => {
  it('visar tid, statusövergång och ändrad av i tidsordning för hyresgästen', async () => {
    renderAs('TENANT')
    fireEvent.click(
      await screen.findByRole('button', { name: /Vatten läcker i köket/ }),
    )
    const items = await historyList()
    expect(items).toHaveLength(2)
    expect(within(items[0]).getByText('Ny → Tilldelad')).toBeTruthy()
    expect(within(items[0]).getByText(/Maria Lindqvist/)).toBeTruthy()
    expect(within(items[0]).getByText(/21 nov/)).toBeTruthy()
    expect(within(items[1]).getByText('Tilldelad → Pågår')).toBeTruthy()
    expect(within(items[1]).getByText(/Ali Hassan/)).toBeTruthy()
  })

  it('visar samma historik för förvaltaren', async () => {
    renderAs('MANAGER')
    fireEvent.click(
      await screen.findByRole('button', {
        name: 'Visa historik för ärende #42',
      }),
    )
    expect(await historyList()).toHaveLength(2)
    fireEvent.click(screen.getByRole('button', { name: 'Dölj historik' }))
    expect(
      screen.queryByRole('region', { name: 'Historik för ärende #42' }),
    ).toBeNull()
  })

  it('visar samma historik för teknikern', async () => {
    renderAs('TECHNICIAN')
    fireEvent.click(
      await screen.findByRole('button', {
        name: 'Visa historik för ärende #42',
      }),
    )
    expect(await historyList()).toHaveLength(2)
  })

  it('visar ett tydligt tomt läge om inga statusändringar finns', async () => {
    resetTicketHistories()
    renderAs('TENANT')
    fireEvent.click(
      await screen.findByRole('button', { name: /Vatten läcker i köket/ }),
    )
    expect(
      await screen.findByText('Inga statusändringar registrerade ännu.'),
    ).toBeTruthy()
  })

  it('visar felmeddelande vid API-fel', async () => {
    server.use(
      http.get(
        '/api/tickets/:ticketId/history',
        () => new HttpResponse(null, { status: 500 }),
      ),
    )
    renderAs('TENANT')
    fireEvent.click(
      await screen.findByRole('button', { name: /Vatten läcker i köket/ }),
    )
    expect(await screen.findByRole('alert')).toHaveProperty(
      'textContent',
      'Kunde inte hämta ärendets historik.',
    )
  })
})
