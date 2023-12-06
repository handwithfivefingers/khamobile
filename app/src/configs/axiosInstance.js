import axios from 'axios'

const instance = axios.create({
  baseURL: process.env.API + `/api`,
  timeout: 1000 * 30, // Wait for 30 seconds
  headers: {
    'Access-Control-Allow-Origin': '*',
    accept: 'application/json',
  },
  withCredentials: true,
  credentials: 'include',
})

instance.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

instance.interceptors.response.use(
  (res) => {
    return res
  },
  (err) => {
    return Promise.reject(err)
  },
)

export default instance
