// Låtsas-API (msw) för inloggningen, enligt kontraktet i
// docs/sprintar/sprint-1/plan-story-1.md. Används i testerna.
import { http, HttpResponse } from 'msw'
import type { User } from '../../shared/types'

export const testUsers: User[] = [
  {
    id: 1,
    name: 'Maria Lindqvist',
    email: 'forvaltare@felanmalan.se',
    role: 'MANAGER',
  },
  {
    id: 3,
    name: 'Ali Hassan',
    email: 'tekniker@felanmalan.se',
    role: 'TECHNICIAN',
  },
  {
    id: 6,
    name: 'Anna Karlsson',
    email: 'hyresgast@felanmalan.se',
    role: 'TENANT',
  },
]

export const tokenFor = (user: User) => `test-token-${user.id}`

export const authHandlers = [
  http.post('/api/auth/login', async ({ request }) => {
    const { email, password } = (await request.json()) as {
      email: string
      password: string
    }
    const user = testUsers.find((u) => u.email === email)
    if (!user || password !== 'test1234') {
      return HttpResponse.json(
        { message: 'Fel e-post eller lösenord' },
        { status: 401 },
      )
    }
    return HttpResponse.json({ token: tokenFor(user), user })
  }),

  http.get('/api/auth/me', ({ request }) => {
    const header = request.headers.get('Authorization')
    const user = testUsers.find((u) => header === `Bearer ${tokenFor(u)}`)
    if (!user) return new HttpResponse(null, { status: 401 })
    return HttpResponse.json(user)
  }),
]
