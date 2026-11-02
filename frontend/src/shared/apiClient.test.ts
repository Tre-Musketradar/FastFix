import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from 'vitest'
import {
  ApiError,
  apiFetch,
  setUnauthorizedHandler,
  tokenStorage,
} from './apiClient'

const server = setupServer(
  http.get('/api/echo', ({ request }) =>
    HttpResponse.json({ auth: request.headers.get('Authorization') }),
  ),
  http.get('/api/expired', () => new HttpResponse(null, { status: 401 })),
)

beforeAll(() => server.listen({ onUnhandledFrame: 'error' }))
afterEach(() => {
  server.resetHandlers()
  localStorage.clear()
})
afterAll(() => server.close())

describe('apiFetch', () => {
  it('skickar token i headern Authorization', async () => {
    tokenStorage.set('abc')

    expect(await apiFetch('/api/echo')).toEqual({ auth: 'Bearer abc' })
  })

  it('skickar ingen header utan token', async () => {
    expect(await apiFetch('/api/echo')).toEqual({ auth: null })
  })

  it('tar bort token och säger till när backend svarar 401', async () => {
    const handler = vi.fn()
    setUnauthorizedHandler(handler)
    tokenStorage.set('gammal')

    await expect(apiFetch('/api/expired')).rejects.toBeInstanceOf(ApiError)
    expect(tokenStorage.get()).toBeNull()
    expect(handler).toHaveBeenCalledOnce()
  })

  it('använder meddelandet från backend i felet', async () => {
    server.use(
      http.get('/api/echo', () =>
        HttpResponse.json({ message: 'Något gick fel' }, { status: 400 }),
      ),
    )

    await expect(apiFetch('/api/echo')).rejects.toMatchObject({
      status: 400,
      message: 'Något gick fel',
    })
  })
})
