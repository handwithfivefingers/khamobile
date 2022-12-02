import axios from 'configs/axiosInstance'

const path = {
  orderAnonymous: '/order',
}

const GlobalOrderService = {
  createOrderAnonymous: async (form) => await axios.post(path.orderAnonymous, { ...form, userType: 'anonymous' }),
}
export default GlobalOrderService
