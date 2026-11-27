// Låtsas-API (msw) för ärenden, samma kontrakt som TicketController. Används i testerna.
import { http, HttpResponse } from 'msw'
import { testUsers, tokenFor } from '../auth/authHandlers'
import type {
  ManagerOpenTicket,
  TechnicianTicket,
  Ticket,
  TicketHistoryEntry,
} from './ticketApi'

let tickets: Ticket[] = []
let managerTickets: ManagerOpenTicket[] = []
let technicianTickets: TechnicianTicket[] = []
let ticketHistories: Record<number, TicketHistoryEntry[]> = {}

/** Ange historik för de ärenden som används i ett test. */
export function resetTicketHistories(
  start: Record<number, TicketHistoryEntry[]> = {},
) {
  ticketHistories = Object.fromEntries(
    Object.entries(start).map(([id, entries]) => [id, [...entries]]),
  )
}

function recordHistory(
  ticketId: number,
  oldStatus: TicketHistoryEntry['newStatus'],
  newStatus: TicketHistoryEntry['newStatus'],
  changedBy: (typeof testUsers)[number],
) {
  if (oldStatus === newStatus) return
  const entries = (ticketHistories[ticketId] ??= [])
  entries.push({
    id: entries.length + 1,
    oldStatus,
    newStatus,
    changedById: changedBy.id,
    changedByName: changedBy.name,
    changedAt: new Date().toISOString(),
  })
}

/** Sätt teknikerns ärenden inför ett test (redan filtrerade och sorterade, som backend). */
export function resetTechnicianTickets(start: TechnicianTicket[] = []) {
  technicianTickets = [...start]
}

/** Sätt förvaltarens ärenden inför ett test. */
export function resetManagerTickets(start: ManagerOpenTicket[] = []) {
  // Kopior, så att tilldelning/stängning i ett test inte ändrar testets data.
  managerTickets = start.map((ticket) => ({ ...ticket }))
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
  http.get('/api/tickets/:ticketId/history', ({ request, params }) => {
    const user = testUsers.find(
      (u) => request.headers.get('Authorization') === `Bearer ${tokenFor(u)}`,
    )
    if (!user) return new HttpResponse(null, { status: 401 })
    const ticketId = Number(params.ticketId)
    const allowed =
      (user.role === 'TENANT' &&
        tickets.some((ticket) => ticket.id === ticketId)) ||
      (user.role === 'TECHNICIAN' &&
        technicianTickets.some((ticket) => ticket.id === ticketId)) ||
      (user.role === 'MANAGER' &&
        managerTickets.some((ticket) => ticket.id === ticketId))
    if (!allowed) return new HttpResponse(null, { status: 404 })
    return HttpResponse.json(ticketHistories[ticketId] ?? [])
  }),
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
    recordHistory(ticket.id, ticket.status, status, technician)
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
    recordHistory(ticket.id, ticket.status, 'ASSIGNED', manager)
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
  http.patch('/api/tickets/:ticketId/close', ({ request, params }) => {
    const manager = testUsers.find(
      (u) =>
        u.role === 'MANAGER' &&
        request.headers.get('Authorization') === `Bearer ${tokenFor(u)}`,
    )
    if (!manager) return new HttpResponse(null, { status: 403 })
    const ticket = managerTickets.find((t) => t.id === Number(params.ticketId))
    if (!ticket) return new HttpResponse(null, { status: 404 })
    // Samma regel som backend: bara åtgärdade ärenden kan stängas.
    if (ticket.status !== 'RESOLVED')
      return new HttpResponse(null, { status: 409 })
    recordHistory(ticket.id, ticket.status, 'CLOSED', manager)
    ticket.status = 'CLOSED'
    return HttpResponse.json({ id: ticket.id, status: ticket.status })
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
