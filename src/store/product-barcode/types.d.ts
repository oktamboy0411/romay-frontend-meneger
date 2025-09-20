import type { Category } from '../category/types'

// Attributes (siz bergan)
export interface ProductAttribute {
  key: string
  value: string
  _id?: string
}

// SALE PRODUCT DETAIL
export interface SaleProductDetail {
  _id: string
  name: string
  description: string
  category_id: Category | string // faqat id kelayapti
  price: number // faqat sale product
  status: string
  currency: string // faqat sale product
  images: string[]
  barcode: string
  attributes: ProductAttribute[]
  from_create: string
  created_at: string
  updated_at: string
}

// RENT PRODUCT DETAIL
export interface RentProductDetail {
  _id: string
  name: string
  description: string
  category_id: Category | string
  status: string
  images: string[]
  barcode: string
  attributes: ProductAttribute[]
  from_create: string
  created_at: string
  updated_at: string
}

// COMMON RESPONSE WRAPPER
export interface ApiResponse<T> {
  success: boolean
  data: T
}
