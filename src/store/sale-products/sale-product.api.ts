import baseApi from '../api'
import type {
  SaleProductResponse,
  SaleProductRequest,
  AddSaleProductResponse,
  AddSaleProductRequest,
  UpdateSaleProductRequest,
  UpdateSaleProductResponse,
} from './types'

export const SaleProductApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getSaleProducts: build.query<SaleProductResponse, SaleProductRequest>({
      query: (params) => ({
        url: '/product/sale-product/get-all',
        method: 'GET',
        params,
      }),
      providesTags: ['saleProducts'],
    }),
    addSaleProduct: build.mutation<
      AddSaleProductResponse,
      AddSaleProductRequest
    >({
      query: (body) => ({
        url: '/product/sale-product/add',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['saleProducts'],
    }),
    updateSaleProduct: build.mutation<
      UpdateSaleProductResponse,
      UpdateSaleProductRequest
    >({
      query: ({ id, body }) => ({
        url: `/product/sale-product/update/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['saleProducts'],
    }),
    deleteSaleProduct: build.mutation<void, string>({
      query: (id) => ({
        url: `/product/sale-product/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['saleProducts'],
    }),
    getOneSaleProduct: build.query<SaleProductResponse, string>({
      query: (id) => ({
        url: `/product/sale-product/get-one/${id}`,
        method: 'GET',
      }),
      providesTags: ['saleProducts'],
    }),
  }),
})

export const {
  useGetSaleProductsQuery,
  useAddSaleProductMutation,
  useUpdateSaleProductMutation,
  useDeleteSaleProductMutation,
  useGetOneSaleProductQuery,
} = SaleProductApi
