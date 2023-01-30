import axios from 'configs/axiosInstance'

const path = {
  login: '/login',
  register: '/register',
  authenticate: '/authenticate',
  logout: '/logout',
  delivery: '/delivery',
  information: '/information',
  password: '/password',
}

const AuthenticateService = {
  isAuthenticate: async () => await axios.post(path.authenticate),
  login: async (params) => await axios.post(path.login, params),
  register: async (params) => await axios.post(path.register, params),
  logout: async () => await axios.post(path.logout),

  changeDelivery: async (form) => await axios.post(path.delivery, form),
  changeInformation: async (form) => await axios.post(path.information, form),
  changePassword: async (form) => await axios.post(path.password, form),
}
export default AuthenticateService
