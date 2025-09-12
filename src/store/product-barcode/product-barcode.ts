import baseApi from '../api'
import type { SaleProductDetail, RentProductDetail, ApiResponse } from './types'

// product-detail API lar
export const productDetailApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ===== GET SALE PRODUCT BY BARCODE =====
    getSaleProductDetailByBarcode: builder.query<
      ApiResponse<SaleProductDetail>, // <== typeni moslab qo'ydik
      string
    >({
      query: (barcode) => ({
        url: `/product-detail/sale-product/barcode/${barcode}`,
        method: 'GET',
      }),
      providesTags: ['product-detail'],
    }),

    // ===== GET RENT PRODUCT BY BARCODE =====
    getRentProductDetailByBarcode: builder.query<
      ApiResponse<RentProductDetail>, // <== typeni moslab qo'ydik
      string
    >({
      query: (barcode) => ({
        url: `/product-detail/rent-product/barcode/${barcode}`,
        method: 'GET',
      }),
      providesTags: ['product-detail'],
    }),
  }),
})

export const {
  useGetSaleProductDetailByBarcodeQuery,
  useGetRentProductDetailByBarcodeQuery,
} = productDetailApi
