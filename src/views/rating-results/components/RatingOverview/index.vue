<template>
  <n-card size="small" title="评价概况">
    <div class="p-4 flex justify-between items-center gap-4 h-[200px]">
      <RatingResultStatus v-bind="statusData" class="flex-shrink-0" />
      <div class="h-3/5 w-px bg-gray-200"></div>
      <OverallScore :score="data?.comprehensive_score" />
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
  /** 评价概况数据，来自 /report/summary 的 overview 字段 */
  data: {
    type: Object,
    default: () => ({}),
  },
})

/** 通过状态和判定依据，映射新接口字段 */
const statusData = computed(() => {
  return {
    status: props.data?.passed ?? false,
    statusBasic: props.data?.judgement_reasons || [],
  }
})

/** 指标统计数据，映射新接口字段 */
const statisticsData = computed(() => ({
  objectiveScore: props.data?.objective_score, // 客观评分
  expertScore: props.data?.expert_average_score, // 专家平均分
  testCasesNum: props.data?.testcase_total, // 测试用例总数
  passRate: props.data?.overall_pass_rate, // 整体通过率
  defectsNum: props.data?.defect_total, // 缺陷总数
}))
</script>
