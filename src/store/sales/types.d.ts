export interface Sale {
  _id: string
  branch_id: SaleBranch | string
  cashier_id: SaleCashier | string
  client_id: SaleClient | string
  items: SaleItem[]
  status: 'PENDING' | 'PAID' | string
  payments: SalePayments
  created_at: string
  updated_at: string
}

// 🔹 Response (GET) — siz tashlagan dataga mos:
export interface SalesResponse {
  success: boolean
  data: Sale[]
  pagination: {
    total: number
    total_pages: number
    page: number
    limit: number
    next_page: boolean
    prev_page: boolean
  }
}

// 🔹 Request (GET) — filter/pagination:
export interface SalesRequest {
  search?: string
  branch_id?: string
  client_id?: string
  cashier_id?: string
  status?: string
  page?: number
  limit?: number
}

// 🔹 Qo‘shish uchun javob (POST):
export interface AddSalesResponse {
  success: boolean
  sale: Sale
}

// 🔹 Qo‘shish uchun request (POST):
export interface AddSalesRequest {
  branch_id: string
  cashier_id: string
  client_id: string
  items: {
    product_id: string
    quantity: number
    price: number
  }[]
  status?: 'PENDING' | 'PAID' | string
  payments: {
    total_amount: number
    paid_amount: number
    debt_amount: number
    type: 'CASH' | 'CARD' | string
    currency: string
  }
}

// 🔹 Yangilash uchun request (PATCH/PUT):
export interface UpdateSalesRequest {
  id: string
  body: Partial<AddSalesRequest> // yoki Partial<Sale>
}

// 🔹 Yangilash uchun javob (PATCH/PUT):
export interface UpdateSalesResponse {
  success: boolean
  sale: Sale
}
