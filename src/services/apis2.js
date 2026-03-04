import createApi from './http.js'

const { post } = createApi(import.meta.env.VITE_API_BASE_URL_2)

// 获取系统设置
export const getSystemConfig = (data) => post('/config/get', data)

// 设置系统设置
export const setSystemConfig = (data) => post('/config/set', data)
