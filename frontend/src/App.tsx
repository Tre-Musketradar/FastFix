import { Navigate, Route, Routes } from 'react-router'
import { LoginPage } from './features/auth/LoginPage'
import { RequireAuth } from './features/auth/RequireAuth'
import { TicketsPage } from './features/tickets/TicketsPage'
import { Layout } from './shared/Layout'

// En rad per sida. Sidorna ligger i sin funktions mapp (docs/projektstruktur.md).
export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        element={
          <RequireAuth>
            <Layout />
          </RequireAuth>
        }
      >
        <Route path="/tickets" element={<TicketsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/tickets" replace />} />
    </Routes>
  )
}
