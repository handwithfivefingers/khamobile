import axios from 'configs/axiosInstance'

const path = {
  product: '/admin/product',
  variable: '/admin/product/variable',
  attribute: '/admin/product_attribute',
  attributeList: '/admin/product_attribute_list',
}

const ProductService = {
  getProduct: async () => await axios.get(path.product),

  getProductById: async ({ _id, type }) => await axios.get(path.product + '/' + _id, { params: { type } }),

  updateProduct: async (form) => await axios.post(path.product + '/update', form),

  createProduct: async (form) => await axios.post(path.product + '/create', form),

  getAttribute: async () => await axios.get(path.attribute),

  getAttributeTermById: async (id) => await axios.get(path.attribute + '/' + id),

  getAttributeList: async () => await axios.get(path.attributeList),

  saveAttributeTerm: async (id, form) => await axios.post(path.attribute + '/' + id, form),

  createAttribute: async (form) => await axios.post(path.attribute, form),
}

export default ProductService
