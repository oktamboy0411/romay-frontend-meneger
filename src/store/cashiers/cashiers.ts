import baseApi from '../api'
import type {
  ClientResponse,
  ClientRequest,
  AddClientResponse,
  AddClientRequest,
  UpdateClientRequest,
  UpdateClientResponse,
  ClientResponseOne,
} from './types'

export const CashiersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCashiers: build.query<ClientResponse, ClientRequest>({
      query: (params) => ({
        url: '/cashier/get-all',
        method: 'GET',
        params,
      }),
      providesTags: ['cashiers'],
    }),
    addCashier: build.mutation<AddClientResponse, AddClientRequest>({
      query: (body) => ({
        url: '/cashier/add',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['cashiers'],
    }),
    updateCashier: build.mutation<UpdateClientResponse, UpdateClientRequest>({
      query: ({ id, body }) => ({
        url: `/cashier/update/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['cashiers'],
    }),
    deleteCashier: build.mutation<void, string>({
      query: (id) => ({
        url: `/cashier/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['cashiers'],
    }),
    getOneCashier: build.query<ClientResponseOne, string>({
      query: (id) => ({
        url: `/cashier/get-one/${id}`,
        method: 'GET',
      }),
      providesTags: ['cashiers'],
    }),
  }),
})

export const {
  useGetCashiersQuery,
  useAddCashierMutation,
  useUpdateCashierMutation,
  useDeleteCashierMutation,
  useGetOneCashierQuery,
} = CashiersApi
