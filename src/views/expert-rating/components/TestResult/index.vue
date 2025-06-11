<template>
  <section>
    <n-h3 prefix="bar">
      <n-text> 测试结果 </n-text>
    </n-h3>

    <div class="flex items-stretch h-[500px] gap-4">
      <TestSet class="w-1/5" v-model="params.type" />
      <div class="flex-1 overflow-auto">
        <div class="mb-2 flex justify-between items-stretch gap-4">
          <ExecutionStatistics class="flex-1/3" />
          <DefectDistributionStatistics class="flex-2/3" />
        </div>

        <TestCaseList class="mb-2" />

        <DefectList />
      </div>
    </div>
  </section>
</template>

<script setup>
import { reactive } from 'vue'
import TestSet from './TestSet.vue'
import ExecutionStatistics from './ExecutionStatistics.vue'
import DefectDistributionStatistics from './DefectDistributionStatistics.vue'
import TestCaseList from './TestCaseList.vue'
import DefectList from './DefectList.vue'
defineOptions({
  name: 'TestResult',
})

const params = reactive({
  type: '',
})
</script>
