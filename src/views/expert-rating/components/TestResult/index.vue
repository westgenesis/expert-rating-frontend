<template>
  <section>
    <n-h3 prefix="bar">
      <n-text> 测试结果 </n-text>
    </n-h3>

    <div class="flex flex-col gap-4">
      <TestSet class="mb-2" :dataId="ratingObj?.dataId" v-model="params.type" />
      <div class="flex-1 overflow-x-hidden overflow-y-auto">
        <n-spin :show="loading">
          <div class="w-full overflow-hidden mb-2 flex justify-between items-stretch gap-4">
            <ExecutionStatistics class="w-1/2" :data="execData" />
            <DefectDistributionStatistics class="w-1/2" :data="defectDistributionData" />
          </div>

          <DefectList class="mb-2" :dataId="ratingObj?.dataId" :type="params.type" />

          <TestCaseList :dataId="ratingObj?.dataId" :type="params.type" />
        </n-spin>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive, computed, watchEffect } from 'vue'

import useRatingObj from '@/hooks/useRatingObj'

import TestSet from './TestSet.vue'
import ExecutionStatistics from './ExecutionStatistics.vue'
import DefectDistributionStatistics from './DefectDistributionStatistics.vue'
import TestCaseList from './TestCaseList.vue'
import DefectList from './DefectList.vue'

import { getTapGetTestsetByDataId, getTapGetTestCaseDetail } from '@/services/apis'

defineOptions({
  name: 'TestResult',
})

const params = reactive({
  type: '',
})

const ratingObj = useRatingObj()

const loading = ref(false)

const result = ref(null)

const getResult = async () => {
  if (!ratingObj.dataId) {
    return
  }
  loading.value = true

  if (params.type === '') {
    const response = await getTapGetTestsetByDataId({
      data_id: ratingObj.dataId,
    })
    result.value = response?.data?.[0] || {}
  } else {
    const response = await getTapGetTestCaseDetail({
      testsuite_id: params.type,
      data_id: ratingObj.dataId,
    })
    result.value = response?.data || {}
  }

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

watchEffect(() => {
  getResult()
})
</script>
