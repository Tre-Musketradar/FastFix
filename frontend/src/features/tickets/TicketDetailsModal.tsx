import { X } from 'lucide-react'
import { useEffect } from 'react'
import { StatusBadge } from '../../shared/StatusBadge'
import type { Ticket } from './ticketApi'
import { categoryLabels, formatDateTime, priorityLabels } from './ticketLabels'

// Detaljvyn för ett ärende. Historik och kommentarer kommer med story 9 och 18.
export function TicketDetailsModal({
  ticket,
  onClose,
}: {
  ticket: Ticket
  onClose: () => void
}) {
  // Escape stänger, som en vanlig dialog
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-10 flex items-center justify-center bg-slate-900/50 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="ticket-details-title"
        className="w-full max-w-lg rounded-xl bg-white p-6 shadow-lg"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-slate-600">Ärende #{ticket.id}</p>
            <h2 id="ticket-details-title" className="text-xl font-bold">
              {categoryLabels[ticket.category]}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={ticket.status} />
            <button
              type="button"
              onClick={onClose}
              aria-label="Stäng"
              className="flex h-11 w-11 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100"
            >
              <X size={20} aria-hidden="true" />
            </button>
          </div>
        </div>

        <p className="mt-4 whitespace-pre-line text-slate-800">
          {ticket.description}
        </p>

        <dl className="mt-6 grid grid-cols-2 gap-4">
          <div>
            <dt className="text-sm text-slate-600">Skapad</dt>
            <dd className="font-semibold">
              {formatDateTime(ticket.createdAt)}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-slate-600">Prioritet</dt>
            <dd className="font-semibold">{priorityLabels[ticket.priority]}</dd>
          </div>
          <div>
            <dt className="text-sm text-slate-600">Huvudnyckel</dt>
            <dd className="font-semibold">
              {ticket.masterKeyAllowed ? 'Ja' : 'Nej'}
            </dd>
          </div>
          {ticket.closedAt && (
            <div>
              <dt className="text-sm text-slate-600">Stängd</dt>
              <dd className="font-semibold">
                {formatDateTime(ticket.closedAt)}
              </dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  )
}
