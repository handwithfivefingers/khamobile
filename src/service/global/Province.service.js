import axios from 'configs/axiosInstance'

const path = {
  province: '/province',
}

const ProvinceService = {
  getCity: () => axios.get(path.province),
  getDistrict: (districtCode) => axios.get(path.province, { code: districtCode }),
  getWard: (districtCode, wardCode) => axios.get(path.province, { code: districtCode, wards: wardCode }),
}

export default ProvinceService
