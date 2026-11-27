import { useQuery } from '@tanstack/react-query'
import { ticketApi } from './ticketApi'
import { formatDateTime } from './ticketLabels'
import type { TicketStatus } from '../../shared/types'

const statusLabels: Record<TicketStatus, string> = {
  NEW: 'Ny',
  ASSIGNED: 'Tilldelad',
  IN_PROGRESS: 'Pågår',
  WAITING: 'Väntar',
  RESOLVED: 'Åtgärdad',
  CLOSED: 'Stängd',
}

/** Gemensam historik för hyresgästens, teknikerns och förvaltarens ärendevy. */
export function TicketHistory({ ticketId }: { ticketId: number }) {
  const history = useQuery({
    queryKey: ['tickets', 'history', ticketId],
    queryFn: () => ticketApi.history(ticketId),
    retry: false,
    // Hämta färsk historik när en detaljvy öppnas igen.
    refetchOnMount: 'always',
  })

  return (
    <section aria-label={`Historik för ärende #${ticketId}`} className="mt-4">
      <h3 className="text-base font-semibold">Ärendets historik</h3>

      {history.isPending ? (
        <p className="mt-2 text-sm text-slate-600">Laddar historik…</p>
      ) : history.isError ? (
        <p role="alert" className="mt-2 text-sm text-red-700">
          Kunde inte hämta ärendets historik.
        </p>
      ) : history.data.length === 0 ? (
        <p className="mt-2 text-sm text-slate-600">
          Inga statusändringar registrerade ännu.
        </p>
      ) : (
        <ol className="mt-3 space-y-3 border-l-2 border-slate-200 pl-4">
          {history.data.map((entry) => (
            <li key={entry.id} className="text-sm">
              <p className="font-semibold text-slate-900">
                {entry.oldStatus
                  ? `${statusLabels[entry.oldStatus]} → ${statusLabels[entry.newStatus]}`
                  : `Status: ${statusLabels[entry.newStatus]}`}
              </p>
              <p className="text-slate-600">
                {formatDateTime(entry.changedAt)} · {entry.changedByName}
              </p>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
