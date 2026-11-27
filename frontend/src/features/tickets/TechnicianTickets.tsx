import { useQuery } from '@tanstack/react-query'
import { KeyRound, Lock, MapPin, Wrench } from 'lucide-react'
import { useState } from 'react'
import { StatusBadge } from '../../shared/StatusBadge'
import type { TicketPriority } from '../../shared/types'
import { ticketApi } from './ticketApi'
import { TicketStatusActions } from './TicketStatusActions'
import { TicketHistory } from './TicketHistory'
import { categoryLabels, formatDate, priorityLabels } from './ticketLabels'

// Akut och hög prioritet sticker ut, så att teknikern ser dem direkt.
const priorityStyles: Record<TicketPriority, string> = {
  URGENT: 'bg-red-100 text-red-800',
  HIGH: 'bg-amber-100 text-amber-800',
  NORMAL: 'bg-slate-100 text-slate-700',
  LOW: 'bg-slate-100 text-slate-700',
}

// Teknikerns uppdrag (story 10). Backend skickar bara ärenden som är tilldelade
// teknikern, utan åtgärdade och stängda, mest brådskande först och sedan äldst först.
// Teknikern ändrar status direkt på kortet (story 11).
export function TechnicianTickets({ userId }: { userId: number }) {
  // Åtgärdade ärenden försvinner ur listan, så teknikern får en bekräftelse.
  const [resolvedId, setResolvedId] = useState<number | null>(null)
  const [historyId, setHistoryId] = useState<number | null>(null)
  const tickets = useQuery({
    queryKey: ['tickets', 'assigned', userId],
    queryFn: ticketApi.assigned,
    retry: false,
  })

  if (tickets.isPending) {
    return <p className="text-slate-600">Laddar uppdrag…</p>
  }
  if (tickets.isError) {
    return (
      <p role="alert" className="text-red-700">
        Kunde inte hämta dina uppdrag.
      </p>
    )
  }
  const confirmation = resolvedId !== null && (
    <p
      role="status"
      className="rounded-xl bg-green-50 p-4 font-medium text-green-800"
    >
      Ärende #{resolvedId} är markerat som åtgärdat.
    </p>
  )

  if (tickets.data.length === 0) {
    return (
      <div className="flex flex-col gap-3">
        {confirmation}
        <p className="rounded-xl bg-white p-6 text-slate-600 shadow-sm">
          Du har inga tilldelade ärenden just nu.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {confirmation}
      <ul className="flex flex-col gap-3">
        {tickets.data.map((ticket) => (
          <li
            key={ticket.id}
            className="flex flex-col gap-3 rounded-xl bg-white p-5 shadow-sm"
          >
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                <Wrench size={18} aria-hidden="true" />
              </span>
              <span className="text-lg font-semibold">
                {categoryLabels[ticket.category]}
              </span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${priorityStyles[ticket.priority]}`}
              >
                {priorityLabels[ticket.priority]}
              </span>
              <span className="ml-auto">
                <StatusBadge status={ticket.status} />
              </span>
            </div>

            <p className="flex items-start gap-2 text-slate-800">
              <MapPin
                size={18}
                aria-hidden="true"
                className="mt-0.5 shrink-0 text-slate-500"
              />
              <span>
                <span className="font-semibold">{ticket.propertyAddress}</span>
                <span className="text-slate-600">
                  {' '}
                  · {ticket.propertyName} · Lgh {ticket.apartmentNumber}
                  {ticket.floor !== null && `, vån ${ticket.floor}`}
                </span>
              </span>
            </p>

            <p className="line-clamp-3 text-slate-800">{ticket.description}</p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
              {ticket.masterKeyAllowed ? (
                <span className="flex items-center gap-1.5 font-medium text-green-800">
                  <KeyRound size={16} aria-hidden="true" />
                  Huvudnyckel får användas
                </span>
              ) : (
                <span className="flex items-center gap-1.5 font-medium text-slate-700">
                  <Lock size={16} aria-hidden="true" />
                  Huvudnyckel får inte användas
                </span>
              )}
              <span className="text-slate-600">
                #{ticket.id} · Skapad {formatDate(ticket.createdAt)}
              </span>
            </div>

            <div>
              <button
                type="button"
                aria-expanded={historyId === ticket.id}
                onClick={() =>
                  setHistoryId(historyId === ticket.id ? null : ticket.id)
                }
                className="text-sm font-semibold text-blue-700 hover:underline"
              >
                {historyId === ticket.id
                  ? 'Dölj historik'
                  : `Visa historik för ärende #${ticket.id}`}
              </button>
              {historyId === ticket.id && (
                <TicketHistory ticketId={ticket.id} />
              )}
            </div>

            <TicketStatusActions
              ticketId={ticket.id}
              status={ticket.status}
              onChanged={(status) =>
                setResolvedId(status === 'RESOLVED' ? ticket.id : null)
              }
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
