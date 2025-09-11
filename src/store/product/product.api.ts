import baseApi from '../api'
import type {
  GetAllProductsResponse,
  GetAllRentProductsResponse,
  GetAllProductsRequest,
  CreateProductRequest,
  CreateProductResponse,
  UpdateProductRequest,
} from './types'

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ===== GET ALL PRODUCTS =====
    getAllSaleProducts: builder.query<
      GetAllProductsResponse,
      GetAllProductsRequest
    >({
      query: (params) => ({
        url: '/product/sale-product/get-all',
        method: 'GET',
        params,
      }),
      providesTags: ['products'],
    }),
    getAllRentProducts: builder.query<
      GetAllRentProductsResponse,
      GetAllProductsRequest
    >({
      query: (params) => ({
        url: '/product/rent-product/get-all',
        method: 'GET',
        params,
      }),
      providesTags: ['products'],
    }),

    // ===== GET BY ID =====
    getSaleProductById: builder.query<CreateProductResponse, string>({
      query: (id) => ({
        url: `/product/sale-product/get/${id}`,
        method: 'GET',
      }),
      providesTags: ['products'],
    }),
    getRentProductById: builder.query<CreateProductResponse, string>({
      query: (id) => ({
        url: `/product/rent-product/get/${id}`,
        method: 'GET',
      }),
      providesTags: ['products'],
    }),

    // ===== CREATE PRODUCTS =====
    createSaleProduct: builder.mutation<
      CreateProductResponse,
      CreateProductRequest
    >({
      query: (body) => ({
        url: '/product/sale-product/add',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['products'],
    }),
    createRentProduct: builder.mutation<
      CreateProductResponse,
      CreateProductRequest
    >({
      query: (body) => ({
        url: '/product/rent-product/add',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['products'],
    }),

    // ===== UPDATE PRODUCTS =====
    updateSaleProduct: builder.mutation<
      CreateProductResponse,
      { id: string; body: UpdateProductRequest }
    >({
      query: ({ id, body }) => ({
        url: `/product/sale-product/update/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['products'],
    }),
    updateRentProduct: builder.mutation<
      CreateProductResponse,
      { id: string; body: UpdateProductRequest }
    >({
      query: ({ id, body }) => ({
        url: `/product/rent-product/update/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['products'],
    }),

    // ===== DELETE PRODUCTS =====
    deleteSaleProduct: builder.mutation<void, string>({
      query: (id) => ({
        url: `/product/sale-product/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['products'],
    }),
    deleteRentProduct: builder.mutation<void, string>({
      query: (id) => ({
        url: `/product/rent-product/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['products'],
    }),
  }),
})

export const {
  useGetAllSaleProductsQuery,
  useGetAllRentProductsQuery,
  useGetSaleProductByIdQuery,
  useGetRentProductByIdQuery,
  useCreateSaleProductMutation,
  useCreateRentProductMutation,
  useUpdateSaleProductMutation,
  useUpdateRentProductMutation,
  useDeleteSaleProductMutation,
  useDeleteRentProductMutation,
} = productApi
