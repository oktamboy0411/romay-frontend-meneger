// Legacy Product interface for backward compatibility
export interface Product {
  id: string | number
  name: string
  category?: string
  status?: string
  price?: string | number
  note?: string
  sku?: string
  stock?: number
  image?: string
  subtitle?: string
  barcode?: string
}

// Import the updated types from store
export type {
  Product as WarehouseProduct,
  RentProduct,
  BaseProduct,
  ProductAttribute,
  Category,
  GetAllProductsResponse,
  GetAllRentProductsResponse,
  GetAllProductsRequest,
  CreateProductRequest,
  CreateProductResponse,
  UpdateProductRequest,
  ProductWarehouseItem,
} from '@/store/product/types'
