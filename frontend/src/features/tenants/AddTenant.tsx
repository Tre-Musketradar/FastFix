import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, Navigate } from 'react-router'
import { ApiError } from '../../shared/apiClient'
import { useAuth } from '../auth/useAuth'
import {
  availableApartments,
  createTenant,
  type ApartmentSummary,
  type CreateTenantRequest,
} from './TenantApi'

const addTenantSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, 'Namn måste anges')
      .max(100, 'Namnet får vara högst 100 tecken'),
    email: z
      .string()
      .trim()
      .min(1, 'E-post är obligatoriskt')
      .email('Ange en giltig e-postadress'),
    password: z.string().min(8, 'Lösenordet måste vara minst 8 tecken'),
    confirmPassword: z.string().min(1, 'Bekräfta lösenordet'),
    // Värden i en select är strängar, så schemat använder sträng här
    apartmentId: z.string().min(1, 'Välj en lägenhet'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Lösenorden matchar inte',
    path: ['confirmPassword'],
  })

type AddTenantFormData = z.infer<typeof addTenantSchema>

// Backend skickar med ett meddelande (t.ex. "E-postadressen används redan.").
function mapTenantError(error: unknown): string {
  if (error instanceof ApiError && [404, 409].includes(error.status)) {
    return error.message
  }
  if (error instanceof ApiError && error.status === 400) {
    return 'Kontrollera uppgifterna.'
  }
  return 'Ett fel uppstod. Försök igen.'
}

// Lägenheterna grupperas per fastighet i listan.
function byProperty(apartments: ApartmentSummary[]) {
  const groups = new Map<string, ApartmentSummary[]>()
  for (const apartment of apartments) {
    const list = groups.get(apartment.propertyName) ?? []
    list.push(apartment)
    groups.set(apartment.propertyName, list)
  }
  return [...groups]
}

const inputClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700/20'

const fields = [
  { name: 'name', label: 'Namn', type: 'text' },
  { name: 'email', label: 'E-post', type: 'email' },
  { name: 'password', label: 'Lösenord', type: 'password' },
  { name: 'confirmPassword', label: 'Repetera lösenord', type: 'password' },
] as const

export function AddTenant() {
  const { user } = useAuth()
  if (!user || user.role !== 'MANAGER') {
    return <Navigate to="/tickets" replace />
  }
  return <AddTenantForm userId={user.id} />
}

function AddTenantForm({ userId }: { userId: number }) {
  const queryClient = useQueryClient()
  const apartmentsKey = ['tenants', 'available-apartments', userId]
  const apartments = useQuery({
    queryKey: apartmentsKey,
    queryFn: availableApartments,
    retry: false,
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddTenantFormData>({
    resolver: zodResolver(addTenantSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      apartmentId: '',
    },
  })

  const mutation = useMutation({
    mutationFn: (values: CreateTenantRequest) => createTenant(values),
    onSuccess: () => {
      reset()
      // Lägenheten är inte längre ledig.
      void queryClient.invalidateQueries({ queryKey: apartmentsKey })
    },
  })

  const onSubmit = (data: AddTenantFormData) => {
    mutation.mutate({
      name: data.name,
      email: data.email,
      password: data.password,
      apartmentId: Number(data.apartmentId),
    })
  }

  const freeApartments = apartments.data ?? []

  return (
    <section className="flex flex-col gap-6">
      <div>
        <Link to="/tickets" className="text-sm text-blue-700 hover:underline">
          Tillbaka till ärenden
        </Link>
        <h1 className="mt-3 text-2xl font-bold">Lägg till hyresgäst</h1>
        <p className="mt-1 text-slate-600">
          Hyresgästen kan sedan logga in med sin e-post och sitt lösenord.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex max-w-xl flex-col gap-4 rounded-xl bg-white p-6 shadow-sm"
      >
        {fields.map((field) => (
          <div key={field.name} className="flex flex-col gap-1">
            <label htmlFor={`tenant-${field.name}`} className="font-medium">
              {field.label}
            </label>
            <input
              id={`tenant-${field.name}`}
              type={field.type}
              {...register(field.name)}
              className={inputClass}
              aria-invalid={Boolean(errors[field.name])}
            />
            {errors[field.name] && (
              <p role="alert" className="text-sm text-red-700">
                {errors[field.name]?.message}
              </p>
            )}
          </div>
        ))}

        <div className="flex flex-col gap-1">
          <label htmlFor="tenant-apartmentId" className="font-medium">
            Lägenhet
          </label>
          <select
            id="tenant-apartmentId"
            {...register('apartmentId')}
            className={inputClass}
            aria-invalid={Boolean(errors.apartmentId)}
            disabled={freeApartments.length === 0}
          >
            <option value="">Välj lägenhet</option>
            {byProperty(freeApartments).map(([propertyName, list]) => (
              <optgroup key={propertyName} label={propertyName}>
                {list.map((apartment) => (
                  <option key={apartment.id} value={apartment.id}>
                    {apartment.number}
                    {apartment.floor !== null && ` (våning ${apartment.floor})`}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          {apartments.isError && (
            <p role="alert" className="text-sm text-red-700">
              Kunde inte hämta lediga lägenheter.
            </p>
          )}
          {apartments.isSuccess && freeApartments.length === 0 && (
            <p className="text-sm text-slate-600">
              Det finns inga lediga lägenheter i dina fastigheter.
            </p>
          )}
          {errors.apartmentId && (
            <p role="alert" className="text-sm text-red-700">
              {errors.apartmentId.message}
            </p>
          )}
        </div>

        {mutation.isSuccess && (
          <p
            role="status"
            className="rounded-lg bg-green-50 p-3 text-green-800"
          >
            Hyresgästen {mutation.data.name} har lagts till.
          </p>
        )}
        {mutation.isError && (
          <p role="alert" className="rounded-lg bg-red-50 p-3 text-red-700">
            {mapTenantError(mutation.error)}
          </p>
        )}

        <button
          type="submit"
          disabled={mutation.isPending}
          className="self-start rounded-lg bg-blue-700 px-4 py-2 font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
        >
          {mutation.isPending ? 'Sparar…' : 'Lägg till hyresgäst'}
        </button>
      </form>
    </section>
  )
}
