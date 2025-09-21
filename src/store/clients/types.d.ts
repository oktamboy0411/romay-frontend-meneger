/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface ClientResponse {
  data: Client[]
  pagination: {
    total: number
    total_pages: number
    page: number
    limit: number
    next_page: boolean
    prev_page: boolean
  }
}

export interface ClientRes {
  success: boolean
  data: {
    debt: {
      sale_amount: number
      total_amount: number
      currency: string
    }
    _id: string
    username: string
    description: string
    sales_count: number
    phone: string
    profession: string
    birth_date: Date
    branch_id: {
      _id: string
      name: string
      address: string
    }
    address: string
    customer_tier: string
    created_at: Date
    updated_at: Date
  }
  error: {
    statusCode: number
    msg: string
  }
}

export interface ClientRequest {
  search?: string
  branch_id?: string
  page?: number
  limit?: number
  client_id?: string
}

export interface AddClientResponse {}

export interface AddClientRequest {
  username: string
  description?: string
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
