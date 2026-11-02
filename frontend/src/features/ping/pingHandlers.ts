import { http, HttpResponse } from 'msw'

// Låtsas-API för testendpointen, för tester av sidor som visar PingStatus
export const pingHandlers = [
  http.get('/api/ping', () =>
    HttpResponse.json({ status: 'ok', database: 'PostgreSQL 17', users: 3 }),
  ),
]
