import { get, patch } from './http.js'

// 获取专家评分矩阵
export const getShowExpertRatingMatrix = (params) => {
  return get('/admin/show_expert_rating_matrix', params)
}

// 更新专家评分矩阵
export const updateExpertRatingMatrix = (data) => {
  return patch('/admin/update_expert_rating_matrix', data)
}
