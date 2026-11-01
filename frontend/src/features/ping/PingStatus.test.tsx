import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { PingStatus } from './PingStatus'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('PingStatus', () => {
  it('visar svaret från backend', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue(
          Response.json({ status: 'ok', database: 'PostgreSQL 17', users: 0 }),
        ),
    )

    render(<PingStatus />)

    expect(
      await screen.findByText(/Backend: ok · Databas: PostgreSQL 17/),
    ).toBeDefined()
  })

  it('visar ett fel när backend inte svarar', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(null, { status: 500 })),
    )

    render(<PingStatus />)

    expect(await screen.findByText('Backend svarar inte')).toBeDefined()
  })
})
