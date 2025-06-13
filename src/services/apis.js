import { get, patch, post } from './http.js'

// 获取专家评分矩阵
export const getShowExpertRatingMatrix = (params) => {
  return get('/admin/show_expert_rating_matrix', params)
}

// 更新专家评分矩阵
export const updateExpertRatingMatrix = (data) => {
  return patch('/admin/update_expert_rating_matrix', data)
}

// 获取评测结果
export const getTapGetByName = (params) => {
  return get('/tpa/get_by_name', params)
}

// 获取专家评分历史
export const getTapScoreHistory = (params) => {
  return get('/tpa/score_history', params)
}

// 获取专家列表
export const getTapExpertsEmail = (params) => {
  return get('/tpa/get_experts_email', params)
}

// 邀请专家评分
export const postTapAskExpertsReview = (data) => {
  return post('/tpa/ask_experts_review', data)
}

// 确认评分
export const getTapSubmitScores = (params) => {
  return get('/tpa/submit_scores', params)
}

// 专家提交评分
export const postTapSendScorePayload = (data) => {
  return post('/tpa/send_score_payload', data)
}

// 获取专家评分
export const getTapReadScorePayload = (params) => {
  return get('/tpa/read_score_payload', params)
}
