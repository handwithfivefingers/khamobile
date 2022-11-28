import axios from 'configs/axiosInstance'

const path = {
  product: '/admin/product',
  variable: '/admin/product/variable',
  attribute: '/admin/product_attribute',
}

const ProductService = {
  getProduct: async () => await axios.get(path.product),

  getProductById: async ({ _id, type }) => await axios.get(path.product + '/' + _id, { params: { type } }),

  updateProduct: async (id, form) => await axios.post(path.product + '/update/' + id, form),

  createProduct: async (form) => await axios.post(path.product + '/create', form),

  getVariables: async () => await axios.get(path.variable),

  updateVariable: async (id, form) => await axios.post(path.variable + '/' + id, form),

  createVariable: async (form) => await axios.post(path.variable, form),

  getAttribute: async () => await axios.get(path.attribute),
}

export default ProductService
