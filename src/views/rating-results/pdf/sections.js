import {
  buildExecutionDataSummary,
  buildSeverityRows,
  defectColumns,
  defectSeverityColumns,
  executionSummaryColumns,
  formatPercent,
  formatScore,
  FREQUENCY_COLORS,
  isExecutionSummaryRow,
  QUALITY_LEVEL_COLORS,
  recommendColumns,
  residualRiskColumns,
  RISK_LEVEL_COLORS,
  scoreHistoryColumns,
  toPdfTable,
} from '../report-schema'
import { PIE_IMAGE_WIDTH, renderPieToDataUrl } from './chart'
import { COLORS } from './styles'

/**
 * 生成小节标题节点
 * @param {string} text - 标题文字
 * @returns {object} pdfmake 文本节点
 */
const sectionTitle = (text) => ({ text, style: 'sectionTitle' })

/**
 * 汇总行加浅蓝底色
 * @param {object} row - 执行汇总行
 * @returns {string|null} 背景色
 */
const executionRowFill = (row) => (isExecutionSummaryRow(row) ? COLORS.summaryRowBg : null)

/**
 * 评价概况：左侧综合评分，右侧五项指标，下方判定依据
 * @param {object} overview - /report/summary 的 overview 字段
 * @returns {Array<object>} pdfmake 节点数组
 */
export const buildOverviewSection = (overview = {}) => {
  const passed = Boolean(overview.passed)
  const statusColor = passed ? COLORS.pass : COLORS.fail
  const statusText = overview.status_text || (passed ? '测试通过' : '测试未通过')

  const metrics = [
    { label: '客观评分', value: formatScore(overview.objective_score) },
    { label: '专家平均分', value: formatScore(overview.expert_average_score) },
    { label: '测试用例总数', value: overview.testcase_total ?? '--' },
    { label: '整体通过率', value: formatPercent(overview.overall_pass_rate) },
    { label: '缺陷总数', value: overview.defect_total ?? '--' },
  ]

  const nodes = [
    sectionTitle('评价概况'),
    {
      columns: [
        {
          width: 120,
          stack: [
            {
              text: formatScore(overview.comprehensive_score),
              style: 'scoreValue',
              color: statusColor,
              alignment: 'center',
            },
            { text: '综合评分', style: 'scoreLabel', alignment: 'center', margin: [0, 2, 0, 4] },
            {
              text: statusText,
              alignment: 'center',
              fontSize: 9,
              bold: true,
              color: statusColor,
            },
          ],
        },
        {
          width: '*',
          margin: [12, 8, 0, 0],
          table: {
            widths: Array.from({ length: metrics.length }, () => '*'),
            body: [
              metrics.map((item) => ({
                text: String(item.value),
                style: 'metricValue',
                alignment: 'center',
              })),
              metrics.map((item) => ({
                text: item.label,
                style: 'metricLabel',
                alignment: 'center',
                margin: [0, 2, 0, 0],
              })),
            ],
          },
          layout: 'plain',
        },
      ],
    },
  ]

  const reasons = overview.judgement_reasons || []
  if (reasons.length) {
    nodes.push({
      margin: [0, 12, 0, 0],
      table: {
        widths: ['*'],
        body: [
          [
            {
              border: [false, false, false, false],
              fillColor: COLORS.accentBg,
              margin: [8, 6, 8, 6],
              stack: [
                { text: '判定依据', style: 'cardTitle', color: COLORS.accent },
                { ul: reasons.map((reason) => ({ text: reason, style: 'cardBody' })) },
              ],
            },
          ],
        ],
      },
      layout: 'plain',
    })
  }

  return nodes
}

/**
 * 用例执行汇总，含页面上同款「数据说明」
 * @param {Array<object>} rows - execution_summary 数据
 * @returns {Array<object>} pdfmake 节点数组
 */
export const buildExecutionSection = (rows = []) => {
  const nodes = [
    sectionTitle('用例执行汇总（按优先级）'),
    // 行内容都是数字，高度必定很小，禁止跨页更好看
    toPdfTable(executionSummaryColumns, rows, { rowFill: executionRowFill, dontBreakRows: true }),
  ]

  const summaryText = buildExecutionDataSummary(rows)
  if (summaryText) {
    nodes.push({ text: `数据说明：${summaryText}`, style: 'note', margin: [0, 6, 0, 0] })
  }

  return nodes
}

/**
 * 缺陷分布统计：等级分布表 + 发生频率饼图
 * @param {object} statistics - defect_statistics 数据
 * @returns {Array<object>} pdfmake 节点数组
 */
export const buildDefectStatisticsSection = (statistics = {}) => {
  const severityRows = buildSeverityRows(statistics)
  const nodes = [
    sectionTitle('缺陷分布统计'),
    toPdfTable(defectSeverityColumns, severityRows, {
      rowFill: (row) => (row.isSummary ? COLORS.summaryRowBg : null),
      dontBreakRows: true,
    }),
  ]

  const frequencyImage = renderPieToDataUrl(statistics?.frequency_distribution, (key) => ({
    color: FREQUENCY_COLORS[key] || '#94a3b8',
  }))

  if (frequencyImage) {
    nodes.push({ text: '缺陷发生频率分布图', style: 'subTitle' })
    nodes.push({ image: frequencyImage, width: PIE_IMAGE_WIDTH, alignment: 'center' })
  }

  return nodes
}

/** 报告只列出达到 A 级及以上的缺陷，其余等级不进明细 */
const REPORTED_SEVERITIES = ['S', 'A']

/**
 * 缺陷明细清单，只保留 A 级及以上，严重程度红色标注
 *
 * 上方的缺陷分布统计仍是全量口径，两处条数对不上是预期的，
 * 因此这里加一行说明，避免被当成漏数据。
 * @param {Array<object>} defects - 全量缺陷
 * @returns {Array<object>} pdfmake 节点数组
 */
export const buildDefectDetailSection = (defects = []) => {
  const listed = defects.filter((defect) => REPORTED_SEVERITIES.includes(defect.severity))

  return [
    sectionTitle('缺陷明细清单'),
    {
      text: `说明：仅列出严重程度 A 级及以上（${REPORTED_SEVERITIES.join('、')}）的缺陷，共 ${listed.length} 条；其余等级请见上方缺陷分布统计。`,
      style: 'note',
      margin: [0, 0, 0, 6],
    },
    toPdfTable(defectColumns, listed, {
      emptyText: '暂无 A 级及以上缺陷',
      cellColor: (row, index, key) => (key === 'severity' ? COLORS.fail : null),
    }),
  ]
}

/**
 * 主观评价详情，无数据时整节省略
 * @param {Array<object>} scores - 专家评分历史
 * @returns {Array<object>} pdfmake 节点数组
 */
export const buildScoreSection = (scores = []) => {
  if (!scores.length) return []
  return [
    sectionTitle('主观评价详情'),
    toPdfTable(scoreHistoryColumns, scores, {
      cellColor: (row, index, key) =>
        key === '评分' && (row['评分'] == null || row['评分'] === '') ? COLORS.fail : null,
    }),
  ]
}

/**
 * 迭代用例推荐，附大模型总结
 * @param {object} recommend - 推荐接口返回体
 * @returns {Array<object>} pdfmake 节点数组
 */
export const buildRecommendSection = (recommend = {}) => {
  const rows = recommend?.defect_related || []
  if (!rows.length) return []

  const nodes = [sectionTitle('迭代用例推荐'), toPdfTable(recommendColumns, rows)]

  if (recommend.llm_summarize) {
    nodes.push({ text: recommend.llm_summarize, style: 'note', margin: [0, 8, 0, 0] })
  }

  return nodes
}

/**
 * 遗留风险分析，风险等级按高中低着色
 * @param {Array<object>} risks - residual_risks 数据
 * @returns {Array<object>} pdfmake 节点数组
 */
export const buildRiskSection = (risks = []) => {
  if (!risks.length) return []
  return [
    sectionTitle('遗留风险分析'),
    toPdfTable(residualRiskColumns, risks, {
      cellColor: (row, index, key) => (key === 'level' ? RISK_LEVEL_COLORS[row.level] : null),
    }),
  ]
}

/**
 * 整体质量分析卡片与综合结论
 * @param {Array<object>} qualityAnalysis - quality_analysis 数据
 * @param {string} conclusion - 综合结论
 * @returns {Array<object>} pdfmake 节点数组
 */
export const buildQualitySection = (qualityAnalysis = [], conclusion = '') => {
  if (!qualityAnalysis.length) return []

  const nodes = [sectionTitle('整体质量分析')]

  qualityAnalysis.forEach((item) => {
    nodes.push({
      margin: [0, 0, 0, 6],
      table: {
        widths: ['*'],
        body: [
          [
            {
              margin: [8, 6, 8, 6],
              stack: [
                {
                  columns: [
                    { text: item.dimension || '--', style: 'cardTitle', width: '*' },
                    {
                      text: item.level || '--',
                      width: 'auto',
                      fontSize: 9,
                      bold: true,
                      color: QUALITY_LEVEL_COLORS[item.level] || COLORS.muted,
                    },
                  ],
                },
                { text: item.summary || '--', style: 'cardBody' },
              ],
            },
          ],
        ],
      },
      layout: 'reportTable',
      unbreakable: true,
    })
  })

  if (conclusion) {
    nodes.push({
      margin: [0, 6, 0, 0],
      table: {
        widths: ['*'],
        body: [
          [
            {
              border: [false, false, false, false],
              fillColor: COLORS.accentBg,
              margin: [8, 6, 8, 6],
              stack: [
                { text: '综合结论', style: 'cardTitle', color: COLORS.accent },
                { text: conclusion, style: 'cardBody' },
              ],
            },
          ],
        ],
      },
      layout: 'plain',
    })
  }

  return nodes
}

/**
 * 后续优化落地建议
 * @param {Array<object>} suggestions - optimization_suggestions 数据
 * @returns {Array<object>} pdfmake 节点数组
 */
export const buildSuggestionSection = (suggestions = []) => {
  if (!suggestions.length) return []

  const nodes = [sectionTitle('后续优化落地建议')]

  suggestions.forEach((item, index) => {
    nodes.push({
      margin: [0, 0, 0, 6],
      unbreakable: true,
      stack: [
        { text: `${index + 1}. ${item.title || '--'}`, style: 'cardTitle' },
        { text: item.content || '--', style: 'cardBody' },
      ],
    })
  })

  return nodes
}
