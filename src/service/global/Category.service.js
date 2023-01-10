import axios from 'configs/axiosInstance'

const path = {
  category: '/category',
  prodCate: '/product_category',
}

const GlobalCategoryService = {
  getProdCate: async (params) => await axios.get(path.prodCate, { params }),
  getProdByCategorySlug: async (slug, params) => await axios.get(path.prodCate + '/' + slug, { params }),
}
export default GlobalCategoryService
