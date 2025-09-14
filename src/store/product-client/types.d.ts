/* eslint-disable @typescript-eslint/no-empty-object-type */

export interface ProductAttribute {
  key: string
  value: string
  _id: string
}

export interface Product {
  _id: string
  name: string
  description: string
  category_id: string | { _id: string; name: string }
  price: number
  status: string
  currency: string
  images: string[]
  barcode: string
  attributes: ProductAttribute[]
  from_create: string
  created_at: string
  updated_at: string
}

export interface ProductWarehouseItem {
  _id: string
  product: {
    _id: string
    name: string
    description: string
    category_id: {
      _id: string
      name: string
      description: string
      created_at: Date
      updated_at: Date
    }
    price: number
    status: string
    currency: string
    images: string[]
    barcode: string
    attributes: {
      key: string
      value: string
      _id: string
    }[]
    from_create: string
    created_at: Date
    updated_at: Date
  }
  product_count: number
  branch: string
  product_barcode: string
  from_create: string
  created_at: Date
  updated_at: Date
}

export interface GetAllProductsResponse {
  success: boolean
  page_count: number
  current_page: number
  current_limit: number
  next_page: number | null
  after_filtering_count: number
  data: ProductWarehouseItem[]
}

export interface GetAllProductsRequest {}

export interface CreateProductRequest {
  name: string
  description: string
  category_id: string
  price: number
  status: string
  currency: string
  images: string[]
  barcode: string
  attributes: ProductAttribute[]
  product_count: number
  from_create: string
  branch: string
}

export interface CreateProductResponse {}
