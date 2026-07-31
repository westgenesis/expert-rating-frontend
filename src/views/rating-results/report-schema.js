import formatDate from 'date-fns/format'
import { CONTENT_WIDTH, TABLE_METRICS } from './pdf/styles'

/**
 * 报告各表格的共享列定义。
 *
 * 页面用 n-data-table 渲染，PDF 导出用 pdfmake 渲染，两端共用这一份定义。
 * 之前两边各写一套，已经漂移出实际缺陷（导出表头有「测试步骤」但数据行没有、
 * 缺陷频率图整块丢失），所以这里把列定义收敛成唯一来源。
 *
 * 单列字段约定：
 * - title      表头文字
 * - key        数据字段名，n-data-table 需要它做唯一标识
 * - width      页面列宽（像素），不填则自适应
 * - pdfWidth   PDF 列宽的相对权重，按可用宽度等比分配，缺省为 1
 * - text       (row, index) => string，纯文本取值，PDF 与页面共用
 * - render     (row, index) => VNode，仅页面使用的富渲染，PDF 始终走 text
 * - ellipsis   页面是否单行省略并悬浮显示全文
 *
 * 只属于页面交互的列（如「操作」按钮列）不放进这里，由组件自行追加。
 */

/** 缺陷等级中文说明 */
export const SEVERITY_LABELS = { A: 'A级（致命）', B: 'B级（严重）', C: 'C级（一般）', D: 'D级（轻微）' }

/** 缺陷等级对应的 n-tag type */
export const SEVERITY_TAG_TYPES = { A: 'error', B: 'warning', C: 'info', D: 'success' }

/** 缺陷发生频率的图表配色，页面饼图与 PDF 饼图共用 */
export const FREQUENCY_COLORS = { 必现: '#ef4444', 偶发: '#f97316', 极少: '#3b82f6' }

/** 风险等级配色，页面用 Tailwind class，PDF 用十六进制色值 */
export const RISK_LEVEL_CLASSES = {
  高: 'text-red-600 font-semibold',
  中: 'text-amber-500 font-semibold',
  低: 'text-green-600 font-semibold',
}

/** 风险等级在 PDF 中的字体颜色 */
export const RISK_LEVEL_COLORS = { 高: '#dc2626', 中: '#f59e0b', 低: '#16a34a' }

/** 质量等级对应的 n-tag type */
export const QUALITY_LEVEL_TAG_TYPES = { 优: 'success', 良: 'info', 中: 'warning', 差: 'error' }

/** 质量等级在 PDF 中的字体颜色 */
export const QUALITY_LEVEL_COLORS = {
  优: '#16a34a',
  良: '#2563eb',
  中: '#f59e0b',
  差: '#dc2626',
}

/** 无数据时统一显示的占位符 */
const PLACEHOLDER = '--'

/**
 * 取值为空时回落到占位符
 * @param {*} value - 原始值
 * @returns {string} 文本，空值返回 '--'
 */
const fallback = (value) => {
  if (value === null || value === undefined || value === '') return PLACEHOLDER
  return String(value)
}

/**
 * 数组拼接为顿号分隔的文本
 * @param {Array} list - 待拼接数组
 * @returns {string} 拼接结果，空数组返回 '--'
 */
const joinList = (list) => (list?.length ? list.join('、') : PLACEHOLDER)

/**
 * 按 order 排序后拼接测试步骤
 * @param {Array<{order: string|number, action: string}>} steps - 测试步骤列表
 * @returns {string} 换行分隔的步骤文本
 */
export const formatSteps = (steps) => {
  if (!steps?.length) return PLACEHOLDER
  return [...steps]
    .sort((a, b) => (parseInt(a.order, 10) || 0) - (parseInt(b.order, 10) || 0))
    .map((step) => step.action)
    .join('\n')
}

/**
 * 格式化百分比字段
 * @param {number|null|undefined} value - 百分比数值（不含 % 号）
 * @returns {string} 形如 "92.5%" 的文本
 */
export const formatPercent = (value) => (value != null ? `${value}%` : PLACEHOLDER)

/**
 * 格式化评分，保留两位小数
 * @param {number|null|undefined} value - 分值
 * @returns {string} 形如 "86.42" 的文本
 */
export const formatScore = (value) => (value != null ? Number(value).toFixed(2) : PLACEHOLDER)

/**
 * 判断执行汇总中的行是否为「全部」汇总行
 * @param {object} row - 执行汇总原始行
 * @returns {boolean} 是否为汇总行
 */
export const isExecutionSummaryRow = (row) => row?.priority === '全部'

/** 用例执行汇总（按优先级） */
export const executionSummaryColumns = [
  {
    title: '序号',
    key: 'index',
    width: 60,
    pdfWidth: 0.6,
    text: (row, index) => (isExecutionSummaryRow(row) ? '' : String(index + 1)),
  },
  {
    title: '用例优先级',
    key: 'priority',
    pdfWidth: 1.2,
    text: (row) => (isExecutionSummaryRow(row) ? '汇总' : fallback(row.priority)),
  },
  { title: '用例数量', key: 'total', pdfWidth: 1, text: (row) => fallback(row.total) },
  { title: '测试通过用例数', key: 'passed', pdfWidth: 1.2, text: (row) => fallback(row.passed) },
  { title: '测试失败用例数', key: 'failed', pdfWidth: 1.2, text: (row) => fallback(row.failed) },
  {
    title: '未执行用例数',
    key: 'not_executed',
    pdfWidth: 1.2,
    text: (row) => fallback(row.not_executed ?? 0),
  },
  {
    title: '测试通过率',
    key: 'pass_rate',
    pdfWidth: 1.1,
    text: (row) => formatPercent(row.pass_rate),
  },
]

/** 测试用例明细 */
export const testcaseColumns = [
  {
    title: '用例编号',
    key: 'testcase_number',
    width: 130,
    pdfWidth: 1.1,
    text: (row) => fallback(row.testcase_number || row.testcase_id),
  },
  {
    title: '用例名称',
    key: 'testcase_name',
    ellipsis: true,
    pdfWidth: 2.2,
    text: (row) => fallback(row.testcase_name),
  },
  {
    title: '测试类型',
    key: 'testcase_type',
    width: 100,
    pdfWidth: 0.8,
    text: (row) => fallback(row.testcase_type),
  },
  { title: '优先级', key: 'priority', width: 90, pdfWidth: 0.8, text: (row) => fallback(row.priority) },
  {
    title: '描述信息',
    key: 'description',
    ellipsis: true,
    pdfWidth: 2.6,
    text: (row) => fallback(row.description),
  },
  {
    title: '测试步骤',
    key: 'steps',
    ellipsis: true,
    pdfWidth: 3,
    text: (row) => formatSteps(row.steps),
  },
  {
    title: '预期结果',
    key: 'expected_results',
    ellipsis: true,
    pdfWidth: 2.5,
    text: (row) => (row.expected_results?.length ? row.expected_results.join('\n') : PLACEHOLDER),
  },
]

/**
 * 由缺陷统计构造缺陷等级分布表的数据行，末行追加缺陷总数
 * @param {object} statistics - /report/summary 的 defect_statistics 字段
 * @returns {Array<{index: string|number, label: string, count: number, isSummary: boolean}>} 表格行
 */
export const buildSeverityRows = (statistics) => {
  const distribution = statistics?.severity_distribution || {}
  const rows = Object.entries(distribution).map(([key, count], index) => ({
    index: index + 1,
    label: `${key}（${SEVERITY_LABELS[key] || ''}）`,
    count,
    isSummary: false,
  }))
  rows.push({ index: '', label: '缺陷总数', count: statistics?.total ?? 0, isSummary: true })
  return rows
}

/**
 * 由执行汇总生成「数据说明」文案
 * @param {Array<object>} rows - /report/summary 的 execution_summary 字段
 * @returns {string} 说明文案，无汇总行时返回空串
 */
export const buildExecutionDataSummary = (rows) => {
  const summaryRow = rows?.find(isExecutionSummaryRow)
  if (!summaryRow) return ''
  const { total, failed, pass_rate: passRate } = summaryRow
  const head = `本次测试共覆盖 ${total} 条用例，整体通过率 ${passRate}%。`
  const tail = failed > 0 ? `共有 ${failed} 条用例失败，是本次测试的主要关注点。` : '所有用例全部通过。'
  return head + tail
}

/** 缺陷等级分布 */
export const defectSeverityColumns = [
  {
    title: '序号',
    key: 'index',
    width: 60,
    pdfWidth: 0.6,
    // 末行是「缺陷总数」汇总行，没有序号，留空而不是显示占位符
    text: (row) => (row.index === '' ? '' : fallback(row.index)),
  },
  { title: '缺陷等级', key: 'label', pdfWidth: 4, text: (row) => fallback(row.label) },
  { title: '数量', key: 'count', width: 80, pdfWidth: 1, text: (row) => fallback(row.count) },
]

/** 缺陷明细清单 */
export const defectColumns = [
  {
    title: '所属测试集',
    key: 'testsuite_names',
    pdfWidth: 1.8,
    text: (row) => joinList(row.testsuite_names),
  },
  { title: '缺陷编号', key: 'bug_id', width: 110, pdfWidth: 1, text: (row) => fallback(row.bug_id) },
  {
    title: '关联用例编号',
    key: 'associated_testcase_ids',
    pdfWidth: 1.6,
    text: (row) => joinList(row.associated_testcase_ids),
  },
  { title: '缺陷描述', key: 'title', ellipsis: true, pdfWidth: 3, text: (row) => fallback(row.title) },
  {
    title: '严重程度',
    key: 'severity',
    width: 90,
    pdfWidth: 0.8,
    text: (row) => fallback(row.severity),
  },
  {
    title: '发生频率',
    key: 'frequency',
    width: 90,
    pdfWidth: 0.8,
    text: (row) => fallback(row.frequency),
  },
  {
    title: '缺陷场景',
    key: 'defect_scenario',
    width: 110,
    pdfWidth: 1.2,
    text: (row) => fallback(row.defect_scenario),
  },
]

/** 主观评价详情（专家评分历史） */
export const scoreHistoryColumns = [
  { title: '评分专家', key: '评分专家', pdfWidth: 1.5, text: (row) => fallback(row['评分专家']) },
  {
    title: '评分',
    key: '评分',
    pdfWidth: 0.8,
    text: (row) => (row['评分'] != null && row['评分'] !== '' ? String(row['评分']) : '未提交'),
  },
  {
    title: '更新时间',
    key: '更新时间',
    pdfWidth: 1.5,
    text: (row) =>
      row['更新时间'] ? formatDate(new Date(row['更新时间']), 'yyyy-MM-dd HH:mm:ss') : '',
  },
  { title: '备注', key: '备注', pdfWidth: 3, text: (row) => (row['备注'] ? row['备注'] : '-') },
]

/** 迭代用例推荐 */
export const recommendColumns = [
  { title: '用例编号', key: '用例编号', pdfWidth: 1.2, text: (row) => fallback(row['用例编号']) },
  { title: '用例名称', key: '用例名称', pdfWidth: 2, text: (row) => fallback(row['用例名称']) },
  { title: '前置条件', key: '前置条件', pdfWidth: 2.2, text: (row) => fallback(row['前置条件']) },
  {
    title: '测试优先级',
    key: '测试优先级',
    pdfWidth: 0.9,
    text: (row) => fallback(row['测试优先级']),
  },
  { title: '测试描述', key: '测试描述', pdfWidth: 3, text: (row) => fallback(row['测试描述']) },
]

/** 遗留风险分析 */
export const residualRiskColumns = [
  { title: '风险编号', key: 'risk_id', width: 100, pdfWidth: 1, text: (row) => fallback(row.risk_id) },
  {
    title: '风险描述',
    key: 'description',
    ellipsis: true,
    pdfWidth: 2.5,
    text: (row) => fallback(row.description),
  },
  { title: '风险等级', key: 'level', width: 90, pdfWidth: 0.8, text: (row) => fallback(row.level) },
  {
    title: '关联缺陷/用例',
    key: 'related_items',
    width: 160,
    pdfWidth: 1.6,
    text: (row) => joinList(row.related_items),
  },
  {
    title: '影响范围',
    key: 'impact_scope',
    ellipsis: true,
    pdfWidth: 2,
    text: (row) => fallback(row.impact_scope),
  },
  {
    title: '应对措施与建议',
    key: 'mitigation',
    pdfWidth: 3,
    text: (row) =>
      row.mitigation?.length
        ? row.mitigation.map((item, i) => `${i + 1}. ${item}`).join('\n')
        : PLACEHOLDER,
  },
]

/**
 * 把共享列定义转换为 n-data-table 的 columns
 *
 * 未提供 render 的列自动回落到 text，保证页面与 PDF 文案一致。
 * @param {Array<object>} schema - 共享列定义
 * @returns {Array<object>} n-data-table 列配置
 */
export const toDataTableColumns = (schema) =>
  schema.map((column) => {
    const result = { title: column.title, key: column.key }
    if (column.width) result.width = column.width
    if (column.align) result.align = column.align
    if (column.ellipsis) result.ellipsis = { tooltip: true }
    result.render = column.render || ((row, index) => column.text(row, index))
    return result
  })

/** 单个「词」超过这个长度就强制折行 */
const MAX_TOKEN_LENGTH = 24

/**
 * 匹配过长且没有断行机会的字符串片段。
 *
 * 中文可以逐字断行，但连续的字母数字下划线（如长编号、URL）在排版算法里
 * 是一个不可分割的词。pdfmake 会按最长的词撑开列宽，一条数据就能把整张表
 * 顶出页面，所以这里主动给它们插入换行。
 */
const LONG_TOKEN = new RegExp(
  `[^\\s\\u2E80-\\u9FFF\\uF900-\\uFAFF\\uFF00-\\uFFEF]{${MAX_TOKEN_LENGTH + 1},}`,
  'g',
)

/**
 * 给超长不可断词插入换行，避免撑破列宽
 * @param {string} text - 单元格文本
 * @returns {string} 处理后的文本
 */
const softWrap = (text) =>
  text.replace(LONG_TOKEN, (token) => token.match(/.{1,24}/g).join('\n'))

/**
 * 按相对权重把可用宽度分配给各列
 *
 * 不用 pdfmake 的 '*' / 'auto'：它会按内容的最小宽度撑开列，
 * 遇到超长内容整张表会超出页面。这里直接算出绝对宽度，表格宽度恒定。
 * @param {Array<object>} columns - 列定义
 * @param {number} contentWidth - 正文可用宽度（磅）
 * @returns {Array<number>} 每列的绝对宽度（磅）
 */
const computeWidths = (columns, contentWidth) => {
  const { cellPaddingX, lineWidth } = TABLE_METRICS
  // 扣掉内边距与竖线占用的宽度，剩下的才是可分配给内容的部分
  const overhead = columns.length * cellPaddingX * 2 + (columns.length + 1) * lineWidth
  const usable = Math.max(contentWidth - overhead, 1)
  const totalWeight = columns.reduce((sum, column) => sum + (column.pdfWidth || 1), 0)
  return columns.map((column) => ((column.pdfWidth || 1) / totalWeight) * usable)
}

/**
 * 把共享列定义转换为 pdfmake 的 table 节点
 *
 * 自动开启表头重复（headerRows），长表格跨页时每页都带表头。
 * @param {Array<object>} schema - 共享列定义
 * @param {Array<object>} rows - 数据行
 * @param {object} [options] - 可选项
 * @param {(row: object, index: number) => (string|null)} [options.rowFill] - 行背景色回调
 * @param {(row: object, index: number, key: string) => (string|null)} [options.cellColor] - 单元格字色回调
 * @param {string} [options.emptyText] - 无数据时的占位文案
 * @param {boolean} [options.dontBreakRows] - 是否禁止行内跨页，仅适用于内容必定很短的表
 * @returns {object} pdfmake 的 table 节点
 */
export const toPdfTable = (schema, rows, options = {}) => {
  const { rowFill, cellColor, emptyText = '暂无数据', dontBreakRows = false } = options
  const columns = schema

  const headerRow = columns.map((column) => ({ text: column.title, style: 'tableHeader' }))

  const bodyRows = rows.map((row, index) => {
    const fillColor = rowFill?.(row, index) || null
    return columns.map((column) => {
      const cell = { text: softWrap(column.text(row, index)) }
      if (fillColor) cell.fillColor = fillColor
      const color = cellColor?.(row, index, column.key)
      if (color) cell.color = color
      return cell
    })
  })

  const body = bodyRows.length
    ? [headerRow, ...bodyRows]
    : [
        headerRow,
        [
          {
            text: emptyText,
            colSpan: columns.length,
            alignment: 'center',
            color: '#94a3b8',
            margin: [0, 6, 0, 6],
          },
          // colSpan 要求后续单元格占位为空对象
          ...Array.from({ length: columns.length - 1 }, () => ({})),
        ],
      ]

  return {
    table: {
      headerRows: 1,
      // 默认允许行内跨页：测试步骤这类内容可能比一整页还高，
      // 禁止跨页会让 pdfmake 把整行挤到下一页且渲染不出来，产生大量空白页
      dontBreakRows,
      widths: computeWidths(columns, CONTENT_WIDTH),
      body,
    },
    layout: 'reportTable',
  }
}
