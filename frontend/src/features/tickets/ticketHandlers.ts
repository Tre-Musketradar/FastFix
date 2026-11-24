// Låtsas-API (msw) för ärenden, samma kontrakt som TicketController. Används i testerna.
import { http, HttpResponse } from 'msw'
import { testUsers, tokenFor } from '../auth/authHandlers'
import type { ManagerOpenTicket, TechnicianTicket, Ticket } from './ticketApi'

let tickets: Ticket[] = []
let managerTickets: ManagerOpenTicket[] = []
let technicianTickets: TechnicianTicket[] = []

/** Sätt teknikerns ärenden inför ett test (redan filtrerade och sorterade, som backend). */
export function resetTechnicianTickets(start: TechnicianTicket[] = []) {
  technicianTickets = [...start]
}

/** Sätt förvaltarens ärenden inför ett test. */
export function resetManagerTickets(start: ManagerOpenTicket[] = []) {
  managerTickets = [...start]
}

/** Sätt hyresgästens ärenden inför ett test (nyaste först, som backend). */
export function resetTickets(start: Ticket[] = []) {
  tickets = [...start]
}

// Teknikerns tillåtna statusändringar, samma som TicketStatusService i backend.
const technicianTransitions: Record<string, string[]> = {
  ASSIGNED: ['IN_PROGRESS'],
  IN_PROGRESS: ['WAITING', 'RESOLVED'],
  WAITING: ['IN_PROGRESS'],
}

export const ticketHandlers = [
  http.get('/api/tickets/assigned', ({ request }) => {
    const technician = testUsers.find(
      (u) =>
        u.role === 'TECHNICIAN' &&
        request.headers.get('Authorization') === `Bearer ${tokenFor(u)}`,
    )
    if (!technician) return new HttpResponse(null, { status: 403 })
    return HttpResponse.json(technicianTickets)
  }),
  http.patch('/api/tickets/:ticketId/status', async ({ request, params }) => {
    const technician = testUsers.find(
      (u) =>
        u.role === 'TECHNICIAN' &&
        request.headers.get('Authorization') === `Bearer ${tokenFor(u)}`,
    )
    if (!technician) return new HttpResponse(null, { status: 403 })
    const ticket = technicianTickets.find(
      (t) => t.id === Number(params.ticketId),
    )
    if (!ticket) return new HttpResponse(null, { status: 404 })
    const { status } = (await request.json()) as {
      status: TechnicianTicket['status']
    }
    if (!technicianTransitions[ticket.status]?.includes(status)) {
      return new HttpResponse(null, { status: 409 })
    }
    // Åtgärdade ärenden visas inte i teknikerns lista (som i backend).
    technicianTickets =
      status === 'RESOLVED'
        ? technicianTickets.filter((t) => t.id !== ticket.id)
        : technicianTickets.map((t) =>
            t.id === ticket.id ? { ...t, status } : t,
          )
    return HttpResponse.json({ id: ticket.id, status })
  }),
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
  http.get('/api/tickets/technicians', ({ request }) => {
    const manager = testUsers.find(
      (u) =>
        u.role === 'MANAGER' &&
        request.headers.get('Authorization') === `Bearer ${tokenFor(u)}`,
    )
    if (!manager) return new HttpResponse(null, { status: 403 })
    return HttpResponse.json(
      testUsers
        .filter((u) => u.role === 'TECHNICIAN')
        .map(({ id, name }) => ({ id, name })),
    )
  }),
  http.patch('/api/tickets/:ticketId/assign', async ({ request, params }) => {
    const manager = testUsers.find(
      (u) =>
        u.role === 'MANAGER' &&
        request.headers.get('Authorization') === `Bearer ${tokenFor(u)}`,
    )
    if (!manager) return new HttpResponse(null, { status: 403 })
    const ticket = managerTickets.find((t) => t.id === Number(params.ticketId))
    if (!ticket) return new HttpResponse(null, { status: 404 })
    if (ticket.status === 'CLOSED')
      return new HttpResponse(null, { status: 409 })
    const { technicianId } = (await request.json()) as { technicianId?: number }
    const technician = testUsers.find(
      (u) => u.id === technicianId && u.role === 'TECHNICIAN',
    )
    if (!technician) return new HttpResponse(null, { status: 400 })
    ticket.assignedTo = technician.id
    ticket.assignedTechnicianName = technician.name
    ticket.status = 'ASSIGNED'
    return HttpResponse.json({
      id: ticket.id,
      assignedTo: technician.id,
      assignedTechnicianName: technician.name,
      status: ticket.status,
    })
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
