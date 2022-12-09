import axios from 'configs/axiosInstance'

const path = {
  orderAnonymous: '/order',
}

const GlobalOrderService = {
  createOrder: async (form) => await axios.post(path.orderAnonymous, { ...form }),
}
export default GlobalOrderService
