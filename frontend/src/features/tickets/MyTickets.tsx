import { useQuery } from '@tanstack/react-query'
import { Wrench } from 'lucide-react'
import { useState } from 'react'
import { StatusBadge } from '../../shared/StatusBadge'
import { ticketApi, type Ticket } from './ticketApi'
import { TicketDetailsModal } from './TicketDetailsModal'
import { categoryLabels, formatDate } from './ticketLabels'

// Hyresgästens ärenden (story 7). Backend skickar bara den egna lägenhetens
// ärenden, nyaste först, så listan visas i den ordningen.
export function MyTickets({ userId }: { userId: number }) {
  const [selected, setSelected] = useState<Ticket | null>(null)
  const tickets = useQuery({
    queryKey: ['tickets', 'mine', userId],
    queryFn: ticketApi.mine,
    retry: false,
  })

  if (tickets.isPending) {
    return <p className="text-slate-600">Laddar ärenden…</p>
  }
  if (tickets.isError) {
    return (
      <p role="alert" className="text-red-700">
        Kunde inte hämta dina ärenden.
      </p>
    )
  }
  if (tickets.data.length === 0) {
    return (
      <p className="rounded-xl bg-white p-6 text-slate-600 shadow-sm">
        Du har inga ärenden än.
      </p>
    )
  }

  return (
    <>
      <ul className="flex flex-col gap-3">
        {tickets.data.map((ticket) => (
          <li key={ticket.id}>
            <button
              type="button"
              onClick={() => setSelected(ticket)}
              className="flex w-full flex-col gap-3 rounded-xl bg-white p-5 text-left shadow-sm hover:ring-2 hover:ring-blue-700/20"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                  <Wrench size={18} aria-hidden="true" />
                </span>
                <span className="text-lg font-semibold">
                  {categoryLabels[ticket.category]}
                </span>
                <span className="ml-auto">
                  <StatusBadge status={ticket.status} />
                </span>
              </span>
              <span className="line-clamp-2 text-slate-800">
                {ticket.description}
              </span>
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
