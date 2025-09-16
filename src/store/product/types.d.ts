// ===== Request & Response types =====

// Query parameters for GET ALL products
export interface GetAllProductsRequest {
  page?: number
  limit?: number
  search?: string
  branch2?: string
}

// Category interface
export interface Category {
  _id: string
  name: string
  description: string
  created_at: string
  updated_at: string
}

// Product attributes interface
export interface ProductAttribute {
  key: string
  value: string
  _id?: string
}

// Base Product interface (nested product inside warehouse item)
export interface BaseProduct {
  _id: string
  name: string
  description: string
  category_id: Category
  price?: number // for sale products
  status: string
  currency?: string
  images: string[]
  barcode: string
  attributes: ProductAttribute[]
  from_create: string
  created_at: string
  updated_at: string
}

// Warehouse Product Item (main structure returned by API)
export interface Product {
  _id: string
  branch: string
  product_barcode: string
  created_at: string
  from_create: string
  product: BaseProduct
  product_count: number
  updated_at: string
}

export interface Branch {
  _id: string
  name: string
  address: string
  manager_ids: string[]
  sales_balance: number
  service_balance: number
  total_balance: number
  created_at: string
  updated_at: string
}

// Rent Product Item (specific structure for rent products)
export interface RentProduct {
  _id: string
  branch: Branch
  product_barcode: string
  created_at: string
  from_create: string
  product: BaseProduct
  product_active_count: number
  product_rent_price: number
  product_total_count: number
  updated_at: string
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

// Response for GET ALL rent products
export interface GetAllRentProductsResponse {
  success: boolean
  page_count: number
  current_page: number
  next_page: number | null
  after_filtering_count: number
  data: RentProduct[]
}

// Create product request
export interface CreateProductRequest {
  branch?: string
  name: string
  product_count?: number
  price?: number // sale products
  product_rent_price?: number // rent products
  description?: string
  category_id: string
  images: string[]
  barcode: string
  currency?: string
  attributes?: ProductAttribute[]
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
  attributes?: ProductAttribute[]
}

// Product warehouse item (for components that expect nested structure)
export interface ProductWarehouseItem {
  _id: string
  product: BaseProduct
  product_count: number
  branch?: string
}
