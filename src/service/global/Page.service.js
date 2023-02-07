import axios from 'configs/axiosInstance'

const path = {
  page: '/page',
}

const PageService = {
  getPage: async (slug) => await axios.post(path.page, { slug }),
}

export default PageService
