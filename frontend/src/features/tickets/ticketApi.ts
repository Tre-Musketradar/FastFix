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

export const ticketApi = {
  mine: () => apiFetch<Ticket[]>('/api/tickets/mine'),
}
