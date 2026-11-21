import { apiFetch } from '../../shared/apiClient'
import type {
  TicketCategory,
  TicketPriority,
  TicketStatus,
} from '../../shared/types'

// Samma fält som entiteten Ticket i backend.
export type Ticket = {
  id: number
  apartmentId: number
  createdBy: number
  assignedTo: number | null
  category: TicketCategory
  priority: TicketPriority
  status: TicketStatus
  description: string
  masterKeyAllowed: boolean
  createdAt: string
  closedAt: string | null
}

// Kompakt svar för förvaltarens öppna ärenden (inklusive fastighet och tilldelad tekniker).
export type ManagerOpenTicket = {
  id: number
  propertyId: number
  propertyName: string
  apartmentId: number
  apartmentNumber: string
  category: TicketCategory
  priority: TicketPriority
  status: TicketStatus
  description: string
  assignedTo: number | null
  assignedTechnicianName: string | null
  createdAt: string
}

export type TechnicianOption = {
  id: number
  name: string
}

export type TicketAssignmentResponse = {
  id: number
  assignedTo: number
  assignedTechnicianName: string
  status: TicketStatus
}

export const ticketApi = {
  mine: () => apiFetch<Ticket[]>('/api/tickets/mine'),
  openForManager: () => apiFetch<ManagerOpenTicket[]>('/api/tickets/open'),
  technicians: () => apiFetch<TechnicianOption[]>('/api/tickets/technicians'),
  assignedToMe: () => apiFetch<Ticket[]>('/api/tickets/assigned'),
  assignTechnician: (ticketId: number, technicianId: number) =>
    apiFetch<TicketAssignmentResponse>(`/api/tickets/${ticketId}/assign`, {
      method: 'PATCH',
      body: JSON.stringify({ technicianId }),
    }),
}
