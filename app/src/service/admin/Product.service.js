import axios from 'configs/axiosInstance'

const path = {
  product: '/admin/product',
  variable: '/admin/product/variable',
  attribute: '/admin/product_attribute',
  attributeList: '/admin/product_attribute_list',
  searchProduct: '/search',
}

const ProductService = {
  getProduct: async () => await axios.get(path.product),

  getProductById: async ({ _id, type }) => await axios.get(path.product + '/' + _id, { params: { type } }),

  updateProduct: async (form) => await axios.post(path.product + '/update', form),

  createProduct: async (form) => await axios.post(path.product + '/create', form),

  deleteProduct: async (form) => await axios.post(path.product + '/delete', form),

  duplicateProduct: async (_id) => await axios.post(path.product + '/duplicate', _id),

  getAttribute: async () => await axios.get(path.attribute),

  getAttributeTermById: async (id) => await axios.get(path.attribute + '/' + id),

  getAttributeList: async () => await axios.get(path.attributeList),

  saveAttributeTerm: async (id, form) => await axios.post(path.attribute + '/' + id, form),

  createAttribute: async (form) => await axios.post(path.attribute, form),

  deleteAttribute: async (_id) => await axios.delete(path.attribute + '/' + _id),

  searchProduct: async (form) => await axios.post(path.searchProduct, form),
}

export default ProductService
