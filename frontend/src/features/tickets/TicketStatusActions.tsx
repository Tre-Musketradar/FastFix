import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { TicketStatus } from '../../shared/types'
import { ticketApi } from './ticketApi'

// Teknikerns statusflöde (docs/frontend-plan.md), samma regler som backend:
// Tilldelad → Pågår, Pågår ⇄ Väntar, Pågår → Åtgärdad.
const nextStatuses: Partial<Record<TicketStatus, TicketStatus[]>> = {
  ASSIGNED: ['IN_PROGRESS'],
  IN_PROGRESS: ['WAITING', 'RESOLVED'],
  WAITING: ['IN_PROGRESS'],
}

const buttonLabels: Partial<Record<TicketStatus, string>> = {
  IN_PROGRESS: 'Pågår',
  WAITING: 'Väntar',
  RESOLVED: 'Åtgärdad',
}

export function TicketStatusActions({
  ticketId,
  status,
  onChanged,
}: {
  ticketId: number
  status: TicketStatus
  onChanged: (status: TicketStatus) => void
}) {
  const client = useQueryClient()
  const change = useMutation({
    mutationFn: (next: TicketStatus) => ticketApi.changeStatus(ticketId, next),
    onSuccess: (result) => {
      onChanged(result.status)
      // Teknikerns lista, hyresgästens och förvaltarens visar statusen.
      void client.invalidateQueries({ queryKey: ['tickets'] })
    },
  })

  const options = nextStatuses[status] ?? []
  if (options.length === 0) return null

  return (
    <div className="flex flex-col gap-2 border-t border-slate-100 pt-3">
      <div
        role="group"
        aria-label={`Ändra status på ärende #${ticketId}`}
        className="flex flex-wrap items-center gap-2"
      >
        <span className="text-sm text-slate-600">Ändra status:</span>
        {options.map((next) => (
          <button
            key={next}
            type="button"
            disabled={change.isPending}
            onClick={() => change.mutate(next)}
            className={`rounded-lg px-3 py-1.5 text-sm font-semibold disabled:opacity-50 ${
              next === 'RESOLVED'
                ? 'bg-green-700 text-white hover:bg-green-800'
                : 'border border-slate-300 bg-white text-slate-800 hover:bg-slate-50'
            }`}
          >
            {buttonLabels[next]}
          </button>
        ))}
      </div>
      {change.isError && (
        <p role="alert" className="text-sm text-red-700">
          Kunde inte ändra status. Ladda om sidan och försök igen.
        </p>
      )}
    </div>
  )
}
