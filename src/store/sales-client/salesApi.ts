import baseApi from '../api'
import type {
  ClientsRes,
  CreateSale,
  CreateSaleRes,
  GetAllAssistant,
  GetAllSalesReq,
  GetAllSalesRes,
} from './types'

export const salesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllSales: build.query<GetAllSalesRes, GetAllSalesReq>({
      query: (params) => ({
        url: '/sales/get-all',
        method: 'GET',
        params,
      }),
      providesTags: ['sales'],
    }),
    createSale: build.mutation<CreateSaleRes, CreateSale>({
      query: (body) => ({
        url: '/sales/add',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['sales'],
    }),
    getClients: build.query<ClientsRes, CreateSale>({
      query: () => '/client/get-all',
      providesTags: ['clients'],
    }),
    updateClientID: build.mutation<
      CreateSaleRes,
      { id: string; client_id: string }
    >({
      query: (body) => ({
        url: `/sales/update-client/${body.id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['sales'],
    }),
    // Add the missing updateSale mutation
    updateSale: build.mutation<object, { id: string; data: object }>({
      query: ({ id, data }) => ({
        url: `/sales/update/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['sales'],
    }),
    addItems: build.mutation({
      query: (body) => ({
        url: `/sales/add-item/${body.clientId}`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['sales'],
    }),
    getAllAssistant: build.query<GetAllAssistant, GetAllSalesReq>({
      query: (params) => ({
        url: '/sales-assistant/get-all',
        method: 'GET',
        params,
      }),
      providesTags: ['sales'],
    }),
    deleteSale: build.mutation<void, string>({
      query: (id) => ({
        url: `/sales/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['sales'],
    }),
  }),
})

export const {
  useGetAllSalesQuery,
  useCreateSaleMutation,
  useGetClientsQuery,
  useUpdateClientIDMutation,
  useUpdateSaleMutation, // Add this export
  useAddItemsMutation,
  useGetAllAssistantQuery,
  useDeleteSaleMutation,
} = salesApi
