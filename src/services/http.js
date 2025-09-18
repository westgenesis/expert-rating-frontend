import axios from 'axios'

// 配置 axios 默认设置
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 配置请求拦截器，可用于添加认证令牌等
api.interceptors.request.use(
  (config) => {
    // 从本地存储获取 token
    const token = localStorage.getItem('token')
    if (token && config.headers) {
      config.headers.Token = `${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default api

export const get = (url, params, config) => {
  return api.get(url, { params, ...config })
}
export const post = (url, data, config) => {
  return api.post(url, data, config)
}
export const put = (url, data, config) => {
  return api.put(url, data, config)
}
export const del = (url, params, config) => {
  return api.delete(url, { params, ...config })
}
export const patch = (url, data, config) => {
  return api.patch(url, data, config)
}
