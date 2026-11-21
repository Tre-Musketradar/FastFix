import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { StatusBadge } from '../../shared/StatusBadge'
import type { TicketStatus } from '../../shared/types'
import { ticketApi } from './ticketApi'
import { categoryLabels, formatDate, priorityLabels } from './ticketLabels'

const summary: { status: TicketStatus; title: string }[] = [
  { status: 'NEW', title: 'Nya' },
  { status: 'ASSIGNED', title: 'Tilldelade' },
  { status: 'IN_PROGRESS', title: 'Pågår' },
  { status: 'WAITING', title: 'Väntar' },
  { status: 'RESOLVED', title: 'Åtgärdade' },
]

// Endast för förvaltare. TicketsPage styr vilken roll som får se komponenten.
// Servern verifierar dessutom MANAGER och filtrerar på förvaltarens fastigheter.
export function ManagerOpenTickets({ userId }: { userId: number }) {
  const [search, setSearch] = useState('')
  const [propertyId, setPropertyId] = useState('all')
  const tickets = useQuery({
    queryKey: ['tickets', 'open', userId],
    queryFn: ticketApi.openForManager,
    retry: false,
  })

  const allTickets = useMemo(() => tickets.data ?? [], [tickets.data])
  const properties = useMemo(
    () =>
      Array.from(
        new Map(
          allTickets.map((ticket) => [ticket.propertyId, ticket.propertyName]),
        ),
        ([id, name]) => ({ id, name }),
      ).sort((a, b) => a.name.localeCompare(b.name, 'sv')),
    [allTickets],
  )

  const visibleTickets = useMemo(() => {
    const searchTerm = search.trim().toLocaleLowerCase('sv')
    return allTickets.filter((ticket) => {
      if (propertyId !== 'all' && ticket.propertyId !== Number(propertyId)) {
        return false
      }
      if (!searchTerm) return true
      return [
        ticket.propertyName,
        ticket.apartmentNumber,
        categoryLabels[ticket.category],
        ticket.description,
        ticket.assignedTechnicianName ?? '',
      ].some((value) => value.toLocaleLowerCase('sv').includes(searchTerm))
    })
  }, [allTickets, propertyId, search])

  if (tickets.isPending) {
    return <p className="text-slate-600">Laddar öppna ärenden…</p>
  }
  if (tickets.isError) {
    return (
      <p role="alert" className="text-red-700">
        Kunde inte hämta öppna ärenden.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm text-slate-600">
        {allTickets.length} öppna ärenden i dina fastigheter
      </p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {summary.map(({ status, title }) => (
          <div
            key={status}
            className={`rounded-xl border p-4 shadow-sm ${
              status === 'NEW' &&
              allTickets.some((ticket) => ticket.status === 'NEW')
                ? 'border-blue-300 bg-blue-50'
                : 'border-slate-200 bg-white'
            }`}
          >
            <p className="text-sm text-slate-600">{title}</p>
            <p className="mt-1 text-2xl font-bold">
              {allTickets.filter((ticket) => ticket.status === status).length}
            </p>
          </div>
        ))}
      </div>

      {allTickets.length === 0 ? (
        <p className="rounded-xl bg-white p-6 text-slate-600 shadow-sm">
          Det finns inga öppna ärenden.
        </p>
      ) : (
        <>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex-1">
              <label htmlFor="manager-ticket-search" className="sr-only">
                Sök ärenden
              </label>
              <input
                id="manager-ticket-search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Sök ärende eller lägenhet"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
              />
            </div>
            <div>
              <label htmlFor="manager-property-filter" className="sr-only">
                Filtrera fastighet
              </label>
              <select
                id="manager-property-filter"
                value={propertyId}
                onChange={(event) => setPropertyId(event.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 sm:w-56"
              >
                <option value="all">Alla fastigheter</option>
                {properties.map((property) => (
                  <option key={property.id} value={property.id}>
                    {property.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {visibleTickets.length === 0 ? (
            <p className="rounded-xl bg-white p-6 text-slate-600 shadow-sm">
              Inga ärenden matchar sökningen.
            </p>
          ) : (
            <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-slate-100 text-slate-700">
                  <tr>
                    <th scope="col" className="px-4 py-3">
                      Fastighet
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Lägenhet
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Kategori
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Beskrivning
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Prioritet
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Status
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Tilldelad tekniker
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {visibleTickets.map((ticket) => (
                    <tr
                      key={ticket.id}
                      className={ticket.status === 'NEW' ? 'bg-blue-50' : ''}
                    >
                      <td className="px-4 py-3 font-semibold">
                        {ticket.propertyName}
                      </td>
                      <td className="px-4 py-3">{ticket.apartmentNumber}</td>
                      <td className="px-4 py-3">
                        {categoryLabels[ticket.category]}
                      </td>
                      <td className="max-w-56 px-4 py-3">
                        <p className="line-clamp-2">{ticket.description}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          #{ticket.id} · {formatDate(ticket.createdAt)}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        {priorityLabels[ticket.priority]}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={ticket.status} />
                      </td>
                      <td className="px-4 py-3">
                        {ticket.assignedTechnicianName ?? 'Ej tilldelad'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  )
}
