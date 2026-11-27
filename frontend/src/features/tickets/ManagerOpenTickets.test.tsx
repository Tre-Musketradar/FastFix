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
import type { ManagerOpenTicket } from './ticketApi'
import { resetManagerTickets, ticketHandlers } from './ticketHandlers'
import { tenantHandlers } from '../tenants/tenantHandlers'

const server = setupServer(
  ...authHandlers,
  ...pingHandlers,
  ...ticketHandlers,
  ...tenantHandlers,
)

beforeAll(() => server.listen({ onUnhandledFrame: 'error' }))
beforeEach(() => resetManagerTickets())
afterEach(() => {
  cleanup()
  server.resetHandlers()
  localStorage.clear()
})
afterAll(() => server.close())

const tickets: ManagerOpenTicket[] = [
  {
    id: 12,
    propertyId: 1,
    propertyName: 'Solrosen',
    apartmentId: 10,
    apartmentNumber: '1001',
    category: 'PLUMBING',
    priority: 'NORMAL',
    status: 'NEW',
    description: 'Kranen läcker',
    assignedTo: null,
    assignedTechnicianName: null,
    createdAt: '2026-11-21T08:00:00Z',
  },
  {
    id: 13,
    propertyId: 2,
    propertyName: 'Björken',
    apartmentId: 11,
    apartmentNumber: '2002',
    category: 'ELECTRICAL',
    priority: 'HIGH',
    status: 'ASSIGNED',
    description: 'Lampa trasig',
    assignedTo: 3,
    assignedTechnicianName: 'Ali Hassan',
    createdAt: '2026-11-21T07:00:00Z',
  },
  {
    id: 14,
    propertyId: 1,
    propertyName: 'Solrosen',
    apartmentId: 10,
    apartmentNumber: '1001',
    category: 'OTHER',
    priority: 'LOW',
    status: 'CLOSED',
    description: 'Stängt ärende',
    assignedTo: 3,
    assignedTechnicianName: 'Ali Hassan',
    createdAt: '2026-11-19T07:00:00Z',
  },
]

const resolved: ManagerOpenTicket = {
  ...tickets[1],
  id: 15,
  status: 'RESOLVED',
  description: 'Element fixat',
}

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

describe('ManagerOpenTickets', () => {
  it('visar fastighet, lägenhet, kategori, status, tekniker och lyfter fram nya ärenden', async () => {
    resetManagerTickets(tickets)
    renderAs('MANAGER')

    const rows = await screen.findAllByRole('row')
    expect(rows).toHaveLength(3) // header + två öppna ärenden
    const fresh = within(rows[1])
    expect(fresh.getByText('Solrosen')).toBeTruthy()
    expect(fresh.getByText('1001')).toBeTruthy()
    expect(fresh.getByText('VVS')).toBeTruthy()
    expect(fresh.getByText('Ny')).toBeTruthy()
    expect(fresh.getByText('Ej tilldelad')).toBeTruthy()
    expect(rows[1].className).toContain('bg-blue-50')
    const assigned = within(rows[2])
    expect(assigned.getByText('Ali Hassan')).toBeTruthy()
    expect(assigned.getByText('Tilldelad')).toBeTruthy()
    expect(screen.queryByText('Stängt ärende')).toBeNull()
    expect(screen.getByText('2 öppna ärenden i dina fastigheter')).toBeTruthy()
  })

  it('filtrerar på fastighet och söker efter ärenden', async () => {
    resetManagerTickets(tickets)
    renderAs('MANAGER')
    await screen.findByText('Kranen läcker')

    fireEvent.change(screen.getByLabelText('Filtrera fastighet'), {
      target: { value: '2' },
    })
    expect(screen.queryByText('Kranen läcker')).toBeNull()
    expect(screen.getByText('Lampa trasig')).toBeTruthy()

    fireEvent.change(screen.getByLabelText('Filtrera fastighet'), {
      target: { value: 'all' },
    })
    fireEvent.change(screen.getByLabelText('Sök ärenden'), {
      target: { value: 'kranen' },
    })
    expect(screen.getByText('Kranen läcker')).toBeTruthy()
    expect(screen.queryByText('Lampa trasig')).toBeNull()
  })

  it('visar tomt läge när det inte finns öppna ärenden', async () => {
    renderAs('MANAGER')
    expect(
      await screen.findByText('Det finns inga öppna ärenden.'),
    ).toBeTruthy()
  })

  it('visar serverfel utan att krascha', async () => {
    server.use(
      http.get(
        '/api/tickets/open',
        () => new HttpResponse(null, { status: 500 }),
      ),
    )
    renderAs('MANAGER')
    expect(await screen.findByRole('alert')).toHaveProperty(
      'textContent',
      'Kunde inte hämta öppna ärenden.',
    )
  })

  it('visar Stäng ärende bara för åtgärdade ärenden', async () => {
    resetManagerTickets([...tickets, resolved])
    renderAs('MANAGER')
    await screen.findByText('Element fixat')

    expect(
      screen.getAllByRole('button', { name: /Stäng ärende/ }),
    ).toHaveLength(1)
    expect(
      screen.getByRole('button', { name: 'Stäng ärende #15' }),
    ).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Tilldela' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Byt tekniker' })).toBeTruthy()
  })

  it('stänger ett åtgärdat ärende så att det försvinner ur listan', async () => {
    resetManagerTickets([...tickets, resolved])
    renderAs('MANAGER')
    await screen.findByText('3 öppna ärenden i dina fastigheter')

    fireEvent.click(screen.getByRole('button', { name: 'Stäng ärende #15' }))

    expect(
      await screen.findByText('2 öppna ärenden i dina fastigheter'),
    ).toBeTruthy()
    expect(screen.queryByText('Element fixat')).toBeNull()
    expect(screen.getByRole('status')).toHaveProperty(
      'textContent',
      'Ärende #15 är stängt.',
    )
  })

  it('visar ett fel om ärendet inte kunde stängas', async () => {
    resetManagerTickets([...tickets, resolved])
    server.use(
      http.patch(
        '/api/tickets/:ticketId/close',
        () => new HttpResponse(null, { status: 409 }),
      ),
    )
    renderAs('MANAGER')
    fireEvent.click(
      await screen.findByRole('button', { name: 'Stäng ärende #15' }),
    )

    expect(await screen.findByRole('alert')).toHaveProperty(
      'textContent',
      'Kunde inte stänga ärendet. Ladda om sidan och försök igen.',
    )
    expect(screen.getByText('Element fixat')).toBeTruthy()
  })

  it.each(['TENANT', 'TECHNICIAN'])(
    '%s får inte se förvaltarens ärendelista',
    async (role) => {
      resetManagerTickets(tickets)
      renderAs(role)
      expect(await screen.findByRole('heading', { level: 1 })).toBeTruthy()
      expect(
        screen.queryByText('2 öppna ärenden i dina fastigheter'),
      ).toBeNull()
    },
  )
})
