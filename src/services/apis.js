import { get, patch, post } from './http.js'

// 获取专家评分矩阵
export const getShowExpertRatingMatrix = (params) => {
  return get('/admin/show_expert_rating_matrix', params)
}

// 更新专家评分矩阵
export const updateExpertRatingMatrix = (data) => {
  return patch('/admin/update_expert_rating_matrix', data)
}

// 获取客观评分矩阵
export const getShowObjectiveRatingMatrix = (params) => {
  return get('/admin/show_objective_rating_matrix', params)
}

// 更新客观评分矩阵
export const updateObjectiveRatingMatrix = (data) => {
  return patch('/admin/update_objective_rating_matrix', data)
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

// 更新专家列表
export const updateExpertsEmail = (data) => {
  return patch('/admin/update_experts', data)
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

// 获取所有历史评价
export const getTapAllScoreHistory = (params) => {
  return get('/tpa/all_score_history', params)
}

// 获取测试用例列表
export const getTapGetTestCaseLists = (params) => {
  return get('/tpa/get_testcaselists', params)
}

// 获取缺陷列表
export const getTapGetDefectLists = (params) => {
  return get('/tpa/get_defect_lists', params)
}

// 获取用户信息
export const getTapExportInfo = (params) => {
  return get('/tpa/expert_info', params)
}

// 获取测试用例ID列表
export const getTapTestCaseIds = (params) => {
  return get('/tpa/testcase_ids', params)
}

// 设置评分系数
export const postTapUpdateZongheSettings = (data) => {
  return patch('/admin/update_zonghe_settings', data)
}

// 获取评分系数（单个）
export const getTapGetZongheSettings = (params) => {
  return get('/admin/get_zonghe_settings', params)
}

// 获取测试用例详情
export const getTapGetTestCaseDetail = (params) => {
  return get('/tpa/get_by_testsuite_id', params)
}
