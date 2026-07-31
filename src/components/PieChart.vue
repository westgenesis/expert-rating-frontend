<template>
  <BaseChart :option="realOption" />
</template>

<script setup>
import { PieChart } from 'echarts/charts'
import { computed } from 'vue'
import BaseChart from './BaseChart.vue'
import { merge, clone } from 'lodash'
import { use } from 'echarts/core'
import { buildPieOption } from './pie-chart-option'

use([PieChart])

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
  getItemStyle: {
    type: Function,
  },
  option: {
    type: Object,
    default: () => ({}),
  },
})

/** 基础配置与 PDF 导出的离屏饼图共用 */
const baseOption = computed(() => buildPieOption(props.data, props.getItemStyle))

const realOption = computed(() => merge(clone(baseOption.value), props.option || {}))
</script>
