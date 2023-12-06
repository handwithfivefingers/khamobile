import axios from 'configs/axiosInstance'

const path = {
  product: '/product',
  products: '/products',
  product_id: '/product_id',
  variable: '/admin/product/variable',
}

const GlobalProductService = {
  getProduct: (params) => axios.get(path.products, { params }),

  getProductById: (_id, variantId) => axios.post(path.product_id, { _id, variantId }),

  filterProduct: (params) => axios.get(path.product, { params }),

  updateProduct: (id, form) => axios.post(path.product + '/' + id, form),

  createProduct: (form) => axios.post(path.product, form),

  getVariables: () => axios.get(path.variable),

  updateVariable: (id, form) => axios.post(path.variable + '/' + id, form),

  createVariable: (form) => axios.post(path.variable, form),
}

export { GlobalProductService }
