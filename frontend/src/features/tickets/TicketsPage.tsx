import { useAuth } from '../auth/useAuth'
import type { Role } from '../../shared/types'
import { MyTickets } from './MyTickets'
import { ManagerOpenTickets } from './ManagerOpenTickets'
import { TechnicianAssignments } from './TechnicianAssignments'

// Startsidan för varje roll. Hyresgästens och förvaltarens listor är implementerade.
// Teknikerns lista kommer i en separat story.
const titles: Record<Role, { title: string; text: string }> = {
  TENANT: {
    title: 'Mina ärenden',
    text: 'Här ser du dina felanmälningar och hur det går med dem.',
  },
  TECHNICIAN: {
    title: 'Mina uppdrag',
    text: 'Här ser du ärendena som du har fått.',
  },
  MANAGER: {
    title: 'Öppna ärenden',
    text: 'Här ser du alla ärenden som inte är stängda.',
  },
}

export function TicketsPage() {
  const { user } = useAuth()
  if (!user) return null

  const { title, text } = titles[user.role]
  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <p className="text-slate-600">{text}</p>
      </div>
      {user.role === 'TENANT' && <MyTickets userId={user.id} />}
      {user.role === 'MANAGER' && <ManagerOpenTickets userId={user.id} />}
      {user.role === 'TECHNICIAN' && <TechnicianAssignments userId={user.id} />}
    </section>
  )
}
