import { apiFetch } from '../../shared/apiClient';

export interface CreateTenantRequest {
  name: string;
  email: string;
  password: string;
  apartmentId: number;
}

export interface Tenant {
  id: number;
  name: string;
  email: string;
  apartmentId: number;
}

export const tenantApi = {
  create: (data: CreateTenantRequest) =>
    apiFetch<Tenant>('/api/tenants', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};
