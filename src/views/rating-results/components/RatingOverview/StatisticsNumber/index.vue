<template>
  <div class="flex items-center gap-4 overflow-hidden">
    <div class="flex flex-col items-center justify-center gap-2 mr-10">
      <ScoreBlock
        :icon="ListChecked"
        title="客观评分"
        :value="data.objectiveScore"
        color="#54A7FF"
      />
      <ScoreBlock
        :icon="HatGraduation16Filled"
        title="专家评分"
        :value="data.expertScore"
        color="#84CE5F"
      />
    </div>
    <div class="flex-1 flex flex-wrap items-center gap-6 h-fit">
      <NumberBlock class="flex-1" v-for="(item, index) in numberList" :key="index" v-bind="item" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import ScoreBlock from './ScoreBlock.vue'
import NumberBlock from './NumberBlock.vue'
import { ListChecked } from '@vicons/carbon'
import { HatGraduation16Filled } from '@vicons/fluent'

defineOptions({
  name: 'StatisticsNumber',
})

const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
})

const numberList = computed(() => {
  return [
    {
      title: '测试用例数',
      value: props.data.testCasesNum,
    },
    {
      title: '通过率',
      value: props.data.passRate,
      unit: '%',
    },
    {
      title: '缺陷数',
      value: props.data.defectsNum,
    },
  ]
})
</script>
