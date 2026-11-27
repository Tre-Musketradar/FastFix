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
import { resetTickets, ticketHandlers } from '../tickets/ticketHandlers'
import type { ApartmentSummary } from './TenantApi'
import { resetTenants, tenantHandlers } from './tenantHandlers'

const server = setupServer(
  ...authHandlers,
  ...pingHandlers,
  ...ticketHandlers,
  ...tenantHandlers,
)

beforeAll(() => server.listen({ onUnhandledFrame: 'error' }))
beforeEach(() => {
  resetTenants()
  resetTickets()
})
afterEach(() => {
  cleanup()
  server.resetHandlers()
  localStorage.clear()
})
afterAll(() => server.close())

const free: ApartmentSummary[] = [
  {
    id: 4,
    propertyName: 'Solrosen',
    propertyAddress: 'Solrosvägen 12',
    number: '1102',
    floor: 1,
  },
  {
    id: 8,
    propertyName: 'Björken',
    propertyAddress: 'Björkgatan 3',
    number: '1002',
    floor: null,
  },
]

function renderAs(role: string, path = '/tenants/new') {
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

function fillIn(values: Record<string, string>) {
  for (const [label, value] of Object.entries(values)) {
    fireEvent.change(screen.getByLabelText(label), { target: { value } })
  }
}

const valid = {
  Namn: 'Test Testsson',
  'E-post': 'test@example.com',
  Lösenord: 'hemligt123',
  'Repetera lösenord': 'hemligt123',
}

describe('AddTenant', () => {
  it('visar bara lediga lägenheter, grupperade per fastighet', async () => {
    resetTenants(free)
    renderAs('MANAGER')

    const select = await screen.findByLabelText('Lägenhet')
    await waitFor(() =>
      expect(within(select).getAllByRole('option')).toHaveLength(3),
    )
    expect(within(select).getByRole('group', { name: 'Solrosen' })).toBeTruthy()
    expect(
      within(select).getByRole('option', { name: '1102 (våning 1)' }),
    ).toBeTruthy()
    expect(within(select).getByRole('option', { name: '1002' })).toBeTruthy()
  })

  it('lägger till en hyresgäst och tar bort lägenheten ur listan', async () => {
    resetTenants(free)
    renderAs('MANAGER')
    const select = await screen.findByLabelText('Lägenhet')
    await waitFor(() =>
      expect(within(select).getAllByRole('option')).toHaveLength(3),
    )

    fillIn({ ...valid, Lägenhet: '4' })
    fireEvent.click(screen.getByRole('button', { name: 'Lägg till hyresgäst' }))

    expect((await screen.findByRole('status')).textContent).toBe(
      'Hyresgästen Test Testsson har lagts till.',
    )
    await waitFor(() =>
      expect(within(select).getAllByRole('option')).toHaveLength(2),
    )
    expect((screen.getByLabelText('Namn') as HTMLInputElement).value).toBe('')
  })

  it('visar fel för tomma fält och olika lösenord utan att skicka', async () => {
    let posted = false
    server.use(
      http.post('/api/tenants', () => {
        posted = true
        return new HttpResponse(null, { status: 201 })
      }),
    )
    resetTenants(free)
    renderAs('MANAGER')
    await screen.findByLabelText('Lägenhet')

    fillIn({ Lösenord: 'hemligt123', 'Repetera lösenord': 'annat123' })
    fireEvent.click(screen.getByRole('button', { name: 'Lägg till hyresgäst' }))

    expect(await screen.findByText('Namn måste anges')).toBeTruthy()
    expect(screen.getByText('E-post är obligatoriskt')).toBeTruthy()
    expect(screen.getByText('Lösenorden matchar inte')).toBeTruthy()
    expect(screen.getByText('Välj en lägenhet')).toBeTruthy()
    expect(posted).toBe(false)
  })

  it('visar serverns meddelande när e-postadressen redan används', async () => {
    resetTenants(free)
    renderAs('MANAGER')
    const select = await screen.findByLabelText('Lägenhet')
    await waitFor(() =>
      expect(within(select).getAllByRole('option')).toHaveLength(3),
    )

    fillIn({ ...valid, 'E-post': 'hyresgast@felanmalan.se', Lägenhet: '8' })
    fireEvent.click(screen.getByRole('button', { name: 'Lägg till hyresgäst' }))

    expect(
      await screen.findByText('E-postadressen används redan.'),
    ).toBeTruthy()
  })

  it('säger till när det inte finns några lediga lägenheter', async () => {
    renderAs('MANAGER')
    expect(
      await screen.findByText(
        'Det finns inga lediga lägenheter i dina fastigheter.',
      ),
    ).toBeTruthy()
  })

  it('förvaltaren har Hyresgäster i menyn', async () => {
    renderAs('MANAGER', '/tickets')
    const menu = await screen.findByRole('navigation', { name: 'Huvudmeny' })
    expect(within(menu).getByRole('link', { name: 'Hyresgäster' })).toBeTruthy()
  })

  it.each(['TENANT', 'TECHNICIAN'])(
    '%s skickas till ärendesidan',
    async (role) => {
      renderAs(role)
      expect(await screen.findByRole('heading', { level: 1 })).toBeTruthy()
      expect(screen.queryByText('Lägg till hyresgäst')).toBeNull()
    },
  )
})

describe('MyApartment', () => {
  it('hyresgästen ser sin lägenhet på startsidan', async () => {
    resetTenants([], free[0])
    renderAs('TENANT', '/tickets')
    const section = await screen.findByRole('region', { name: 'Min lägenhet' })
    expect(section.textContent).toContain('Solrosen, lägenhet 1102')
    expect(section.textContent).toContain('Solrosvägen 12, våning 1')
  })

  it('visar ingenting om hyresgästen saknar lägenhet', async () => {
    renderAs('TENANT', '/tickets')
    await screen.findByRole('heading', { name: 'Mina ärenden' })
    expect(screen.queryByRole('region', { name: 'Min lägenhet' })).toBeNull()
  })
})
