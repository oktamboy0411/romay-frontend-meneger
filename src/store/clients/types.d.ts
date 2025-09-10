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

export interface AddClientResponse {
  fullName: string
  phone: string
  work_type: string
  branch_id: string
}

export interface AddClientRequest {
  username: string
  description?: string | undefined
  phone: string
  profession?: string | undefined
  birth_date?: string | undefined
  branch_id: string
  address?: string | undefined
}

export interface UpdateClientResponse {}

export interface UpdateClientRequest {
  id: string
  body: Partial<Client>
}
