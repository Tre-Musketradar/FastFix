import { useQuery } from '@tanstack/react-query'
import { Home } from 'lucide-react'
import { myApartment } from './TenantApi'

// Hyresgästen ser vilken lägenhet hen är kopplad till (story 4).
export function MyApartment({ userId }: { userId: number }) {
  const apartment = useQuery({
    queryKey: ['tenants', 'me', 'apartment', userId],
    queryFn: myApartment,
    retry: false,
  })

  if (!apartment.data) return null
  const { propertyName, propertyAddress, number, floor } = apartment.data
  return (
    <section
      aria-label="Min lägenhet"
      className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm"
    >
      <Home size={20} aria-hidden="true" className="text-blue-700" />
      <p>
        <span className="font-semibold">
          {propertyName}, lägenhet {number}
        </span>
        <span className="text-slate-600">
          {' '}
          · {propertyAddress}
          {floor !== null && `, våning ${floor}`}
        </span>
      </p>
    </section>
  )
}
