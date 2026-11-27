import { apiFetch } from '../../shared/apiClient'

export interface CreateTenantRequest {
  name: string
  email: string
  password: string
  apartmentId: number
}

export interface Tenant {
  id: number
  name: string
  email: string
  apartmentId: number
}

// En lägenhet med fastighetens namn och adress (ApartmentSummary i backend).
export interface ApartmentSummary {
  id: number
  propertyName: string
  propertyAddress: string
  number: string
  floor: number | null
}

export const createTenant = (body: CreateTenantRequest) =>
  apiFetch<Tenant>('/api/tenants', {
    method: 'POST',
    body: JSON.stringify(body),
  })

// Lediga lägenheter i förvaltarens fastigheter.
export const availableApartments = () =>
  apiFetch<ApartmentSummary[]>('/api/tenants/available-apartments')

// Den inloggade hyresgästens lägenhet.
export const myApartment = () =>
  apiFetch<ApartmentSummary>('/api/tenants/me/apartment')
