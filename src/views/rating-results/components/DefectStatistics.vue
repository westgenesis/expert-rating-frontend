<template>
  <div>
    <h3 class="text-[15px] font-semibold text-slate-700 mb-3">缺陷分布统计</h3>

    <div class="grid gap-10 items-start" :style="defectGridStyle">
      <!-- 左侧：缺陷等级分布表 -->
      <div>
        <n-table :single-line="false" size="small">
          <thead>
            <tr>
              <th>序号</th>
              <th>缺陷等级</th>
              <th>数量</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in severityList" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ item.label }}（{{ item.description }}）</td>
              <td>{{ item.count }}</td>
            </tr>
            <tr class="bg-blue-50 font-semibold">
              <td colspan="2">缺陷总数</td>
              <td>{{ totalDefects }}</td>
            </tr>
            <tr v-if="!severityList.length">
              <td colspan="3" class="text-center text-gray-400 py-8">暂无数据</td>
            </tr>
          </tbody>
        </n-table>
      </div>

      <!-- 右侧：缺陷发生频率分布图 -->
      <div v-if="frequencyData && Object.keys(frequencyData).length" class="flex flex-col">
        <div class="text-sm font-semibold text-slate-700 mb-2">缺陷发生频率分布图</div>
        <PieChart
          :data="frequencyData"
          :getItemStyle="getFrequencyColor"
          class="!h-[220px]"
        />
      </div>
      <n-empty v-else class="py-8" description="暂无频率分布数据" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import PieChart from '@/components/PieChart.vue'

defineOptions({
  name: 'DefectStatistics',
})

const props = defineProps({
  /** 缺陷统计数据，来自 report/summary 的 defect_statistics */
  data: {
    type: Object,
    default: () => ({}),
  },
})

/** 缺陷等级中文描述映射 */
const SEVERITY_LABELS = {
  A: 'A级（致命）',
  B: 'B级（严重）',
  C: 'C级（一般）',
  D: 'D级（轻微）',
}

/**
 * 将 severity_distribution 对象转为表格行数组
 * 动态遍历键值，不写死等级
 */
const severityList = computed(() => {
  const dist = props.data?.severity_distribution || {}
  return Object.entries(dist).map(([key, count]) => ({
    label: key,
    description: SEVERITY_LABELS[key] || '',
    count,
  }))
})

/** 缺陷总数 */
const totalDefects = computed(() => {
  return props.data?.total ?? 0
})

/** 缺陷发生频率分布数据（用于饼图） */
const frequencyData = computed(() => {
  return props.data?.frequency_distribution || {}
})

/** 响应式网格布局 */
const defectGridStyle = computed(() => ({
  gridTemplateColumns: '1.6fr 1fr',
}))

/**
 * 频率分布饼图颜色映射
 * @param {string} key - 频率标签
 */
const getFrequencyColor = (key) => {
  const colorMap = {
    必现: '#ef4444',
    偶发: '#f97316',
    极少: '#3b82f6',
  }
  return { color: colorMap[key] || '#94a3b8' }
}
</script>
