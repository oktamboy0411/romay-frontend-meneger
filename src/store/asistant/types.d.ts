/* eslint-disable @typescript-eslint/no-empty-object-type */

// Asosiy ustalar interfeysi
export interface Master {
  _id: string
  username: string // JSON’dagi "username"
  phone: string // "+998996234567"
  description?: string // optional, tavsif
  branch_id: string // branch ID
  address?: string // optional, manzil
  hire_date: string // ishga kirgan sana
  created_at: string
  updated_at: string
  total_sales?: {
    amount: number
    currency: string
  }
}

// API javobi (pagination bilan)
export interface MasterResponse {
  success: boolean
  data: Master[]
  pagination: {
    total: number
    total_pages: number
    page: number
    limit: number
    next_page: boolean
    prev_page: boolean
  }
}
export interface MasterResponseOne {
  success: boolean
  data: Master
}

// API so‘rovi
export interface MasterRequest {
  search?: string
  branch_id?: string
  page?: number
  limit?: number
}

// Yangi ustani qo‘shish javobi
export interface AddMasterResponse {
  _id: string
  username: string
  phone: string
  branch_id: string
  description?: string
  address?: string
  hire_date?: string
  created_at: string
  updated_at: string
  total_sales?: {
    amount: number
    currency: string
  }
}

// Yangi ustani qo‘shish so‘rovi
export interface AddMasterRequest {
  username: string
  phone: string
  branch_id: string
  description?: string
  address?: string
  hire_date?: string
  service_count?: number // agar kerak bo‘lsa
}

// Ustani yangilash javobi
export interface UpdateMasterResponse {
  success: boolean
  master: Master
}

// Ustani yangilash so‘rovi
export interface UpdateMasterRequest {
  id: string
  body: Partial<Master>
}
