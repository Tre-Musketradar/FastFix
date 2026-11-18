import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { Link, Navigate, useParams } from 'react-router'
import { z } from 'zod'
import { ApiError } from '../../shared/apiClient'
import { useAuth } from '../auth/useAuth'
import { propertyApi } from './propertyApi'
import { apartmentApi, type Apartment } from './apartmentApi'

const schema = z.object({
  number: z
    .string()
    .trim()
    .min(1, 'Lägenhetsnummer måste anges')
    .max(20, 'Högst 20 tecken'),
  floor: z
    .string()
    .refine(
      (value) =>
        value.trim() === '' ||
        (/^-?\d+$/.test(value.trim()) &&
          Number(value) >= -2147483648 &&
          Number(value) <= 2147483647),
      'Våning måste vara ett heltal',
    ),
})

type FormValues = z.infer<typeof schema>

const inputClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700/20'

export function ApartmentsPage() {
  const { user } = useAuth()
  const { propertyId: propertyIdParam } = useParams()
  const propertyId = Number(propertyIdParam)

  if (!user || user.role !== 'MANAGER') {
    return <Navigate to="/tickets" replace />
  }
  if (!Number.isSafeInteger(propertyId) || propertyId < 1) {
    return <Navigate to="/properties" replace />
  }

  return <ApartmentsContent userId={user.id} propertyId={propertyId} />
}

function ApartmentsContent({
  userId,
  propertyId,
}: {
  userId: number
  propertyId: number
}) {
  const queryClient = useQueryClient()
  const queryKey = ['apartments', userId, propertyId]

  // Reuse the existing manager-specific property endpoint and cache.
  const properties = useQuery({
    queryKey: ['properties', userId],
    queryFn: propertyApi.list,
    retry: false,
  })
  const property = properties.data?.find((item) => item.id === propertyId)

  const apartments = useQuery({
    queryKey,
    queryFn: () => apartmentApi.list(propertyId),
    enabled: Boolean(property),
    retry: false,
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { number: '', floor: '' },
  })

  const createApartment = useMutation({
    mutationFn: (values: FormValues) =>
      apartmentApi.create(propertyId, {
        number: values.number.trim(),
        floor: values.floor.trim() === '' ? null : Number(values.floor),
      }),
    onSuccess: (created) => {
      queryClient.setQueryData<Apartment[]>(queryKey, (old = []) => [
        created,
        ...old,
      ])
      reset()
      void queryClient.invalidateQueries({ queryKey })
    },
  })

  const saveError = createApartment.error
    ? createApartment.error instanceof ApiError &&
      createApartment.error.status === 409
      ? 'Lägenhetsnumret finns redan i fastigheten.'
      : createApartment.error instanceof ApiError &&
          createApartment.error.status === 400
        ? 'Kontrollera lägenhetsnumret och våningen.'
        : createApartment.error instanceof Error
          ? createApartment.error.message
          : 'Kunde inte spara lägenheten.'
    : null

  if (properties.isPending) {
    return <p className="text-slate-600">Laddar fastighet…</p>
  }
  if (properties.isError) {
    return (
      <p role="alert" className="text-red-700">
        Kunde inte hämta fastigheten.
      </p>
    )
  }
  if (!property) {
    return (
      <section className="flex flex-col gap-3">
        <h1 className="text-2xl font-bold">Fastigheten hittades inte</h1>
        <Link to="/properties" className="text-blue-700 hover:underline">
          Tillbaka till fastigheter
        </Link>
      </section>
    )
  }

  return (
    <section className="flex flex-col gap-6">
      <div>
        <Link
          to="/properties"
          className="text-sm text-blue-700 hover:underline"
        >
          Tillbaka till fastigheter
        </Link>
        <h1 className="mt-3 text-2xl font-bold">{property.name}</h1>
        <p className="mt-1 text-slate-600">{property.address}</p>
      </div>

      <form
        noValidate
        onSubmit={handleSubmit((values) => createApartment.mutate(values))}
        className="flex max-w-xl flex-col gap-4 rounded-xl bg-white p-6 shadow-sm"
      >
        <h2 className="text-lg font-semibold">Lägg till lägenhet</h2>

        <div className="flex flex-col gap-1">
          <label htmlFor="apartment-number" className="font-medium">
            Lägenhetsnummer
          </label>
          <input
            id="apartment-number"
            {...register('number')}
            className={inputClass}
            aria-invalid={Boolean(errors.number)}
            aria-describedby={
              errors.number ? 'apartment-number-error' : undefined
            }
          />
          {errors.number && (
            <p
              id="apartment-number-error"
              role="alert"
              className="text-sm text-red-700"
            >
              {errors.number.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="apartment-floor" className="font-medium">
            Våning (valfritt)
          </label>
          <input
            id="apartment-floor"
            type="number"
            step="1"
            {...register('floor')}
            className={inputClass}
            aria-invalid={Boolean(errors.floor)}
            aria-describedby={
              errors.floor ? 'apartment-floor-error' : undefined
            }
          />
          {errors.floor && (
            <p
              id="apartment-floor-error"
              role="alert"
              className="text-sm text-red-700"
            >
              {errors.floor.message}
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
          disabled={createApartment.isPending}
          className="self-start rounded-lg bg-blue-700 px-5 py-2 font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
        >
          {createApartment.isPending ? 'Sparar…' : 'Spara lägenhet'}
        </button>
      </form>

      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Lägenheter</h2>
        {apartments.isPending ? (
          <p className="mt-3 text-slate-600">Laddar lägenheter…</p>
        ) : apartments.isError ? (
          <p role="alert" className="mt-3 text-red-700">
            Kunde inte hämta lägenheterna.
          </p>
        ) : apartments.data.length === 0 ? (
          <p className="mt-3 text-slate-600">
            Inga lägenheter registrerade ännu.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-slate-200">
            {apartments.data.map((apartment) => (
              <li
                key={apartment.id}
                className="flex justify-between gap-4 py-3"
              >
                <span className="font-semibold">
                  Lägenhet {apartment.number}
                </span>
                <span className="text-slate-600">
                  {apartment.floor === null
                    ? 'Våning ej angiven'
                    : `Våning ${apartment.floor}`}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
