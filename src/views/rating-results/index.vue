<template>
  <section>
    <RatingObjInfo :data="ratingObj" />
    <RatingOverview :data="result" />

    <div class="my-4 flex justify-between items-stretch gap-4">
      <ExecutionStatistics :data="execData" class="flex-1/2" />
      <DefectDistributionStatistics :data="defectDistributionData" class="flex-1/2" />
    </div>

    <RatingHistory :dataId="ratingObj.dataId" />

    <UsecasesRecommend :dataId="ratingObj.dataId" class="mt-4" />

    <div class="my-4 flex justify-end gap-2">
      <ConfirmResult :dataId="ratingObj.dataId" v-if="!result?.['主观确认状态']" />
      <InviteExpertRating :dataId="ratingObj.dataId" v-if="!result?.['主观确认状态']" />
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref, computed, watch } from 'vue'
import RatingObjInfo from '@/views/expert-rating/components/RatingObjInfo.vue'
import RatingOverview from './components/RatingOverview/index.vue'
import ExecutionStatistics from '@/views/expert-rating/components/TestResult/ExecutionStatistics.vue'
import DefectDistributionStatistics from '@/views/expert-rating/components/TestResult/DefectDistributionStatistics.vue'
import RatingHistory from './components/RatingHistory.vue'
import UsecasesRecommend from './components/UsecasesRecommend.vue'
import ConfirmResult from './components/ConfirmResult.vue'
import InviteExpertRating from './components/InviteExpertRating.vue'

import useRatingObj from '@/hooks/useRatingObj'

import { getTapGetTestsetByDataId } from '@/services/apis'

const ratingObj = useRatingObj()
defineOptions({
  name: 'RatingResults',
})

const loading = ref(false)

const result = ref(null)

const getResult = async () => {
  if (!ratingObj.dataId) {
    return
  }
  loading.value = true
  const response = await getTapGetTestsetByDataId({
    data_id: ratingObj.dataId,
  })
  result.value = response?.data?.[0] || {}
  loading.value = false
}

const execData = computed(() => {
  const data = result.value?.['用例执行情况']
  return data
})

const defectDistributionData = computed(() => {
  const data = result.value?.['缺陷分布']
  return data
})

onMounted(() => {
  getResult()
})

watch(
  () => ratingObj.name,
  () => {
    getResult()
  },
)
</script>
