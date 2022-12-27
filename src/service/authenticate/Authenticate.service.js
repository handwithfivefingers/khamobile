import axios from 'configs/axiosInstance'

const path = {
  login: '/login',
  register: '/register',
  authenticate: '/authenticate',
  logout: '/logout',
}

const AuthenticateService = {
  isAuthenticate: async () => await axios.post(path.authenticate),
  login: async (params) => await axios.post(path.login, params),
  register: async (params) => await axios.post(path.register, params),
  logout: async () => await axios.post(path.logout),
}
export default AuthenticateService
