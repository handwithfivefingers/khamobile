import axios from 'configs/axiosInstance'

const path = {
  setting: '/admin/setting',
  settingMenu: '/admin/setting/menu',
}

const SettingService = {
  //   getCate: async (params) => await axios.get(path.category, { params }),
  //   getCateById: async (id) => await axios.get(path.category + '/' + id),
  //   createCate: async (form) => await axios.post(path.category, form),
  //   getProdCate: async (params) => await axios.get(path.prodCategory, { params }),
  //   getProdCateById: async (_id) => await axios.get(path.prodCategory + '/' + _id),
  //   updateProdCateById: async (_id, params) => await axios.post(path.prodCategory + '/' + _id, params),

  getSetting: async (params) => await axios.get(path.setting, { params }),

  updateSetting: async (_id, form) => await axios.post(path.setting + '/' + _id, form),
}

export default SettingService
