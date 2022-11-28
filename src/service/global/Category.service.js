import axios from 'configs/axiosInstance'

const path = {
  category: '/category',
  prodCate: '/product_category',
}

const GlobalCategoryService = {
  getProdCate: async () => await axios.get(path.prodCate),
}
export default GlobalCategoryService
