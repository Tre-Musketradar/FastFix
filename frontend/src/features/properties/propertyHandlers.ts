// Låtsas-API (msw) för fastigheter, samma kontrakt som PropertyController. Används i testerna.
import { http, HttpResponse } from 'msw'
import { testUsers, tokenFor } from '../auth/authHandlers'
import type { Property } from './propertyApi'

let properties: Property[] = []
let nextId = 1

/** Töm listan mellan testerna. */
export function resetProperties(start: Property[] = []) {
  properties = [...start]
  nextId = properties.length + 1
}

const managerFrom = (request: Request) =>
  testUsers.find(
    (u) =>
u.role === 'MANAGER' &&
request.headers.get('Authorization') === `Bearer ${tokenFor(u)}`,
)

export const propertyHandlers = [
  http.get('/api/properties', ({ request }) => {
    const manager = managerFrom(request)
    if (!manager) return new HttpResponse(null, { status: 403 })
    return HttpResponse.json(
      properties.filter((p) => p.ownerId === manager.id).toReversed(),
    )
  }),

  http.post('/api/properties', async ({ request }) => {
    const manager = managerFrom(request)
    if (!manager) return new HttpResponse(null, { status: 403 })
    const { name, address } = (await request.json()) as {
      name: string
      address: string
    }
    if (!name?.trim() || !address?.trim()) {
      return new HttpResponse(null, { status: 400 })
    }
    const created = { id: nextId++, name, address, ownerId: manager.id }
    properties.push(created)
    return HttpResponse.json(created, { status: 201 })
  }),
]
