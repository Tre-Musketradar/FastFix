import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { Link, Navigate } from 'react-router'
import { z } from 'zod'
import { useAuth } from '../auth/useAuth'
import { ApiError } from '../../shared/apiClient'
import { propertyApi, type Property } from './propertyApi'

const schema = z.object({
  name: z.string().trim().min(1, 'Namn måste anges').max(100, 'Högst 100 tecken'),
  address: z
    .string()
    .trim()
    .min(1, 'Adress måste anges')
    .max(255, 'Högst 255 tecken'),
})

type FormValues = z.infer<typeof schema>

const inputClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700/20'

export function PropertiesPage() {
  const { user } = useAuth()
  if (!user || user.role !== 'MANAGER') {
    return <Navigate to="/tickets" replace />
  }
  return <PropertiesContent userId={user.id} />
}

function PropertiesContent({ userId }: { userId: number }) {
  const queryClient = useQueryClient()
  const queryKey = ['properties', userId]

  const properties = useQuery({
    queryKey,
    queryFn: propertyApi.list,
    retry: false,
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', address: '' },
  })

  const createProperty = useMutation({
    mutationFn: propertyApi.create,
    onSuccess: (created) => {
      queryClient.setQueryData<Property[]>(queryKey, (old = []) => [
        created,
        ...old,
      ])
      reset()
      void queryClient.invalidateQueries({ queryKey })
    },
  })

  const onSubmit = (values: FormValues) => {
    createProperty.mutate(values)
  }

  const saveError = createProperty.error
    ? createProperty.error instanceof ApiError &&
      createProperty.error.status === 400
      ? 'Kontrollera namn och adress.'
      : createProperty.error instanceof Error
        ? createProperty.error.message
        : 'Kunde inte spara fastigheten.'
    : null

  return (
    <section className="flex flex-col gap-6">
      <div>
        <Link to="/tickets" className="text-sm text-blue-700 hover:underline">
          Tillbaka till ärenden
        </Link>
        <h1 className="mt-3 text-2xl font-bold">Fastigheter</h1>
        <p className="mt-1 text-slate-600">
          Lägg till en fastighet och se dina registrerade fastigheter.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex max-w-xl flex-col gap-4 rounded-xl bg-white p-6 shadow-sm"
      >
        <h2 className="text-lg font-semibold">Lägg till fastighet</h2>

        <div className="flex flex-col gap-1">
          <label htmlFor="property-name" className="font-medium">
            Namn
          </label>
          <input
            id="property-name"
            {...register('name')}
            className={inputClass}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'property-name-error' : undefined}
          />
          {errors.name && (
            <p id="property-name-error" role="alert" className="text-sm text-red-700">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="property-address" className="font-medium">
            Adress
          </label>
          <input
            id="property-address"
            {...register('address')}
            className={inputClass}
            aria-invalid={Boolean(errors.address)}
            aria-describedby={errors.address ? 'property-address-error' : undefined}
          />
          {errors.address && (
            <p id="property-address-error" role="alert" className="text-sm text-red-700">
              {errors.address.message}
            </p>
          )}
        </div>

        {saveError && (
          <p role="alert" className="rounded-lg bg-red-50 p-3 text-red-700">
            {saveError}
          </p>
        )}

        <button
          type="submit"
          disabled={createProperty.isPending}
          className="self-start rounded-lg bg-blue-700 px-5 py-2 font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
        >
          {createProperty.isPending ? 'Sparar…' : 'Spara fastighet'}
        </button>
      </form>

      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Mina fastigheter</h2>
        {properties.isPending ? (
          <p className="mt-3 text-slate-600">Laddar fastigheter…</p>
        ) : properties.isError ? (
          <p role="alert" className="mt-3 text-red-700">
            Kunde inte hämta fastigheterna.
          </p>
        ) : properties.data.length === 0 ? (
          <p className="mt-3 text-slate-600">Inga fastigheter registrerade ännu.</p>
        ) : (
          <ul className="mt-4 divide-y divide-slate-200">
            {properties.data.map((property) => (
              <li key={property.id} className="py-3">
                <p className="font-semibold">{property.name}</p>
                <p className="text-sm text-slate-600">{property.address}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
