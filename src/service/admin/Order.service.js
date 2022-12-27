import axios from 'configs/axiosInstance'

const path = {
  product: '/admin/orders',
}

const OrderService = {
  getOrders: async () => await axios.post(path.product),
}

export default OrderService
