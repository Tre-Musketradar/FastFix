// Delade typer. Värdena ska stämma exakt med backendens enums (se docs/databasschema.md).

export type Role = 'TENANT' | 'TECHNICIAN' | 'MANAGER'

export type User = {
  id: number
  name: string
  email: string
  role: Role
}
