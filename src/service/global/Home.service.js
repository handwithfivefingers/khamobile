import axios from 'configs/axiosInstance'

const path = {
  homeProd: '/home',
  homeSeo: '/seo',
  aboutSeo: '/seo-about',
  categorySeo: '/seo-category',
  postSeo: '/seo-post',
  productSeo: '/seo-product',
}

const GlobalHomeService = {
  getHomeProd: async () => await axios.get(path.homeProd),
  getHomeSeo: async () => await axios.get(path.homeSeo),
  getAboutUsSeo: async () => await axios.get(path.aboutSeo),
  getCategorySeo: async () => await axios.get(path.categorySeo),
  getPostSeo: async () => await axios.get(path.postSeo),
  getProductSeo: async () => await axios.get(path.productSeo),
}
export default GlobalHomeService
