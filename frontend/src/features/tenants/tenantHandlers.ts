// Låtsas-API (msw) för hyresgäster, samma kontrakt som TenantController. Används i testerna.
import { http, HttpResponse } from 'msw'
import { testUsers, tokenFor } from '../auth/authHandlers'
import type { ApartmentSummary, CreateTenantRequest } from './TenantApi'

let available: ApartmentSummary[] = []
let tenantApartment: ApartmentSummary | null = null
const takenEmails = new Set<string>()
let nextId = 100

/** Lediga lägenheter för förvaltaren och den inloggade hyresgästens lägenhet. */
export function resetTenants(
  start: ApartmentSummary[] = [],
  ownApartment: ApartmentSummary | null = null,
) {
  available = start.map((apartment) => ({ ...apartment }))
  tenantApartment = ownApartment
  takenEmails.clear()
  testUsers.forEach((user) => takenEmails.add(user.email))
}

const userFrom = (request: Request, role: string) =>
  testUsers.find(
    (u) =>
      u.role === role &&
      request.headers.get('Authorization') === `Bearer ${tokenFor(u)}`,
  )

export const tenantHandlers = [
  http.get('/api/tenants/available-apartments', ({ request }) => {
    if (!userFrom(request, 'MANAGER')) {
      return new HttpResponse(null, { status: 403 })
    }
    return HttpResponse.json(available)
  }),

  http.post('/api/tenants', async ({ request }) => {
    if (!userFrom(request, 'MANAGER')) {
      return new HttpResponse(null, { status: 403 })
    }
    const body = (await request.json()) as CreateTenantRequest
    const email = body.email.trim().toLowerCase()
    if (takenEmails.has(email)) {
      return HttpResponse.json(
        { message: 'E-postadressen används redan.' },
        { status: 409 },
      )
    }
    const apartment = available.find((a) => a.id === body.apartmentId)
    if (!apartment) {
      return HttpResponse.json(
        { message: 'Lägenheten har redan en hyresgäst.' },
        { status: 409 },
      )
    }
    takenEmails.add(email)
    available = available.filter((a) => a.id !== apartment.id)
    return HttpResponse.json(
      { id: nextId++, name: body.name, email, apartmentId: apartment.id },
      { status: 201 },
    )
  }),

  http.get('/api/tenants/me/apartment', ({ request }) => {
    if (!userFrom(request, 'TENANT')) {
      return new HttpResponse(null, { status: 403 })
    }
    if (!tenantApartment) {
      return HttpResponse.json(
        { message: 'Du är inte kopplad till någon lägenhet.' },
        { status: 404 },
      )
    }
    return HttpResponse.json(tenantApartment)
  }),
]
