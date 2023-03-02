import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

const cartState = {
  cart: [],
}

const cartMutation = (set) => ({
  addToCart: (item) => set((state) => ({ cart: item })),
})

const store = (set) => ({
  ...cartState,
  ...cartMutation(set),
})
const useCartStore = create(
  devtools(store, {
    name: 'useCartStore',
    enabled: process.env.NODE_ENV === 'development',
  }),
)

export { useCartStore }
