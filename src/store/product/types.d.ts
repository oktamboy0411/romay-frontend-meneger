// ===== Request & Response types =====

// Query parameters for GET ALL products
export interface GetAllProductsRequest {
  page?: number
  limit?: number
  search?: string
}

// Response for GET ALL products
export interface GetAllProductsResponse {
  success: boolean
  page_count: number
  current_page: number
  next_page: number | null
  after_filtering_count: number
  data: Product[]
}

// Product type (common for sale & rent)
export interface Product {
  _id: string
  branch: string
  name: string
  description?: string
  product_count: number
  product_rent_price?: number // faqat rent products uchun
  price?: number // faqat sale products uchun
  category_id: string
  images: string[]
  barcode: string
  currency?: string
  attributes?: Array<{ key: string; value: string }>
  created_at?: string
  updated_at?: string
}

// Create product request
export interface CreateProductRequest {
  branch: string
  name: string
  product_count: number
  price?: number // sale products
  product_rent_price?: number // rent products
  description?: string
  category_id: string
  images: string[]
  barcode: string
  currency?: string
  attributes?: Array<{ key: string; value: string }>
}

// Response for creating/updating product
export interface CreateProductResponse {
  success: boolean
  msg?: string
  data?: Product
}

// Update product request
export interface UpdateProductRequest {
  name?: string
  product_count?: number
  price?: number
  product_rent_price?: number
  description?: string
  category_id?: string
  images?: string[]
  barcode?: string
  currency?: string
  attributes?: Array<{ key: string; value: string }>
}
