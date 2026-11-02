import { useEffect, useState } from 'react'

// Testendpoint från projektskelettet: visar att frontend når backend och databasen.
type Ping = { status: string; database: string; users: number }

type State =
  { kind: 'loading' } | { kind: 'ok'; ping: Ping } | { kind: 'error' }

export function PingStatus() {
  const [state, setState] = useState<State>({ kind: 'loading' })

  useEffect(() => {
    fetch('/api/ping')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json() as Promise<Ping>
      })
      .then((ping) => setState({ kind: 'ok', ping }))
      .catch(() => setState({ kind: 'error' }))
  }, [])

  if (state.kind === 'loading') return <p>Kontrollerar backend…</p>
  if (state.kind === 'error') {
    return <p className="text-red-600">Backend svarar inte</p>
  }
  return (
    <p className="text-green-700">
      Backend: {state.ping.status} · Databas: {state.ping.database} · Användare:{' '}
      {state.ping.users}
    </p>
  )
}
