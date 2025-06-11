<template>
  <n-card size="small" title="评价概况">
    <div class="p-4 flex justify-between items-center gap-4 h-[200px]">
      <RatingResultStatus :status="data.status" class="flex-shrink-0" />
      <div class="h-3/5 w-px bg-gray-200"></div>
      <OverallScore :score="data.score" />
      <div class="h-3/5 w-px bg-gray-200"></div>
      <StatisticsNumber class="flex-1" :data="data" />
    </div>
  </n-card>
</template>

<script setup>
import { ref } from 'vue'

import RatingResultStatus from './RatingResultStatus.vue'
import OverallScore from './OverallScore.vue'
import StatisticsNumber from './StatisticsNumber/index.vue'

const data = ref({
  status: true, // 判定结果
  score: 95, // 综合得分
  objectiveScore: 95, // 客观评分
  expertScore: 82.1, // 专家评分
  testCasesNum: 112893, // 测试用例数
  passRate: 98.98, // 通过率
  defectsNum: 123, // 缺陷数
})
</script>
