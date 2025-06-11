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
          :data="data"
          :option="{ series: [{ center: ['40%', '55%'] }] }"
          class="!h-[220px]"
        />
      </div>
    </n-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import PieChart from '@/components/PieChart.vue'
defineOptions({
  name: 'ExecutionStatistics',
})

const levelOptions = [
  {
    label: '全部',
    value: '',
  },
  {
    label: '高优先级',
    value: 1,
  },
  {
    label: '中优先级',
    value: 2,
  },
  {
    label: '低优先级',
    value: 3,
  },
]

const level = ref('')
const data = ref({
  通过: 90,
  失败: 9.1,
  异常: 0.1,
  无判断: 0.1,
})
</script>
