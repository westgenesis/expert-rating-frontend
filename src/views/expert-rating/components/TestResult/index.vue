<template>
  <section>
    <n-h3 prefix="bar">
      <n-text> 测试结果 </n-text>
    </n-h3>

    <div class="flex items-stretch h-[500px] gap-4">
      <TestSet class="w-1/5" :name="ratingObj?.name" v-model="params.type" />
      <div class="flex-1 overflow-x-hidden overflow-y-auto">
        <n-spin :show="loading">
          <div class="w-full overflow-hidden mb-2 flex justify-between items-stretch gap-4">
            <ExecutionStatistics class="w-1/3" :data="execData" />
            <DefectDistributionStatistics class="w-2/3" :data="defectDistributionData" />
          </div>

          <TestCaseList class="mb-2" :name="ratingObj?.name" :type="params.type" />

          <DefectList :name="ratingObj?.name" :type="params.type" />
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

import { getTapGetTestsetByName, getTapGetTestCaseDetail } from '@/services/apis'

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
  if (!ratingObj.name) {
    return
  }
  loading.value = true

  if (params.type === '') {
    const response = await getTapGetTestsetByName({
      name: ratingObj.name,
    })
    result.value = response?.data?.[0] || {}
  } else {
    const response = await getTapGetTestCaseDetail({
      testsuite_id: params.type,
      name: ratingObj.name,
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
