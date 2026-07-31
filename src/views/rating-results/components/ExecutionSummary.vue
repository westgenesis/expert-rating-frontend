<template>
  <div>
    <h3 class="text-[15px] font-semibold text-slate-700 mt-5 mb-3">用例执行汇总（按优先级）</h3>
    <n-data-table
      :columns="columns"
      :data="data"
      :row-class-name="rowClassName"
      :single-line="false"
      size="small"
    />

    <!-- 数据说明 -->
    <div
      v-if="dataSummary"
      class="text-sm text-slate-500 leading-relaxed mt-3 p-3 bg-slate-50 rounded-lg"
    >
      <strong>数据说明：</strong>{{ dataSummary }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  buildExecutionDataSummary,
  executionSummaryColumns,
  isExecutionSummaryRow,
  toDataTableColumns,
} from '../report-schema'

defineOptions({
  name: 'ExecutionSummary',
})

const props = defineProps({
  /** 执行汇总列表，来自 report/summary 的 execution_summary */
  data: {
    type: Array,
    default: () => [],
  },
})

/** 列定义与 PDF 导出共用 */
const columns = toDataTableColumns(executionSummaryColumns)

/**
 * 汇总行高亮
 * @param {object} row - 当前行数据
 * @returns {string} 行样式类名
 */
const rowClassName = (row) => (isExecutionSummaryRow(row) ? 'bg-blue-50 font-semibold' : '')

/** 自动生成的数据说明文字 */
const dataSummary = computed(() => buildExecutionDataSummary(props.data))
</script>
