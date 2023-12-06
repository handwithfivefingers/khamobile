import axios from 'configs/axiosInstance'

const path = {
  province: '/province',
}

const ProvinceService = {
  getCity: (params) => axios.get(path.province, { params }),
}

export { ProvinceService }
