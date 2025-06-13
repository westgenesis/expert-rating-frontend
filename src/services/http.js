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

export const get = (url, params) => {
  return api.get(url, { params })
}
export const post = (url, data) => {
  return api.post(url, data)
}
export const put = (url, data) => {
  return api.put(url, data)
}
export const del = (url, params) => {
  return api.delete(url, { params })
}
export const patch = (url, data) => {
  return api.patch(url, data)
}
