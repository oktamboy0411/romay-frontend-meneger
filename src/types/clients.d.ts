export interface Client {
  _id: string
  username: string
  phone: string
  address: string
  branch_id: {
    _id: string
    name: string
    address: string
  }
  role: string
  created_at: string
  updated_at: string
}
