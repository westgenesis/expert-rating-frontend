import formatDate from 'date-fns/format'
import { PDF_FONT_FAMILY } from './pdfmake'
import {
  buildDefectDetailSection,
  buildDefectStatisticsSection,
  buildExecutionSection,
  buildOverviewSection,
  buildQualitySection,
  buildRecommendSection,
  buildRiskSection,
  buildScoreSection,
  buildSuggestionSection,
} from './sections'
import { COLORS, PAGE, STYLES } from './styles'

/**
 * 组装报告的 pdfmake 文档定义
 *
 * 区块顺序与报告页面保持一致，数据为空的区块整节省略。
 * @param {object} params - 数据集合
 * @param {object} params.summary - /report/summary 返回体
 * @param {object|null} params.analysis - 大模型分析结果
 * @param {Array<object>} params.defects - 全量缺陷
 * @param {Array<object>} params.scores - 专家评分历史
 * @param {object} params.recommend - 迭代用例推荐
 * @returns {object} pdfmake docDefinition
 */
export const buildDocDefinition = ({
  summary = {},
  analysis = null,
  defects = [],
  scores = [],
  recommend = {},
}) => {
  const testObject = summary.test_object || '--'
  const ai = analysis || {}
  const generatedAt = formatDate(new Date(), 'yyyy-MM-dd HH:mm')

  const content = [
    { text: '评测结果', style: 'reportTitle' },
    { text: `测试对象：${testObject}    导出时间：${generatedAt}`, style: 'reportSubtitle' },
    ...buildOverviewSection(summary.overview),
    ...buildExecutionSection(summary.execution_summary),
    ...buildDefectStatisticsSection(summary.defect_statistics),
    ...buildDefectDetailSection(defects),
    ...buildScoreSection(scores),
    ...buildRecommendSection(recommend),
    ...buildRiskSection(ai.residual_risks),
    ...buildQualitySection(ai.quality_analysis, ai.conclusion),
    ...buildSuggestionSection(ai.optimization_suggestions),
  ]

  return {
    pageSize: PAGE.size,
    pageOrientation: PAGE.orientation,
    pageMargins: PAGE.margins,
    info: {
      title: `${testObject} 评测报告`,
      subject: '测试评测报告',
    },
    defaultStyle: {
      font: PDF_FONT_FAMILY,
      fontSize: 8,
      color: COLORS.text,
      lineHeight: 1.25,
    },
    styles: STYLES,
    content,
    footer: (currentPage, pageCount) => ({
      columns: [
        { text: testObject, style: 'footer', margin: [PAGE.margins[0], 0, 0, 0] },
        {
          text: `第 ${currentPage} 页 / 共 ${pageCount} 页`,
          style: 'footer',
          alignment: 'right',
          margin: [0, 0, PAGE.margins[2], 0],
        },
      ],
    }),
  }
}
