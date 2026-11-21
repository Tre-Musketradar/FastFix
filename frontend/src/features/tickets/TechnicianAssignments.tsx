import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { StatusBadge } from '../../shared/StatusBadge'
import { TicketDetailsModal } from './TicketDetailsModal'
import { ticketApi, type Ticket } from './ticketApi'
import { categoryLabels, formatDate } from './ticketLabels'

export function TechnicianAssignments({ userId }: { userId: number }) {
  const [selected, setSelected] = useState<Ticket | null>(null)
  const assignments = useQuery({
    queryKey: ['tickets', 'assigned', userId],
    queryFn: ticketApi.assignedToMe,
    retry: false,
  })

  if (assignments.isPending) return <p>Laddar uppdrag…</p>
  if (assignments.isError) {
    return (
      <p role="alert" className="text-red-700">
        Kunde inte hämta dina uppdrag.
      </p>
    )
  }
  if (assignments.data.length === 0) {
    return (
      <p className="rounded-xl bg-white p-6 text-slate-600 shadow-sm">
        Du har inga tilldelade ärenden.
      </p>
    )
  }

  return (
    <>
      <ul className="flex flex-col gap-3">
        {assignments.data.map((ticket) => (
          <li key={ticket.id}>
            <button
              type="button"
              onClick={() => setSelected(ticket)}
              className="flex w-full flex-col gap-2 rounded-xl bg-white p-5 text-left shadow-sm hover:ring-2 hover:ring-blue-700/20"
            >
              <span className="flex items-center justify-between gap-3">
                <span className="font-semibold">
                  #{ticket.id} · {categoryLabels[ticket.category]}
                </span>
                <StatusBadge status={ticket.status} />
              </span>
              <span className="line-clamp-2">{ticket.description}</span>
              <span className="text-sm text-slate-600">
                Skapad {formatDate(ticket.createdAt)}
              </span>
            </button>
          </li>
        ))}
      </ul>
      {selected && (
        <TicketDetailsModal
          ticket={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  )
}
