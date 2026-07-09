<template>
  <div>
    <h3 class="text-[15px] font-semibold text-slate-700 mb-3">缺陷分布统计</h3>

    <div class="grid gap-10 items-start" :style="defectGridStyle">
      <!-- 左侧：缺陷等级分布表 -->
      <div>
        <n-data-table :columns="severityColumns" :data="severityTableData" :single-line="false" size="small" />
      </div>

      <!-- 右侧：缺陷发生频率分布图 -->
      <div v-if="frequencyData && Object.keys(frequencyData).length" class="flex flex-col">
        <div class="text-sm font-semibold text-slate-700 mb-2">缺陷发生频率分布图</div>
        <PieChart :data="frequencyData" :getItemStyle="getFrequencyColor" class="!h-[220px]" />
      </div>
      <n-empty v-else class="py-8" description="暂无频率分布数据" />
    </div>
  </div>
</template>

<script setup lang="jsx">
import { computed } from 'vue'
import PieChart from '@/components/PieChart.vue'

defineOptions({ name: 'DefectStatistics' })

const props = defineProps({ data: { type: Object, default: () => ({}) } })

const severityColumns = [
  { title: '序号', key: 'index', width: 60 },
  { title: '缺陷等级', key: 'label' },
  { title: '数量', key: 'count', width: 80 },
]

const SEVERITY_LABELS = { A: 'A级（致命）', B: 'B级（严重）', C: 'C级（一般）', D: 'D级（轻微）' }

const severityTableData = computed(() => {
  const dist = props.data?.severity_distribution || {}
  const rows = Object.entries(dist).map(([key, count], idx) => ({
    index: idx + 1,
    label: `${key}（${SEVERITY_LABELS[key] || ''}）`,
    count,
  }))
  rows.push({ index: '', label: '缺陷总数', count: props.data?.total ?? 0, _summary: true })
  return rows
})

const frequencyData = computed(() => props.data?.frequency_distribution || {})

const defectGridStyle = computed(() => ({ gridTemplateColumns: '1.6fr 1fr' }))

const getFrequencyColor = (key) => {
  const colorMap = { 必现: '#ef4444', 偶发: '#f97316', 极少: '#3b82f6' }
  return { color: colorMap[key] || '#94a3b8' }
}
</script>
