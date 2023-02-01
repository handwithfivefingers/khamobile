import axios from 'configs/axiosInstance'

const path = {
  filePath: '/admin/file-manager',
}

const FileManagerService = {
  getListFileAndFolder: async (query) =>
    await axios.get(path.filePath, {
      params: query,
    }),
}

export default FileManagerService
