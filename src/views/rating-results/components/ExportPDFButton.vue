<template>
  <n-button type="primary" :loading="exporting" :disabled="!dataId" @click="handleExport">
    {{ exporting ? '正在生成报告...' : '导出PDF报告' }}
  </n-button>
</template>

<script setup>
import { useReportExport } from '../useReportExport'

defineOptions({
  name: 'ExportPDFButton',
})

const props = defineProps({
  /** 报告汇总数据 */
  summary: {
    type: Object,
    default: () => ({}),
  },
  /** AI 分析结果 */
  analysisData: {
    type: Object,
    default: null,
  },
  /** 测试评测任务唯一ID */
  dataId: {
    type: String,
    required: true,
  },
})

const { exporting, exportReport } = useReportExport()

/**
 * 触发报告导出
 * @returns {Promise<void>}
 */
const handleExport = () =>
  exportReport({
    summary: props.summary,
    analysis: props.analysisData,
    dataId: props.dataId,
  })
</script>
