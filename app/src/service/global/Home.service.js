import axios from 'configs/axiosInstance'
import axiosService from 'configs/axiosService'

const path = {
  homeProd: '/home',
  homeSeo: '/seo',
  aboutSeo: '/seo-about',
  categorySeo: '/seo-category',
  postSeo: '/seo-post',
  productSeo: '/seo-product',
  menu: '/menu',
}
const GlobalHomeService = {
  getHomeProd: () => axiosService.get(path.homeProd),
  getHomeSeo: () => axiosService.get(path.homeSeo),
  getAboutUsSeo: () => axiosService.get(path.aboutSeo),
  getCategorySeo: () => axiosService.get(path.categorySeo),
  getSingleCategorySeo: (slug) => axiosService.get(path.categorySeo + '/' + slug),
  getPostSeo: () => axiosService.get(path.postSeo),
  getProductSeo: () => axiosService.get(path.productSeo),
  getMenu: () => axios.get(path.menu),
}
export { GlobalHomeService }
