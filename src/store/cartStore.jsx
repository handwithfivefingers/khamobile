import { create } from 'zustand'
const cartState = {
  cart: [],
}

const cartMutation = (set) => ({
  addToCart: (item) => set((state) => ({ cart: item })),
})

const useCartStore = create((set) => ({
  ...cartState,
  ...cartMutation(set),
  // addToCart: (item) => set((state) => ({ cart: [...state.cart, item] })),
  // deleteItemFormCart: (item) =>
  //   set((state) => {
  //     let index = state.cart.findIndex((cartItem) => cartItem._id === item._id)
  //     let newCart = []
  //     if (index !== -1) {
  //       newCart = [...state.cart.slice(0, index), ...state.cart.slice(index + 1)]
  //     }
  //     return {
  //       cart: newCart,
  //     }
  //   }),
}))

export { useCartStore }
