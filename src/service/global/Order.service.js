import axios from 'configs/axiosInstance'

const path = {
  createOrder: '/order',
  getOrders: '/orders',
}

const GlobalOrderService = {
  createOrder: async (form) => await axios.post(path.createOrder, { ...form }),
  getOrders: async () => await axios.post(path.getOrders),
}
export { GlobalOrderService }
