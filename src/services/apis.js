import createApi from './http.js'

const { get, patch, post } = createApi()

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
  return get('/tpa/get_testset_testsuite_by_name_id', params)
}

// 获取测试集列表
export const getTapGetTestsetByDataId = (params) => {
  return get('/tpa/get_testset_by_data_id', params)
}

// 测试对象列表
export const getTapGetTestObjList = (params) => {
  return get('/tpa/testcase_selector', params)
}

// 获取模型推荐评分
export const getAlearnRecommend = (params) => {
  return get('/alearn/recommend', params)
}

// 生成推荐用例
export const postTestcaseRecommend = (data) => {
  return post('/testcase_recommend/project_recommend', data, {
    timeout: 5 * 60 * 1000,
  })
}

// 获取已生成的推荐用例
export const getTestcaseRecommend = (params) => {
  return post('/testcase_recommend/get_project_recommend', params)
}

// ==================== 测试评测报告接口 ====================

/**
 * 获取报告汇总数据
 * 包含：报告标题、评价概况、执行汇总、缺陷统计、分析状态
 * @param {Object} params - { data_id: string }
 */
export const getReportSummary = (params) => {
  return get('/tpa/report/summary', params)
}

/**
 * 分页查询测试用例明细
 * @param {Object} params - { data_id, page, page_size, priority, testsuite_id, keyword }
 */
export const getReportTestcases = (params) => {
  return get('/tpa/report/testcases', params)
}

/**
 * 分页查询缺陷明细
 * @param {Object} params - { data_id, page, page_size, severity, scenario, keyword }
 */
export const getReportDefects = (params) => {
  return get('/tpa/report/defects', params)
}

/**
 * 查询可邀请的评分专家列表
 */
export const getReportExperts = () => {
  return get('/tpa/report/experts')
}

/**
 * 邀请专家评分
 * @param {Object} data - { data_id: string, emails: string[] }
 */
export const postReportInvitations = (data) => {
  return post('/tpa/report/invitations', data)
}

/**
 * 查询大模型分析状态和结果
 * @param {Object} params - { data_id: string }
 */
export const getReportAnalysis = (params) => {
  return get('/tpa/report/analysis', params)
}

/**
 * 触发大模型生成分析（同步接口）
 * @param {Object} data - { data_id: string, force?: boolean }
 */
export const postReportAnalysisGenerate = (data) => {
  return post('/tpa/report/analysis/generate', data)
}
