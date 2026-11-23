import { apiFetch } from '../../shared/apiClient'

export type Property = {
  id: number
  name: string
  address: string
  ownerId: number
}

export type CreatePropertyInput = {
  name: string
  address: string
}

export const propertyApi = {
  list: () => apiFetch<Property[]>('/api/properties'),
  create: (data: CreatePropertyInput) =>
    apiFetch<Property>('/api/properties', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
}
