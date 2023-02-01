import axios from 'configs/axiosInstance'

const path = {
  page: '/admin/page',
}

const PageService = {
  getPages: () => axios.get(path.page),
  updatePage: (_id, formData) => axios.post(path.page + '/' + _id, formData),
  createPage: (formData) => axios.post(path.page, formData),
  getPageById: (id) => axios.get(path.page + '/' + id),
}

export default PageService
