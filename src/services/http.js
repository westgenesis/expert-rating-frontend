import axios from 'axios'

export const createApi = (baseURL = import.meta.env.VITE_API_BASE_URL) => {
  // 配置 axios 默认设置
  const api = axios.create({
    baseURL,
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

  const get = (url, params, config) => {
    return api.get(url, { params, ...config })
  }
  const post = (url, data, config) => {
    return api.post(url, data, config)
  }
  const put = (url, data, config) => {
    return api.put(url, data, config)
  }
  const del = (url, params, config) => {
    return api.delete(url, { params, ...config })
  }
  const patch = (url, data, config) => {
    return api.patch(url, data, config)
  }

  return {
    api,
    get,
    post,
    put,
    del,
    patch,
  }
}

export default createApi
