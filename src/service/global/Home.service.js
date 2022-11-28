import axios from 'configs/axiosInstance'

const path = {
  homeProd: '/home',
}

const GlobalHomeService = {
  getHomeProd: async () => await axios.get(path.homeProd),
}
export default GlobalHomeService
