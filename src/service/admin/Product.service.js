import axios from 'configs/axiosInstance'

const path = {
  product: '/admin/product',
  variable: '/admin/product/variable',
}

const ProductService = {
  getProduct: async () => await axios.get(path.product),

  getProductById: async (id) => await axios.get(path.product + '/' + id),

  updateProduct: async (id, form) => await axios.post(path.product + '/update/' + id, form),

  createProduct: async (form) => await axios.post(path.product + '/create', form),

  getVariables: async () => await axios.get(path.variable),

  updateVariable: async (id, form) => await axios.post(path.variable + '/' + id, form),

  createVariable: async (form) => await axios.post(path.variable, form),
}

export default ProductService