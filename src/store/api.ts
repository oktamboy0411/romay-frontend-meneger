import { SERVER_URL } from '@/constants/server_url'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getAuthToken } from '@/utils/auth'

const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: fetchBaseQuery({
    baseUrl: SERVER_URL,
    prepareHeaders: (headers) => {
      const token = getAuthToken()
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: [
    'user',
    'assistants',
    'clients',
    'products',
    'mechanics',
    'services',
    'masters',
    'cashiers',
    'branch',
    'birthdays',
    'employees',
    'history',
    'suppliers',
    'permissions',
    'notifications',
    'settings',
    'sales',
    'saleProducts',
    'rents',
    'rentProducts',
    'product-detail',
    'rent-products',
  ],
  endpoints: () => ({}),
})

export default baseApi
