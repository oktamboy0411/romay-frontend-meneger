import baseApi from '../api'
import type {
  SalesResponse,
  SalesRequest,
  AddSalesResponse,
  AddSalesRequest,
  UpdateSalesRequest,
  UpdateSalesResponse,
} from './types'

export const SalesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getSales: build.query<SalesResponse, SalesRequest>({
      query: (params) => ({
        url: '/sales/get-all',
        method: 'GET',
        params,
      }),
      providesTags: ['sales'],
    }),
    addSales: build.mutation<AddSalesResponse, AddSalesRequest>({
      query: (body) => ({
        url: '/sales/add',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['sales'],
    }),
    updateSales: build.mutation<UpdateSalesResponse, UpdateSalesRequest>({
      query: ({ id, body }) => ({
        url: `/sales/update/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['sales'],
    }),
    deleteSales: build.mutation<void, string>({
      query: (id) => ({
        url: `/sales/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['sales'],
    }),
    getOneSales: build.query<SalesResponse, string>({
      query: (id) => ({
        url: `/sales/get-one/${id}`,
        method: 'GET',
      }),
      providesTags: ['sales'],
    }),
  }),
})

export const {
  useGetSalesQuery,
  useAddSalesMutation,
  useUpdateSalesMutation,
  useDeleteSalesMutation,
  useGetOneSalesQuery,
} = SalesApi
