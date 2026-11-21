// Låtsas-API (msw) för ärenden, samma kontrakt som TicketController. Används i testerna.
import { http, HttpResponse } from 'msw'
import { testUsers, tokenFor } from '../auth/authHandlers'
import type { ManagerOpenTicket, Ticket } from './ticketApi'

let tickets: Ticket[] = []
let managerTickets: ManagerOpenTicket[] = []

/** Sätt förvaltarens ärenden inför ett test. */
export function resetManagerTickets(start: ManagerOpenTicket[] = []) {
  managerTickets = [...start]
}

/** Sätt hyresgästens ärenden inför ett test (nyaste först, som backend). */
export function resetTickets(start: Ticket[] = []) {
  tickets = [...start]
}

export const ticketHandlers = [
  http.get('/api/tickets/open', ({ request }) => {
    const manager = testUsers.find(
      (u) =>
        u.role === 'MANAGER' &&
        request.headers.get('Authorization') === `Bearer ${tokenFor(u)}`,
    )
    if (!manager) return new HttpResponse(null, { status: 403 })
    return HttpResponse.json(
      managerTickets.filter((ticket) => ticket.status !== 'CLOSED'),
    )
  }),
  http.get('/api/tickets/mine', ({ request }) => {
    const tenant = testUsers.find(
      (u) =>
        u.role === 'TENANT' &&
        request.headers.get('Authorization') === `Bearer ${tokenFor(u)}`,
    )
    if (!tenant) return new HttpResponse(null, { status: 403 })
    return HttpResponse.json(tickets)
  }),
]
