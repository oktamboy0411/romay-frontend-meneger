/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface SaleProductResponse {
  data: SaleProduct[]
  pagination: {
    limit: number
    next_page: boolean
    page: number
    prev_page: boolean
    total: number
    total_pages: number
  }
}

export interface SaleProductRequest {
  search?: string
  branch_id?: string
  page?: number
  limit?: number
}

export interface AddSaleProductResponse {
  fullName: string
  phone: string
  work_type: string
  branch_id: string
}

export interface AddSaleProductRequest {
  username: string
  description?: string | undefined
  phone: string
  profession?: string | undefined
  birth_date?: string | undefined
  branch_id: string
  address?: string | undefined
}

export interface UpdateSaleProductResponse {}

export interface UpdateSaleProductRequest {
  id: string
  body: Partial<SaleProduct>
}
