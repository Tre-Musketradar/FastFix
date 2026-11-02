import { zodResolver } from '@hookform/resolvers/zod'
import { Wrench } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Navigate, useNavigate } from 'react-router'
import { z } from 'zod'
import { PingStatus } from '../ping/PingStatus'
import { useAuth } from './useAuth'

const schema = z.object({
  email: z.string().trim().min(1, 'Skriv din e-post'),
  password: z.string().min(1, 'Skriv ditt lösenord'),
})

type LoginForm = z.infer<typeof schema>

const inputClass =
  'h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-base text-slate-900 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-700/30 aria-invalid:border-red-600'

export function LoginPage() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(schema) })

  const onSubmit = async ({ email, password }: LoginForm) => {
    setError('')
    try {
      await login(email, password)
      navigate('/tickets', { replace: true })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Något gick fel')
    }
  }

  // Redan inloggad: inloggningssidan behövs inte
  if (user) return <Navigate to="/tickets" replace />

  return (
    <main className="flex min-h-screen flex-col items-center bg-slate-50 px-6 pt-20 pb-10 text-slate-900">
      <div className="flex h-18 w-18 items-center justify-center rounded-2xl bg-blue-700 text-white">
        <Wrench size={30} aria-hidden="true" />
      </div>
      <h1 className="mt-5 text-3xl font-bold tracking-tight">Felanmälan</h1>
      <p className="mt-3 max-w-sm text-center text-slate-600">
        Anmäl fel i din lägenhet och följ ärendet hela vägen.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="mt-10 flex w-full max-w-sm flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm"
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="font-semibold">
            E-post
          </label>
          <input
            id="email"
            type="email"
            autoComplete="username"
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? 'email-error' : undefined}
            className={inputClass}
            {...register('email')}
          />
          {errors.email && (
            <p id="email-error" className="text-sm text-red-700">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="font-semibold">
            Lösenord
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            aria-invalid={errors.password ? true : undefined}
            aria-describedby={errors.password ? 'password-error' : undefined}
            className={inputClass}
            {...register('password')}
          />
          {errors.password && (
            <p id="password-error" className="text-sm text-red-700">
              {errors.password.message}
            </p>
          )}
        </div>

        {error && (
          <p
            role="alert"
            className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="h-13 rounded-xl bg-blue-700 text-lg font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
        >
          {isSubmitting ? 'Loggar in…' : 'Logga in'}
        </button>
      </form>

      <p className="mt-auto pt-10 text-center text-sm text-slate-600">
        Problem att logga in?
        <br />
        Kontakta din förvaltare.
      </p>
      <div className="mt-4 text-xs">
        <PingStatus />
      </div>
    </main>
  )
}
