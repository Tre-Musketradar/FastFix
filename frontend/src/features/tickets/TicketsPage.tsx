import { useAuth } from '../auth/useAuth'
import type { Role } from '../../shared/types'

// Startsidan för varje roll. Bara rubriker tills listorna byggs i sprint 2
// (story 7, 8 och 10).
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
    <section className="flex flex-col gap-2">
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      <p className="text-slate-600">{text}</p>
    </section>
  )
}
