import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

// Register Initial State
const commonState = {
  title: '',
  productCategory: [],
  product: [],
}

// Register Action
const commonMutation = (set) => ({
  changeTitle: (title) => set((state) => ({ ...state, title })),
  changeProductCategory: (listCategory) => set((state) => ({ ...state, productCategory: [...listCategory] })),
  changeProduct: (listProduct) => set((state) => ({ ...state, product: [...listProduct] })),
})

const store = (set) => ({
  ...commonState,
  ...commonMutation(set),
})

// Register Store
const useCommonStore = create(
  devtools(store, {
    name: 'useCommonStore',
    serialize: { options: true },
    enabled: process.env.NODE_ENV === 'development',
  }),
)

export { useCommonStore }
