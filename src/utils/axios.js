import axios from 'axios'
import { getToken } from './auth'

const instance = axios.create({
  baseURL: 'http://localhost:8080'
})

instance.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers['x-authorization'] = token
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default instance