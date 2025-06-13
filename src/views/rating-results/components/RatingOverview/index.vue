<template>
  <n-card size="small" title="评价概况">
    <div class="p-4 flex justify-between items-center gap-4 h-[200px]">
      <RatingResultStatus v-bind="overviewData" class="flex-shrink-0" />
      <div class="h-3/5 w-px bg-gray-200"></div>
      <OverallScore :score="data?.['综合得分']" />
      <div class="h-3/5 w-px bg-gray-200"></div>
      <StatisticsNumber class="flex-1" :data="statisticsData" />
    </div>
  </n-card>
</template>

<script setup>
import { computed } from 'vue'

import RatingResultStatus from './RatingResultStatus.vue'
import OverallScore from './OverallScore.vue'
import StatisticsNumber from './StatisticsNumber/index.vue'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
})

const overviewData = computed(() => {
  return {
    status: props.data?.['是否通过'] === '是',
    statusBasic: props.data?.['判定依据'] || [],
  }
})

const statisticsData = computed(() => ({
  objectiveScore: props.data?.['客观评分'], // 客观评分
  expertScore: props.data?.['专家评分'], // 专家评分
  testCasesNum: props.data?.['测试用例数'], // 测试用例数
  passRate: props.data?.['通过率'], // 通过率
  defectsNum: props.data?.['缺陷数'], // 缺陷数
}))
</script>
