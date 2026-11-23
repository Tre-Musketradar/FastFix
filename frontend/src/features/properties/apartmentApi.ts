import { apiFetch } from '../../shared/apiClient'

export type Apartment = {
  id: number
  propertyId: number
  number: string
  floor: number | null
  tenantId: number | null
}

export type CreateApartmentInput = {
  number: string
  floor: number | null
}

export const apartmentApi = {
  list: (propertyId: number) =>
    apiFetch<Apartment[]>(`/api/properties/${propertyId}/apartments`),
  create: (propertyId: number, input: CreateApartmentInput) =>
    apiFetch<Apartment>(`/api/properties/${propertyId}/apartments`, {
      method: 'POST',
      body: JSON.stringify(input),
    }),
}
