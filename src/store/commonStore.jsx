import { create } from 'zustand'

const initState = {
  title: '',
  productCategory: [],
  product: [],
}

const useCommonStore = create((set) => ({
  ...initState,

  changeTitle: (title) => set((state) => ({ ...state, title })),
  changeProductCategory: (listCategory) => set((state) => ({ ...state, productCategory: [...listCategory] })),
  changeProduct: (listProduct) => set((state) => ({ ...state, product: [...listProduct] })),
}))

export { useCommonStore }
