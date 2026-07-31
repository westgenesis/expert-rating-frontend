import { ref } from 'vue'
import { useMessage } from 'naive-ui'
import formatDate from 'date-fns/format'
import { buildDocDefinition } from './pdf/doc-definition'
import { loadPdfMake } from './pdf/pdfmake'
import { fetchReportExportData } from './pdf/report-data'

/**
 * 文件名中不能出现的字符
 */
const INVALID_FILENAME_CHARS = /[\\/:*?"<>|]/g

/**
 * 生成导出文件名
 * @param {string} testObject - 测试对象名称
 * @returns {string} 形如 "某某系统_评测报告_20260731.pdf"
 */
const buildFileName = (testObject) => {
  const name = (testObject || '测试评测').replace(INVALID_FILENAME_CHARS, '_').trim()
  return `${name}_评测报告_${formatDate(new Date(), 'yyyyMMdd')}.pdf`
}

/**
 * 报告 PDF 导出
 *
 * 直接在浏览器端生成 PDF 文件并下载，不经过打印对话框，文件名可控。
 * 需在组件 setup 中调用。
 * @returns {{exporting: import('vue').Ref<boolean>, exportReport: Function}} 导出状态与触发方法
 */
export const useReportExport = () => {
  const message = useMessage()
  const exporting = ref(false)

  /**
   * 拉取全量数据、生成 PDF 并触发下载
   * @param {object} params - 导出参数
   * @param {object} params.summary - 报告汇总数据
   * @param {object|null} params.analysis - 大模型分析结果
   * @param {string} params.dataId - 测试评测任务唯一ID
   * @returns {Promise<void>}
   */
  const exportReport = async ({ summary, analysis, dataId }) => {
    if (exporting.value) return

    exporting.value = true
    try {
      // 字体较大，与数据请求并行加载，避免串行等待
      const [pdfMake, exportData] = await Promise.all([
        loadPdfMake(),
        fetchReportExportData(dataId),
      ])

      if (exportData.failures.length) {
        message?.warning(`${exportData.failures.join('、')}获取失败，这部分内容未包含在报告中`)
      }

      const docDefinition = buildDocDefinition({
        summary: summary || {},
        analysis,
        testcases: exportData.testcases,
        defects: exportData.defects,
        scores: exportData.scores,
        recommend: exportData.recommend,
      })

      await pdfMake.createPdf(docDefinition).download(buildFileName(summary?.test_object))
    } catch (error) {
      console.error('导出 PDF 报告失败:', error)
      message?.error('导出 PDF 报告失败，请重试')
    } finally {
      exporting.value = false
    }
  }

  return { exporting, exportReport }
}
