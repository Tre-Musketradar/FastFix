import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
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

  it('visar bara de statusar teknikern får byta till', async () => {
    resetTechnicianTickets(tickets)
    renderAs('TECHNICIAN')

    const urgent = within(
      await screen.findByRole('group', { name: 'Ändra status på ärende #6' }),
    )
    expect(urgent.getByRole('button', { name: 'Väntar' })).toBeTruthy()
    expect(urgent.getByRole('button', { name: 'Åtgärdad' })).toBeTruthy()
    expect(urgent.queryByRole('button', { name: 'Pågår' })).toBeNull()

    const assigned = within(
      screen.getByRole('group', { name: 'Ändra status på ärende #4' }),
    )
    expect(assigned.getAllByRole('button').map((b) => b.textContent)).toEqual([
      'Pågår',
    ])
  })

  it('ändrar status och skickar den nya statusen till backend', async () => {
    let body: unknown
    server.events.on('request:start', async ({ request }) => {
      if (request.method === 'PATCH') body = await request.clone().json()
    })
    resetTechnicianTickets(tickets)
    renderAs('TECHNICIAN')

    const group = await screen.findByRole('group', {
      name: 'Ändra status på ärende #4',
    })
    fireEvent.click(within(group).getByRole('button', { name: 'Pågår' }))

    // Listan hämtas igen: kortet visar Pågår och erbjuder Väntar/Åtgärdad.
    const updated = within(
      await screen.findByRole('group', { name: 'Ändra status på ärende #4' }),
    )
    expect(await updated.findByRole('button', { name: 'Väntar' })).toBeTruthy()
    expect(body).toEqual({ status: 'IN_PROGRESS' })
    server.events.removeAllListeners()
  })

  it('tar bort åtgärdade ärenden ur listan och bekräftar', async () => {
    resetTechnicianTickets(tickets)
    renderAs('TECHNICIAN')

    const group = await screen.findByRole('group', {
      name: 'Ändra status på ärende #6',
    })
    fireEvent.click(within(group).getByRole('button', { name: 'Åtgärdad' }))

    expect((await screen.findByRole('status')).textContent).toBe(
      'Ärende #6 är markerat som åtgärdat.',
    )
    await waitFor(() => expect(screen.getAllByRole('listitem')).toHaveLength(1))
    expect(
      screen.queryByRole('group', { name: 'Ändra status på ärende #6' }),
    ).toBeNull()
  })

  it('visar ett fel om statusen inte kan ändras', async () => {
    server.use(
      http.patch(
        '/api/tickets/:ticketId/status',
        () => new HttpResponse(null, { status: 409 }),
      ),
    )
    resetTechnicianTickets(tickets)
    renderAs('TECHNICIAN')

    const group = await screen.findByRole('group', {
      name: 'Ändra status på ärende #4',
    })
    fireEvent.click(within(group).getByRole('button', { name: 'Pågår' }))

    expect((await screen.findByRole('alert')).textContent).toBe(
      'Kunde inte ändra status. Ladda om sidan och försök igen.',
    )
  })
})
