import axios from 'configs/axiosInstance'

const path = {
  product: '/admin/orders',
  orderChart: '/admin/orders-chart',
}

const OrderService = {
  getOrders: async () => await axios.post(path.product),
  getOrderChart: async () => await axios.get(path.orderChart),
}

export default OrderService
