/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface ClientResponse {
  data: Client[]
  pagination: {
    limit: number
    next_page: boolean
    page: number
    prev_page: boolean
    total: number
    total_pages: number
  }
}

export interface ClientRequest {
  search?: string
  branch_id?: string
  page?: number
  limit?: number
}

export interface AddClientResponse {}

export interface AddClientRequest {
  username: string
  description: string
  phone: string
  profession: string
  birth_date: string
  branch_id: string
  address: string
  address: string
}

export interface UpdateClientResponse {}

export interface UpdateClientRequest {
  id: string
  body: Partial<Client>
}
