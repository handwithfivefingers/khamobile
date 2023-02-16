import { create } from 'zustand'

const initState = {
  title: '',
  productCategory: [],
}

const useCommonStore = create((set) => ({
  ...initState,

  changeTitle: (title) => set((state) => ({ ...state, title })),

  changeProductCategory: (listCategory) => set((state) => ({ ...state, productCategory: [...listCategory] })),
}))

export { useCommonStore }
