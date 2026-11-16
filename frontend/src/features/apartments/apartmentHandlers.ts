// Låtsas-API för lägenheter. Samma endpoints och begränsningar som backend.
import { http, HttpResponse } from 'msw'
import { testUsers, tokenFor } from '../auth/authHandlers'
import { ownsTestProperty } from '../properties/propertyHandlers'
import type { Apartment } from './apartmentApi'

let apartments: Apartment[] = []
let nextId = 1

export function resetApartments(start: Apartment[] = []) {
  apartments = [...start]
  nextId = Math.max(0, ...start.map((apartment) => apartment.id)) + 1
}

const managerFrom = (request: Request) =>
  testUsers.find(
    (user) =>
      user.role === 'MANAGER' &&
      request.headers.get('Authorization') === `Bearer ${tokenFor(user)}`,
  )

export const apartmentHandlers = [
  http.get('/api/properties/:propertyId/apartments', ({ request, params }) => {
    const manager = managerFrom(request)
    if (!manager) return new HttpResponse(null, { status: 403 })

    const propertyId = Number(params.propertyId)
    if (!ownsTestProperty(propertyId, manager.id)) {
      return new HttpResponse(null, { status: 404 })
    }
    return HttpResponse.json(
      apartments
        .filter((apartment) => apartment.propertyId === propertyId)
        .toReversed(),
    )
  }),

  http.post(
    '/api/properties/:propertyId/apartments',
    async ({ request, params }) => {
      const manager = managerFrom(request)
      if (!manager) return new HttpResponse(null, { status: 403 })

      const propertyId = Number(params.propertyId)
      if (!ownsTestProperty(propertyId, manager.id)) {
        return new HttpResponse(null, { status: 404 })
      }

      const { number, floor } = (await request.json()) as {
        number: string
        floor: number | null
      }
      if (
        !number?.trim() ||
        number.trim().length > 20 ||
        (floor !== null &&
          (!Number.isInteger(floor) ||
            floor < -2147483648 ||
            floor > 2147483647))
      ) {
        return new HttpResponse(null, { status: 400 })
      }
      const cleanNumber = number.trim()
      if (
        apartments.some(
          (apartment) =>
            apartment.propertyId === propertyId &&
            apartment.number === cleanNumber,
        )
      ) {
        return HttpResponse.json(
          { message: 'Lägenhetsnumret finns redan i fastigheten.' },
          { status: 409 },
        )
      }

      const created: Apartment = {
        id: nextId++,
        propertyId,
        number: cleanNumber,
        floor,
        tenantId: null,
      }
      apartments.push(created)
      return HttpResponse.json(created, { status: 201 })
    },
  ),
]
