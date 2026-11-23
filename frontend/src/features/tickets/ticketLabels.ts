import type { TicketCategory, TicketPriority } from '../../shared/types'

// Svenska namn för backendens enum-värden (docs/frontend-plan.md).
export const categoryLabels: Record<TicketCategory, string> = {
  PLUMBING: 'VVS',
  ELECTRICAL: 'El',
  APPLIANCES: 'Vitvaror',
  VENTILATION: 'Ventilation',
  LOCKS_DOORS: 'Lås och dörrar',
  OTHER: 'Övrigt',
}

export const priorityLabels: Record<TicketPriority, string> = {
  URGENT: 'Akut',
  HIGH: 'Hög',
  NORMAL: 'Normal',
  LOW: 'Låg',
}

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('sv-SE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

export const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString('sv-SE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
