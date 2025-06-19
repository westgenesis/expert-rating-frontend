<template>
  <div>
    <n-card size="small" title="执行情况统计" class="h-full">
      <div class="flex flex-col items-center">
        <n-radio-group v-model:value="level">
          <n-radio-button
            v-for="item in levelOptions"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          />
        </n-radio-group>

        <PieChart
          v-if="filterData"
          :data="filterData"
          :option="{ series: [{ center: ['40%', '55%'] }] }"
          :getItemStyle="getItemStyle"
          class="!h-[220px]"
        />
        <n-empty class="mt-6" v-else>暂无数据</n-empty>
      </div>
    </n-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import PieChart from '@/components/PieChart.vue'
defineOptions({
  name: 'ExecutionStatistics',
})

const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
})

const levelOptions = [
  {
    label: '全部',
    value: '全部',
  },
  {
    label: '高优先级',
    value: '高优先级',
  },
  {
    label: '中优先级',
    value: '中优先级',
  },
  {
    label: '低优先级',
    value: '低优先级',
  },
]

const level = ref('全部')

const getItemStyle = (key) => {
  // 通过 失败 异常 无判定
  const colorMap = {
    通过: '#91CD75',
    失败: '#EE6767',
    异常: '#FAC858',
    无判定: '#d9d9d9',
  }

  return { color: colorMap[key] }
}

const filterData = computed(() => {
  return props.data[level.value]
})
</script>
