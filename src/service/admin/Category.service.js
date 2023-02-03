import axios from 'configs/axiosInstance'

const path = {
  category: '/admin/category',
  prodCategory: '/admin/product_category',
}

const CategoryService = {
  getCate: async (params) => await axios.get(path.category, { params }),
  getCateById: async (id) => await axios.get(path.category + '/' + id),
  createCate: async (form) => await axios.post(path.category, form),
  getProdCate: async (params) => await axios.get(path.prodCategory, { params }),
  getProdCateById: async (_id) => await axios.get(path.prodCategory + '/' + _id),
  updateProdCateById: async (_id, params) => await axios.post(path.prodCategory + '/' + _id, params),
}

export default CategoryService
