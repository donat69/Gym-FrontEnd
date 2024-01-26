export interface Event {
  id?: number,
  title: string,
  start: Date,
  end: Date,
  color: string,
  role: string,
  createdBy: number,
  tenantId: number
}
