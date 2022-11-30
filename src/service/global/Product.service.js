import axios from 'configs/axiosInstance'

const path = {
  product: '/product',
  product_id: '/product_id',
  variable: '/admin/product/variable',
}

const GlobalProductService = {
  getProduct: async (params) => await axios.get(path.product + 's', { params }),

  getProductById: async (id) => await axios.get(path.product_id + '/' + id),

  updateProduct: async (id, form) => await axios.post(path.product + '/' + id, form),

  createProduct: async (form) => await axios.post(path.product, form),

  getVariables: async () => await axios.get(path.variable),

  updateVariable: async (id, form) => await axios.post(path.variable + '/' + id, form),

  createVariable: async (form) => await axios.post(path.variable, form),
}

export default GlobalProductService
