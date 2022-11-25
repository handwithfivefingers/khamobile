import axios from 'configs/axiosInstance'

const path = {
  product: '/admin/product',
  variable: '/admin/product/variable',
}

const GlobalProductService = {
  getProduct: async () => await axios.get(path.product),
  
  getProductById: async () => await axios.get(path.product + '/' + id),

  updateProduct: async (id, form) => await axios.post(path.product + '/' + id, form),

  createProduct: async (form) => await axios.post(path.product, form),

  getVariables: async () => await axios.get(path.variable),

  updateVariable: async (id, form) => await axios.post(path.variable + '/' + id, form),

  createVariable: async (form) => await axios.post(path.variable, form),
}

export default GlobalProductService
