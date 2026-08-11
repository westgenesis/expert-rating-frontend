import { getReportDefects, getTapScoreHistory, getTestcaseRecommend } from '@/services/apis'

/** 单次请求的分页大小 */
const PAGE_SIZE = 200

/** 翻页次数上限，防止接口 total 异常时陷入死循环 */
const MAX_PAGES = 50

/**
 * 逐页拉取直到取满 total
 *
 * 导出必须拿到全量数据：旧实现只请求第一页 200 条，缺陷超过 200 条时
 * 会被静默截断。
 * @param {(params: object) => Promise<object>} request - 分页接口
 * @param {object} params - 除分页参数外的查询条件
 * @returns {Promise<Array<object>>} 全部数据行
 */
const fetchAllPages = async (request, params) => {
  const rows = []
  let page = 1
  let total = Number.POSITIVE_INFINITY

  while (rows.length < total && page <= MAX_PAGES) {
    const { data } = await request({ ...params, page, page_size: PAGE_SIZE })
    const items = data?.data || []
    total = data?.total ?? items.length
    rows.push(...items)
    if (!items.length) break
    page += 1
  }

  return rows
}

/**
 * 从 Promise.allSettled 结果中取值，失败时记录区块名
 * @param {PromiseSettledResult} result - allSettled 单项结果
 * @param {string} label - 区块名称，用于失败提示
 * @param {Array<string>} failures - 失败区块收集数组
 * @param {*} fallbackValue - 失败时的兜底值
 * @returns {*} 成功时的数据，失败时为兜底值
 */
const unwrap = (result, label, failures, fallbackValue) => {
  if (result.status === 'fulfilled') return result.value
  console.error(`导出时获取${label}失败:`, result.reason)
  failures.push(label)
  return fallbackValue
}

/**
 * 拉取 PDF 导出所需的全部明细数据
 *
 * 概况与大模型分析由报告页面持有，这里只补齐需要额外请求的部分。
 * 报告不含测试用例明细，因此不请求用例接口。
 * 单个区块失败不阻断导出，但会通过 failures 告知调用方。
 * @param {string} dataId - 测试评测任务唯一ID
 * @returns {Promise<{defects: Array, scores: Array, recommend: object, failures: Array<string>}>}
 */
export const fetchReportExportData = async (dataId) => {
  const failures = []

  if (!dataId) {
    return { defects: [], scores: [], recommend: {}, failures }
  }

  const [defectsResult, scoresResult, recommendResult] = await Promise.allSettled([
    fetchAllPages(getReportDefects, { data_id: dataId }),
    getTapScoreHistory({ data_id: dataId }),
    getTestcaseRecommend({ data_id: dataId }),
  ])

  return {
    defects: unwrap(defectsResult, '缺陷明细', failures, []),
    scores: unwrap(scoresResult, '主观评价详情', failures, { data: [] })?.data || [],
    recommend: unwrap(recommendResult, '迭代用例推荐', failures, { data: {} })?.data || {},
    failures,
  }
}
