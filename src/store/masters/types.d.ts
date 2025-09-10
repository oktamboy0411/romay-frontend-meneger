/* eslint-disable @typescript-eslint/no-empty-object-type */

export interface Master {
  _id: string
  fullName: string
  phone: string
  work_type: 'FIELD_SERVICE' | 'SERVICE' | string // agar boshqa variantlar ham bo'lsa string qoldirsa bo'ladi
  service_count: number
  branch_id: string // faqat ID keladi, agar branch obyekti bo‘lsa { _id, name } yozish kerak bo‘ladi
  created_at: string
  updated_at: string
}

export interface MasterResponse {
  success: boolean
  page_count: number
  current_page: number
  next_page: number | null
  after_filtering_count: number
  data: Client[]
}

export interface MasterRequest {
  search?: string
  branch_id?: string
  page?: number
  limit?: number
}

export interface AddMasterResponse {
  fullName: string
  phone: string
  work_type: string
  branch_id: string
}

export interface AddMasterRequest {
  fullName: string
  phone: string
  work_type: string
  branch_id: string
  service_count?: number
  // qo‘shimcha fieldlar ham kiritish mumkin:
  created_at?: string
  updated_at?: string
}

export interface UpdateMasterResponse {
  success: boolean
  master: Master
}

export interface UpdateMasterRequest {
  id: string
  body: Partial<Master>
}
