<template>
  <div>
    <n-card title="缺陷分布统计">
      <div class="w-full overflow-hidden flex gap-4">
        <div class="flex-1 shadow-sm p-4">
          <div class="text-md text-center font-semibold">缺陷严重程度分布</div>
          <PieChart
            v-if="defectSeverityDistribution && !!Object.keys(defectSeverityDistribution).length"
            :data="defectSeverityDistribution"
            :getItemStyle="getItemStyle"
          />
          <n-empty class="mt-6" v-else>暂无数据</n-empty>
        </div>

        <!-- <div class="flex-1 shadow-sm p-4">
          <div class="text-md text-center font-semibold">缺陷场景分布</div>
          <PieChart
            v-if="defectSceneDistribution && !!Object.keys(defectSceneDistribution).length"
            :data="defectSceneDistribution"
          />
          <n-empty class="mt-6" v-else>暂无数据</n-empty>
        </div> -->
      </div>
    </n-card>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import PieChart from '@/components/PieChart.vue'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
})

// 缺陷严重程度分布
const defectSeverityDistribution = computed(() => {
  return props.data?.['缺陷严重程度分布']
})

const getItemStyle = (key) => {
  const colorMap = {
    A: '#EE6767',
    B: '#FAC858',
    C: '#d9d9d9',
    D: '#91CD75',
  }

  return { color: colorMap[key] }
}

// 缺陷场景分布
const defectSceneDistribution = computed(() => {
  return props.data?.['缺陷场景分布']
})
</script>
