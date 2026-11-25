import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ticketApi } from './ticketApi'

// Förvaltaren stänger ett åtgärdat ärende (story 13). Backend tillåter bara
// Åtgärdad → Stängd, så knappen visas bara för åtgärdade ärenden.
export function CloseTicketButton({
  ticketId,
  onClosed,
}: {
  ticketId: number
  onClosed: () => void
}) {
  const client = useQueryClient()
  const close = useMutation({
    mutationFn: () => ticketApi.close(ticketId),
    onSuccess: () => {
      onClosed()
      // Förvaltarens lista döljer stängda ärenden, hyresgästens visar Stängd.
      void client.invalidateQueries({ queryKey: ['tickets'] })
    },
  })

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        disabled={close.isPending}
        onClick={() => close.mutate()}
        aria-label={`Stäng ärende #${ticketId}`}
        className="rounded-lg bg-green-700 px-3 py-2 font-semibold text-white hover:bg-green-800 disabled:opacity-50"
      >
        Stäng ärende
      </button>
      {close.isError && (
        <p role="alert" className="text-xs text-red-700">
          Kunde inte stänga ärendet. Ladda om sidan och försök igen.
        </p>
      )}
    </div>
  )
}
