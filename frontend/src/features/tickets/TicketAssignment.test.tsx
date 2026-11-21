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
import type { ManagerOpenTicket } from './ticketApi'
import { resetManagerTickets, ticketHandlers } from './ticketHandlers'

const server = setupServer(...authHandlers, ...pingHandlers, ...ticketHandlers)

const sample: ManagerOpenTicket = {
  id: 55,
  propertyId: 1,
  propertyName: 'Solrosen',
  apartmentId: 10,
  apartmentNumber: '1001',
  category: 'PLUMBING',
  priority: 'NORMAL',
  status: 'NEW',
  description: 'Kökskranen läcker',
  assignedTo: null,
  assignedTechnicianName: null,
  createdAt: '2026-11-21T08:00:00Z',
}

beforeAll(() => server.listen({ onUnhandledFrame: 'error' }))
beforeEach(() => resetManagerTickets([sample].map((t) => ({ ...t }))))
afterEach(() => {
  cleanup()
  server.resetHandlers()
  localStorage.clear()
})
afterAll(() => server.close())

function renderAs(role: 'MANAGER' | 'TENANT' | 'TECHNICIAN') {
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

describe('Tilldela tekniker (#18)', () => {
  it('visar bara tekniker i rullistan och kräver ett val', async () => {
    renderAs('MANAGER')
    fireEvent.click(await screen.findByRole('button', { name: 'Tilldela' }))
    const field = await screen.findByLabelText('Tekniker')
    expect(
      within(field).getByRole('option', { name: 'Ali Hassan' }),
    ).toBeTruthy()
    expect(
      within(field).queryByRole('option', { name: 'Maria Lindqvist' }),
    ).toBeNull()
    expect(
      within(field).queryByRole('option', { name: 'Anna Karlsson' }),
    ).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Spara tilldelning' }))
    expect(screen.getByRole('alert').textContent).toContain('Välj en tekniker.')
  })

  it('uppdaterar status till Tilldelad och visar teknikern direkt i listan', async () => {
    renderAs('MANAGER')
    fireEvent.click(await screen.findByRole('button', { name: 'Tilldela' }))
    fireEvent.change(await screen.findByLabelText('Tekniker'), {
      target: { value: '3' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Spara tilldelning' }))
    expect(await screen.findByRole('status')).toHaveProperty(
      'textContent',
      'Teknikern har tilldelats ärendet.',
    )
    const row = screen
      .getAllByRole('row')
      .find((element) => within(element).queryByText('Kökskranen läcker'))!
    expect(within(row).getByText('Tilldelad')).toBeTruthy()
    expect(within(row).getByText('Ali Hassan')).toBeTruthy()
  })

  it('visar tilldelningen i teknikerns Mina uppdrag', async () => {
    resetManagerTickets([
      {
        ...sample,
        status: 'ASSIGNED',
        assignedTo: 3,
        assignedTechnicianName: 'Ali Hassan',
      },
    ])
    renderAs('TECHNICIAN')
    expect(await screen.findByText('Kökskranen läcker')).toBeTruthy()
    expect(screen.getByText('Tilldelad')).toBeTruthy()
    expect(screen.queryByRole('button', { name: 'Tilldela' })).toBeNull()
  })

  it('visar ett tomt läge för tekniker utan uppdrag', async () => {
    resetManagerTickets([])
    renderAs('TECHNICIAN')
    expect(
      await screen.findByText('Du har inga tilldelade ärenden.'),
    ).toBeTruthy()
  })

  it('visar aldrig tilldelningskontroll för hyresgäster', async () => {
    renderAs('TENANT')
    expect(
      await screen.findByRole('heading', { name: 'Mina ärenden' }),
    ).toBeTruthy()
    expect(screen.queryByRole('button', { name: 'Tilldela' })).toBeNull()
  })
})
