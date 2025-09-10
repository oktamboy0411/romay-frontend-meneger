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
    'branch',
    'birthdays',
    'employees',
    'history',
    'clients',
    'suppliers',
    'products',
    'mechanics',
    'services',
    'masters',
  ],
  endpoints: () => ({}),
})

export default baseApi
