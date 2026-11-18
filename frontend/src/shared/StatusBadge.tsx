import type { TicketStatus } from './types'

// Färgerna från mockuperna (docs/frontend-plan.md): ljus bakgrund och mörk text.
const statuses: Record<TicketStatus, { label: string; className: string }> = {
  NEW: { label: 'Ny', className: 'bg-blue-100 text-blue-800' },
  ASSIGNED: { label: 'Tilldelad', className: 'bg-purple-100 text-purple-800' },
  IN_PROGRESS: { label: 'Pågår', className: 'bg-orange-100 text-orange-800' },
  WAITING: { label: 'Väntar', className: 'bg-yellow-100 text-yellow-800' },
  RESOLVED: { label: 'Åtgärdad', className: 'bg-green-100 text-green-800' },
  CLOSED: { label: 'Stängd', className: 'bg-slate-200 text-slate-700' },
}

export function StatusBadge({ status }: { status: TicketStatus }) {
  const { label, className } = statuses[status]
  return (
    <span
      className={`rounded-full px-3 py-1 text-sm font-semibold ${className}`}
    >
      {label}
    </span>
  )
}
