import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { ProductWarehouseItem } from '../product/types'

type SaleProductItem = ProductWarehouseItem & {
  qty: number
}

type State = {
  allProducts: ProductWarehouseItem[]
  filteredProducts: SaleProductItem[]
  client: string | null
  assistant: string | null
}

const initialState: State = {
  allProducts: [],
  filteredProducts: [],
  client: null,
  assistant: null,
}

const SaleSlice = createSlice({
  name: 'sale',
  initialState,
  reducers: {
    addToFilteredProduct: (
      state,
      action: PayloadAction<ProductWarehouseItem>
    ) => {
      // Check if product already exists in filtered products
      const existingProduct = state.filteredProducts.find(
        (p) => p._id === action.payload._id
      )

      if (existingProduct) {
        // If exists, increase quantity
        state.filteredProducts = state.filteredProducts.map((p) =>
          p._id === action.payload._id ? { ...p, qty: p.qty + 1 } : p
        )
      } else {
        // If doesn't exist, add new product with qty 1
        const productWithQty: SaleProductItem = { ...action.payload, qty: 1 }
        state.filteredProducts.push(productWithQty)
      }

      // Remove from all products to avoid duplication
      state.allProducts = state.allProducts.filter(
        (p) => p._id !== action.payload._id
      )
    },

    addToAllProduct: (state, action: PayloadAction<ProductWarehouseItem[]>) => {
      state.allProducts = action.payload
    },

    removeProduct: (state, action: PayloadAction<string>) => {
      const removedProduct = state.filteredProducts.find(
        (p) => p._id === action.payload
      )

      state.filteredProducts = state.filteredProducts.filter(
        (p) => p._id !== action.payload
      )

      if (removedProduct) {
        // Remove qty property and add back to all products
        const { ...productWithoutQty } = removedProduct
        state.allProducts.push(productWithoutQty)
      }
    },

    increaseQty: (state, action: PayloadAction<string>) => {
      state.filteredProducts = state.filteredProducts.map((p) =>
        p._id === action.payload ? { ...p, qty: p.qty + 1 } : p
      )
    },

    decreaseQty: (state, action: PayloadAction<string>) => {
      state.filteredProducts = state.filteredProducts.map((p) => {
        if (p._id === action.payload) {
          if (p.qty > 1) {
            return { ...p, qty: p.qty - 1 }
          }
          // If qty becomes 0, we could either remove it or keep it at 1
          // Keeping it at 1 for now, but you can change this behavior
          return { ...p, qty: 1 }
        }
        return p
      })
    },

    updateQty: (state, action: PayloadAction<{ id: string; qty: number }>) => {
      const { id } = action.payload

      state.filteredProducts = state.filteredProducts.map((p) =>
        p._id === id ? { ...p } : p
      )
    },

    clearProducts: (state) => {
      // Move all filtered products back to all products
      const productsWithoutQty = state.filteredProducts.map(
        ({ ...product }) => product
      )
      state.allProducts = [...state.allProducts, ...productsWithoutQty]
      state.filteredProducts = []
      state.client = null
      state.assistant = null
    },

    setClient: (state, action: PayloadAction<string | null>) => {
      state.client = action.payload
    },

    setAssistant: (state, action: PayloadAction<string | null>) => {
      state.assistant = action.payload
    },

    clearClient: (state) => {
      state.client = null
    },

    clearAssistant: (state) => {
      state.assistant = null
    },

    resetSale: () => {
      return initialState
    },
  },
})

export const {
  addToFilteredProduct,
  addToAllProduct,
  removeProduct,
  increaseQty,
  decreaseQty,
  updateQty,
  clearProducts,
  setClient,
  setAssistant,
  clearClient,
  clearAssistant,
  resetSale,
} = SaleSlice.actions

export default SaleSlice.reducer
