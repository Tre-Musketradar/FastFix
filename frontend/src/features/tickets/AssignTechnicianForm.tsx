import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { ApiError } from '../../shared/apiClient'
import { ticketApi, type ManagerOpenTicket } from './ticketApi'

type Props = {
  ticket: ManagerOpenTicket
  managerId: number
  onCancel: () => void
  onAssigned: () => void
}

export function AssignTechnicianForm({
  ticket,
  managerId,
  onCancel,
  onAssigned,
}: Props) {
  const [technicianId, setTechnicianId] = useState(
    ticket.assignedTo?.toString() ?? '',
  )
  const [validationError, setValidationError] = useState('')
  const client = useQueryClient()
  const queryKey = ['tickets', 'open', managerId]

  const technicians = useQuery({
    queryKey: ['tickets', 'technicians'],
    queryFn: ticketApi.technicians,
    retry: false,
  })
  const assignment = useMutation({
    mutationFn: (id: number) => ticketApi.assignTechnician(ticket.id, id),
    onSuccess: (result) => {
      client.setQueryData<ManagerOpenTicket[]>(queryKey, (previous) =>
        previous?.map((item) =>
          item.id === result.id
            ? {
                ...item,
                assignedTo: result.assignedTo,
                assignedTechnicianName: result.assignedTechnicianName,
                status: result.status,
              }
            : item,
        ),
      )
      void client.invalidateQueries({ queryKey })
      void client.invalidateQueries({ queryKey: ['tickets', 'assigned'] })
      onAssigned()
    },
  })

  const apiError = assignment.error
    ? assignment.error instanceof ApiError && assignment.error.status === 409
      ? 'Ärendet kan inte tilldelas eftersom det är stängt.'
      : 'Kunde inte tilldela teknikern. Försök igen.'
    : null

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        if (!technicianId) {
          setValidationError('Välj en tekniker.')
          return
        }
        setValidationError('')
        assignment.mutate(Number(technicianId))
      }}
      className="flex flex-col gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4"
    >
      <p className="font-semibold">
        Tilldela tekniker till ärende #{ticket.id}
      </p>
      {technicians.isPending ? (
        <p>Laddar tekniker…</p>
      ) : technicians.isError ? (
        <p role="alert" className="text-red-700">
          Kunde inte hämta tekniker.
        </p>
      ) : technicians.data.length === 0 ? (
        <p>Det finns inga tekniker att välja.</p>
      ) : (
        <>
          <label
            htmlFor={`technician-for-${ticket.id}`}
            className="font-medium"
          >
            Tekniker
          </label>
          <select
            id={`technician-for-${ticket.id}`}
            value={technicianId}
            onChange={(event) => {
              setTechnicianId(event.target.value)
              setValidationError('')
            }}
            className="w-full max-w-sm rounded-lg border border-slate-300 bg-white px-3 py-2"
          >
            <option value="">Välj tekniker</option>
            {technicians.data.map((technician) => (
              <option key={technician.id} value={technician.id}>
                {technician.name}
              </option>
            ))}
          </select>
          {validationError && (
            <p role="alert" className="text-red-700">
              {validationError}
            </p>
          )}
          {apiError && (
            <p role="alert" className="text-red-700">
              {apiError}
            </p>
          )}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={assignment.isPending}
              className="rounded-lg bg-blue-700 px-4 py-2 font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
            >
              {assignment.isPending ? 'Sparar…' : 'Spara tilldelning'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2"
            >
              Avbryt
            </button>
          </div>
        </>
      )}
      {(technicians.isPending ||
        technicians.isError ||
        technicians.data?.length === 0) && (
        <button
          type="button"
          onClick={onCancel}
          className="self-start underline"
        >
          Avbryt
        </button>
      )}
    </form>
  )
}
