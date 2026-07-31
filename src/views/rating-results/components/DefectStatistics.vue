<template>
  <div>
    <h3 class="text-[15px] font-semibold text-slate-700 mb-3">缺陷分布统计</h3>

    <div class="flex gap-2 items-start">
      <!-- 左侧：缺陷等级分布表 -->
      <n-data-table
        :columns="severityColumns"
        :data="severityTableData"
        :single-line="false"
        size="small"
        class="flex-1/3 min-w-[300px]"
      />

      <!-- 右侧：缺陷发生频率分布图 -->
      <div v-if="hasFrequencyData" class="flex flex-col flex-2/3">
        <div class="text-sm font-semibold text-slate-700 mb-2">缺陷发生频率分布图</div>
        <PieChart :data="frequencyData" :getItemStyle="getFrequencyColor" class="h-[300px]!" />
      </div>
      <n-empty v-else class="py-8" description="暂无频率分布数据" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import PieChart from '@/components/PieChart.vue'
import {
  buildSeverityRows,
  defectSeverityColumns,
  FREQUENCY_COLORS,
  toDataTableColumns,
} from '../report-schema'

defineOptions({ name: 'DefectStatistics' })

const props = defineProps({ data: { type: Object, default: () => ({}) } })

/** 列定义与 PDF 导出共用 */
const severityColumns = toDataTableColumns(defectSeverityColumns)

/** 缺陷等级分布行，末行为缺陷总数 */
const severityTableData = computed(() => buildSeverityRows(props.data))

/** 缺陷发生频率原始分布 */
const frequencyData = computed(() => props.data?.frequency_distribution || {})

/** 是否存在频率分布数据 */
const hasFrequencyData = computed(() => Object.keys(frequencyData.value).length > 0)

/**
 * 频率分布饼图的扇区配色，与 PDF 导出共用同一份色板
 * @param {string} key - 频率名称（必现/偶发/极少）
 * @returns {{color: string}} ECharts itemStyle
 */
const getFrequencyColor = (key) => ({ color: FREQUENCY_COLORS[key] || '#94a3b8' })
</script>
