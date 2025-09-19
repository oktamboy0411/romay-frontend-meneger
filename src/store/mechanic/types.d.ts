// Ish turi enum/type
export type WorkType = 'SERVICE' | 'FIELD_SERVICE'

// Mechanic entity (backend DocumentI ga mos)
export interface Mechanic {
  _id: string
  fullName: string
  phone: string
  work_type: WorkType
  branch_id: string // yoki {_id: string; name: string} agar populate bo‘lsa
  service_count: number
  created_at: string // backend Date frontga string bo‘lib keladi
  updated_at: string
}

// Yangi mechanic qo‘shish uchun request body
export interface AddMechanicRequest {
  fullName: string
  phone: string
  work_type: WorkType
  branch_id: string
}

// Add mechanic response
export interface AddMechanicResponse {
  success: boolean
  data: Mechanic
  message: string
}

// Barcha mechaniclarni olish uchun request params
export interface GetAllMechanicsRequest {
  search?: string
  work_type?: WorkType
  branch_id?: string
  page?: number
  limit?: number
}

// Barcha mechaniclarni olish uchun response
export interface GetAllMechanicsResponse {
  success: boolean
  data: Mechanic[]
  pagination: {
    total: number
    total_pages: number
    page: number
    limit: number
    next_page: boolean
    prev_page: boolean
  }
}

// Bitta mechanicni olish uchun response
export interface MechanicResponse {
  success: boolean
  data: Mechanic
}
